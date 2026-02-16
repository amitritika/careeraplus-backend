# CareerPlus Backend (Express + MongoDB)

This backend matches your existing User module & Auth flows, using CommonJS and Express.

## Quick Start

```bash
cd careerplus-backend
cp .env.example .env
# fill env vars
npm install
npm run dev
```

API base: `http://localhost:5000`

### Auth endpoints
- `POST /api/auth/pre-signup` {name,email,password}
- `POST /api/auth/signup` {token}  # from email or response in dev
- `POST /api/auth/signin` {email,password}
- `GET  /api/auth/signout`
- `PUT  /api/auth/forgot-password` {email}
- `PUT  /api/auth/reset-password` {resetPasswordLink,newPassword}

### User endpoints
- `GET  /api/user/profile` (cookie auth)
- `PUT  /api/user/update` (form-data with `photosrc` optional)
- `GET  /api/user/photo/:username`
- `GET  /api/user/profile-photo/:username`
- `GET  /api/user/public-profile/:username`
- `PUT  /api/user/update-profile-photo` (form-data with `photosrc`)
- `GET  /api/user/resume-photo/:username`
- `PUT  /api/user/update-resume-photo` (form-data with `photosrc`)
- `GET  /api/user/profile-resume/:username`
- `PUT  /api/user/update-profile-resume` {list,bg,font}
- `PUT  /api/user/update-transactions`
- `POST /api/user/payment/:username/:txnid`  # stub

Cookies: `signin` sets `token` httpOnly cookie used by protected routes.

## Notes
- Email sending (SendGrid) is optional; without API key, endpoints return the token in response for dev.
- Payment verification endpoint is stubbed.
- This code keeps the `hashed_password` + `salt` approach with a virtual `password` field.

---

## ENV migration notes

This backend supports both a new single `MONGO_URI` and your legacy keys:
- `DATABASE_CLOUD_DEV` / `DATABASE_CLOUD_PROD` / `DATABASE_LOCAL`

At runtime:
- If `MONGO_URI` is set, it is used.
- Else, `DATABASE_CLOUD_PROD` (production) or `DATABASE_CLOUD_DEV` (development) are used.
- Else, falls back to `DATABASE_LOCAL`.

CORS origin is picked from `CLIENT_URL_PROD` (production) or `CLIENT_URL_DEV` (development).

Cookies for JWT are now set with:
- `httpOnly: true`
- `secure: NODE_ENV === 'production'`
- `sameSite: 'none'` in production, `'lax'` in development

See `.env.migrated.example` and **do not commit `.env`**.
