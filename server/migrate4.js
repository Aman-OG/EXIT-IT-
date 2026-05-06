const pool = require('./src/config/db');

async function runDeployPhase4() {
  try {
    console.log('🚀 Running Phase 4: Quiz & Learning Engine Database Migrations...');
    
    // 1. Create Quizzes Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS quizzes (
          id SERIAL PRIMARY KEY,
          course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
          title VARCHAR(200) NOT NULL,
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Create Questions Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS questions (
          id SERIAL PRIMARY KEY,
          quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
          question_text TEXT NOT NULL,
          question_type VARCHAR(20) DEFAULT 'mcq',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Create Options Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS options (
          id SERIAL PRIMARY KEY,
          question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
          option_text TEXT NOT NULL,
          is_correct BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Create Quiz Attempts Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS quiz_attempts (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
          score INTEGER NOT NULL,
          total_questions INTEGER NOT NULL,
          completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Phase 4 Database Migrations Completed Successfully!');
    process.exit(0);
  } catch(e) {
    console.error('❌ Phase 4 Migration failed: ', e);
    process.exit(1);
  }
}

runDeployPhase4();
