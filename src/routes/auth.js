const express = require('express');
const router = express.Router();

const { signup, signin, signout, requireSignin, forgotPassword, resetPassword, preSignup, 
  authMiddleware, adminMiddleware } = require('../controllers/auth');

// Validators
const { runValidation } = require('../validators');
const { userSignupValidator, userSigninValidator, forgotPasswordValidator, resetPasswordValidator } = require('../validators/auth');

router.post('/pre-signup', userSignupValidator, runValidation, preSignup);
router.post('/signup', signup);
router.post('/signin', userSigninValidator, runValidation, signin);
router.get('/signout', signout);
router.put('/forgot-password', forgotPasswordValidator, runValidation, forgotPassword);
router.put('/reset-password', resetPasswordValidator, runValidation, resetPassword);

// Example of admin-protected endpoint (ping)
// router.get('/admin/ping', requireSignin, adminMiddleware, (req,res)=> res.json({ok:true}));

module.exports = router;
