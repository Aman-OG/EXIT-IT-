const pool = require('./src/config/db');

async function runDeploy() {
  try {
    console.log('Running Phase 2 Database Migrations...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS system_settings (
          key VARCHAR(50) PRIMARY KEY,
          value TEXT NOT NULL
      );
    `);
    
    await pool.query(`
      INSERT INTO system_settings (key, value) VALUES ('exam_date', '2026-05-30') ON CONFLICT DO NOTHING;
    `);

    console.log('Successfully injected system_settings schema!');
    
    // Attempting to blindly promote the first registered user to admin as a convenience
    const userRes = await pool.query('SELECT email FROM users ORDER BY id ASC LIMIT 1');
    if(userRes.rows.length > 0) {
      await pool.query('UPDATE users SET role = $1 WHERE email = $2', ['admin', userRes.rows[0].email]);
      console.log(`Automatically promoted ${userRes.rows[0].email} to Admin!`);
    }

    process.exit(0);
  } catch(e) {
    console.error('Migration failed: ', e);
    process.exit(1);
  }
}

runDeploy();
