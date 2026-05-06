const pool = require('./src/config/db');

async function runDeployPhase8() {
  try {
    console.log('🚀 Running Phase 8: AI Usage Quotas & Caching Migrations...');
    
    // 1. AI Cache Table
    // query_hash is SHA256 of the prompt/parameters
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ai_cache (
          id SERIAL PRIMARY KEY,
          query_hash VARCHAR(64) UNIQUE NOT NULL,
          response TEXT NOT NULL,
          model_used VARCHAR(50),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. AI Usage Tracking Table (20 actions/day per user)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ai_usage (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          usage_date DATE DEFAULT CURRENT_DATE,
          action_count INTEGER DEFAULT 1,
          UNIQUE(user_id, usage_date)
      );
    `);

    console.log('✅ Phase 8 Database Migrations Completed Successfully!');
    process.exit(0);
  } catch(e) {
    console.error('❌ Phase 8 Migration failed: ', e);
    process.exit(1);
  }
}

runDeployPhase8();
