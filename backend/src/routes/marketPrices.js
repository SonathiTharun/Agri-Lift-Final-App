const express = require('express');
const { query, validationResult } = require('express-validator');
const MarketPrice = require('../models/MarketPrice');

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

// GET /api/market-prices/latest - Get latest market prices
router.get('/latest', [
  query('crops').optional().isString().withMessage('Crops must be a comma-separated string'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
], handleValidationErrors, async (req, res) => {
  try {
    const { crops, limit = 50 } = req.query;
    
    let cropList = [];
    if (crops) {
      cropList = crops.split(',').map(crop => crop.trim());
    }

    const prices = await MarketPrice.getLatestPrices(cropList, parseInt(limit));

    res.json({
      success: true,
      data: {
        prices,
        count: prices.length,
        lastUpdated: prices.length > 0 ? prices[0].lastUpdated : null
      }
    });
  } catch (error) {
    console.error('Get latest prices error:', error);
    res.status(500).json({
      error: 'Failed to fetch latest prices',
      message: error.message
    });
  }
});

// GET /api/market-prices/crop/:cropName - Get prices for specific crop
router.get('/crop/:cropName', [
  query('state').optional().isString().withMessage('State must be a string'),
  query('marketType').optional().isIn(['wholesale', 'retail', 'mandi', 'online', 'export']).withMessage('Invalid market type'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
], handleValidationErrors, async (req, res) => {
  try {
    const { cropName } = req.params;
    const { state, marketType, limit = 10 } = req.query;

    const prices = await MarketPrice.findByCrop(cropName, {
      state,
      marketType,
      limit: parseInt(limit)
    });

    if (prices.length === 0) {
      return res.status(404).json({
        error: 'No prices found',
        message: `No market prices found for ${cropName}`
      });
    }

    res.json({
      success: true,
      data: {
        crop: cropName,
        prices,
        count: prices.length
      }
    });
  } catch (error) {
    console.error('Get crop prices error:', error);
    res.status(500).json({
      error: 'Failed to fetch crop prices',
      message: error.message
    });
  }
});

// GET /api/market-prices/market/:marketName - Get prices for specific market
router.get('/market/:marketName', [
  query('state').optional().isString().withMessage('State must be a string')
], handleValidationErrors, async (req, res) => {
  try {
    const { marketName } = req.params;
    const { state } = req.query;

    const prices = await MarketPrice.findByMarket(marketName, state);

    if (prices.length === 0) {
      return res.status(404).json({
        error: 'No prices found',
        message: `No prices found for market ${marketName}`
      });
    }

    res.json({
      success: true,
      data: {
        market: marketName,
        state,
        prices,
        count: prices.length
      }
    });
  } catch (error) {
    console.error('Get market prices error:', error);
    res.status(500).json({
      error: 'Failed to fetch market prices',
      message: error.message
    });
  }
});

// GET /api/market-prices/compare/:cropName - Compare prices across states
router.get('/compare/:cropName', [
  query('states').optional().isString().withMessage('States must be a comma-separated string')
], handleValidationErrors, async (req, res) => {
  try {
    const { cropName } = req.params;
    const { states } = req.query;

    let stateList = [];
    if (states) {
      stateList = states.split(',').map(state => state.trim());
    }

    const comparison = await MarketPrice.getPriceComparison(cropName, stateList);

    if (comparison.length === 0) {
      return res.status(404).json({
        error: 'No comparison data found',
        message: `No price comparison data found for ${cropName}`
      });
    }

    res.json({
      success: true,
      data: {
        crop: cropName,
        comparison,
        statesCompared: comparison.length
      }
    });
  } catch (error) {
    console.error('Get price comparison error:', error);
    res.status(500).json({
      error: 'Failed to fetch price comparison',
      message: error.message
    });
  }
});

// GET /api/market-prices/trending - Get trending crops
router.get('/trending', [
  query('days').optional().isInt({ min: 1, max: 30 }).withMessage('Days must be between 1 and 30'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
], handleValidationErrors, async (req, res) => {
  try {
    const { days = 7, limit = 10 } = req.query;

    const trending = await MarketPrice.getTrendingCrops(parseInt(days), parseInt(limit));

    res.json({
      success: true,
      data: {
        trending,
        period: `${days} days`,
        count: trending.length
      }
    });
  } catch (error) {
    console.error('Get trending crops error:', error);
    res.status(500).json({
      error: 'Failed to fetch trending crops',
      message: error.message
    });
  }
});

// GET /api/market-prices/summary - Get market summary
router.get('/summary', [
  query('state').optional().isString().withMessage('State must be a string')
], handleValidationErrors, async (req, res) => {
  try {
    const { state } = req.query;

    const summary = await MarketPrice.getMarketSummary(state);

    if (summary.length === 0) {
      return res.status(404).json({
        error: 'No summary data found',
        message: 'No market summary data available'
      });
    }

    res.json({
      success: true,
      data: {
        summary: summary[0],
        state: state || 'All states'
      }
    });
  } catch (error) {
    console.error('Get market summary error:', error);
    res.status(500).json({
      error: 'Failed to fetch market summary',
      message: error.message
    });
  }
});

// GET /api/market-prices/search - Search market prices
router.get('/search', [
  query('q').isString().isLength({ min: 2 }).withMessage('Search query must be at least 2 characters'),
  query('type').optional().isIn(['crop', 'market']).withMessage('Type must be either crop or market'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
], handleValidationErrors, async (req, res) => {
  try {
    const { q, type = 'crop', limit = 20 } = req.query;

    let query = { isActive: true };
    
    if (type === 'crop') {
      query.crop = new RegExp(q, 'i');
    } else if (type === 'market') {
      query['market.name'] = new RegExp(q, 'i');
    } else {
      // Search both crop and market
      query.$or = [
        { crop: new RegExp(q, 'i') },
        { 'market.name': new RegExp(q, 'i') }
      ];
    }

    const results = await MarketPrice.find(query)
      .sort({ lastUpdated: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: {
        results,
        count: results.length,
        query: q,
        searchType: type
      }
    });
  } catch (error) {
    console.error('Search market prices error:', error);
    res.status(500).json({
      error: 'Failed to search market prices',
      message: error.message
    });
  }
});

// GET /api/market-prices/realtime - Get real-time price ticker data
router.get('/realtime', [
  query('crops').optional().isString().withMessage('Crops must be a comma-separated string'),
  query('limit').optional().isInt({ min: 1, max: 20 }).withMessage('Limit must be between 1 and 20')
], handleValidationErrors, async (req, res) => {
  try {
    const { crops, limit = 10 } = req.query;
    
    let cropList = [];
    if (crops) {
      cropList = crops.split(',').map(crop => crop.trim());
    }

    // Get latest prices for ticker
    const prices = await MarketPrice.getLatestPrices(cropList, parseInt(limit));

    // Format for ticker display
    const tickerData = prices.map(price => ({
      id: price._id,
      name: price.crop,
      price: price.price.current,
      change: price.change.amount,
      changePercent: price.change.percentage,
      trend: price.change.trend,
      unit: price.price.unit,
      market: price.market.name,
      lastUpdated: price.lastUpdated
    }));

    res.json({
      success: true,
      data: {
        ticker: tickerData,
        count: tickerData.length,
        lastUpdated: prices.length > 0 ? prices[0].lastUpdated : null
      }
    });
  } catch (error) {
    console.error('Get realtime prices error:', error);
    res.status(500).json({
      error: 'Failed to fetch realtime prices',
      message: error.message
    });
  }
});

module.exports = router;
