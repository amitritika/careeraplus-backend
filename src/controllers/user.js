const User = require('../models/user');
const _ = require('lodash');
const formidable = require('formidable');
const fs = require('fs');
const { errorHandler } = require('../helpers/dbErrorHandler');

const url = (process.env.NODE_ENV === 'production') ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL_DEV;

const first = (v) => (Array.isArray(v) ? v[0] : v);
const normalizeFields = (fields) =>
  Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, first(v)]));
const normalizeFiles = (files) =>
  Object.fromEntries(Object.entries(files).map(([k, v]) => [k, first(v)]));

// GET /user/profile
exports.read = async (req, res) => {
  const profile = req.profile.toObject ? req.profile.toObject() : req.profile;
  delete profile.hashed_password;
  delete profile.salt;
  delete profile.profile_photo;
  return res.json(profile);
};

// PUT /user/update
exports.update = (req, res) => {
  const form = new formidable.IncomingForm({ keepExtensions: true, multiples: false });
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(400).json({ error: 'Photo could not be uploaded' });

    try {
      fields = normalizeFields(fields);
      files = normalizeFiles(files);

      let user = req.profile;
      user = _.extend(user, fields);  // now fields.about is a string, not an array
      user.profile = `${url}/${user.username}`;

      const photoFile = files.photosrc;
      if (photoFile) {
        if ((photoFile.size || 0) > 10 * 1024 * 1024)
          return res.status(400).json({ error: 'Image should be less than 10mb' });
        const filePath = photoFile.filepath || photoFile.path;
        const mime = photoFile.mimetype || photoFile.type;
        user.photo.data = fs.readFileSync(filePath);
        user.photo.contentType = mime;
      }

      const result = await user.save();
      const obj = result.toObject ? result.toObject() : result;
      delete obj.hashed_password; delete obj.salt; delete obj.photo;
      return res.json(obj);
    } catch (e) {
      return res.status(400).json({ error: errorHandler(e) });
    }
  });
};

// GET /user/photo/:username
exports.photo = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: 'User not found' });
    if (user.photo && user.photo.data) {
      res.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
      res.set('Content-Type', user.photo.contentType);
      return res.send(user.photo.data);
    }
    return res.status(404).end();
  } catch (e) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

// GET /user/profile-photo/:username
exports.profilephoto = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: 'User not found' });
    if (user.profile_photo && user.profile_photo.data) {
      res.set('Content-Type', user.profile_photo.contentType);
      return res.send(user.profile_photo.data);
    }
    return res.status(404).end();
  } catch (e) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

// PUT /user/update-profile-photo
exports.updateprofilephoto = (req, res) => {
  const form = new formidable.IncomingForm({ keepExtensions: true, multiples: false });
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(400).json({ error: 'Photo could not be uploaded' });

    try {
      files = normalizeFiles(files);

      let user = req.profile;
      const photoFile = files.photosrc;
      if (photoFile) {
        if ((photoFile.size || 0) > 10 * 1024 * 1024)
          return res.status(400).json({ error: 'Image should be less than 10mb' });
        const filePath = photoFile.filepath || photoFile.path;
        const mime = photoFile.mimetype || photoFile.type;
        user.profile_photo.data = fs.readFileSync(filePath);
        user.profile_photo.contentType = mime;
      }

      const result = await user.save();
      const obj = result.toObject ? result.toObject() : result;
      delete obj.hashed_password; delete obj.salt; delete obj.photo;
      return res.json(obj);
    } catch (e) {
      return res.status(400).json({ error: errorHandler(e) });
    }
  });
};

// Public profile (mask email)
exports.readpublic = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: 'User not found' });
    const obj = user.toObject ? user.toObject() : user;
    delete obj.hashed_password;
    delete obj.salt;
    obj.email = 'dummy@mail.com';
    return res.send(obj);
  } catch (e) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

// Resume photo endpoints
exports.resumephoto = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: 'User not found' });
    if (user.resume_photo && user.resume_photo.data) {
      res.set('Content-Type', user.resume_photo.contentType);
      return res.send(user.resume_photo.data);
    }
    return res.status(404).end();
  } catch (e) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

exports.updateresumephoto = (req, res) => {
  const form = new formidable.IncomingForm({ keepExtensions: true, multiples: false });
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(400).json({ error: 'Photo could not be uploaded' });

    try {
      files = normalizeFiles(files);

      let user = req.profile;
      const photoFile = files.photosrc;
      if (photoFile) {
        if ((photoFile.size || 0) > 10 * 1024 * 1024)
          return res.status(400).json({ error: 'Image should be less than 10mb' });
        const filePath = photoFile.filepath || photoFile.path;
        const mime = photoFile.mimetype || photoFile.type;
        user.resume_photo.data = fs.readFileSync(filePath);
        user.resume_photo.contentType = mime;
      }

      const result = await user.save();
      const obj = result.toObject ? result.toObject() : result;
      delete obj.hashed_password; delete obj.salt; delete obj.photo;
      return res.json(obj);
    } catch (e) {
      return res.status(400).json({ error: errorHandler(e) });
    }
  });
};

// Profile resume JSON
exports.profileresume = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: 'User not found' });
    if (user.profile_resume) return res.send(user.profile_resume);
    return res.status(404).end();
  } catch (e) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

exports.updateprofileresume = async (req, res) => {
  try {
    const { list, bg, font } = req.body;
    let user = req.profile;
    user.profile_resume = { list, bg, font };
    const result = await user.save();
    const obj = result.toObject ? result.toObject() : result;
    delete obj.hashed_password;
    delete obj.salt;
    delete obj.photo;
    delete obj.profile_photo;
    delete obj.resume_photo;
    return res.json(obj.profile_resume);
  } catch (e) {
    return res.status(400).json({ error: errorHandler(e) });
  }
};

// Transactions minimal stubs
exports.updateTransactionsUser = async (req, res) => {
  try {
    let user = req.profile;
    user.set(req.body);
    const result = await user.save();
    return res.json(result.transactions || []);
  } catch (e) {
    return res.status(400).json({ error: errorHandler(e) });
  }
};

exports.updateTransactions = async (req, res) => {
  return res.status(501).json({ message: 'Payment verification flow not implemented in this starter' });
};
