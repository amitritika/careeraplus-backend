// src/controllers/blog.js
const fs = require('fs');
const slugify = require('slugify');
const formidable = require('formidable');
const mongoose = require('mongoose');
const { stripHtml } = require('string-strip-html');

const Blog = require('../models/blog');
const Category = require('../models/category');
const Tag = require('../models/tag');
const { errorHandler } = require('../helpers/dbErrorHandler');

/* ----------------------------- helpers ----------------------------- */

// Smart trim like the legacy controller (cut at word boundary, suffix " ...")
const smartTrim = (str, length, delim = ' ', appendix = ' ...') => {
  const s = String(str || '');
  if (s.length <= length) return s;
  let trimmed = s.substr(0, length);
  const lastDelim = trimmed.lastIndexOf(delim);
  if (lastDelim > -1) trimmed = trimmed.substr(0, lastDelim);
  return trimmed + appendix;
};

const toStr = (v) => {
  if (v === undefined || v === null) return null;
  if (typeof v === 'string') return v;
  if (Array.isArray(v)) return v.length ? String(v[0]) : null;
  return String(v);
};

const allAreObjectIds = (arr) =>
  Array.isArray(arr) && arr.length > 0 && arr.every((id) => mongoose.Types.ObjectId.isValid(id));

// Accepts: ['id'], 'id1,id2', '["id1","id2"]', [ '["id1","id2"]' ], repeated keys, etc.
const normalizeIdArray = (raw) => {
  const flatten = (v) => {
    if (v == null) return [];
    if (Array.isArray(v)) return v.flatMap(flatten);

    let s = String(v).trim();
    if (!s) return [];

    // Try to JSON-parse JSON-ish strings
    if (
      (s.startsWith('[') && s.endsWith(']')) ||
      (s.startsWith('{') && s.endsWith('}')) ||
      ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'")))
    ) {
      try {
        const parsed = JSON.parse(s.replace(/'/g, '"'));
        return flatten(parsed);
      } catch {
        // fall through to CSV
      }
    }

    // CSV fallback
    if (s.includes(',')) return s.split(',').map((x) => x.trim()).filter(Boolean);

    // Single token; strip quotes
    return [s.replace(/^["']|["']$/g, '')];
  };

  const list = flatten(raw).map((x) => String(x).trim()).filter(Boolean);
  return Array.from(new Set(list)); // unique
};

const pickUpload = (files, prefer = ['photo', 'photosrc', 'image', 'file', 'upload']) => {
  if (!files || typeof files !== 'object') return null;
  const scan = (v) => {
    const arr = Array.isArray(v) ? v : [v].filter(Boolean);
    for (const f of arr) {
      const filepath = f?.filepath || f?.path || f?.file?.filepath || f?.file?.path;
      const size = Number(f?.size || f?.file?.size || 0);
      const type = f?.mimetype || f?.type || f?.headers?.['content-type'];
      if (filepath && size > 0) return { filepath, size, type };
    }
    return null;
  };
  for (const name of prefer) {
    const got = scan(files[name]);
    if (got) return got;
  }
  for (const v of Object.values(files)) {
    const got = scan(v);
    if (got) return got;
  }
  return null;
};

/* ------------------------------ CREATE ----------------------------- */

exports.createBlog = async (req, res) => {
  try {
    // If you mounted a pre-parser (req.blogForm), reuse it
    if (req.blogForm) {
      const { fields, files } = req.blogForm;
      return createFromFields(req, res, fields, files);
    }

    // JSON create (no photo)
    if ((req.headers['content-type'] || '').includes('application/json')) {
      return createFromFields(req, res, req.body || {}, {});
    }

    // Multipart parse here
    const form = new formidable.IncomingForm({ keepExtensions: true });
    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(400).json({ error: 'Image could not upload' });
      await createFromFields(req, res, fields, files);
    });
  } catch (e) {
    res.status(500).json({ error: e.message || 'Server error' });
  }
};

async function createFromFields(req, res, fields, files) {
  const get = (name) => (toStr(fields[name]) || '').trim();
  const required = (name) => {
    const v = get(name);
    if (!v) throw new Error(`${name} is required`);
    return v;
  };

  // Validate required fields early
  let title, body;
  try {
    title = required('title');
    body = required('body');
    required('categories');
    required('tags');
  } catch (err) {
    return res.status(422).json({ error: err.message });
  }

  // Normalize cat/tag arrays (accept array, CSV, stringified array, repeated keys)
  const rawCats = fields.categories ?? req.body?.categories;
  const rawTags = fields.tags ?? req.body?.tags;
  const categoryIds = normalizeIdArray(rawCats);
  const tagIds = normalizeIdArray(rawTags);

  if (!allAreObjectIds(categoryIds)) {
    return res.status(422).json({ error: 'Invalid categories: provide ObjectIds (array, CSV, or repeated keys).' });
  }
  if (!allAreObjectIds(tagIds)) {
    return res.status(422).json({ error: 'Invalid tags: provide ObjectIds (array, CSV, or repeated keys).' });
  }

  // Auto excerpt & mdesc like legacy behavior (if not explicitly provided)
  const providedExcerpt = (toStr(fields.excerpt) || '').trim();
  const providedMdesc = (toStr(fields.mdesc) || '').trim();
  const autoExcerpt = smartTrim(stripHtml(body).result, 320, ' ', ' ...');
  const autoMdesc = stripHtml(body.substring(0, 160)).result;

  // Build doc first (avoid TDZ)
  const doc = new Blog({
    title,
    body,
    excerpt: providedExcerpt || autoExcerpt,
    mtitle: (toStr(fields.mtitle) || '').trim() || undefined,
    mdesc: providedMdesc || autoMdesc,
    slug: slugify(title, { lower: true, strict: true }),
    categories: categoryIds,
    tags: tagIds,
    postedBy: req.auth && req.auth._id
  });

  // Optional photo
  const picked = pickUpload(files);
  if (picked) {
    if (picked.size > 2 * 1024 * 1024) return res.status(413).json({ error: 'Image should be less than 2MB' });
    doc.photo = {
      data: fs.readFileSync(picked.filepath),
      contentType: picked.type || 'image/jpeg'
    };
  }

  const saved = await doc.save();
  return res.status(201).json(saved);
}

/* ------------------------------- LIST ------------------------------ */

exports.listBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = Math.min(parseInt(req.query.limit || '10', 10), 50);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Blog.find({})
        .select('-photo')
        .populate('categories', 'name slug')
        .populate('tags', 'name slug')
        .populate('postedBy', 'name username')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Blog.countDocuments()
    ]);

    res.json({ items, page, limit, total });
  } catch (e) {
    res.status(500).json({ error: errorHandler(e) });
  }
};

