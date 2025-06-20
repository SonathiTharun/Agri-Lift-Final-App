const mongoose = require('mongoose');

// Market Price Schema
const marketPriceSchema = new mongoose.Schema({
  crop: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  variety: {
    type: String,
    trim: true
  },
  market: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      city: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      country: {
        type: String,
        default: 'India'
      }
    },
    type: {
      type: String,
      enum: ['wholesale', 'retail', 'mandi', 'online', 'export'],
      default: 'wholesale'
    }
  },
  price: {
    current: {
      type: Number,
      required: true,
      min: 0
    },
    previous: {
      type: Number,
      min: 0
    },
    unit: {
      type: String,
      required: true,
      enum: ['per_kg', 'per_quintal', 'per_ton', 'per_piece', 'per_dozen'],
      default: 'per_quintal'
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  change: {
    amount: {
      type: Number,
      default: 0
    },
    percentage: {
      type: Number,
      default: 0
    },
    trend: {
      type: String,
      enum: ['up', 'down', 'neutral'],
      default: 'neutral'
    }
  },
  volume: {
    traded: {
      type: Number,
      min: 0,
      default: 0
    },
    available: {
      type: Number,
      min: 0
    },
    unit: {
      type: String,
      enum: ['kg', 'quintal', 'ton'],
      default: 'quintal'
    }
  },
  quality: {
    grade: {
      type: String,
      enum: ['A', 'B', 'C', 'Premium', 'Standard', 'Low'],
      default: 'Standard'
    },
    description: String,
    certifications: [String]
  },
  season: {
    type: String,
    enum: ['kharif', 'rabi', 'zaid', 'year_round'],
    required: true
  },
  dataSource: {
    type: String,
    required: true,
    enum: ['government', 'market_committee', 'trader', 'farmer', 'api', 'manual']
  },
  reliability: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  metadata: {
    reportedBy: String,
    verifiedBy: String,
    notes: String,
    tags: [String]
  }
}, {
  timestamps: true,
  collection: 'market_prices'
});

// Indexes for better performance
marketPriceSchema.index({ crop: 1, 'market.location.state': 1, lastUpdated: -1 });
marketPriceSchema.index({ 'market.name': 1, crop: 1 });
marketPriceSchema.index({ lastUpdated: -1 });
marketPriceSchema.index({ season: 1, crop: 1 });
marketPriceSchema.index({ 'change.trend': 1 });
marketPriceSchema.index({ isActive: 1 });

// Virtual for price per kg
marketPriceSchema.virtual('pricePerKg').get(function() {
  switch (this.price.unit) {
    case 'per_kg':
      return this.price.current;
    case 'per_quintal':
      return this.price.current / 100;
    case 'per_ton':
      return this.price.current / 1000;
    default:
      return this.price.current;
  }
});

// Virtual for formatted price
marketPriceSchema.virtual('formattedPrice').get(function() {
  const price = this.price.current;
  const unit = this.price.unit.replace('per_', '');
  return `₹${price.toLocaleString('en-IN')}/${unit}`;
});

// Pre-save middleware to calculate change
marketPriceSchema.pre('save', function(next) {
  if (this.price.previous && this.price.current) {
    this.change.amount = this.price.current - this.price.previous;
    this.change.percentage = ((this.change.amount / this.price.previous) * 100).toFixed(2);
    
    if (this.change.amount > 0) {
      this.change.trend = 'up';
    } else if (this.change.amount < 0) {
      this.change.trend = 'down';
    } else {
      this.change.trend = 'neutral';
    }
  }
  
  this.lastUpdated = new Date();
  next();
});

// Instance methods
marketPriceSchema.methods.updatePrice = function(newPrice) {
  this.price.previous = this.price.current;
  this.price.current = newPrice;
  return this.save();
};

marketPriceSchema.methods.isDataFresh = function(maxAgeHours = 24) {
  const ageInHours = (Date.now() - this.lastUpdated.getTime()) / (1000 * 60 * 60);
  return ageInHours <= maxAgeHours;
};

