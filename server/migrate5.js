const pool = require('./src/config/db');

async function runDeployPhase5() {
  try {
    console.log('🚀 Running Phase 5: Progress & Intelligence + Notes System Database Migrations...');
    
    // 1. Create User Notes Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_notes (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          material_id INTEGER REFERENCES materials(id) ON DELETE CASCADE,
          content TEXT NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id, material_id)
      );
    `);

    console.log('✅ Phase 5 Database Migrations Completed Successfully!');
    process.exit(0);
  } catch(e) {
    console.error('❌ Phase 5 Migration failed: ', e);
    process.exit(1);
  }
}

runDeployPhase5();
