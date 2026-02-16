const axios = require('axios');

const authBase = 'https://www.linkedin.com/oauth/v2/authorization';
const tokenUrl = 'https://www.linkedin.com/oauth/v2/accessToken';

function linkedinAuthUrl(state) {
  const u = new URL(authBase);
  u.searchParams.set('client_id', process.env.LINKEDIN_CLIENT_ID);
  u.searchParams.set('redirect_uri', process.env.LINKEDIN_REDIRECT_URI);
  u.searchParams.set('response_type', 'code');
  u.searchParams.set('scope', 'r_liteprofile r_emailaddress');
  u.searchParams.set('state', state);
  return u.toString();
}

async function linkedinProfileFromCode(code) {
  const t = await axios.post(tokenUrl, null, {
    params: {
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
      client_id: process.env.LINKEDIN_CLIENT_ID,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET
    },
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  const { access_token } = t.data;

  const { data: me } = await axios.get('https://api.linkedin.com/v2/me', {
    headers: { Authorization: `Bearer ${access_token}` }
  });
  const { data: emailRes } = await axios.get(
    'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))',
    { headers: { Authorization: `Bearer ${access_token}` } }
  );
  const email = emailRes?.elements?.[0]?.['handle~']?.emailAddress;

  const first = me.localizedFirstName || '';
  const last  = me.localizedLastName || '';
  return {
    provider: 'linkedin',
    providerId: me.id,
    email,
    name: `${first} ${last}`.trim(),
    picture: undefined,
    emailVerified: !!email
  };
}

module.exports = { linkedinAuthUrl, linkedinProfileFromCode };
