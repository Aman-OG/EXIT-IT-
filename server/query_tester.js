require('dotenv').config();
const pool = require('./src/config/db');

async function testUpdate() {
  try {
    const res = await pool.query('INSERT INTO system_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2 RETURNING *', ['exam_date', '2026-05-15']);
    console.log('Update result:', res.rows);
  } catch(e) {
    console.error('Update failed:', e);
  } finally {
    process.exit(0);
  }
}
testUpdate();
