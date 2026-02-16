# Security

- JWT in **httpOnly cookie** `token`; header `Authorization: Bearer` also supported
- Cookies: dev (`secure=false, sameSite=lax`), prod (`secure=true, sameSite=none`, HTTPS)
- CORS: origin from `CLIENT_URL_DEV/PROD`, `credentials: true`
- Strip sensitive fields before returning user
- Do not commit `.env`; rotate keys on schedule/incident
