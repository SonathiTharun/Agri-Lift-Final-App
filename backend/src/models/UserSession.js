const mongoose = require('mongoose');

// User Session Schema for tracking user activity
const userSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: String,
    index: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  },
  location: {
    country: String,
    region: String,
    city: String,
    latitude: Number,
    longitude: Number
  },
  deviceInfo: {
    browser: String,
    os: String,
    device: String,
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  activityLog: [{
    action: {
      type: String,
      required: true,
      enum: [
        'session_start',
        'file_upload',
        'analysis_complete',
        'recommendation_generated',
        'parameter_updated',
        'season_changed',
        'report_viewed',
        'session_end'
      ]
    },
    details: mongoose.Schema.Types.Mixed,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  reportsGenerated: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SoilReport'
  }],
  totalUploads: {
    type: Number,
    default: 0
  },
  totalAnalyses: {
    type: Number,
    default: 0
  },
  preferredSeasons: [{
    type: String,
    enum: ['kharif', 'rabi', 'zaid']
  }],
  lastActivity: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sessionDuration: {
    type: Number, // in milliseconds
    default: 0
  }
}, {
  timestamps: true,
  collection: 'user_sessions'
});

// Indexes for performance
userSessionSchema.index({ sessionId: 1 });
userSessionSchema.index({ userId: 1, lastActivity: -1 });
userSessionSchema.index({ isActive: 1, lastActivity: -1 });
userSessionSchema.index({ createdAt: -1 });
userSessionSchema.index({ 'activityLog.action': 1, 'activityLog.timestamp': -1 });

// Virtual for session age
userSessionSchema.virtual('sessionAge').get(function() {
  return Date.now() - this.createdAt.getTime();
});

// Virtual for activity count
userSessionSchema.virtual('activityCount').get(function() {
  return this.activityLog.length;
});

// Pre-save middleware to update session duration
userSessionSchema.pre('save', function(next) {
  if (this.isModified('lastActivity')) {
    this.sessionDuration = this.lastActivity.getTime() - this.createdAt.getTime();
  }
  next();
});

// Instance methods
userSessionSchema.methods.addActivity = function(action, details = null) {
  this.activityLog.push({
    action,
    details,
    timestamp: new Date()
  });
  this.lastActivity = new Date();
  
  // Update counters based on action
  switch (action) {
    case 'file_upload':
      this.totalUploads += 1;
      break;
    case 'analysis_complete':
      this.totalAnalyses += 1;
      break;
  }
};

userSessionSchema.methods.addReport = function(reportId) {
  if (!this.reportsGenerated.includes(reportId)) {
    this.reportsGenerated.push(reportId);
  }
};

userSessionSchema.methods.updatePreferredSeason = function(season) {
  if (!this.preferredSeasons.includes(season)) {
    this.preferredSeasons.push(season);
  }
  // Keep only last 3 preferred seasons
  if (this.preferredSeasons.length > 3) {
    this.preferredSeasons = this.preferredSeasons.slice(-3);
  }
};

userSessionSchema.methods.endSession = function() {
  this.isActive = false;
  this.lastActivity = new Date();
  this.sessionDuration = this.lastActivity.getTime() - this.createdAt.getTime();
  this.addActivity('session_end');
};

// Static methods
userSessionSchema.statics.findActiveSession = function(sessionId) {
  return this.findOne({ 
    sessionId, 
    isActive: true 
  });
};

userSessionSchema.statics.findUserSessions = function(userId, limit = 10) {
  return this.find({ userId })
    .sort({ lastActivity: -1 })
    .limit(limit)
    .select('-activityLog'); // Exclude detailed activity log for list view
};

userSessionSchema.statics.getActiveSessionsCount = function() {
  return this.countDocuments({ 
    isActive: true,
    lastActivity: { 
      $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
    }
  });
};

userSessionSchema.statics.getSessionStats = function(timeRange = 7) {
  const startDate = new Date(Date.now() - timeRange * 24 * 60 * 60 * 1000);
  
  return this.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt"
          }
        },
        totalSessions: { $sum: 1 },
        activeSessions: {
          $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] }
        },
        totalUploads: { $sum: "$totalUploads" },
        totalAnalyses: { $sum: "$totalAnalyses" },
        avgSessionDuration: { $avg: "$sessionDuration" }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

userSessionSchema.statics.getUserActivityPattern = function(userId) {
  return this.aggregate([
    { $match: { userId } },
    { $unwind: "$activityLog" },
    {
      $group: {
        _id: "$activityLog.action",
        count: { $sum: 1 },
        lastOccurrence: { $max: "$activityLog.timestamp" }
      }
    },
    { $sort: { count: -1 } }
  ]);
};

userSessionSchema.statics.cleanupOldSessions = function(daysOld = 30) {
  const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
  
  return this.deleteMany({
    isActive: false,
    lastActivity: { $lt: cutoffDate }
  });
};

// Export the model
module.exports = mongoose.model('UserSession', userSessionSchema);
