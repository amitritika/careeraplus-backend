// routes/visualresume.js
const express = require('express');
const router = express.Router();
const { requireSignin, authMiddleware, adminMiddleware } = require('../controllers/auth');
const {
  readVisualresume,
  updateVisualresume,
  readVisualresumeexp,
  updateVisualresumeexp,
  readVisualresumepro,
  updateVisualresumepro,
  contactFormUserProfile
} = require('../controllers/visualresume');

// GET visual resume (current user)
router.get('/visualresume', requireSignin, authMiddleware, readVisualresume);

// PUT update visual resume (current user)
router.put('/visualresume/update', requireSignin, authMiddleware, updateVisualresume);

// Experience variant
router.get('/visualresumeexp', requireSignin, authMiddleware, readVisualresumeexp);
router.put('/visualresumeexp/update', requireSignin, authMiddleware, updateVisualresumeexp);

// Pro variant
router.get('/visualresumepro', requireSignin, authMiddleware, readVisualresumepro);
router.put('/visualresumepro/update', requireSignin, authMiddleware, updateVisualresumepro);

// Public contact form on a user's visual profile (no auth required)
router.post('/visualresume/user-contact', contactFormUserProfile);

module.exports = router;
