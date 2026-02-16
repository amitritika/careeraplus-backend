const axios = require('axios');

const authBase = 'https://www.facebook.com/v19.0/dialog/oauth';
const tokenUrl = 'https://graph.facebook.com/v19.0/oauth/access_token';

function facebookAuthUrl(state) {
  const u = new URL(authBase);
  u.searchParams.set('client_id', process.env.FACEBOOK_CLIENT_ID);
  u.searchParams.set('redirect_uri', process.env.FACEBOOK_REDIRECT_URI);
  u.searchParams.set('response_type', 'code');
  u.searchParams.set('scope', 'public_profile,email');
  u.searchParams.set('state', state);
  return u.toString();
}

async function facebookProfileFromCode(code) {
  const t = await axios.get(tokenUrl, {
    params: {
      client_id: process.env.FACEBOOK_CLIENT_ID,
      client_secret: process.env.FACEBOOK_CLIENT_SECRET,
      redirect_uri: process.env.FACEBOOK_REDIRECT_URI,
      code
    }
  });
  const { access_token } = t.data;
  const { data: me } = await axios.get('https://graph.facebook.com/me', {
    params: { fields: 'id,name,email,picture', access_token }
  });
  return {
    provider: 'facebook',
    providerId: me.id,
    email: me.email,
    name: me.name,
    picture: me?.picture?.data?.url,
    emailVerified: !!me.email
  };
}

module.exports = { facebookAuthUrl, facebookProfileFromCode };
