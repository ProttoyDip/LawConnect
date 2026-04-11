const express = require('express');
const dotenv = require('dotenv');
const { checkDatabaseConnection } = require('./config/db');
const userRoutes = require('./routes/user.routes');

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
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

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
}

startServer();
