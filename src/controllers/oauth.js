// src/controllers/oauth.js
const crypto = require('crypto');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const shortId = require('shortid');

const CLIENT_URL = (process.env.NODE_ENV === 'production')
  ? process.env.CLIENT_URL_PROD
  : process.env.CLIENT_URL_DEV;

const isProd = process.env.NODE_ENV === 'production';
const cookieOpts = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'none' : 'lax',
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000
};

function makeState(res) {
  const state = crypto.randomBytes(16).toString('hex');
  res.cookie('oauth_state', state, {
    httpOnly: true, sameSite: 'lax', secure: isProd, maxAge: 10 * 60 * 1000
  });
  return state;
}

function checkState(req) {
  const sent = req.query.state;
  const saved = req.cookies.oauth_state;
  if (!sent || !saved || sent !== saved) throw new Error('Invalid OAuth state');
}

async function upsertUser({ provider, providerId, email, name, picture, emailVerified }) {
  let user = null;
  if (email) user = await User.findOne({ email });
  if (!user) user = await User.findOne({ identities: { $elemMatch: { provider, providerId } } });

  if (!user) {
    const username = shortId.generate();
    user = new User({
      username: email ? email.split('@')[0] : `${provider}_${providerId}`,
      name: name || 'New User',
      email,
      profile: `${CLIENT_URL}/profile/${username}`,
      password: crypto.randomBytes(16).toString('hex'),
      emailVerified: !!emailVerified
    });
  }
  user.linkIdentity(provider, providerId);
  if (email && !user.email) user.email = email;
  if (emailVerified) user.emailVerified = true;
  await user.save();
  return user;
}

function signAndSetCookie(res, user) {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, cookieOpts);
  return token;
}

module.exports = {
  makeState,
  checkState,
  upsertUser,
  signAndSetCookie
};
