const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  connectionTimeoutMillis: 10000, // 10s wait for connection
  idleTimeoutMillis: 30000,       // 30s before closing idle client
  max: 20                         // capped max connections
});

pool.on('error', (err) => {
  console.error('⚠️ UNEXPECTED DATABASE ERROR on idle client:', err.message);
  // Do NOT exit the process, let the pool handle reconnection
});

module.exports = pool;
