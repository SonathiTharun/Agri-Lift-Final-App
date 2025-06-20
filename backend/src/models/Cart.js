const mongoose = require('mongoose');

// Cart Item Schema
const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  discount: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
}, {
  _id: false
});

// Cart Schema
const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  sessionId: {
    type: String,
    index: true
  },
  items: [cartItemSchema],
  subtotal: {
    type: Number,
    default: 0,
    min: 0
  },
  totalItems: {
    type: Number,
    default: 0,
    min: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date,
    default: function() {
      // Cart expires after 30 days of inactivity
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }
  }
}, {
  timestamps: true,
  collection: 'carts'
});

// Indexes for better performance
cartSchema.index({ userId: 1 });
cartSchema.index({ sessionId: 1 });
cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
cartSchema.index({ lastUpdated: 1 });

// Pre-save middleware to calculate totals
cartSchema.pre('save', function(next) {
  this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
  
  this.subtotal = this.items.reduce((total, item) => {
    const itemTotal = item.price * item.quantity;
    const discountAmount = (itemTotal * item.discount) / 100;
    return total + (itemTotal - discountAmount);
  }, 0);
  
  this.lastUpdated = new Date();
  
  // Update expiration date
  this.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  
  next();
});

// Instance methods
cartSchema.methods.addItem = function(productId, quantity = 1, price, discount = 0) {
  const existingItemIndex = this.items.findIndex(
    item => item.productId.toString() === productId.toString()
  );
  
  if (existingItemIndex > -1) {
    // Update existing item
    this.items[existingItemIndex].quantity += quantity;
    this.items[existingItemIndex].price = price; // Update price in case it changed
    this.items[existingItemIndex].discount = discount;
    this.items[existingItemIndex].addedAt = new Date();
  } else {
    // Add new item
    this.items.push({
      productId,
      quantity,
      price,
      discount,
      addedAt: new Date()
    });
  }
  
  return this.save();
};

cartSchema.methods.updateItemQuantity = function(productId, quantity) {
  const itemIndex = this.items.findIndex(
    item => item.productId.toString() === productId.toString()
  );
  
  if (itemIndex > -1) {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      this.items.splice(itemIndex, 1);
    } else {
      this.items[itemIndex].quantity = quantity;
    }
    return this.save();
  }
  
  throw new Error('Item not found in cart');
};

cartSchema.methods.removeItem = function(productId) {
  const itemIndex = this.items.findIndex(
    item => item.productId.toString() === productId.toString()
  );
  
  if (itemIndex > -1) {
    this.items.splice(itemIndex, 1);
    return this.save();
  }
  
  throw new Error('Item not found in cart');
};

cartSchema.methods.clearCart = function() {
  this.items = [];
  return this.save();
};

cartSchema.methods.getItemCount = function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
};

cartSchema.methods.hasItem = function(productId) {
  return this.items.some(item => item.productId.toString() === productId.toString());
};

cartSchema.methods.getItemQuantity = function(productId) {
  const item = this.items.find(item => item.productId.toString() === productId.toString());
  return item ? item.quantity : 0;
};

cartSchema.methods.validateStock = async function() {
  const Product = mongoose.model('Product');
  const validationResults = [];
  
  for (const item of this.items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      validationResults.push({
        productId: item.productId,
        error: 'Product not found',
        isValid: false
      });
    } else if (!product.isActive) {
      validationResults.push({
        productId: item.productId,
        error: 'Product is no longer available',
        isValid: false
      });
    } else if (product.stock < item.quantity) {
      validationResults.push({
        productId: item.productId,
        error: `Only ${product.stock} items available`,
        availableStock: product.stock,
        requestedQuantity: item.quantity,
        isValid: false
      });
    } else {
      validationResults.push({
        productId: item.productId,
        isValid: true
      });
    }
  }
  
  return validationResults;
};

// Static methods
cartSchema.statics.findByUser = function(userId) {
  return this.findOne({ userId, isActive: true })
    .populate({
      path: 'items.productId',
      select: 'name price images stock isActive discount',
      populate: {
        path: 'categoryId',
        select: 'name'
      }
    });
};

cartSchema.statics.findBySession = function(sessionId) {
  return this.findOne({ sessionId, isActive: true })
    .populate({
      path: 'items.productId',
      select: 'name price images stock isActive discount'
    });
};

cartSchema.statics.mergeGuestCart = async function(userId, sessionId) {
  const userCart = await this.findByUser(userId);
  const guestCart = await this.findBySession(sessionId);
  
  if (!guestCart) return userCart;
  
  if (!userCart) {
    // Convert guest cart to user cart
    guestCart.userId = userId;
    guestCart.sessionId = undefined;
    return guestCart.save();
  }
  
  // Merge guest cart items into user cart
  for (const guestItem of guestCart.items) {
    await userCart.addItem(
      guestItem.productId,
      guestItem.quantity,
      guestItem.price,
      guestItem.discount
    );
  }
  
  // Remove guest cart
  await guestCart.deleteOne();
  
  return userCart;
};

cartSchema.statics.cleanupExpiredCarts = function() {
  return this.deleteMany({
    $or: [
      { expiresAt: { $lt: new Date() } },
      { lastUpdated: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }
    ]
  });
};

cartSchema.statics.getCartStats = function() {
  return this.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: null,
        totalCarts: { $sum: 1 },
        totalItems: { $sum: '$totalItems' },
        totalValue: { $sum: '$subtotal' },
        avgCartValue: { $avg: '$subtotal' },
        avgItemsPerCart: { $avg: '$totalItems' }
      }
    }
  ]);
};

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
