const pool = require('./src/config/db');

async function migrate() {
    try {
        console.log('Adding percentage and last_accessed_at to user_progress...');
        await pool.query(`
            ALTER TABLE user_progress 
            ADD COLUMN IF NOT EXISTS percentage INTEGER DEFAULT 0,
            ADD COLUMN IF NOT EXISTS last_accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
        `);
        console.log('Migration completed successfully.');
        process.exit(0);
    } catch(e) {
        console.error('Migration failed:', e);
        process.exit(1);
    }
}

migrate();
