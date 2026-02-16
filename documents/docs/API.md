# API Endpoints

Base URL (dev): `http://localhost:8000`

See the full OpenAPI spec at `../openapi.yaml` or serve it at `/docs` using Swagger UI.

## Auth
- `POST /api/auth/pre-signup` — create activation token (emails in prod; returns token in dev)
- `POST /api/auth/signup` — complete signup with token
- `POST /api/auth/signin` — sets httpOnly cookie `token` and returns `{ token, user }`
- `GET  /api/auth/signout` — clears cookie
- `PUT  /api/auth/forgot-password` — start reset (emails token or returns token in dev)
- `PUT  /api/auth/reset-password` — complete reset with token

## User
- `GET  /api/user/profile` — current user (protected)
- `PUT  /api/user/update` — form-data fields + optional file `photosrc` (protected)
- `GET  /api/user/public-profile/:username` — public profile (email masked)
- `GET  /api/user/profile-photo/:username` — binary
- `PUT  /api/user/update-profile-photo` — upload `photosrc` (protected)
- `GET  /api/user/resume-photo/:username` — binary
- `PUT  /api/user/update-resume-photo` — upload `photosrc` (protected)
- `GET  /api/user/profile-resume/:username` — JSON
- `PUT  /api/user/update-profile-resume` — JSON body (protected)

### AuthN/Z
`express-jwt` reads token from **cookie** `token` first, then `Authorization: Bearer <token>`.
