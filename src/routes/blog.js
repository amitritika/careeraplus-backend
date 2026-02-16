const express = require('express');
const router = express.Router();

const { requireSignin, adminMiddleware } = require('../controllers/auth');
const {
  createBlog,
  listBlogs,
  listAllBlogsCategoriesTags,
  readBlog,
  removeBlog,
  updateBlog,
  blogPhoto,
  listRelated
} = require('../controllers/blog');

// Create (admin) — supports JSON (no photo) or multipart/form-data (photo)
router.post('/blog', requireSignin, adminMiddleware, createBlog);

// List (public)
router.get('/blogs', listBlogs);

// Landing widgets (public)
router.get('/blogs-categories-tags', listAllBlogsCategoriesTags);

// Read one (public)
router.get('/blog/:slug', readBlog);

// Update (admin) — JSON or multipart
router.put('/blog/:slug', requireSignin, adminMiddleware, updateBlog);

// Delete (admin)
router.delete('/blog/:slug', requireSignin, adminMiddleware, removeBlog);

// Blog photo (public/binary)
router.get('/blog/photo/:slug', blogPhoto);

// Related (public)
router.post('/blogs/related', listRelated);

module.exports = router;
