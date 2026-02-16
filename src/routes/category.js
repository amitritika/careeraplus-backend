const express = require('express');
const router = express.Router();
const { requireSignin, adminMiddleware } = require('../controllers/auth');
const { createCategory, listCategories, readCategory, removeCategory } = require('../controllers/category');
const { runValidation } = require('../validators');
const { categoryCreateValidator } = require('../validators/category');

router.post('/category', requireSignin, adminMiddleware, categoryCreateValidator, runValidation, createCategory);
router.get('/categories', listCategories);
router.get('/category/:slug', readCategory);
router.delete('/category/:slug', requireSignin, adminMiddleware, removeCategory);

module.exports = router;
