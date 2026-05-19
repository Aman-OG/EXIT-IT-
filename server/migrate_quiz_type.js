require('dotenv').config();
const pool = require('./src/config/db');

async function migrate() {
  try {
    // Add quiz_type column: 'exam' for official exams, 'quiz' for admin quizzes
    await pool.query(`
      ALTER TABLE quizzes 
      ADD COLUMN IF NOT EXISTS quiz_type VARCHAR(20) DEFAULT 'quiz'
    `);
    console.log('✅ Added quiz_type column');

    // Mark existing official quizzes that have 100 questions as 'exam'
    await pool.query(`
      UPDATE quizzes 
      SET quiz_type = 'exam'
      WHERE is_official = TRUE 
      AND id IN (
        SELECT quiz_id FROM questions 
        GROUP BY quiz_id 
        HAVING COUNT(*) >= 50
      )
    `);
    console.log('✅ Marked large official quizzes as exam type');

    console.log('Migration complete!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
