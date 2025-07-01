const mongoose = require('mongoose');

const LivestockSchema = new mongoose.Schema({
  name: { type: String, required: true },
  breed: { type: String, required: true },
  location: { type: String, required: true },
  age: { type: String, required: true },
  lactation: { type: Number, default: 0 },
  yield: { type: Number, default: 0 },
  certifications: [{ type: String }],
  images: [{ type: String }], // URLs to images
  seller: { type: String, required: true },
  healthRecords: [{ type: String }], // URLs to health/vaccination docs
}, { timestamps: true });

module.exports = mongoose.model('Livestock', LivestockSchema); 