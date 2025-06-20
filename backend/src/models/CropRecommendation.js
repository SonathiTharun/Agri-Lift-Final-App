const mongoose = require('mongoose');

// Parameter Score Schema for detailed analysis
const parameterScoreSchema = new mongoose.Schema({
  pH: {
    type: Number,
    min: 0,
    max: 100
  },
  nitrogen: {
    type: Number,
    min: 0,
    max: 100
  },
  phosphorus: {
    type: Number,
    min: 0,
    max: 100
  },
  potassium: {
    type: Number,
    min: 0,
    max: 100
  },
  organicMatter: {
    type: Number,
    min: 0,
    max: 100
  },
  moisture: {
    type: Number,
    min: 0,
    max: 100
  }
}, {
  _id: false
});

// Market Information Schema
const marketInfoSchema = new mongoose.Schema({
  price: {
    min: Number,
    max: Number,
    unit: {
      type: String,
      default: '₹/quintal'
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  expectedYield: {
    min: Number,
    max: Number,
    unit: {
      type: String,
      default: 'quintal/hectare'
    }
  },
  potentialRevenue: {
    type: Number,
    min: 0
  }
}, {
  _id: false
});

// Crop Recommendation Schema
const cropRecommendationSchema = new mongoose.Schema({
  reportId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SoilReport',
    required: true,
    index: true
  },
  userId: {
    type: String,
    index: true
  },
  sessionId: {
    type: String,
    required: true
  },
  cropName: {
    type: String,
    required: true,
    index: true
  },
  cropDescription: {
    type: String,
    required: true
  },
  growingPeriod: {
    type: String,
    required: true
  },
  waterNeed: {
    type: String,
    required: true,
    enum: ['Low', 'Medium', 'High']
  },
  suitability: {
    type: String,
    required: true,
    enum: ['Excellent', 'Good', 'Fair', 'Poor']
  },
  suitabilityScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  season: {
    type: String,
    required: true,
    enum: ['kharif', 'rabi', 'zaid'],
    index: true
  },
  parameterScores: parameterScoreSchema,
  marketInfo: marketInfoSchema,
  idealConditions: {
    pH: {
      min: Number,
      max: Number
    },
    nitrogen: {
      min: Number,
      max: Number
    },
    phosphorus: {
      min: Number,
      max: Number
    },
    potassium: {
      min: Number,
      max: Number
    },
    organicMatter: {
      min: Number,
      max: Number
    },
    moisture: {
      min: Number,
      max: Number
    }
  },
  cultivationTips: [String],
  riskFactors: [String],
  benefits: [String],
  isRecommended: {
    type: Boolean,
    default: function() {
      return this.suitabilityScore >= 70;
    }
  },
  priority: {
    type: Number,
    default: function() {
      if (this.suitabilityScore >= 85) return 1; // High priority
      if (this.suitabilityScore >= 70) return 2; // Medium priority
      if (this.suitabilityScore >= 50) return 3; // Low priority
      return 4; // Not recommended
    }
  },
  metadata: {
    generationMethod: {
      type: String,
      enum: ['ai_analysis', 'rule_based', 'hybrid'],
      default: 'rule_based'
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.8
    },
    version: {
      type: String,
      default: '1.0'
    }
  }
}, {
  timestamps: true,
  collection: 'crop_recommendations'
});

// Compound indexes for efficient queries
cropRecommendationSchema.index({ reportId: 1, season: 1 });
cropRecommendationSchema.index({ userId: 1, season: 1, createdAt: -1 });
cropRecommendationSchema.index({ suitabilityScore: -1, season: 1 });
cropRecommendationSchema.index({ cropName: 1, season: 1 });
cropRecommendationSchema.index({ isRecommended: 1, priority: 1 });

// Virtual for recommendation rank
cropRecommendationSchema.virtual('rank').get(function() {
  if (this.suitabilityScore >= 85) return 'Top Choice';
  if (this.suitabilityScore >= 70) return 'Good Option';
  if (this.suitabilityScore >= 50) return 'Consider';
  return 'Not Recommended';
});

// Pre-save middleware
cropRecommendationSchema.pre('save', function(next) {
  // Auto-calculate isRecommended and priority if not set
  if (this.isNew || this.isModified('suitabilityScore')) {
    this.isRecommended = this.suitabilityScore >= 70;
    
    if (this.suitabilityScore >= 85) this.priority = 1;
    else if (this.suitabilityScore >= 70) this.priority = 2;
    else if (this.suitabilityScore >= 50) this.priority = 3;
    else this.priority = 4;
  }
  next();
});

// Instance methods
cropRecommendationSchema.methods.updateScore = function(newScore) {
  this.suitabilityScore = newScore;
  this.isRecommended = newScore >= 70;
  
  if (newScore >= 85) this.priority = 1;
  else if (newScore >= 70) this.priority = 2;
  else if (newScore >= 50) this.priority = 3;
  else this.priority = 4;
};

cropRecommendationSchema.methods.addCultivationTip = function(tip) {
  if (!this.cultivationTips.includes(tip)) {
    this.cultivationTips.push(tip);
  }
};

cropRecommendationSchema.methods.addRiskFactor = function(risk) {
  if (!this.riskFactors.includes(risk)) {
    this.riskFactors.push(risk);
  }
};

// Static methods
cropRecommendationSchema.statics.findByReportAndSeason = function(reportId, season = null) {
  const query = { reportId };
  if (season) query.season = season;
  
  return this.find(query)
    .sort({ suitabilityScore: -1, priority: 1 })
    .populate('reportId', 'userId sessionId createdAt');
};

cropRecommendationSchema.statics.findTopRecommendations = function(reportId, season, limit = 5) {
  return this.find({ 
    reportId, 
    season,
    isRecommended: true 
  })
    .sort({ suitabilityScore: -1, priority: 1 })
    .limit(limit);
};

cropRecommendationSchema.statics.getSeasonalStats = function(season, userId = null) {
  const matchStage = { season };
  if (userId) matchStage.userId = userId;
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$suitability',
        count: { $sum: 1 },
        avgScore: { $avg: '$suitabilityScore' },
        crops: { $addToSet: '$cropName' }
      }
    },
    { $sort: { avgScore: -1 } }
  ]);
};

cropRecommendationSchema.statics.getCropPopularity = function(season = null, limit = 10) {
  const matchStage = season ? { season } : {};
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$cropName',
        recommendationCount: { $sum: 1 },
        avgScore: { $avg: '$suitabilityScore' },
        seasons: { $addToSet: '$season' }
      }
    },
    { $sort: { recommendationCount: -1, avgScore: -1 } },
    { $limit: limit }
  ]);
};

// Export the model
module.exports = mongoose.model('CropRecommendation', cropRecommendationSchema);
