const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: {
      values: ['farmer', 'executive'],
      message: 'Role must be either farmer or executive'
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'pending'],
    default: 'pending'
  },
  verification: {
    type: String,
    enum: ['verified', 'unverified', 'pending'],
    default: 'unverified'
  },
  profileImage: {
    type: String,
    default: null
  },
  location: {
    address: String,
    city: String,
    state: String,
    country: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  // Farmer-specific fields
  farmDetails: {
    farmName: String,
    farmSize: Number, // in acres
    farmType: {
      type: String,
      enum: ['organic', 'conventional', 'mixed']
    },
    primaryCrops: [String],
    experience: Number // years of farming experience
  },
  // Executive-specific fields
  executiveDetails: {
    department: String,
    position: String,
    employeeId: String,
    accessLevel: {
      type: String,
      enum: ['basic', 'advanced', 'admin'],
      default: 'basic'
    }
  },
  // Authentication and security
  lastLogin: {
    type: Date,
    default: null
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  // Activity tracking
  totalLogins: {
    type: Number,
    default: 0
  },
  preferences: {
    language: {
      type: String,
      default: 'en'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      },
      push: {
        type: Boolean,
        default: true
      }
    },
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    }
  },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Equipment' }],
}, {
  timestamps: true,
  toJSON: {
    transform: function (doc, ret) {
      delete ret.password;
      delete ret.resetPasswordToken;
      delete ret.resetPasswordExpires;
      delete ret.emailVerificationToken;
      delete ret.emailVerificationExpires;
      return ret;
    }
  }
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });
userSchema.index({ createdAt: -1 });

// Virtual for account lock status
userSchema.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save middleware to hash password
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Instance method to increment login attempts
userSchema.methods.incLoginAttempts = function () {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    }).maxTimeMS(10000); // 10 second timeout
  }

  const updates = { $inc: { loginAttempts: 1 } };

  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }

  return this.updateOne(updates).maxTimeMS(10000); // 10 second timeout
};

// Instance method to reset login attempts
userSchema.methods.resetLoginAttempts = function () {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  }).maxTimeMS(10000); // 10 second timeout
};

// Instance method to update last login
userSchema.methods.updateLastLogin = function () {
  return this.updateOne({
    $set: { lastLogin: new Date() },
    $inc: { totalLogins: 1 }
  }).maxTimeMS(10000); // 10 second timeout
};

// Static method to find by email with timeout
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() }).maxTimeMS(15000); // 15 second timeout
};

// Static method to find active users
userSchema.statics.findActiveUsers = function (role = null) {
  const query = { status: 'active' };
  if (role) query.role = role;
  return this.find(query).maxTimeMS(15000); // 15 second timeout
};

// Static method to get user stats
userSchema.statics.getUserStats = function () {
  return this.aggregate([
    {
      $group: {
        _id: '$role',
        total: { $sum: 1 },
        active: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
        pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
        suspended: { $sum: { $cond: [{ $eq: ['$status', 'suspended'] }, 1, 0] } }
      }
    }
  ]).maxTimeMS(15000); // 15 second timeout
};

const User = mongoose.model('User', userSchema);

module.exports = User;
