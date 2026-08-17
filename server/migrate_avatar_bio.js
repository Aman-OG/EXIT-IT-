const pool = require('./src/config/db');

async function migrateAvatarAndBio() {
  const client = await pool.connect();
  try {
    console.log('🔄 Adding avatar_url and bio columns to users table...');
    await client.query('BEGIN');

    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT DEFAULT NULL;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT NULL;
    `);

    await client.query('COMMIT');
    console.log('✅ Successfully added avatar_url and bio to users table!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', error);
  } finally {
    client.release();
    process.exit(0);
  }
}

migrateAvatarAndBio();
