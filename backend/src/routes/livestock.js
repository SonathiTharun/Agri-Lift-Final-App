const express = require('express');
const router = express.Router();
const Livestock = require('../models/Livestock');
const multer = require('multer');
const path = require('path');

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Get all livestock
router.get('/', async (req, res) => {
  try {
    const livestock = await Livestock.find().sort({ createdAt: -1 });
    res.json(livestock);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add new livestock (with image upload)
router.post('/', upload.array('images', 5), async (req, res) => {
  try {
    const data = req.body;
    // If fields are sent as JSON, parse them
    if (typeof data.certifications === 'string') {
      data.certifications = JSON.parse(data.certifications);
    }
    if (typeof data.healthRecords === 'string') {
      data.healthRecords = JSON.parse(data.healthRecords);
    }
    // Handle uploaded images
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map(f => `/uploads/${f.filename}`);
    }
    const livestock = new Livestock({
      ...data,
      images: imageUrls.length > 0 ? imageUrls : [],
    });
    await livestock.save();
    res.status(201).json(livestock);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data', details: err.message });
  }
});

// Get livestock by ID
router.get('/:id', async (req, res) => {
  try {
    const livestock = await Livestock.findById(req.params.id);
    if (!livestock) return res.status(404).json({ error: 'Not found' });
    res.json(livestock);
  } catch (err) {
    res.status(400).json({ error: 'Invalid ID' });
  }
});

// Edit livestock (with optional image upload)
router.put('/:id', upload.array('images', 5), async (req, res) => {
  try {
    const data = req.body;
    if (typeof data.certifications === 'string') {
      data.certifications = JSON.parse(data.certifications);
    }
    if (typeof data.healthRecords === 'string') {
      data.healthRecords = JSON.parse(data.healthRecords);
    }
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map(f => `/uploads/${f.filename}`);
    }
    const update = {
      ...data,
    };
    if (imageUrls.length > 0) {
      update.images = imageUrls;
    }
    const livestock = await Livestock.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!livestock) return res.status(404).json({ error: 'Not found' });
    res.json(livestock);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data', details: err.message });
  }
});

// Delete livestock
router.delete('/:id', async (req, res) => {
  try {
    const livestock = await Livestock.findByIdAndDelete(req.params.id);
    if (!livestock) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Invalid ID' });
  }
});

module.exports = router; 