/* --------------- list blogs + categories + tags (landing) ---------- */

exports.listAllBlogsCategoriesTags = async (_req, res) => {
  try {
    const blogs = await Blog.find({})
      .select('-photo')
      .populate('categories', 'name slug')
      .populate('tags', 'name slug')
      .populate('postedBy', 'name username')
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    const categories = await Category.find({}).lean();
    const tags = await Tag.find({}).lean();

    res.json({ blogs, categories, tags });
  } catch (e) {
    res.status(500).json({ error: errorHandler(e) });
  }
};

/* ------------------------------- READ ------------------------------ */

exports.readBlog = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug })
      .populate('categories', 'name slug')
      .populate('tags', 'name slug')
      .populate('postedBy', 'name username')
      .lean();
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch (e) {
    res.status(500).json({ error: errorHandler(e) });
  }
};

/* ------------------------------ REMOVE ----------------------------- */

exports.removeBlog = async (req, res) => {
  try {
    const out = await Blog.findOneAndDelete({ slug: req.params.slug });
    if (!out) return res.status(404).json({ error: 'Blog not found' });
    res.json({ message: 'Blog deleted' });
  } catch (e) {
    res.status(500).json({ error: errorHandler(e) });
  }
};

/* ------------------------------ UPDATE ----------------------------- */

