const express = require('express');
const Joi = require('joi');
const SoilReport = require('../models/SoilReport');
const CropRecommendation = require('../models/CropRecommendation');
const UserSession = require('../models/UserSession');
const cropRecommendationService = require('../services/cropRecommendationService');

const router = express.Router();

// Validation schemas
const recommendationSchema = Joi.object({
  reportId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
  season: Joi.string().valid('kharif', 'rabi', 'zaid').required()
});

// POST /api/crop-recommendation/generate - Generate crop recommendations
router.post('/generate', async (req, res) => {
  try {
    // Validate request
    const { error, value } = recommendationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details[0].message
      });
    }

    const { reportId, season } = value;

    // Check if report exists and is completed
    const report = await SoilReport.findById(reportId);

    if (!report) {
      return res.status(404).json({
        error: 'Report not found',
        message: 'The specified soil analysis report does not exist'
      });
    }

    if (report.processingStatus !== 'completed') {
      return res.status(400).json({
        error: 'Report not ready',
        message: 'Soil analysis is still processing. Please wait for completion.'
      });
    }

    if (!report.parameters || report.parameters.length === 0) {
      return res.status(400).json({
        error: 'No soil parameters found',
        message: 'No soil parameters available for generating recommendations'
      });
    }

    // Convert MongoDB parameters to service format
    const soilParameters = report.parameters.map(p => ({
      name: p.name,
      value: p.value,
      unit: p.unit,
      status: p.status,
      optimal: p.optimal,
      confidence: p.confidence
    }));

    // Generate recommendations using the service
    const recommendations = cropRecommendationService.generateRecommendations(soilParameters, season);

    // Delete existing recommendations for this report and season
    await CropRecommendation.deleteMany({ reportId, season });

    // Create new recommendation documents
    const recommendationDocs = recommendations.map(rec => ({
      reportId,
      userId: report.userId,
      sessionId: report.sessionId,
      cropName: rec.name,
      cropDescription: rec.description,
      growingPeriod: rec.growingPeriod,
      waterNeed: rec.waterNeed,
      suitability: rec.suitability,
      suitabilityScore: rec.score,
      season,
      parameterScores: rec.parameterScores,
      marketInfo: {
        price: rec.marketPrice,
        expectedYield: rec.expectedYield,
        potentialRevenue: rec.potentialRevenue
      },
      idealConditions: rec.idealConditions || {},
      metadata: {
        generationMethod: 'rule_based',
        confidence: 0.8,
        version: '1.0'
      }
    }));

    // Insert new recommendations
    await CropRecommendation.insertMany(recommendationDocs);

    // Update user session
    const userSession = await UserSession.findActiveSession(report.sessionId);
    if (userSession) {
      userSession.addActivity('recommendation_generated', {
        reportId: reportId.toString(),
        season,
        recommendationCount: recommendations.length
      });
      userSession.updatePreferredSeason(season);
      await userSession.save();
    }

    res.json({
      success: true,
      reportId: reportId.toString(),
      season: season,
      recommendations: recommendations,
      metadata: {
        totalRecommendations: recommendations.length,
        excellentCrops: recommendations.filter(r => r.suitability === 'Excellent').length,
        goodCrops: recommendations.filter(r => r.suitability === 'Good').length,
        fairCrops: recommendations.filter(r => r.suitability === 'Fair').length,
        poorCrops: recommendations.filter(r => r.suitability === 'Poor').length,
        averageScore: recommendations.reduce((sum, r) => sum + r.score, 0) / recommendations.length,
        topRecommendation: recommendations[0]?.name || null
      }
    });

  } catch (error) {
    console.error('Generate recommendations error:', error);
    res.status(500).json({
      error: 'Failed to generate recommendations',
      message: error.message
    });
  }
});

// GET /api/crop-recommendation/report/:reportId - Get recommendations for a report
router.get('/report/:reportId', async (req, res) => {
  try {
    const { reportId } = req.params;
    const { season } = req.query;

    // Validate ObjectId format
    if (!reportId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        error: 'Invalid report ID',
        message: 'Please provide a valid report ID'
      });
    }

    // Build query
    const query = { reportId };
    if (season) query.season = season;

    // Get recommendations
    const recommendations = await CropRecommendation.find(query)
      .sort({ suitabilityScore: -1, cropName: 1 })
      .lean();

    const formattedRecommendations = recommendations.map(rec => ({
      id: rec._id,
      name: rec.cropName,
      description: rec.cropDescription,
      growingPeriod: rec.growingPeriod,
      waterNeed: rec.waterNeed,
      suitability: rec.suitability,
      score: rec.suitabilityScore,
      season: rec.season,
      parameterScores: rec.parameterScores,
      marketInfo: rec.marketInfo,
      isRecommended: rec.isRecommended,
      priority: rec.priority,
      createdAt: rec.createdAt
    }));

    res.json({
      reportId: reportId,
      season: season || 'all',
      recommendations: formattedRecommendations,
      metadata: {
        totalRecommendations: formattedRecommendations.length,
        recommendedCount: formattedRecommendations.filter(r => r.isRecommended).length,
        seasons: [...new Set(formattedRecommendations.map(r => r.season))],
        averageScore: formattedRecommendations.length > 0
          ? formattedRecommendations.reduce((sum, r) => sum + r.score, 0) / formattedRecommendations.length
          : 0
      }
    });

  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({
      error: 'Failed to retrieve recommendations',
      message: error.message
    });
  }
});

// GET /api/crop-recommendation/seasons - Get available seasons
router.get('/seasons', (req, res) => {
  try {
    const seasons = cropRecommendationService.getAvailableSeasons();
    
    res.json({
      seasons: seasons.map(season => ({
        value: season,
        label: season.charAt(0).toUpperCase() + season.slice(1),
        description: getSeasonDescription(season)
      }))
    });
  } catch (error) {
    console.error('Get seasons error:', error);
    res.status(500).json({
      error: 'Failed to retrieve seasons',
      message: error.message
    });
  }
});

// GET /api/crop-recommendation/crops/:season - Get crops for a specific season
router.get('/crops/:season', (req, res) => {
  try {
    const { season } = req.params;
    const crops = cropRecommendationService.getCropsBySeason(season);
    
    if (crops.length === 0) {
      return res.status(404).json({
        error: 'Season not found',
        message: 'The specified season does not exist'
      });
    }

    res.json({
      season: season,
      crops: crops.map(crop => ({
        name: crop.name,
        description: crop.description,
        growingPeriod: crop.growingPeriod,
        waterNeed: crop.waterNeed,
        idealConditions: crop.idealConditions,
        marketPrice: crop.marketPrice,
        expectedYield: crop.yield
      }))
    });
  } catch (error) {
    console.error('Get crops error:', error);
    res.status(500).json({
      error: 'Failed to retrieve crops',
      message: error.message
    });
  }
});

// Helper function to get season descriptions
function getSeasonDescription(season) {
  const descriptions = {
    kharif: 'Monsoon season crops (June-October)',
    rabi: 'Winter season crops (November-April)', 
    zaid: 'Summer season crops (April-June)'
  };
  return descriptions[season] || 'Unknown season';
}

module.exports = router;
