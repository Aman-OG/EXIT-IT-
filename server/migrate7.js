const pool = require('./src/config/db');

async function runDeployPhase7() {
  try {
    console.log('🚀 Running Phase 7: Streak Freezes Gamification Migrations...');
    
    // 1. Add streak_freezes to Users Table
    await pool.query(`
      ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS streak_freezes INTEGER DEFAULT 2;
    `);

    // 2. Grant all existing users 2 freezes (if they happen to be NULL)
    await pool.query(`
      UPDATE users SET streak_freezes = 2 WHERE streak_freezes IS NULL;
    `);

    console.log('✅ Phase 7 Database Migrations Completed Successfully!');
    process.exit(0);
  } catch(e) {
    console.error('❌ Phase 7 Migration failed: ', e);
    process.exit(1);
  }
}

runDeployPhase7();
