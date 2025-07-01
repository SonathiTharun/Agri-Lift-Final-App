const mongoose = require('mongoose');

const EquipmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  brand: { type: String },
  condition: { type: String, enum: ['New', 'Used'], required: true },
  capacity: { type: String },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  images: [{ type: String }], // URLs to images
  seller: { type: String, required: true },
  contactInfo: { type: String },
  conditionReport: { type: String }, // For used items
}, { timestamps: true });

module.exports = mongoose.model('Equipment', EquipmentSchema); 