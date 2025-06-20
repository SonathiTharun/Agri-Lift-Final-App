const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const Joi = require('joi');

const SoilReport = require('../models/SoilReport');
const UserSession = require('../models/UserSession');
const ocrService = require('../services/ocrService');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and PDF files are allowed.'));
    }
  }
});

// Validation schemas
const uploadSchema = Joi.object({
  userId: Joi.string().optional(),
  sessionId: Joi.string().optional()
});

// POST /api/soil-analysis/upload - Upload and analyze soil health card
router.post('/upload', upload.single('soilHealthCard'), async (req, res) => {
  let soilReport = null;

  try {
    // Validate request
    const { error, value } = uploadSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details[0].message
      });
    }

    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded',
        message: 'Please upload a soil health card image or PDF'
      });
    }

    const { userId = null, sessionId = uuidv4() } = value;

    // Create initial soil report document
    soilReport = new SoilReport({
      userId,
      sessionId,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      filePath: req.file.path,
      processingStatus: 'processing',
      metadata: {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        uploadSource: 'web'
      }
    });

    await soilReport.save();
    const reportId = soilReport._id;

    // Log processing start
    soilReport.addProcessingLog('file_upload', 'completed', 'File uploaded successfully');
    await soilReport.save();

    // Create or update user session
    let userSession = await UserSession.findActiveSession(sessionId);
    if (!userSession) {
      userSession = new UserSession({
        sessionId,
        userId,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });
    }
    userSession.addActivity('file_upload', { fileName: req.file.originalname, fileSize: req.file.size });
    userSession.addReport(reportId);
    await userSession.save();

    // Extract text using OCR service
    soilReport.addProcessingLog('ocr_extraction', 'started');
    await soilReport.save();

    const ocrStartTime = Date.now();
    const ocrResult = await ocrService.extractText(req.file.path, req.file.mimetype);
    const ocrProcessingTime = Date.now() - ocrStartTime;

    console.log('OCR extraction completed:', {
      confidence: ocrResult.confidence,
      textLength: ocrResult.text.length,
      textPreview: ocrResult.text.substring(0, 200) + '...'
    });

    soilReport.addProcessingLog('ocr_extraction', 'completed', `Confidence: ${ocrResult.confidence}%`, ocrProcessingTime);

    // Parse text to soil data
    soilReport.addProcessingLog('data_parsing', 'started');
    const parseStartTime = Date.now();

    const soilData = ocrService.parseTextToSoilData(ocrResult.text);
    const parseProcessingTime = Date.now() - parseStartTime;

    console.log('Parameter extraction completed:', {
      extractedCount: soilData.extractedCount,
      totalParameters: soilData.totalParameters,
      parameters: soilData.parameters.map(p => `${p.name}: ${p.value} ${p.unit} (${p.status})`)
    });

    soilReport.addProcessingLog('data_parsing', 'completed', `Extracted ${soilData.extractedCount} parameters`, parseProcessingTime);

    // Update report with OCR results and parameters
    soilReport.ocrText = ocrResult.text;
    soilReport.ocrConfidence = ocrResult.confidence;
    soilReport.processingStatus = 'completed';

    // Add soil parameters (include all parameters, both extracted and default)
    soilReport.parameters = soilData.parameters.map(param => ({
      name: param.name,
      value: param.value,
      unit: param.unit || '',
      status: param.status,
      optimal: param.optimal,
      extractionMethod: param.extracted ? 'ocr' : 'manual',
      confidence: param.confidence
    }));

    soilReport.extractedCount = soilData.extractedCount;
    soilReport.addProcessingLog('database_storage', 'completed', 'Data stored successfully');

    try {
      await soilReport.save();
      console.log('📊 Soil report saved to database:', soilReport._id);
    } catch (dbError) {
      console.log('⚠️ Database save failed, continuing without database:', dbError.message);
      // Continue processing without database
    }

    // Update user session (if database is available)
    try {
      userSession.addActivity('analysis_complete', {
        reportId: reportId.toString(),
        extractedCount: soilData.extractedCount,
        confidence: ocrResult.confidence
      });
      await userSession.save();
    } catch (dbError) {
      console.log('⚠️ User session save failed:', dbError.message);
    }

    // Clean up uploaded file (optional - keep for debugging)
    // fs.unlinkSync(req.file.path);

    // Return success response
    res.status(200).json({
      success: true,
      reportId: reportId.toString(),
      sessionId: sessionId,
      ocrResult: {
        confidence: ocrResult.confidence,
        method: ocrResult.method,
        processingTime: ocrResult.processingTime
      },
      soilData: {
        extractedCount: soilData.extractedCount,
        totalParameters: soilData.parameters.length,
        parameters: soilData.parameters
      },
      healthScore: soilReport.healthScore,
      message: `Successfully processed soil health card. Extracted ${soilData.extractedCount} parameters.`
    });

  } catch (error) {
    console.error('Soil analysis error:', error);

    // Update report status to failed if report was created
    if (soilReport) {
      try {
        soilReport.processingStatus = 'failed';
        soilReport.addProcessingLog('error', 'failed', error.message);
        await soilReport.save();
      } catch (saveError) {
        console.error('Error updating failed report:', saveError);
      }
    }

    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      error: 'Processing failed',
      message: error.message,
      reportId: soilReport ? soilReport._id.toString() : null
    });
  }
});

