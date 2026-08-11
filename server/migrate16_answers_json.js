const pool = require('./src/config/db');

async function migrate() {
  try {
    await pool.query('ALTER TABLE quiz_attempts ADD COLUMN IF NOT EXISTS answers_json JSONB;');
    console.log('✅ Migration 16 (answers_json) completed successfully.');
  } catch (err) {
    console.error('❌ Migration 16 failed:', err);
  } finally {
    process.exit(0);
  }
}

migrate();
