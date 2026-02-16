// models/exam.js
const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  weight: { type: Number, required: true, min: 0, max: 1 }
}, { _id: false });

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  weight: { type: Number, required: true, min: 0, max: 1 },
  topics: [topicSchema]
}, { _id: false });

const preparationTypeSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Technical Only", "General Studies", "Combined"
  slug: { type: String, required: true }, // e.g., "technical-only", "general-studies", "combined"
  description: { type: String },
  subjects: [subjectSchema],
  isActive: { type: Boolean, default: true }
}, { _id: false });

const streamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  preparationTypes: [preparationTypeSchema],
  isActive: { type: Boolean, default: true }
}, { _id: false });

const examSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  streams: [streamSchema],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Indexes for better performance
examSchema.index({ slug: 1, isActive: 1 });
examSchema.index({ 'streams.slug': 1, 'streams.isActive': 1 });
examSchema.index({ 'streams.preparationTypes.slug': 1, 'streams.preparationTypes.isActive': 1 });

module.exports = mongoose.model('Exam', examSchema);
