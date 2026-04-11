const express = require('express');
const dotenv = require('dotenv');
const { checkDatabaseConnection, configSource, database } = require('./config/db');
const { ensureFixedSuperAdminAccount } = require('./controllers/user.controller');
const userRoutes = require('./routes/user.routes');

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3000);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Vary', 'Origin');
    res.header('Access-Control-Allow-Credentials', 'true');
  } else {
    res.header('Access-Control-Allow-Origin', '*');
  }
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    req.headers['access-control-request-headers'] || 'Content-Type, Authorization, Accept'
  );

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  return next();
});

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Node API is healthy',
  });
});

app.use('/api', userRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

app.use((error, req, res, next) => {
  console.error('Unhandled error:', error.message);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
});

async function startServer() {
  try {
    await checkDatabaseConnection();
    await ensureFixedSuperAdminAccount();
    console.log(`DB config source: ${configSource} (${database})`);

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
}

startServer();
