const pool = require('./src/config/db');

async function runDeployPhase3_5() {
  try {
    console.log('Running Phase 3.5 Database Migrations...');
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_progress (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          material_id INTEGER REFERENCES materials(id) ON DELETE CASCADE,
          status VARCHAR(20) DEFAULT 'completed',
          completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id, material_id)
      );
    `);

    console.log('Successfully injected Progress Tracking schemas!');
    process.exit(0);
  } catch(e) {
    console.error('Migration failed: ', e);
    process.exit(1);
  }
}

runDeployPhase3_5();
