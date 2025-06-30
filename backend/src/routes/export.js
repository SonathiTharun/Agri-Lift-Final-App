const express = require('express');
const Export = require('../models/Export');
const router = express.Router();

// Create new export listing
router.post('/', async (req, res) => {
  try {
    const exportListing = new Export(req.body);
    await exportListing.save();
    // TODO: Emit real-time event (e.g., req.app.get('io').emit('export_created', exportListing))
    res.status(201).json(exportListing);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all exports (with optional filters)
router.get('/', async (req, res) => {
  try {
    const { userId, status, limit = 20, skip = 0 } = req.query;
    const query = {};
    if (userId) query.userId = userId;
    if (status) query.status = status;
    const exports = await Export.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(skip));
    res.json(exports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single export by ID
router.get('/:id', async (req, res) => {
  try {
    const exportListing = await Export.findById(req.params.id);
    if (!exportListing) return res.status(404).json({ error: 'Export not found' });
    res.json(exportListing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update export listing
router.put('/:id', async (req, res) => {
  try {
    const exportListing = await Export.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!exportListing) return res.status(404).json({ error: 'Export not found' });
    // TODO: Emit real-time event (e.g., req.app.get('io').emit('export_updated', exportListing))
    res.json(exportListing);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete export listing
router.delete('/:id', async (req, res) => {
  try {
    const exportListing = await Export.findByIdAndDelete(req.params.id);
    if (!exportListing) return res.status(404).json({ error: 'Export not found' });
    // TODO: Emit real-time event (e.g., req.app.get('io').emit('export_deleted', req.params.id))
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update export status (real-time)
router.post('/:id/status', async (req, res) => {
  try {
    const { status, note } = req.body;
    const exportListing = await Export.findById(req.params.id);
    if (!exportListing) return res.status(404).json({ error: 'Export not found' });
    exportListing.updateStatus(status, note);
    await exportListing.save();
    // TODO: Emit real-time event (e.g., req.app.get('io').emit('export_status', { id: req.params.id, status }))
    res.json(exportListing);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get export analytics/insights
router.get('/insights/summary', async (req, res) => {
  try {
    const stats = await Export.getExportStats();
    const topCrops = await Export.getTopCrops(5);
    const marketInsights = await Export.getMarketInsights();
    res.json({ stats, topCrops, marketInsights });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 