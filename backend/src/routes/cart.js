const express = require('express');
const { body, validationResult } = require('express-validator');
const Cart = require('../models/Cart');
const { Product } = require('../models/Product');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'Please check your input data',
      details: errors.array()
    });
  }
  next();
};

// GET /api/cart - Get user's cart (supports both authenticated and guest users)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const userId = req.user?._id;
    const sessionId = req.headers['x-session-id'];

    let cart;

    if (userId) {
      cart = await Cart.findByUser(userId);
      if (!cart) {
        // Create empty cart for authenticated user
        cart = new Cart({ userId, items: [] });
        await cart.save();
      }
    } else if (sessionId) {
      cart = await Cart.findBySession(sessionId);
      if (!cart) {
        // Create empty cart for guest user
        cart = new Cart({ sessionId, items: [] });
        await cart.save();
      }
    } else {
      return res.status(400).json({
        error: 'Session required',
        message: 'Please provide authentication or session ID'
      });
    }

    // Validate stock for all items
    const stockValidation = await cart.validateStock();
    const hasStockIssues = stockValidation.some(item => !item.isValid);

    res.json({
      success: true,
      data: {
        cart,
        stockValidation: hasStockIssues ? stockValidation : undefined
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      error: 'Failed to fetch cart',
      message: error.message
    });
  }
});

// POST /api/cart/add - Add item to cart
router.post('/add',
  optionalAuth,
  [
    body('productId').isMongoId().withMessage('Valid product ID is required'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const userId = req.user?._id;
      const sessionId = req.headers['x-session-id'];
      const { productId, quantity } = req.body;

      if (!userId && !sessionId) {
        return res.status(400).json({
          error: 'Session required',
          message: 'Please provide authentication or session ID'
        });
      }

      // Check if product exists and is available
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({
          error: 'Product not found',
          message: 'The specified product does not exist'
        });
      }

      if (!product.isActive) {
        return res.status(400).json({
          error: 'Product not available',
          message: 'This product is currently not available'
        });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          error: 'Insufficient stock',
          message: `Only ${product.stock} items available`
        });
      }

      // Get or create cart
      let cart;
      if (userId) {
        cart = await Cart.findByUser(userId);
        if (!cart) {
          cart = new Cart({ userId, items: [] });
        }
      } else {
        cart = await Cart.findBySession(sessionId);
        if (!cart) {
          cart = new Cart({ sessionId, items: [] });
        }
      }

      // Check if adding this quantity would exceed available stock
      const currentQuantityInCart = cart.getItemQuantity(productId);
      const totalQuantity = currentQuantityInCart + quantity;
      
      if (totalQuantity > product.stock) {
        return res.status(400).json({
          error: 'Insufficient stock',
          message: `Cannot add ${quantity} items. Only ${product.stock - currentQuantityInCart} more available`
        });
      }

      // Add item to cart
      await cart.addItem(productId, quantity, product.discountedPrice, product.discount);

      // Populate cart for response
      await cart.populate({
        path: 'items.productId',
        select: 'name price images stock isActive discount'
      });

      res.json({
        success: true,
        message: 'Item added to cart successfully',
        data: {
          cart
        }
      });
    } catch (error) {
      console.error('Add to cart error:', error);
      res.status(400).json({
        error: 'Failed to add item to cart',
        message: error.message
      });
    }
  }
);

// PUT /api/cart/update - Update item quantity in cart
router.put('/update',
  authenticateToken,
  [
    body('productId').isMongoId().withMessage('Valid product ID is required'),
    body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const userId = req.user._id;
      const { productId, quantity } = req.body;

      const cart = await Cart.findByUser(userId);
      if (!cart) {
        return res.status(404).json({
          error: 'Cart not found',
          message: 'No cart found for this user'
        });
      }

      if (quantity > 0) {
        // Check product availability and stock
        const product = await Product.findById(productId);
        if (!product || !product.isActive) {
          return res.status(400).json({
            error: 'Product not available',
            message: 'This product is currently not available'
          });
        }

        if (product.stock < quantity) {
          return res.status(400).json({
            error: 'Insufficient stock',
            message: `Only ${product.stock} items available`
          });
        }
      }

      // Update quantity (will remove item if quantity is 0)
      await cart.updateItemQuantity(productId, quantity);

      // Populate cart for response
      await cart.populate({
        path: 'items.productId',
        select: 'name price images stock isActive discount'
      });

      res.json({
        success: true,
        message: quantity > 0 ? 'Cart updated successfully' : 'Item removed from cart',
        data: {
          cart
        }
      });
    } catch (error) {
      console.error('Update cart error:', error);
      res.status(400).json({
        error: 'Failed to update cart',
        message: error.message
      });
    }
  }
);

// DELETE /api/cart/remove/:productId - Remove item from cart
router.delete('/remove/:productId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    const cart = await Cart.findByUser(userId);
    if (!cart) {
      return res.status(404).json({
        error: 'Cart not found',
        message: 'No cart found for this user'
      });
    }

    await cart.removeItem(productId);

    // Populate cart for response
    await cart.populate({
      path: 'items.productId',
      select: 'name price images stock isActive discount'
    });

    res.json({
      success: true,
      message: 'Item removed from cart successfully',
      data: {
        cart
      }
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(400).json({
      error: 'Failed to remove item from cart',
      message: error.message
    });
  }
});

// DELETE /api/cart/clear - Clear entire cart
router.delete('/clear', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findByUser(userId);
    if (!cart) {
      return res.status(404).json({
        error: 'Cart not found',
        message: 'No cart found for this user'
      });
    }

    await cart.clearCart();

    res.json({
      success: true,
      message: 'Cart cleared successfully',
      data: {
        cart
      }
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      error: 'Failed to clear cart',
      message: error.message
    });
  }
});

// POST /api/cart/validate - Validate cart items stock
router.post('/validate', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findByUser(userId);
    if (!cart) {
      return res.status(404).json({
        error: 'Cart not found',
        message: 'No cart found for this user'
      });
    }

    const stockValidation = await cart.validateStock();
    const hasStockIssues = stockValidation.some(item => !item.isValid);

    res.json({
      success: true,
      data: {
        validation: stockValidation,
        hasStockIssues,
        validItems: stockValidation.filter(item => item.isValid).length,
        invalidItems: stockValidation.filter(item => !item.isValid).length
      }
    });
  } catch (error) {
    console.error('Validate cart error:', error);
    res.status(500).json({
      error: 'Failed to validate cart',
      message: error.message
    });
  }
});

// POST /api/cart/merge - Merge guest cart with user cart
router.post('/merge',
  authenticateToken,
  [
    body('sessionId').optional().isString().withMessage('Session ID must be a string')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const userId = req.user._id;
      const { sessionId } = req.body;

      if (!sessionId) {
        return res.status(400).json({
          error: 'Session ID required',
          message: 'Session ID is required to merge guest cart'
        });
      }

      const mergedCart = await Cart.mergeGuestCart(userId, sessionId);

      // Populate cart for response
      if (mergedCart) {
        await mergedCart.populate({
          path: 'items.productId',
          select: 'name price images stock isActive discount'
        });
      }

      res.json({
        success: true,
        message: 'Cart merged successfully',
        data: {
          cart: mergedCart
        }
      });
    } catch (error) {
      console.error('Merge cart error:', error);
      res.status(400).json({
        error: 'Failed to merge cart',
        message: error.message
      });
    }
  }
);

module.exports = router;
