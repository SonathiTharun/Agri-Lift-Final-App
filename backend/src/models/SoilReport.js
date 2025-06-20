const mongoose = require('mongoose');

// Soil Parameter Schema
const soilParameterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['pH', 'nitrogen', 'phosphorus', 'potassium', 'organic_matter', 'organic matter', 'moisture']
  },
  value: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    required: true,
    enum: ['optimal', 'low', 'deficient']
  },
  optimal: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    }
  },
  extractionMethod: {
    type: String,
    default: 'ocr',
    enum: ['ocr', 'manual', 'sensor', 'default']
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1,
    default: 0
  }
}, {
  _id: false // Don't create separate _id for subdocuments
});

// OCR Processing Log Schema
const ocrProcessingLogSchema = new mongoose.Schema({
  step: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['started', 'completed', 'failed']
  },
  message: String,
  processingTimeMs: Number,
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  _id: false
});

// Main Soil Report Schema
const soilReportSchema = new mongoose.Schema({
  userId: {
    type: String,
    index: true
  },
  sessionId: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true,
    enum: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
  },
  fileSize: {
    type: Number,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  ocrText: {
    type: String
  },
  ocrConfidence: {
    type: Number,
    min: 0,
    max: 100
  },
  processingStatus: {
    type: String,
    required: true,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  parameters: [soilParameterSchema],
  processingLog: [ocrProcessingLogSchema],
  extractedCount: {
    type: Number,
    default: 0
  },
  healthScore: {
    type: Number,
    min: 0,
    max: 100
  },
  recommendations: [String], // General soil health recommendations
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  metadata: {
    ipAddress: String,
    userAgent: String,
    uploadSource: {
      type: String,
      enum: ['web', 'mobile', 'api'],
      default: 'web'
    }
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  collection: 'soil_reports'
});

// Indexes for better performance
soilReportSchema.index({ userId: 1, createdAt: -1 });
soilReportSchema.index({ sessionId: 1 });
soilReportSchema.index({ processingStatus: 1 });
soilReportSchema.index({ createdAt: -1 });
soilReportSchema.index({ 'parameters.name': 1 });

// Virtual for calculating health score
soilReportSchema.virtual('calculatedHealthScore').get(function() {
  if (!this.parameters || this.parameters.length === 0) return 0;
  
  const optimalCount = this.parameters.filter(p => p.status === 'optimal').length;
  return Math.round((optimalCount / this.parameters.length) * 100);
});

// Pre-save middleware to calculate health score
soilReportSchema.pre('save', function(next) {
  if (this.parameters && this.parameters.length > 0) {
    const optimalCount = this.parameters.filter(p => p.status === 'optimal').length;
    this.healthScore = Math.round((optimalCount / this.parameters.length) * 100);
    this.extractedCount = this.parameters.filter(p => p.extractionMethod === 'ocr').length;
  }
  next();
});

// Instance methods
soilReportSchema.methods.addProcessingLog = function(step, status, message = null, processingTimeMs = null) {
  this.processingLog.push({
    step,
    status,
    message,
    processingTimeMs,
    timestamp: new Date()
  });
};

soilReportSchema.methods.updateParameter = function(parameterName, value) {
  const param = this.parameters.find(p => p.name === parameterName);
  if (param) {
    param.value = value;
    
    // Update status based on optimal range
    if (value < param.optimal.min) {
      param.status = value < param.optimal.min * 0.7 ? 'deficient' : 'low';
    } else if (value > param.optimal.max) {
      param.status = value > param.optimal.max * 1.3 ? 'deficient' : 'low';
    } else {
      param.status = 'optimal';
    }
    
    // Recalculate health score
    const optimalCount = this.parameters.filter(p => p.status === 'optimal').length;
    this.healthScore = Math.round((optimalCount / this.parameters.length) * 100);
    
    return true;
  }
  return false;
};

// Static methods
soilReportSchema.statics.findByUserId = function(userId, limit = 10, skip = 0) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .select('-ocrText -processingLog'); // Exclude large fields for list view
};

soilReportSchema.statics.findCompletedReports = function(userId = null, limit = 10) {
  const query = { processingStatus: 'completed' };
  if (userId) query.userId = userId;
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('-ocrText -processingLog');
};

soilReportSchema.statics.getProcessingStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$processingStatus',
        count: { $sum: 1 }
      }
    }
  ]);
};

// Export the model
module.exports = mongoose.model('SoilReport', soilReportSchema);
