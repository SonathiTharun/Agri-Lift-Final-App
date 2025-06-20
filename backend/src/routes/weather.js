const express = require('express');
const { query, validationResult } = require('express-validator');
const WeatherData = require('../models/WeatherData');

const router = express.Router();

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

// GET /api/weather/current - Get current weather by location
router.get('/current', [
  query('lat').optional().isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),
  query('lon').optional().isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180'),
  query('city').optional().isString().withMessage('City must be a string'),
  query('state').optional().isString().withMessage('State must be a string')
], handleValidationErrors, async (req, res) => {
  try {
    const { lat, lon, city, state } = req.query;
    let weatherData;

    if (lat && lon) {
      // Find by coordinates
      weatherData = await WeatherData.findByLocation(
        parseFloat(lat), 
        parseFloat(lon)
      );
    } else if (city) {
      // Find by city name
      weatherData = await WeatherData.findByCity(city, state);
    } else {
      return res.status(400).json({
        error: 'Location required',
        message: 'Please provide either coordinates (lat, lon) or city name'
      });
    }

    if (!weatherData) {
      return res.status(404).json({
        error: 'Weather data not found',
        message: 'No weather data available for the specified location'
      });
    }

    // Check if data is fresh (within last hour)
    const isFresh = weatherData.isDataFresh(60);

    res.json({
      success: true,
      data: {
        weather: weatherData,
        isFresh,
        lastUpdated: weatherData.lastUpdated,
        summary: weatherData.summary
      }
    });
  } catch (error) {
    console.error('Get current weather error:', error);
    res.status(500).json({
      error: 'Failed to fetch weather data',
      message: error.message
    });
  }
});

// GET /api/weather/forecast - Get weather forecast
router.get('/forecast', [
  query('lat').optional().isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),
  query('lon').optional().isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180'),
  query('city').optional().isString().withMessage('City must be a string'),
  query('state').optional().isString().withMessage('State must be a string'),
  query('days').optional().isInt({ min: 1, max: 14 }).withMessage('Days must be between 1 and 14')
], handleValidationErrors, async (req, res) => {
  try {
    const { lat, lon, city, state, days = 7 } = req.query;
    let weatherData;

    if (lat && lon) {
      weatherData = await WeatherData.findByLocation(
        parseFloat(lat), 
        parseFloat(lon)
      );
    } else if (city) {
      weatherData = await WeatherData.findByCity(city, state);
    } else {
      return res.status(400).json({
        error: 'Location required',
        message: 'Please provide either coordinates (lat, lon) or city name'
      });
    }

    if (!weatherData) {
      return res.status(404).json({
        error: 'Weather data not found',
        message: 'No weather data available for the specified location'
      });
    }

    // Filter forecast to requested number of days
    const forecast = weatherData.forecast.slice(0, parseInt(days));

    res.json({
      success: true,
      data: {
        location: weatherData.location,
        current: weatherData.current,
        forecast,
        alerts: weatherData.getActiveAlerts(),
        lastUpdated: weatherData.lastUpdated
      }
    });
  } catch (error) {
    console.error('Get weather forecast error:', error);
    res.status(500).json({
      error: 'Failed to fetch weather forecast',
      message: error.message
    });
  }
});

// GET /api/weather/alerts - Get weather alerts for location
router.get('/alerts', [
  query('lat').optional().isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),
  query('lon').optional().isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180'),
  query('city').optional().isString().withMessage('City must be a string'),
  query('state').optional().isString().withMessage('State must be a string')
], handleValidationErrors, async (req, res) => {
  try {
    const { lat, lon, city, state } = req.query;
    let weatherData;

    if (lat && lon) {
      weatherData = await WeatherData.findByLocation(
        parseFloat(lat), 
        parseFloat(lon)
      );
    } else if (city) {
      weatherData = await WeatherData.findByCity(city, state);
    } else {
      return res.status(400).json({
        error: 'Location required',
        message: 'Please provide either coordinates (lat, lon) or city name'
      });
    }

    if (!weatherData) {
      return res.status(404).json({
        error: 'Weather data not found',
        message: 'No weather data available for the specified location'
      });
    }

    const activeAlerts = weatherData.getActiveAlerts();

    res.json({
      success: true,
      data: {
        location: weatherData.location,
        alerts: activeAlerts,
        alertCount: activeAlerts.length,
        lastUpdated: weatherData.lastUpdated
      }
    });
  } catch (error) {
    console.error('Get weather alerts error:', error);
    res.status(500).json({
      error: 'Failed to fetch weather alerts',
      message: error.message
    });
  }
});

// GET /api/weather/recent - Get recent weather data
router.get('/recent', [
  query('hours').optional().isInt({ min: 1, max: 168 }).withMessage('Hours must be between 1 and 168 (7 days)')
], handleValidationErrors, async (req, res) => {
  try {
    const hours = parseInt(req.query.hours) || 24;
    
    const recentData = await WeatherData.getRecentData(hours);

    res.json({
      success: true,
      data: {
        weatherData: recentData,
        count: recentData.length,
        timeRange: `${hours} hours`
      }
    });
  } catch (error) {
    console.error('Get recent weather error:', error);
    res.status(500).json({
      error: 'Failed to fetch recent weather data',
      message: error.message
    });
  }
});

// GET /api/weather/stats - Get weather statistics
router.get('/stats', [
  query('startDate').optional().isISO8601().withMessage('Start date must be a valid ISO date'),
  query('endDate').optional().isISO8601().withMessage('End date must be a valid ISO date')
], handleValidationErrors, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const stats = await WeatherData.getWeatherStats(startDate, endDate);

    res.json({
      success: true,
      data: {
        statistics: stats,
        period: {
          startDate: startDate || 'All time',
          endDate: endDate || 'Present'
        }
      }
    });
  } catch (error) {
    console.error('Get weather stats error:', error);
    res.status(500).json({
      error: 'Failed to fetch weather statistics',
      message: error.message
    });
  }
});

// GET /api/weather/search - Search weather data by location name
router.get('/search', [
  query('q').isString().isLength({ min: 2 }).withMessage('Search query must be at least 2 characters'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
], handleValidationErrors, async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;
    
    const weatherData = await WeatherData.find({
      $or: [
        { 'location.name': new RegExp(q, 'i') },
        { 'location.city': new RegExp(q, 'i') },
        { 'location.state': new RegExp(q, 'i') }
      ],
      isActive: true
    })
    .sort({ lastUpdated: -1 })
    .limit(parseInt(limit))
    .select('location current.temperature current.condition lastUpdated');

    res.json({
      success: true,
      data: {
        results: weatherData,
        count: weatherData.length,
        query: q
      }
    });
  } catch (error) {
    console.error('Search weather error:', error);
    res.status(500).json({
      error: 'Failed to search weather data',
      message: error.message
    });
  }
});

module.exports = router;
