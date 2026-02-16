require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDoc = YAML.load('./documents/openapi.yaml');

const { connectDB } = require('./config/db');
const authRoutes = require('./routes/auth');
const oauthRoutes = require('./routes/auth.oauth.js');
const userRoutes = require('./routes/user');
const blogRoutes = require('./routes/blog');
const categoryRoutes = require('./routes/category');
const tagRoutes = require('./routes/tag');
const examplanRoutes = require('./routes/examplan');
const visualresumeRoutes = require('./routes/visualresume');
const resumePrintRoutes = require("./routes/resumePrint");


const app = express();

const isProd = (process.env.NODE_ENV || 'development').toLowerCase() === 'production';
const CLIENT_URL = isProd ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL_DEV;

// core middlewares
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(cors({
  origin: CLIENT_URL || true, // if not set, allow any (dev)
  credentials: true
}));

// routes
app.use('/api/auth', authRoutes);
app.use('/api', oauthRoutes);
app.use('/api', userRoutes);
app.use('/api', blogRoutes);
app.use('/api', categoryRoutes);
app.use('/api', tagRoutes);
app.use('/api', examplanRoutes);
app.use('/api', visualresumeRoutes);
app.use("/api", resumePrintRoutes);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// db & server
connectDB().then(() => {
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`🚀 API listening on :${port}`));
}).catch(err => {
  console.error('❌ Failed to connect DB', err);
  process.exit(1);
});
