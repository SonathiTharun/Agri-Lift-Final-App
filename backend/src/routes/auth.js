const express = require('express');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const authService = require('../services/authService');
const {
  authenticateToken,
  requireRole,
  requireExecutive,
  logAuthEvent,
  authRateLimit
} = require('../middleware/auth');

const router = express.Router();

// Configure multer for profile picture uploads
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.PROFILE_UPLOAD_DIR || './uploads/profiles';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `profile_${req.user._id}_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const profileUpload = multer({
  storage: profileStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for profile pictures
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG and PNG images are allowed.'));
    }
  }
});

// Validation middleware
const validateRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('phone')
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('role')
    .isIn(['farmer', 'executive'])
    .withMessage('Role must be either farmer or executive')
];

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number')
];

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

// POST /api/auth/register - Register new user
router.post('/register', 
  authRateLimit,
  validateRegistration,
  handleValidationErrors,
  logAuthEvent('REGISTER_ATTEMPT'),
  async (req, res) => {
    try {
      const { name, email, password, phone, role, farmDetails, executiveDetails } = req.body;

      const result = await authService.register({
        name,
        email,
        password,
        phone,
        role,
        farmDetails,
        executiveDetails
      });

      // Set HTTP-only cookie for refresh token
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });

      res.status(201).json({
        success: true,
        message: result.message,
        data: {
          user: result.user,
          token: result.token
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json({
        error: 'Registration failed',
        message: error.message
      });
    }
  }
);

// POST /api/auth/login - Login user
router.post('/login',
  authRateLimit,
  validateLogin,
  handleValidationErrors,
  logAuthEvent('LOGIN_ATTEMPT'),
  async (req, res) => {
    try {
      const { email, password, userType } = req.body;

      const result = await authService.login(email, password, userType);

      // Set HTTP-only cookie for refresh token
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });

      res.json({
        success: true,
        message: result.message,
        data: {
          user: result.user,
          token: result.token
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(401).json({
        error: 'Login failed',
        message: error.message
      });
    }
  }
);

// POST /api/auth/logout - Logout user
router.post('/logout',
  authenticateToken,
  logAuthEvent('LOGOUT'),
  async (req, res) => {
    try {
      // Clear refresh token cookie
      res.clearCookie('refreshToken');

      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        error: 'Logout failed',
        message: 'An error occurred during logout'
      });
    }
  }
);

// POST /api/auth/refresh - Refresh access token
router.post('/refresh',
  authRateLimit,
  async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({
          error: 'Refresh token required',
          message: 'No refresh token provided'
        });
      }

      const result = await authService.refreshToken(refreshToken);

      // Set new refresh token cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });

      res.json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          token: result.token
        }
      });
    } catch (error) {
      console.error('Token refresh error:', error);
      res.status(401).json({
        error: 'Token refresh failed',
        message: error.message
      });
    }
  }
);

// GET /api/auth/profile - Get user profile
router.get('/profile',
  authenticateToken,
  async (req, res) => {
    try {
      const profile = await authService.getProfile(req.user._id);

      res.json({
        success: true,
        data: {
          user: profile
        }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        error: 'Failed to get profile',
        message: error.message
      });
    }
  }
);

// PUT /api/auth/profile - Update user profile
router.put('/profile',
  authenticateToken,
  async (req, res) => {
    try {
      const updatedProfile = await authService.updateProfile(req.user._id, req.body);

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          user: updatedProfile
        }
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(400).json({
        error: 'Failed to update profile',
        message: error.message
      });
    }
  }
);

// POST /api/auth/change-password - Change password
router.post('/change-password',
  authenticateToken,
  validatePasswordChange,
  handleValidationErrors,
  logAuthEvent('PASSWORD_CHANGE'),
  async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;

      const result = await authService.changePassword(
        req.user._id,
        currentPassword,
        newPassword
      );

      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(400).json({
        error: 'Failed to change password',
        message: error.message
      });
    }
  }
);

// GET /api/auth/verify-token - Verify if token is valid
router.get('/verify-token',
  authenticateToken,
  async (req, res) => {
    try {
      res.json({
        success: true,
        message: 'Token is valid',
        data: {
          user: req.user.toJSON()
        }
      });
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(401).json({
        error: 'Token verification failed',
        message: error.message
      });
    }
  }
);

// GET /api/auth/stats - Get user statistics (Executive only)
router.get('/stats',
  authenticateToken,
  requireExecutive,
  async (req, res) => {
    try {
      const stats = await authService.getUserStatistics();

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Get stats error:', error);
      res.status(500).json({
        error: 'Failed to get statistics',
        message: error.message
      });
    }
  }
);

// POST /api/auth/profile/picture - Upload profile picture
router.post('/profile/picture',
  authenticateToken,
  profileUpload.single('profilePicture'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: 'No file uploaded',
          message: 'Please upload a profile picture'
        });
      }

      // Update user profile with new image path
      const profileImageUrl = `/uploads/profiles/${req.file.filename}`;
      const updatedProfile = await authService.updateProfile(req.user._id, {
        profileImage: profileImageUrl
      });

      res.json({
        success: true,
        message: 'Profile picture updated successfully',
        data: {
          user: updatedProfile,
          profileImageUrl: profileImageUrl
        }
      });
    } catch (error) {
      console.error('Profile picture upload error:', error);

      // Clean up uploaded file if database update fails
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      res.status(400).json({
        error: 'Failed to upload profile picture',
        message: error.message
      });
    }
  }
);

module.exports = router;
