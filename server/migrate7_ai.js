const pool = require('./src/config/db');

async function runDeployPhase7AI() {
  try {
    console.log('🚀 Running Phase 7: AI Intelligence & Practice Quiz Database Migrations...');
    
    // 1. Update Quizzes Table
    // Add is_official (default true), user_id (for personal quizzes), difficulty
    await pool.query(`
      ALTER TABLE quizzes 
        ADD COLUMN IF NOT EXISTS is_official BOOLEAN DEFAULT TRUE,
        ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        ADD COLUMN IF NOT EXISTS difficulty VARCHAR(15);
    `);

    // 2. Add explanation column to questions table to store AI insights
    await pool.query(`
      ALTER TABLE questions 
        ADD COLUMN IF NOT EXISTS explanation TEXT;
    `);

    console.log('✅ Phase 7 AI Database Migrations Completed Successfully!');
    process.exit(0);
  } catch(e) {
    console.error('❌ Phase 7 AI Migration failed: ', e);
    process.exit(1);
  }
}

runDeployPhase7AI();
