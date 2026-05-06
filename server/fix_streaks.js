const pool = require('./src/config/db');

async function fixStreaks() {
  try {
    console.log('🔄 Updating everyone to 2 Streak Freezes...');
    const result = await pool.query('UPDATE users SET streak_freezes = 2 WHERE streak_freezes < 2 OR streak_freezes IS NULL');
    console.log(`✅ Successfully updated ${result.rowCount} users!`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to update streak freezes:', err);
    process.exit(1);
  }
}

fixStreaks();
