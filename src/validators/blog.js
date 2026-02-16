const { check } = require('express-validator');

exports.blogCreateValidator = [
  check('title').not().isEmpty().withMessage('Title is required'),
  check('body').not().isEmpty().withMessage('Body is required'),
  check('categories').not().isEmpty().withMessage('At least one category is required'),
  check('tags').not().isEmpty().withMessage('At least one tag is required')
];


const formidable = require('formidable');

const toStr = (v) => {
  if (v === undefined || v === null) return undefined;
  if (typeof v === 'string') return v;
  if (Array.isArray(v)) return v[0];
  return String(v);
};

exports.parseBlogForm = (req, res, next) => {
  // If client sent JSON, skip parsing
  const ct = req.headers['content-type'] || '';
  const isMultipart = ct.includes('multipart/form-data');

  if (!isMultipart) return next();

  const form = new formidable.IncomingForm({ keepExtensions: true });
  form.parse(req, (err, fields, files) => {
    if (err) return res.status(400).json({ error: 'Form parse error' });

    // Make fields visible to validators
    const normalized = {};
    for (const [k, v] of Object.entries(fields)) normalized[k] = toStr(v);

    req.body = { ...req.body, ...normalized };     // express-validator reads this
    req.blogForm = { fields: normalized, files };  // controller will reuse this
    next();
  });
};