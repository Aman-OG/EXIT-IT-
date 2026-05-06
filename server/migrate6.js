const pool = require('./src/config/db');

async function runDeployPhase6() {
  try {
    console.log('🚀 Running Phase 6: Exam Mode, Leaderboard, and Streaks Migrations...');
    
    // 1. Update Users Table for Streaks and Leaderboard
    await pool.query(`
      ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS max_streak INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS last_active_date DATE,
        ADD COLUMN IF NOT EXISTS total_score INTEGER DEFAULT 0;
    `);

    // 2. Create Exam Attempts Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS exam_attempts (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          score INTEGER NOT NULL,
          total_questions INTEGER NOT NULL,
          time_spent_seconds INTEGER,
          completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Phase 6 Database Migrations Completed Successfully!');
    process.exit(0);
  } catch(e) {
    console.error('❌ Phase 6 Migration failed: ', e);
    process.exit(1);
  }
}

runDeployPhase6();
