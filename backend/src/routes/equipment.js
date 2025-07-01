const express = require('express');
const router = express.Router();
const Equipment = require('../models/Equipment');
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

// Get all equipment
router.get('/', async (req, res) => {
    try {
        const equipment = await Equipment.find().sort({ createdAt: -1 });
        res.json(equipment);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Add new equipment (with image upload)
router.post('/', upload.array('images', 5), async (req, res) => {
    try {
        const data = req.body;
        let imageUrls = [];
        if (req.files && req.files.length > 0) {
            imageUrls = req.files.map(f => `/uploads/${f.filename}`);
        }
        const equipment = new Equipment({
            ...data,
            images: imageUrls.length > 0 ? imageUrls : [],
        });
        await equipment.save();
        res.status(201).json(equipment);
    } catch (err) {
        res.status(400).json({ error: 'Invalid data', details: err.message });
    }
});

// Get equipment by ID
router.get('/:id', async (req, res) => {
    try {
        const equipment = await Equipment.findById(req.params.id);
        if (!equipment) return res.status(404).json({ error: 'Not found' });
        res.json(equipment);
    } catch (err) {
        res.status(400).json({ error: 'Invalid ID' });
    }
});

// Edit equipment (with optional image upload)
router.put('/:id', upload.array('images', 5), async (req, res) => {
    try {
        const data = req.body;
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
        const equipment = await Equipment.findByIdAndUpdate(req.params.id, update, { new: true });
        if (!equipment) return res.status(404).json({ error: 'Not found' });
        res.json(equipment);
    } catch (err) {
        res.status(400).json({ error: 'Invalid data', details: err.message });
    }
});

// Delete equipment
router.delete('/:id', async (req, res) => {
    try {
        const equipment = await Equipment.findByIdAndDelete(req.params.id);
        if (!equipment) return res.status(404).json({ error: 'Not found' });
        res.json({ success: true });
    } catch (err) {
        res.status(400).json({ error: 'Invalid ID' });
    }
});

module.exports = router; 