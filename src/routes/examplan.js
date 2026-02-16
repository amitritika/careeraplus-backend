// routes/examplan.js
const express = require('express');
const router = express.Router();
const { requireSignin, adminMiddleware } = require('../controllers/auth');
const User = require('../models/user');

const {
  getExams,
  getExam,
  getStream,
  getPreparationTypes,
  getPreparationType,
  generateExamPlan,
  saveExamPlan,
  getUserExamPlans,
  getExamPlan,
  getExamsForAdmin,
  createExam,
  updateExam,
  updateSubjectWeights
} = require('../controllers/examplan');

// Simple userByID implementation
const userByID = async (req, res, next, id) => {
  try {
    const user = await User.findById(id).exec();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    req.profile = user;
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Error finding user' });
  }
};

// Public routes
router.get('/exams', getExams);
router.get('/exams/:examSlug', getExam);
router.get('/exams/:examSlug/streams/:streamSlug', getStream);
router.get('/exams/:examSlug/streams/:streamSlug/preparation-types', getPreparationTypes);
router.get('/exams/:examSlug/streams/:streamSlug/preparation-types/:prepTypeSlug', getPreparationType);

// Protected routes with preparation types
router.post('/exams/:examSlug/streams/:streamSlug/preparation-types/:prepTypeSlug/generate', requireSignin, generateExamPlan);
router.post('/exams/:examSlug/streams/:streamSlug/preparation-types/:prepTypeSlug/save/:userId', requireSignin, saveExamPlan);
router.get('/examplans/:userId', requireSignin, getUserExamPlans);
router.get('/examplans/:planId/:userId', requireSignin, getExamPlan);

// Backward compatibility routes (without preparation types)
router.post('/exams/:examSlug/streams/:streamSlug/generate', requireSignin, generateExamPlan);
router.post('/exams/:examSlug/streams/:streamSlug/save/:userId', requireSignin, saveExamPlan);

// Admin routes
router.get('/admin/exams', requireSignin, adminMiddleware, getExamsForAdmin);
router.post('/admin/exams', requireSignin, adminMiddleware, createExam);
router.put('/admin/exams/:examId', requireSignin, adminMiddleware, updateExam);
router.put('/admin/exams/:examId/streams/:streamSlug/preparation-types/:prepTypeSlug/subjects', requireSignin, adminMiddleware, updateSubjectWeights);

// Params
router.param('userId', userByID);

module.exports = router;
