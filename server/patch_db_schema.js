require('dotenv').config();
const pool = require('./src/config/db');

async function patchSchema() {
  const client = await pool.connect();
  try {
    console.log('🔄 Running complete database schema consistency patch...');
    await client.query('BEGIN');

    // 1. quiz_attempts
    await client.query(`
      ALTER TABLE quiz_attempts 
        ADD COLUMN IF NOT EXISTS answers_json JSONB;
    `);
    console.log('✅ quiz_attempts: answers_json verified');

    // 2. exam_attempts
    await client.query(`
      ALTER TABLE exam_attempts 
        ADD COLUMN IF NOT EXISTS answers_json JSONB;
    `);
    console.log('✅ exam_attempts: answers_json verified');

    // 3. quizzes
    await client.query(`
      ALTER TABLE quizzes 
        ADD COLUMN IF NOT EXISTS is_official BOOLEAN DEFAULT TRUE,
        ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        ADD COLUMN IF NOT EXISTS difficulty VARCHAR(15),
        ADD COLUMN IF NOT EXISTS quiz_type VARCHAR(20) DEFAULT 'quiz';
    `);
    console.log('✅ quizzes columns verified');

    // 4. questions
    await client.query(`
      ALTER TABLE questions 
        ADD COLUMN IF NOT EXISTS explanation TEXT,
        ADD COLUMN IF NOT EXISTS question_type VARCHAR(20) DEFAULT 'mcq';
    `);
    console.log('✅ questions columns verified');

    // 5. options
    await client.query(`
      ALTER TABLE options 
        ADD COLUMN IF NOT EXISTS is_correct BOOLEAN DEFAULT FALSE;
    `);
    console.log('✅ options columns verified');

    // 6. users
    await client.query(`
      ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS total_score INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS max_streak INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS streak_freezes INTEGER DEFAULT 2,
        ADD COLUMN IF NOT EXISTS last_active_date DATE DEFAULT CURRENT_DATE,
        ADD COLUMN IF NOT EXISTS daily_goal_minutes INTEGER DEFAULT 20,
        ADD COLUMN IF NOT EXISTS avatar_url TEXT DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT NULL;
    `);
    console.log('✅ users columns verified');

    // 7. materials
    await client.query(`
      ALTER TABLE materials 
        ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
    `);
    console.log('✅ materials columns verified');

    // 8. user_progress
    await client.query(`
      ALTER TABLE user_progress 
        ADD COLUMN IF NOT EXISTS percentage INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS last_accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    `);
    console.log('✅ user_progress columns verified');

    await client.query('COMMIT');
    console.log('🎉 Database schema patch completed successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Schema patch failed:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

patchSchema().catch((err) => {
  console.error(err);
  process.exit(1);
});
