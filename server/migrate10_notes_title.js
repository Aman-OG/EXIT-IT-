require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'exit_platform',
  password: process.env.DB_PASSWORD || '1234',
  port: process.env.DB_PORT || 5432,
});

async function migrate() {
  try {
    console.log('Adding title column to user_notes table...');
    await pool.query(`
      ALTER TABLE user_notes
      ADD COLUMN IF NOT EXISTS title VARCHAR(255) DEFAULT 'My Notes';
    `);
    console.log('✅ Migration successful: title column added to user_notes');
  } catch (err) {
    console.error('❌ Migration failed:', err);
  } finally {
    pool.end();
  }
}

migrate();
