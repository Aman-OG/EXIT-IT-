require('dotenv').config();
const app = require('./src/app');
const pool = require('./src/config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test database connection
    const client = await pool.connect();
    console.log('Connected to PostgreSQL database successfully.');
    client.release();

    app.listen(PORT, () => {
      console.log(`🚀 EXIT-IT Server fully loaded on port ${PORT}`);
      // Removed Heartbeat Log
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
};

// Global Error Handlers to prevent silent crashes
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ UNHANDLED REJECTION at:', promise, 'reason:', reason);
    // Keep server running
});

process.on('uncaughtException', (err) => {
    console.error('❌ UNCAUGHT EXCEPTION:', err);
    // Keep server running but consider graceful shutdown if critical
});

startServer();
