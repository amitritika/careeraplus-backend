// controllers/visualresume.js
const User = require('../models/user');
const nodemailer = require('nodemailer');
const _ = require('lodash');
const { errorHandler } = require('../helpers/dbErrorHandler');

const isDev = (process.env.NODE_ENV || 'development') === 'development';
const CLIENT_URL = isDev ? process.env.CLIENT_URL_DEV : process.env.CLIENT_URL_PROD;

/**
 * Helper: sanitize user before returning to client
 */
function sanitizeUser(user) {
  if (!user) return user;
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.hashed_password;
  delete obj.salt;
  delete obj.resetPasswordLink;
  // remove large binary fields
  if (obj.photo) delete obj.photo;
  if (obj.profile_photo) delete obj.profile_photo;
  if (obj.resume_photo) delete obj.resume_photo;
  return obj;
}

/**
 * Helper: create a Nodemailer transport configured for Brevo (SMTP)
 * Expects env:
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
 * or BREVO_SMTP_HOST, BREVO_SMTP_PORT, BREVO_SMTP_USER, BREVO_SMTP_PASS
 */
function createSmtpTransport() {
  const host = process.env.SMTP_HOST || process.env.BREVO_SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || process.env.BREVO_SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER || process.env.BREVO_SMTP_USER;
  const pass = process.env.SMTP_PASS || process.env.BREVO_SMTP_PASS;

  if (!host || !user || !pass) {
    // Return null — callers should handle when transport cannot be created
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: { user, pass }
  });
}

/**
 * GET /visualresume
 */
exports.readVisualresume = async (req, res) => {
  try {
    if (!req.profile) return res.status(401).json({ error: 'Unauthorized' });
    return res.json(req.profile.visualresume || { typeOfResume: '', data: {} });
  } catch (err) {
    console.error('readVisualresume:', err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

/**
 * PUT /visualresume/update
 */
exports.updateVisualresume = async (req, res) => {
  try {
    if (!req.profile) return res.status(401).json({ error: 'Unauthorized' });

    const user = req.profile;
    user.visualresume = req.body || { typeOfResume: '', data: {} };
    user.version = (user.version || 0) + 1;

    const saved = await user.save();
    return res.json(sanitizeUser(saved));
  } catch (err) {
    console.error('updateVisualresume:', err);
    return res.status(400).json({ error: errorHandler(err) });
  }
};

/**
 * GET /visualresumeexp
 */
exports.readVisualresumeexp = async (req, res) => {
  try {
    if (!req.profile) return res.status(401).json({ error: 'Unauthorized' });
    return res.json(req.profile.visualresumeexp || { typeOfResume: '', data: {} });
  } catch (err) {
    console.error('readVisualresumeexp:', err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

/**
 * PUT /visualresumeexp/update
 */
exports.updateVisualresumeexp = async (req, res) => {
  try {
    if (!req.profile) return res.status(401).json({ error: 'Unauthorized' });
    const user = req.profile;
    user.visualresumeexp = req.body || { typeOfResume: '', data: {} };
    user.version = (user.version || 0) + 1;

    const saved = await user.save();
    return res.json(sanitizeUser(saved));
  } catch (err) {
    console.error('updateVisualresumeexp:', err);
    return res.status(400).json({ error: errorHandler(err) });
  }
};

/**
 * GET /visualresumepro
 */
exports.readVisualresumepro = async (req, res) => {
  try {
    if (!req.profile) return res.status(401).json({ error: 'Unauthorized' });
    return res.json(req.profile.visualresumepro || { typeOfResume: '', data: {} });
  } catch (err) {
    console.error('readVisualresumepro:', err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

/**
 * PUT /visualresumepro/update
 */
exports.updateVisualresumepro = async (req, res) => {
  try {
    if (!req.profile) return res.status(401).json({ error: 'Unauthorized' });
    const user = req.profile;
    user.visualresumepro = req.body || { typeOfResume: '', data: {} };
    user.version = (user.version || 0) + 1;

    const saved = await user.save();
    return res.json(sanitizeUser(saved));
  } catch (err) {
    console.error('updateVisualresumepro:', err);
    return res.status(400).json({ error: errorHandler(err) });
  }
};

/**
 * POST /visualresume/user-contact
 * Public contact form on a user's visual profile
 * body: { username, email, name, message }
 *
 * Uses Brevo SMTP via Nodemailer. If SEND_EMAILS === 'false' (string) we do not send and instead return the email preview for dev testing.
 */
exports.contactFormUserProfile = async (req, res) => {
  try {
    const { username, email, name, message } = req.body || {};

    if (!username || !email || !name || !message) {
      return res.status(400).json({ error: 'All fields required' });
    }

    const user = await User.findOne({ username }).exec();
    if (!user) return res.status(400).json({ error: 'User not found' });

    const toEmail = user.email || process.env.EMAIL_FROM || `contact@${process.env.APP_DOMAIN || 'careeraplus.in'}`;
    const fromEmail = process.env.EMAIL_FROM || `contact@${process.env.APP_DOMAIN || 'careeraplus.in'}`;

    const subject = `Digital Profile Contact form - ${process.env.APP_NAME || 'CareerAPlus'}`;
    const html = `
      <h4>Email received from contact form on your Digital Profile</h4>
      <p><strong>Sender name:</strong> ${_.escape(name)}</p>
      <p><strong>Sender email:</strong> ${_.escape(email)}</p>
      <p><strong>Sender message:</strong></p>
      <p>${_.escape(message)}</p>
      <hr />
      <p>This email may contain sensitive information</p>
      <p><a href="${CLIENT_URL}">${CLIENT_URL}</a></p>
    `;

    const text = `Email received from contact form on your Digital Profile\n\nSender name: ${name}\nSender email: ${email}\nSender message: ${message}`;

    const mailOptions = {
      from: fromEmail,
      to: toEmail,
      subject,
      text,
      html
    };

    // Dev shortcut: do not actually send if SEND_EMAILS set to 'false'
    if ((process.env.SEND_EMAILS || 'true').toLowerCase() === 'false') {
      // In local/dev we return the mailOptions so frontend/dev can inspect the "token"
      return res.json({ success: true, preview: mailOptions });
    }

    const transport = createSmtpTransport();
    if (!transport) {
      console.error('SMTP transport not configured. Missing SMTP_HOST / SMTP_USER / SMTP_PASS');
      return res.status(500).json({ error: 'Email delivery not configured' });
    }

    // send mail
    const info = await transport.sendMail(mailOptions);

    // nodemailer returns an info object; return minimal success response
    return res.json({ success: true, messageId: info.messageId });
  } catch (err) {
    console.error('contactFormUserProfile error:', err);
    // try to return helpful error to client without leaking internals
    if (err && err.response) {
      return res.status(500).json({ error: 'Failed to send email', details: err.response });
    }
    return res.status(500).json({ error: 'Failed to send email' });
  }
};
