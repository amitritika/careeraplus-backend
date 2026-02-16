// src/routes/auth.oauth.js
const express = require('express');
const { makeState, checkState, upsertUser, signAndSetCookie } = require('../controllers/oauth');
const {
  googleAuthUrl, googleProfileFromCode
} = require('../controllers/providers/google');
const {
  facebookAuthUrl, facebookProfileFromCode
} = require('../controllers/providers/facebook');
const {
  linkedinAuthUrl, linkedinProfileFromCode
} = require('../controllers/providers/linkedin');

const router = express.Router();

const PROVIDERS = {
  google:   { start: googleAuthUrl,   finish: googleProfileFromCode },
  facebook: { start: facebookAuthUrl, finish: facebookProfileFromCode },
  linkedin: { start: linkedinAuthUrl, finish: linkedinProfileFromCode }
};

// GET /api/auth/oauth/:provider/start
router.get('/auth/oauth/:provider/start', (req, res, next) => {
  try {
    const { provider } = req.params;
    if (!PROVIDERS[provider]) return res.status(404).json({ error: 'Unknown provider' });
    const state = makeState(res);
    res.redirect(PROVIDERS[provider].start(state));
  } catch (e) { next(e); }
});

// GET /api/auth/oauth/:provider/callback
router.get('/auth/oauth/:provider/callback', async (req, res, next) => {
  try {
    checkState(req);
    const { provider } = req.params;
    if (!PROVIDERS[provider]) return res.status(404).json({ error: 'Unknown provider' });
    const { code } = req.query;
    const profile = await PROVIDERS[provider].finish(code);
    const user = await upsertUser(profile);
    signAndSetCookie(res, user);

    const base = process.env.NODE_ENV === 'production'
      ? process.env.CLIENT_URL_PROD
      : process.env.CLIENT_URL_DEV;

    res.redirect(`${base}/login/success`);
  } catch (e) { next(e); }
});

module.exports = router;
