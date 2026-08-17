require('dotenv').config();
const pool = require('./src/config/db');

async function initFeedbackTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS feedbacks (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE SET NULL,
        name VARCHAR(255),
        email VARCHAR(255),
        category VARCHAR(100) DEFAULT 'general', -- 'general', 'bug', 'suggestion', 'course_content', 'exam'
        rating INT DEFAULT 5,
        message TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'reviewed', 'resolved'
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ feedbacks table ready!');
  } catch (err) {
    console.error('❌ Error creating feedbacks table:', err);
  } finally {
    await pool.end();
  }
}

initFeedbackTable();
