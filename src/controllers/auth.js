const User = require('../models/user');
const shortId = require('shortid');
const jwt = require('jsonwebtoken');
const { expressjwt } = require('express-jwt');
const { errorHandler } = require('../helpers/dbErrorHandler');
const { sendMail } = require('../helpers/mailer');

const CLIENT_URL = (process.env.NODE_ENV === 'production')
  ? process.env.CLIENT_URL_PROD
  : process.env.CLIENT_URL_DEV;

/**
 * preSignup with Brevo SMTP (via Nodemailer)
 * - In DEV (SEND_EMAILS !== 'true'): returns { message, token }
 * - In PROD (SEND_EMAILS === 'true'): sends the activation email
 */
exports.preSignup = async (req, res) => {
  try {
    // Normalize input
    const name = (req.body?.name || '').toString().trim();
    const rawEmail = (req.body?.email || '').toString().trim();
    const email = rawEmail.toLowerCase();
    const password = (req.body?.password || '').toString();

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email is taken' });

    // Create activation token (10 min expiry)
    const token = jwt.sign({ name, email, password }, process.env.JWT_ACCOUNT_ACTIVATION, { expiresIn: '10m' });

    // Decide to send email or return token
    const wantEmail = process.env.SEND_EMAILS === 'true';

    if (wantEmail) {
      try {
        await sendMail({
          to: email,
          subject: 'Account activation link',
          html: `<p>Please use the following link to activate your account:</p>
                 <p>${CLIENT_URL}/auth/account/activate/${token}</p>
                 <hr /><p>This email may contain sensitive information</p>`,
        });
        return res.json({ message: `Email sent to ${email}. Follow instructions to activate.` });
      } catch (mailErr) {
        console.error('SMTP error:', mailErr?.response || mailErr?.message || mailErr);
        return res.status(502).json({ error: 'Email service error. Try again later.' });
      }
    } else {
      // DEV: return token for manual testing
      return res.json({ message: 'Activation token (dev only)', token });
    }
  } catch (e) {
    console.error('preSignup error:', e);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
};

// Signup (with token from email)
exports.signup = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: 'Token required' });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION);
    } catch (e) {
      return res.status(401).json({ error: 'Expired link. Signup again' });
    }

    const { name, email, password } = decoded;
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(400).json({ error: 'Email is taken' });

    const username = shortId.generate();
    const profile = `${CLIENT_URL}/profile/${username}`;

    const user = new User({ name, email, profile, username, password });
    await user.save();

    return res.json({ message: 'Signup success! Please signin' });
  } catch (err) {
    return res.status(400).json({ error: errorHandler(err) });
  }
};

// Signin
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ error: 'User with that email does not exist. Please signup' });

    if (!user.authenticate(password)) return res.status(400).json({ error: 'Email and password do not match' });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: (process.env.NODE_ENV === 'production'),
      sameSite: (process.env.NODE_ENV === 'production') ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });
    const { _id, username, name, role } = user;
    return res.json({ token, user: { _id, username, name, email: user.email, role } });
  } catch (e) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

// Signout
exports.signout = (req, res) => {
  res.clearCookie('token');
  return res.json({ message: 'Signout success' });
};

// Protect middleware
exports.requireSignin = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  requestProperty: 'user',        // keep this; our authMiddleware expects req.user._id
  getToken: (req) => {
    // 1) Cookie (our signin sets httpOnly cookie 'token')
    if (req.cookies && req.cookies.token) return req.cookies.token;
    // 2) Authorization header (Bearer <token>)
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    }
    return null;
  }
});

// Attach user to req.profile
exports.authMiddleware = async (req, res, next) => {
  try {
    const authUserId = req.user._id;
    const user = await User.findById(authUserId);
    if (!user) return res.status(400).json({ error: 'User not found' });
    req.profile = user;
    next();
  } catch (e) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

// Ensure admin role
exports.adminMiddleware = async (req, res, next) => {
  try {
    const adminUserId = req.user._id;
    const user = await User.findById(adminUserId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.role !== 1) return res.status(400).json({ error: 'Admin resource. Access denied' });
    req.profile = user;
    next();
  } catch (e) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

// Forgot Password (Brevo SMTP)
exports.forgotPassword = async (req, res) => {
  try {
    const rawEmail = (req.body?.email || '').toString().trim();
    const email = rawEmail.toLowerCase();
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'User with that email does not exist' });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_RESET_PASSWORD, { expiresIn: '10m' });
    user.resetPasswordLink = token;
    await user.save();

    const wantEmail = process.env.SEND_EMAILS === 'true';
    const html = `<p>Please use the following link to reset your password:</p>
                  <p>${CLIENT_URL}/auth/password/reset/${token}</p>
                  <hr /><p>This email may contain sensitive information</p>`;

    if (wantEmail) {
      try {
        await sendMail({ to: email, subject: 'Password reset link', html });
        return res.json({ message: `Email has been sent to ${email}. Link expires in 10 minutes.` });
      } catch (e) {
        console.error('SMTP error (forgot):', e?.response || e?.message || e);
        return res.status(502).json({ error: 'Email service error. Try again later.' });
      }
    } else {
      return res.json({ message: 'Reset token (dev only)', token });
    }
  } catch (e) {
    console.error('forgotPassword error:', e);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const resetPasswordLink = (req.body?.resetPasswordLink || '').toString().trim();
    const newPassword = (req.body?.newPassword || '').toString();

    if (!resetPasswordLink || !newPassword) {
      return res.status(400).json({ error: 'Token and newPassword are required' });
    }

    try {
      jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD);
    } catch (e) {
      return res.status(401).json({ error: 'Expired link. Try again' });
    }

    const user = await User.findOne({ resetPasswordLink });
    if (!user) return res.status(401).json({ error: 'Invalid token. Try again' });

    user.password = newPassword;      // triggers virtual setter to re-hash
    user.resetPasswordLink = '';
    await user.save();

    return res.json({ message: 'Great! Now you can login with your new password' });
  } catch (e) {
    console.error('resetPassword error:', e);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
};