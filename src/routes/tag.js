const express = require('express');
const router = express.Router();
const { requireSignin, adminMiddleware } = require('../controllers/auth');
const { createTag, listTags, readTag, removeTag } = require('../controllers/tag');
const { runValidation } = require('../validators');
const { tagCreateValidator } = require('../validators/tag');

router.post('/tag', requireSignin, adminMiddleware, tagCreateValidator, runValidation, createTag);
router.get('/tags', listTags);
router.get('/tag/:slug', readTag);
router.delete('/tag/:slug', requireSignin, adminMiddleware, removeTag);

module.exports = router;
