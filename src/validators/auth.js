const { check } = require('express-validator');

exports.userSignupValidator = [
  check('name').not().isEmpty().withMessage('Name is required'),
  check('email').isEmail().withMessage('Must be Valid Email Address'),
  check('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters Long')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]{8,}$/i)
    .withMessage('Password must have at least one special character, One Lowercase, One Uppercase and One number')
];

exports.userSigninValidator = [
  check('email').isEmail().withMessage('Must be Valid Email Address'),
  check('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters Long')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]{8,}$/i)
    .withMessage('Password must have at least one special character, One Lowercase, One Uppercase and One number')
];

exports.forgotPasswordValidator = [
  check('email').not().isEmpty().isEmail().withMessage('Must be a valid email address')
];

exports.resetPasswordValidator = [
  check('newPassword')
    .not().isEmpty()
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters Long')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]{8,}$/i)
    .withMessage('Password must have at least one special character, One Lowercase, One Uppercase and One number')
];
