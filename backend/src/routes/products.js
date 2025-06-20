const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { Product, ProductCategory } = require('../models/Product');
const { authenticateToken, requireExecutive } = require('../middleware/auth');

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

// GET /api/products/categories - Get all product categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await ProductCategory.find({ isActive: true })
      .sort({ sortOrder: 1, name: 1 });

    res.json({
      success: true,
      data: {
        categories
      }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      error: 'Failed to fetch categories',
      message: error.message
    });
  }
});

// GET /api/products/featured - Get featured products
router.get('/featured', [
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
], handleValidationErrors, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const products = await Product.findFeatured(limit);

    res.json({
      success: true,
      data: {
        products,
        count: products.length
      }
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      error: 'Failed to fetch featured products',
      message: error.message
    });
  }
});

// GET /api/products - Get products with filtering and pagination
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('categoryId').optional().isMongoId().withMessage('Invalid category ID'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Min price must be non-negative'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Max price must be non-negative'),
  query('minRating').optional().isFloat({ min: 0, max: 5 }).withMessage('Min rating must be between 0 and 5'),
  query('search').optional().isLength({ min: 1 }).withMessage('Search query cannot be empty')
], handleValidationErrors, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const {
      categoryId,
      minPrice,
      maxPrice,
      minRating,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    let query = { isActive: true };
    let sort = {};

    // Build query filters
    if (categoryId) query.categoryId = categoryId;
    if (minPrice !== undefined) query.price = { $gte: parseFloat(minPrice) };
    if (maxPrice !== undefined) {
      query.price = { ...query.price, $lte: parseFloat(maxPrice) };
    }
    if (minRating !== undefined) query.rating = { $gte: parseFloat(minRating) };

    // Build sort object
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    let products;
    let total;

    if (search) {
      // Use text search
      const searchOptions = {
        limit,
        skip,
        categoryId,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        minRating: minRating ? parseFloat(minRating) : undefined
      };
      
      products = await Product.searchProducts(search, searchOptions);
      total = await Product.countDocuments({
        $text: { $search: search },
        ...query
      });
    } else {
      // Regular query
      products = await Product.find(query)
        .populate('categoryId', 'name description icon')
        .sort(sort)
        .limit(limit)
        .skip(skip);
      
      total = await Product.countDocuments(query);
    }

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      error: 'Failed to fetch products',
      message: error.message
    });
  }
});

// GET /api/products/category/:categoryId - Get products by category
router.get('/category/:categoryId', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
], handleValidationErrors, async (req, res) => {
  try {
    const { categoryId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Check if category exists
    const category = await ProductCategory.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        error: 'Category not found',
        message: 'The specified category does not exist'
      });
    }

    const products = await Product.findByCategory(categoryId, {
      limit,
      skip,
      sort: { rating: -1, createdAt: -1 }
    });

    const total = await Product.countDocuments({
      categoryId,
      isActive: true
    });

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        category,
        products,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({
      error: 'Failed to fetch products',
      message: error.message
    });
  }
});

// GET /api/products/:id - Get single product
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id)
      .populate('categoryId', 'name description icon');

    if (!product) {
      return res.status(404).json({
        error: 'Product not found',
        message: 'The specified product does not exist'
      });
    }

    if (!product.isActive) {
      return res.status(404).json({
        error: 'Product not available',
        message: 'This product is currently not available'
      });
    }

    // Get related products from same category
    const relatedProducts = await Product.findByCategory(product.categoryId._id, {
      limit: 4,
      sort: { rating: -1 }
    }).where('_id').ne(product._id);

    res.json({
      success: true,
      data: {
        product,
        relatedProducts
      }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      error: 'Failed to fetch product',
      message: error.message
    });
  }
});

// POST /api/products - Create new product (Executive only)
router.post('/', 
  authenticateToken,
  requireExecutive,
  [
    body('name').trim().isLength({ min: 1, max: 200 }).withMessage('Name is required and must be less than 200 characters'),
    body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
    body('categoryId').isMongoId().withMessage('Valid category ID is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
    body('images').isArray({ min: 1 }).withMessage('At least one image is required')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const productData = req.body;

      // Check if category exists
      const category = await ProductCategory.findById(productData.categoryId);
      if (!category) {
        return res.status(400).json({
          error: 'Invalid category',
          message: 'The specified category does not exist'
        });
      }

      const product = new Product(productData);
      await product.save();

      await product.populate('categoryId', 'name description icon');

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: {
          product
        }
      });
    } catch (error) {
      console.error('Create product error:', error);
      res.status(400).json({
        error: 'Failed to create product',
        message: error.message
      });
    }
  }
);

module.exports = router;
