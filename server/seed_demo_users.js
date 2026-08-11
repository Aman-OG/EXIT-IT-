const pool = require('./src/config/db');
const bcrypt = require('bcryptjs');

async function seedDemoAccounts() {
  try {
    const hash = await bcrypt.hash('password123', 10);
    
    // Upsert Admin Demo
    await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ('Demo Admin', 'admin@demo.com', $1, 'admin')
       ON CONFLICT (email) DO UPDATE SET password = $1, role = 'admin'`,
      [hash]
    );

    // Upsert Student Demo
    await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ('Demo Student', 'student@demo.com', $1, 'user')
       ON CONFLICT (email) DO UPDATE SET password = $1, role = 'user'`,
      [hash]
    );

    console.log('✅ Demo accounts (admin@demo.com & student@demo.com) seeded successfully with password: password123');
  } catch (err) {
    console.error('❌ Failed to seed demo accounts:', err);
  } finally {
    process.exit(0);
  }
}

seedDemoAccounts();
