# Setup

## Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB 5+)
- SendGrid account (optional for emails)

## Install & Run (dev)
```bash
cp .env.migrated.example .env   # fill values
npm install
npm run dev
```

## Environment Files
- `.env` for development
- `.env.production` for production (never commit)

See [ENV.md](./ENV.md).
