const mongoose = require('mongoose');

// Product Category Schema
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  collection: 'product_categories'
});

// Product Schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductCategory',
    required: true,
    index: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  discount: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  images: [{
    type: String,
    required: true
  }],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  specifications: {
    type: Map,
    of: String
  },
  benefits: [String],
  tags: [String],
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  weight: {
    value: Number,
    unit: {
      type: String,
      enum: ['kg', 'g', 'lbs', 'oz'],
      default: 'kg'
    }
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: {
      type: String,
      enum: ['cm', 'inch', 'm'],
      default: 'cm'
    }
  },
  manufacturer: {
    name: String,
    brand: String,
    country: String
  },
  certifications: [String],
  shelfLife: {
    value: Number,
    unit: {
      type: String,
      enum: ['days', 'months', 'years'],
      default: 'months'
    }
  },
  storageInstructions: String,
  usageInstructions: String,
  seoTitle: String,
  seoDescription: String,
  seoKeywords: [String]
}, {
  timestamps: true,
  collection: 'products'
});

// Indexes for better performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ categoryId: 1, isActive: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ createdAt: -1 });

// Virtual for discounted price
productSchema.virtual('discountedPrice').get(function() {
  if (this.discount > 0) {
    return this.price * (1 - this.discount / 100);
  }
  return this.price;
});

// Virtual for availability status
productSchema.virtual('isAvailable').get(function() {
  return this.isActive && this.stock > 0;
});

// Pre-save middleware
productSchema.pre('save', function(next) {
  // Calculate original price if discount is applied
  if (this.discount > 0 && !this.originalPrice) {
    this.originalPrice = this.price;
  }
  
  // Ensure at least one image
  if (!this.images || this.images.length === 0) {
    this.images = ['https://via.placeholder.com/400x300?text=No+Image'];
  }
  
  next();
});

// Instance methods
productSchema.methods.updateStock = function(quantity, operation = 'subtract') {
  if (operation === 'subtract') {
    this.stock = Math.max(0, this.stock - quantity);
  } else if (operation === 'add') {
    this.stock += quantity;
  }
  return this.save();
};

productSchema.methods.updateRating = function(newRating) {
  const totalRating = this.rating * this.reviewCount + newRating;
  this.reviewCount += 1;
  this.rating = totalRating / this.reviewCount;
  return this.save();
};

// Static methods
productSchema.statics.findByCategory = function(categoryId, options = {}) {
  const { limit = 10, skip = 0, sort = { createdAt: -1 } } = options;
  return this.find({ categoryId, isActive: true })
    .populate('categoryId', 'name description')
    .sort(sort)
    .limit(limit)
    .skip(skip);
};

productSchema.statics.findFeatured = function(limit = 10) {
  return this.find({ isFeatured: true, isActive: true })
    .populate('categoryId', 'name description')
    .sort({ rating: -1, createdAt: -1 })
    .limit(limit);
};

productSchema.statics.searchProducts = function(query, options = {}) {
  const { limit = 20, skip = 0, categoryId, minPrice, maxPrice, minRating } = options;
  
  const searchQuery = {
    $text: { $search: query },
    isActive: true
  };
  
  if (categoryId) searchQuery.categoryId = categoryId;
  if (minPrice !== undefined) searchQuery.price = { $gte: minPrice };
  if (maxPrice !== undefined) {
    searchQuery.price = { ...searchQuery.price, $lte: maxPrice };
  }
  if (minRating !== undefined) searchQuery.rating = { $gte: minRating };
  
  return this.find(searchQuery)
    .populate('categoryId', 'name description')
    .sort({ score: { $meta: 'textScore' }, rating: -1 })
    .limit(limit)
    .skip(skip);
};

// Export models
const ProductCategory = mongoose.model('ProductCategory', categorySchema);
const Product = mongoose.model('Product', productSchema);

module.exports = { Product, ProductCategory };