// GET /api/soil-analysis/report/:reportId - Get soil analysis report
router.get('/report/:reportId', async (req, res) => {
  try {
    const { reportId } = req.params;

    // Validate ObjectId format
    if (!reportId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        error: 'Invalid report ID',
        message: 'Please provide a valid report ID'
      });
    }

    // Get report details
    const report = await SoilReport.findById(reportId)
      .select('-ocrText') // Exclude large text field for performance
      .lean();

    if (!report) {
      return res.status(404).json({
        error: 'Report not found',
        message: 'The requested soil analysis report does not exist'
      });
    }

    res.json({
      report: {
        id: report._id,
        userId: report.userId,
        sessionId: report.sessionId,
        fileName: report.fileName,
        fileType: report.fileType,
        fileSize: report.fileSize,
        ocrConfidence: report.ocrConfidence,
        processingStatus: report.processingStatus,
        extractedCount: report.extractedCount,
        healthScore: report.healthScore,
        createdAt: report.createdAt,
        updatedAt: report.updatedAt
      },
      parameters: report.parameters.map(p => ({
        name: p.name,
        value: p.value,
        unit: p.unit,
        status: p.status,
        optimal: p.optimal,
        confidence: p.confidence,
        extractionMethod: p.extractionMethod
      })),
      processingLog: report.processingLog,
      recommendations: report.recommendations
    });

  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({
      error: 'Failed to retrieve report',
      message: error.message
    });
  }
});

// GET /api/soil-analysis/reports - Get all reports for a user
router.get('/reports', async (req, res) => {
  try {
    const { userId, limit = 10, offset = 0, status } = req.query;

    // Build query
    const query = {};
    if (userId) query.userId = userId;
    if (status) query.processingStatus = status;

    // Get total count for pagination
    const total = await SoilReport.countDocuments(query);

    // Get reports
    const reports = await SoilReport.find(query)
      .select('-ocrText -processingLog') // Exclude large fields
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .lean();

    res.json({
      reports: reports.map(report => ({
        id: report._id,
        userId: report.userId,
        sessionId: report.sessionId,
        fileName: report.fileName,
        fileType: report.fileType,
        fileSize: report.fileSize,
        ocrConfidence: report.ocrConfidence,
        processingStatus: report.processingStatus,
        extractedCount: report.extractedCount,
        healthScore: report.healthScore,
        parametersCount: report.parameters ? report.parameters.length : 0,
        createdAt: report.createdAt,
        updatedAt: report.updatedAt
      })),
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: total,
        hasMore: parseInt(offset) + parseInt(limit) < total
      }
    });

  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({
      error: 'Failed to retrieve reports',
      message: error.message
    });
  }
});

// Test endpoint to check OCR functionality
router.post('/test-ocr', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('Testing OCR with file:', req.file.originalname);

    // Test OCR extraction
    const ocrResult = await ocrService.extractText(req.file.path, req.file.mimetype);
    console.log('OCR Result:', ocrResult);

    // Test parameter extraction
    const soilData = ocrService.parseTextToSoilData(ocrResult.text);
    console.log('Extracted Soil Data:', soilData);

    res.json({
      success: true,
      file: req.file.originalname,
      ocrResult,
      soilData
    });

  } catch (error) {
    console.error('OCR test error:', error);
    res.status(500).json({
      error: 'OCR test failed',
      message: error.message
    });
  }
});

module.exports = router;