marketPriceSchema.methods.getPriceHistory = function(days = 30) {
  const MarketPrice = this.constructor;
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  
  return MarketPrice.find({
    crop: this.crop,
    'market.name': this.market.name,
    createdAt: { $gte: startDate }
  }).sort({ createdAt: 1 }).select('price.current createdAt');
};

// Static methods
marketPriceSchema.statics.findByCrop = function(cropName, options = {}) {
  const { state, marketType, limit = 10, sort = { lastUpdated: -1 } } = options;
  
  const query = {
    crop: new RegExp(cropName, 'i'),
    isActive: true
  };
  
  if (state) query['market.location.state'] = new RegExp(state, 'i');
  if (marketType) query['market.type'] = marketType;
  
  return this.find(query)
    .sort(sort)
    .limit(limit);
};

marketPriceSchema.statics.findByMarket = function(marketName, state = null) {
  const query = {
    'market.name': new RegExp(marketName, 'i'),
    isActive: true
  };
  
  if (state) query['market.location.state'] = new RegExp(state, 'i');
  
  return this.find(query).sort({ lastUpdated: -1 });
};

marketPriceSchema.statics.getLatestPrices = function(crops = [], limit = 50) {
  const query = { isActive: true };
  
  if (crops.length > 0) {
    query.crop = { $in: crops.map(crop => new RegExp(crop, 'i')) };
  }
  
  return this.find(query)
    .sort({ lastUpdated: -1 })
    .limit(limit);
};

marketPriceSchema.statics.getPriceComparison = function(cropName, states = []) {
  const query = {
    crop: new RegExp(cropName, 'i'),
    isActive: true
  };
  
  if (states.length > 0) {
    query['market.location.state'] = { $in: states.map(state => new RegExp(state, 'i')) };
  }
  
  return this.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$market.location.state',
        avgPrice: { $avg: '$price.current' },
        minPrice: { $min: '$price.current' },
        maxPrice: { $max: '$price.current' },
        markets: { $addToSet: '$market.name' },
        lastUpdated: { $max: '$lastUpdated' }
      }
    },
    { $sort: { avgPrice: 1 } }
  ]);
};

marketPriceSchema.statics.getTrendingCrops = function(days = 7, limit = 10) {
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  
  return this.aggregate([
    {
      $match: {
        lastUpdated: { $gte: startDate },
        isActive: true
      }
    },
    {
      $group: {
        _id: '$crop',
        avgChange: { $avg: '$change.percentage' },
        totalVolume: { $sum: '$volume.traded' },
        priceUpdates: { $sum: 1 },
        latestPrice: { $last: '$price.current' },
        trend: { $last: '$change.trend' }
      }
    },
    { $sort: { avgChange: -1 } },
    { $limit: limit }
  ]);
};

marketPriceSchema.statics.getMarketSummary = function(state = null) {
  const matchStage = { isActive: true };
  if (state) matchStage['market.location.state'] = new RegExp(state, 'i');
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalCrops: { $addToSet: '$crop' },
        totalMarkets: { $addToSet: '$market.name' },
        avgPrice: { $avg: '$price.current' },
        totalVolume: { $sum: '$volume.traded' },
        priceIncreases: {
          $sum: { $cond: [{ $eq: ['$change.trend', 'up'] }, 1, 0] }
        },
        priceDecreases: {
          $sum: { $cond: [{ $eq: ['$change.trend', 'down'] }, 1, 0] }
        },
        stablePrices: {
          $sum: { $cond: [{ $eq: ['$change.trend', 'neutral'] }, 1, 0] }
        }
      }
    },
    {
      $project: {
        totalCrops: { $size: '$totalCrops' },
        totalMarkets: { $size: '$totalMarkets' },
        avgPrice: { $round: ['$avgPrice', 2] },
        totalVolume: 1,
        priceIncreases: 1,
        priceDecreases: 1,
        stablePrices: 1
      }
    }
  ]);
};

marketPriceSchema.statics.cleanupOldData = function(daysOld = 90) {
  const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
  
  return this.deleteMany({
    lastUpdated: { $lt: cutoffDate }
  });
};

const MarketPrice = mongoose.model('MarketPrice', marketPriceSchema);

module.exports = MarketPrice;
