const Tag = require('../models/tag');
const slugify = require('slugify');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.createTag = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) return res.status(422).json({ error: 'Name is required' });
    const slug = slugify(name, { lower: true, strict: true });
    const exists = await Tag.findOne({ slug });
    if (exists) return res.status(409).json({ error: 'Tag already exists' });
    const tag = await Tag.create({ name: name.trim(), slug });
    res.status(201).json(tag);
  } catch (e) {
    res.status(500).json({ error: errorHandler(e) });
  }
};

exports.listTags = async (_req, res) => {
  try {
    const items = await Tag.find({}).lean();
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: errorHandler(e) });
  }
};

exports.readTag = async (req, res) => {
  try {
    const item = await Tag.findOne({ slug: req.params.slug }).lean();
    if (!item) return res.status(404).json({ error: 'Tag not found' });
    res.json(item);
  } catch (e) {
    res.status(500).json({ error: errorHandler(e) });
  }
};

exports.removeTag = async (req, res) => {
  try {
    const out = await Tag.findOneAndDelete({ slug: req.params.slug });
    if (!out) return res.status(404).json({ error: 'Tag not found' });
    res.json({ message: 'Tag deleted' });
  } catch (e) {
    res.status(500).json({ error: errorHandler(e) });
  }
};
