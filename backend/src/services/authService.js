const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

class AuthService {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
    this.refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN || '30d';
  }

  // Generate JWT token
  generateToken(payload) {
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn,
      issuer: 'agri-lift-soil-insight',
      audience: 'agri-lift-users'
    });
  }

  // Generate refresh token
  generateRefreshToken(payload) {
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.refreshTokenExpiresIn,
      issuer: 'agri-lift-soil-insight',
      audience: 'agri-lift-users'
    });
  }

  // Verify JWT token
  verifyToken(token) {
    try {
      return jwt.verify(token, this.jwtSecret, {
        issuer: 'agri-lift-soil-insight',
        audience: 'agri-lift-users'
      });
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  // Register new user
  async register(userData) {
    try {
      const { name, email, password, phone, role, farmDetails, executiveDetails } = userData;

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Create user data object
      const newUserData = {
        name,
        email: email.toLowerCase(),
        password,
        phone,
        role,
        status: role === 'executive' ? 'pending' : 'active', // Executives need approval
        verification: 'unverified'
      };

      // Add role-specific details
      if (role === 'farmer' && farmDetails) {
        newUserData.farmDetails = farmDetails;
      } else if (role === 'executive' && executiveDetails) {
        newUserData.executiveDetails = executiveDetails;
      }

      // Create new user
      const user = new User(newUserData);
      await user.save();

      // Generate tokens
      const tokenPayload = {
        userId: user._id,
        email: user.email,
        role: user.role,
        status: user.status
      };

      const token = this.generateToken(tokenPayload);
      const refreshToken = this.generateRefreshToken(tokenPayload);

      return {
        user: user.toJSON(),
        token,
        refreshToken,
        message: role === 'executive' 
          ? 'Registration successful. Your account is pending approval.' 
          : 'Registration successful!'
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new Error('User with this email already exists');
      }
      throw error;
    }
  }

  // Login user
  async login(email, password, userType = null) {
    try {
      // Find user by email
      const user = await User.findByEmail(email);
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Check if account is locked
      if (user.isLocked) {
        throw new Error('Account is temporarily locked due to too many failed login attempts. Please try again later.');
      }

      // Verify user type if specified
      if (userType && user.role !== userType) {
        await user.incLoginAttempts();
        throw new Error(`Invalid credentials for ${userType} login`);
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        await user.incLoginAttempts();
        throw new Error('Invalid email or password');
      }

      // Check if user account is active
      if (user.status === 'suspended') {
        throw new Error('Your account has been suspended. Please contact support.');
      }

      if (user.status === 'pending') {
        throw new Error('Your account is pending approval. Please wait for admin approval.');
      }

      if (user.status === 'inactive') {
        throw new Error('Your account is inactive. Please contact support.');
      }

      // Reset login attempts and update last login
      await user.resetLoginAttempts();
      await user.updateLastLogin();

      // Generate tokens
      const tokenPayload = {
        userId: user._id,
        email: user.email,
        role: user.role,
        status: user.status
      };

      const token = this.generateToken(tokenPayload);
      const refreshToken = this.generateRefreshToken(tokenPayload);

      return {
        user: user.toJSON(),
        token,
        refreshToken,
        message: 'Login successful!'
      };
    } catch (error) {
      throw error;
    }
  }

  // Refresh token
  async refreshToken(refreshToken) {
    try {
      const decoded = this.verifyToken(refreshToken);
      
      // Find user to ensure they still exist and are active
      const user = await User.findById(decoded.userId);
      if (!user || user.status !== 'active') {
        throw new Error('Invalid refresh token');
      }

      // Generate new tokens
      const tokenPayload = {
        userId: user._id,
        email: user.email,
        role: user.role,
        status: user.status
      };

      const newToken = this.generateToken(tokenPayload);
      const newRefreshToken = this.generateRefreshToken(tokenPayload);

      return {
        token: newToken,
        refreshToken: newRefreshToken
      };
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  // Get user profile
  async getProfile(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      return user.toJSON();
    } catch (error) {
      throw error;
    }
  }

  // Update user profile
  async updateProfile(userId, updateData) {
    try {
      const allowedUpdates = ['name', 'phone', 'location', 'farmDetails', 'executiveDetails', 'preferences', 'profileImage'];
      const updates = {};

      // Filter allowed updates
      Object.keys(updateData).forEach(key => {
        if (allowedUpdates.includes(key)) {
          updates[key] = updateData[key];
        }
      });

      const user = await User.findByIdAndUpdate(
        userId,
        { $set: updates },
        { new: true, runValidators: true }
      );

      if (!user) {
        throw new Error('User not found');
      }

      return user.toJSON();
    } catch (error) {
      throw error;
    }
  }

  // Change password
  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      // Update password
      user.password = newPassword;
      await user.save();

      return { message: 'Password changed successfully' };
    } catch (error) {
      throw error;
    }
  }

  // Validate token and get user
  async validateTokenAndGetUser(token) {
    try {
      const decoded = this.verifyToken(token);
      const user = await User.findById(decoded.userId);
      
      if (!user || user.status !== 'active') {
        throw new Error('Invalid token or user not active');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  // Get user statistics (for executives)
  async getUserStatistics() {
    try {
      const stats = await User.getUserStats();
      const totalUsers = await User.countDocuments();
      const recentUsers = await User.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .select('name email role status createdAt');

      return {
        totalUsers,
        roleStats: stats,
        recentUsers
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AuthService();