// Apply field updates; recompute excerpt/mdesc if body changed (unless explicitly provided)
const applyUpdates = (blog, fields, files) => {
  // Title & slug
  const incomingTitle = toStr(fields?.title);
  if (incomingTitle !== null) {
    const t = incomingTitle.trim();
    if (t) {
      blog.title = t;
      blog.slug = slugify(t, { lower: true, strict: true });
    }
  }

  // Body & recompute flags
  let didBodyChange = false;
  const nextBody = toStr(fields?.body);
  if (nextBody !== null) { blog.body = nextBody; didBodyChange = true; }

  // Excerpt
  if (fields?.excerpt !== undefined) {
    const e = toStr(fields.excerpt);
    if (e !== null) blog.excerpt = e;
  } else if (didBodyChange) {
    blog.excerpt = smartTrim(stripHtml(blog.body).result, 320, ' ', ' ...');
  }

  // mtitle
  const mtitle = toStr(fields?.mtitle);
  if (mtitle !== null) blog.mtitle = mtitle;

  // mdesc
  if (fields?.mdesc !== undefined) {
    const d = toStr(fields.mdesc);
    if (d !== null) blog.mdesc = d;
  } else if (didBodyChange) {
    blog.mdesc = stripHtml(blog.body.substring(0, 160)).result;
  }

  // Categories
  if (fields?.categories !== undefined) {
    const ids = normalizeIdArray(fields.categories);
    if (!ids.length || !allAreObjectIds(ids)) {
      const err = new Error('Invalid categories: provide ObjectIds (array, CSV, or repeated keys).');
      err.status = 422; throw err;
    }
    blog.categories = ids;
  }

  // Tags
  if (fields?.tags !== undefined) {
    const ids = normalizeIdArray(fields.tags);
    if (!ids.length || !allAreObjectIds(ids)) {
      const err = new Error('Invalid tags: provide ObjectIds (array, CSV, or repeated keys).');
      err.status = 422; throw err;
    }
    blog.tags = ids;
  }

  // Photo (optional)
  const picked = pickUpload(files);
  if (picked) {
    if (picked.size > 2 * 1024 * 1024) {
      const err = new Error('Image should be less than 2MB');
      err.status = 413; throw err;
    }
    blog.photo = blog.photo || {};
    blog.photo.data = fs.readFileSync(picked.filepath);
    blog.photo.contentType = picked.type || 'image/jpeg';
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const ct = req.headers['content-type'] || '';

    // JSON update (no file upload)
    if (ct.includes('application/json')) {
      const blog = await Blog.findOne({ slug: req.params.slug });
      if (!blog) return res.status(404).json({ error: 'Blog not found' });
      try {
        applyUpdates(blog, req.body || {}, {});
        const saved = await blog.save();
        return res.json(saved);
      } catch (e) {
        return res.status(e.status || 500).json({ error: e.message || 'Server error' });
      }
    }

    // Multipart/form-data (supports photo)
    const form = new formidable.IncomingForm({ keepExtensions: true });
    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(400).json({ error: 'Form parse error' });

      const blog = await Blog.findOne({ slug: req.params.slug });
      if (!blog) return res.status(404).json({ error: 'Blog not found' });

      try {
        applyUpdates(blog, fields, files);
        const saved = await blog.save();
        return res.json(saved);
      } catch (e) {
        return res.status(e.status || 500).json({ error: e.message || 'Server error' });
      }
    });
  } catch (e) {
    return res.status(e.status || 500).json({ error: e.message || 'Server error' });
  }
};

/* ------------------------------- PHOTO ----------------------------- */

exports.blogPhoto = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug }).select('photo');
    if (!blog || !blog.photo || !blog.photo.data) return res.status(404).end();
    res.set('Content-Type', blog.photo.contentType || 'image/jpeg');
    return res.send(blog.photo.data);
  } catch (e) {
    res.status(500).json({ error: errorHandler(e) });
  }
};

/* ------------------------------ RELATED ---------------------------- */

exports.listRelated = async (req, res) => {
  try {
    const { blogId, categories } = req.body || {};
    const limit = Math.min(parseInt(req.query.limit || '5', 10), 20);
    const related = await Blog.find({
      _id: { $ne: blogId },
      categories: { $in: categories || [] }
    })
      .select('title slug excerpt categories tags createdAt updatedAt')
      .populate('categories', 'name slug')
      .populate('tags', 'name slug')
      .limit(limit)
      .lean();

    res.json(related);
  } catch (e) {
    res.status(500).json({ error: errorHandler(e) });
  }
};
