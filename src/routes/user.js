const express = require('express');
const router = express.Router();
const { requireSignin, authMiddleware } = require('../controllers/auth');
const {
  read, update, photo, profilephoto, updateprofilephoto,
  readpublic, updateresumephoto, resumephoto, profileresume,
  updateprofileresume, updateTransactionsUser, updateTransactions
} = require('../controllers/user');

router.get('/user/profile', requireSignin, authMiddleware, read);
router.put('/user/update', requireSignin, authMiddleware, update);
router.get('/user/photo/:username', photo);
router.get('/user/profile-photo/:username', profilephoto);
router.get('/user/public-profile/:username', readpublic);
router.put('/user/update-profile-photo', requireSignin, authMiddleware, updateprofilephoto);

router.get('/user/resume-photo/:username', resumephoto);
router.put('/user/update-resume-photo', requireSignin, authMiddleware, updateresumephoto);

router.get('/user/profile-resume/:username', profileresume);
router.put('/user/update-profile-resume', requireSignin, authMiddleware, updateprofileresume);

router.put('/user/update-transactions', requireSignin, authMiddleware, updateTransactionsUser);
router.post('/user/payment/:username/:txnid', updateTransactions);

module.exports = router;
