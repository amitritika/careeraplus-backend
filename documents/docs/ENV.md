# Environment & Secrets

## MongoDB
Preferred:
```
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
```
Legacy (still supported):
- `DATABASE_CLOUD_DEV`
- `DATABASE_CLOUD_PROD`
- `DATABASE_LOCAL`

## JWT
- `JWT_SECRET`
- `JWT_ACCOUNT_ACTIVATION`
- `JWT_RESET_PASSWORD`

## Email
- `SENDGRID_API_KEY`
- `EMAIL_FROM`, `EMAIL_TO`

## Frontend
- `CLIENT_URL_DEV`
- `CLIENT_URL_PROD`

## Rotation steps
1) Create new Mongo user + update `MONGO_URI`
2) Generate new JWT secrets (48+ bytes)
3) Create new SendGrid key (least privilege)
4) Update `.env` → deploy → verify
5) Delete old credentials
