const axios = require('axios');

const authBase = 'https://accounts.google.com/o/oauth2/v2/auth';
const tokenUrl  = 'https://oauth2.googleapis.com/token';
const userUrl   = 'https://www.googleapis.com/oauth2/v3/userinfo';

function googleAuthUrl(state) {
  const u = new URL(authBase);
  u.searchParams.set('client_id', process.env.GOOGLE_CLIENT_ID);
  u.searchParams.set('redirect_uri', process.env.GOOGLE_REDIRECT_URI);
  u.searchParams.set('response_type', 'code');
  u.searchParams.set('scope', 'openid email profile');
  u.searchParams.set('state', state);
  return u.toString();
}

async function googleProfileFromCode(code) {
  const t = await axios.post(tokenUrl, {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    grant_type: 'authorization_code',
    code
  });
  const { access_token } = t.data;
  const { data: p } = await axios.get(userUrl, {
    headers: { Authorization: `Bearer ${access_token}` }
  });
  return {
    provider: 'google',
    providerId: p.sub,
    email: p.email,
    name: p.name,
    picture: p.picture,
    emailVerified: !!p.email_verified
  };
}

module.exports = { googleAuthUrl, googleProfileFromCode };
