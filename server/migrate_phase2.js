require('dotenv').config();
const pool = require('./src/config/db');

async function migrate() {
  try {
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS daily_goal_minutes INTEGER DEFAULT 20');
    console.log('✅ daily_goal_minutes added to users');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS study_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        material_id INTEGER REFERENCES materials(id) ON DELETE SET NULL,
        duration_seconds INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ study_sessions created');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS flashcard_decks (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        course_id INTEGER REFERENCES courses(id) ON DELETE SET NULL,
        title VARCHAR(255) NOT NULL,
        is_public BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ flashcard_decks created');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS flashcards (
        id SERIAL PRIMARY KEY,
        deck_id INTEGER REFERENCES flashcard_decks(id) ON DELETE CASCADE,
        front TEXT NOT NULL,
        back TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ flashcards created');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS flashcard_reviews (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        card_id INTEGER REFERENCES flashcards(id) ON DELETE CASCADE,
        ease_factor FLOAT DEFAULT 2.5,
        interval_days INTEGER DEFAULT 1,
        repetitions INTEGER DEFAULT 0,
        next_review_date DATE DEFAULT CURRENT_DATE,
        last_quality INTEGER,
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, card_id)
      )
    `);
    console.log('✅ flashcard_reviews created');

    console.log('✅ Phase 2 migration complete!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  }
}

migrate();
