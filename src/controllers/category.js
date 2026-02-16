const Category = require('../models/category');
const slugify = require('slugify');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) return res.status(422).json({ error: 'Name is required' });
    const slug = slugify(name, { lower: true, strict: true });
    const exists = await Category.findOne({ slug });
    if (exists) return res.status(409).json({ error: 'Category already exists' });
    const category = await Category.create({ name: name.trim(), slug });
    res.status(201).json(category);
  } catch (e) {
    res.status(500).json({ error: errorHandler(e) });
  }
};

exports.listCategories = async (_req, res) => {
  try {
    const items = await Category.find({}).lean();
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: errorHandler(e) });
  }
};

exports.readCategory = async (req, res) => {
  try {
    const item = await Category.findOne({ slug: req.params.slug }).lean();
    if (!item) return res.status(404).json({ error: 'Category not found' });
    res.json(item);
  } catch (e) {
    res.status(500).json({ error: errorHandler(e) });
  }
};

exports.removeCategory = async (req, res) => {
  try {
    const out = await Category.findOneAndDelete({ slug: req.params.slug });
    if (!out) return res.status(404).json({ error: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (e) {
    res.status(500).json({ error: errorHandler(e) });
  }
};
