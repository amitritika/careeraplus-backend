const mongoose = require('mongoose');

function pickMongoUri() {
  const env = (process.env.NODE_ENV || 'development').toLowerCase();

  // Preferred new-style single var
  if (process.env.MONGO_URI) return process.env.MONGO_URI;

  // Legacy vars (from old .env)
  if (env === 'production') {
    return process.env.DATABASE_CLOUD_PROD || process.env.DATABASE_LOCAL;
  } else {
    return process.env.DATABASE_CLOUD_DEV || process.env.DATABASE_LOCAL;
  }
}

async function connectDB() {
  const uri = pickMongoUri();
  if (!uri) throw new Error('No MongoDB URI found. Set MONGO_URI or DATABASE_CLOUD_DEV/PROD or DATABASE_LOCAL');
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  console.log('✅ MongoDB connected');
}

module.exports = { connectDB };
