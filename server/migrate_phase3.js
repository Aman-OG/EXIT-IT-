require('dotenv').config();
const pool = require('./src/config/db');

async function migrate() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pdf_bookmarks (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        material_id INTEGER REFERENCES materials(id) ON DELETE CASCADE,
        page_number INTEGER NOT NULL,
        label VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, material_id, page_number)
      )
    `);
    console.log('✅ pdf_bookmarks created');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS pdf_highlights (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        material_id INTEGER REFERENCES materials(id) ON DELETE CASCADE,
        page_number INTEGER NOT NULL,
        selected_text TEXT NOT NULL,
        color VARCHAR(20) DEFAULT 'yellow',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ pdf_highlights created');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS certificates (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
        issued_at TIMESTAMP DEFAULT NOW(),
        certificate_code VARCHAR(50) UNIQUE,
        UNIQUE(user_id, course_id)
      )
    `);
    console.log('✅ certificates created');

    console.log('✅ Phase 3 migration complete!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  }
}

migrate();
