const authService = require('../services/authService');
const User = require('../models/User');

// Middleware to authenticate JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'No token provided'
      });
    }

    // Verify token and get user
    const user = await authService.validateTokenAndGetUser(token);
    
    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Access denied',
      message: error.message || 'Invalid token'
    });
  }
};

// Middleware to check if user has required role
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Authentication required'
      });
    }

    // Convert single role to array
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Access forbidden',
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}`
      });
    }

    next();
  };
};

// Middleware to check if user is farmer
const requireFarmer = requireRole('farmer');

// Middleware to check if user is executive
const requireExecutive = requireRole('executive');

// Middleware to check if user is active
const requireActiveUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Access denied',
      message: 'Authentication required'
    });
  }

  if (req.user.status !== 'active') {
    return res.status(403).json({
      error: 'Access forbidden',
      message: 'Account is not active'
    });
  }

  next();
};

// Middleware to check if user is verified
const requireVerifiedUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Access denied',
      message: 'Authentication required'
    });
  }

  if (req.user.verification !== 'verified') {
    return res.status(403).json({
      error: 'Access forbidden',
      message: 'Email verification required'
    });
  }

  next();
};

// Middleware to check executive access level
const requireExecutiveAccess = (minLevel = 'basic') => {
  const accessLevels = {
    'basic': 1,
    'advanced': 2,
    'admin': 3
  };

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Authentication required'
      });
    }

    if (req.user.role !== 'executive') {
      return res.status(403).json({
        error: 'Access forbidden',
        message: 'Executive access required'
      });
    }

    const userLevel = accessLevels[req.user.executiveDetails?.accessLevel || 'basic'];
    const requiredLevel = accessLevels[minLevel];

    if (userLevel < requiredLevel) {
      return res.status(403).json({
        error: 'Access forbidden',
        message: `Insufficient access level. Required: ${minLevel}`
      });
    }

    next();
  };
};

// Middleware to allow access to own resources or executive access
const requireOwnershipOrExecutive = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Access denied',
      message: 'Authentication required'
    });
  }

  const resourceUserId = req.params.userId || req.body.userId || req.query.userId;
  const isOwner = req.user._id.toString() === resourceUserId;
  const isExecutive = req.user.role === 'executive';

  if (!isOwner && !isExecutive) {
    return res.status(403).json({
      error: 'Access forbidden',
      message: 'You can only access your own resources'
    });
  }

  next();
};

// Optional authentication middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const user = await authService.validateTokenAndGetUser(token);
      req.user = user;
    }
  } catch (error) {
    // Ignore authentication errors for optional auth
    console.log('Optional auth failed:', error.message);
  }
  
  next();
};

// Rate limiting for authentication endpoints
const authRateLimit = (req, res, next) => {
  // This would typically use a more sophisticated rate limiting solution
  // For now, we'll rely on the global rate limiter
  next();
};

// Middleware to log authentication events
const logAuthEvent = (event) => {
  return (req, res, next) => {
    const userInfo = req.user ? {
      userId: req.user._id,
      email: req.user.email,
      role: req.user.role
    } : { ip: req.ip };

    console.log(`Auth Event: ${event}`, {
      ...userInfo,
      timestamp: new Date().toISOString(),
      userAgent: req.get('User-Agent'),
      ip: req.ip
    });

    next();
  };
};

// Middleware to check if user can perform action on resource
const checkResourcePermission = (resourceType) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'Access denied',
          message: 'Authentication required'
        });
      }

      // Executives can access all resources
      if (req.user.role === 'executive') {
        return next();
      }

      // Farmers can only access their own resources
      if (req.user.role === 'farmer') {
        const resourceId = req.params.id || req.params.resourceId;
        
        // Check if resource belongs to the user
        // This would need to be customized based on the resource type
        // For now, we'll allow access and let the route handler check ownership
        return next();
      }

      return res.status(403).json({
        error: 'Access forbidden',
        message: 'Insufficient permissions'
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Error checking permissions'
      });
    }
  };
};

module.exports = {
  authenticateToken,
  requireRole,
  requireFarmer,
  requireExecutive,
  requireActiveUser,
  requireVerifiedUser,
  requireExecutiveAccess,
  requireOwnershipOrExecutive,
  optionalAuth,
  authRateLimit,
  logAuthEvent,
  checkResourcePermission
};
