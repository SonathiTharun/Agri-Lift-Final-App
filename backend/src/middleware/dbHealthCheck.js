const { isDbConnected, getConnectionStatus } = require('../database/init');

/**
 * Middleware to check database connection health before processing requests
 */
const checkDbHealth = (req, res, next) => {
  try {
    if (!isDbConnected()) {
      const status = getConnectionStatus();
      console.error('❌ Database health check failed:', status);
      
      return res.status(503).json({
        error: 'Service Unavailable',
        message: 'Database connection is not available. Please try again later.',
        details: {
          state: status.state,
          timestamp: new Date().toISOString()
        }
      });
    }
    
    // Database is healthy, proceed with request
    next();
  } catch (error) {
    console.error('❌ Database health check error:', error);
    
    return res.status(503).json({
      error: 'Service Unavailable',
      message: 'Unable to verify database connection. Please try again later.',
      details: {
        timestamp: new Date().toISOString()
      }
    });
  }
};

/**
 * Middleware specifically for authentication routes with retry logic
 */
const checkDbHealthForAuth = (req, res, next) => {
  try {
    if (!isDbConnected()) {
      const status = getConnectionStatus();
      console.error('❌ Auth database health check failed:', status);
      
      return res.status(503).json({
        error: 'Authentication Service Unavailable',
        message: 'Unable to process authentication request. Database connection is not available.',
        details: {
          state: status.state,
          timestamp: new Date().toISOString(),
          suggestion: 'Please try again in a few moments'
        }
      });
    }
    
    // Database is healthy, proceed with authentication
    next();
  } catch (error) {
    console.error('❌ Auth database health check error:', error);
    
    return res.status(503).json({
      error: 'Authentication Service Error',
      message: 'Unable to verify database connection for authentication.',
      details: {
        timestamp: new Date().toISOString()
      }
    });
  }
};

module.exports = {
  checkDbHealth,
  checkDbHealthForAuth
};
