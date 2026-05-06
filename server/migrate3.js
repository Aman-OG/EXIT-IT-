const pool = require('./src/config/db');

async function runDeployPhase3() {
  try {
    console.log('Running Phase 3 Database Migrations...');
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS courses (
          id SERIAL PRIMARY KEY,
          title VARCHAR(150) NOT NULL,
          code VARCHAR(50) UNIQUE NOT NULL,
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS materials (
          id SERIAL PRIMARY KEY,
          course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
          title VARCHAR(200) NOT NULL,
          file_url TEXT NOT NULL,
          type VARCHAR(20) DEFAULT 'pdf',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Inject temporary sample courses to build off of
    await pool.query(`
      INSERT INTO courses (title, code, description) VALUES 
      ('Software Engineering', 'SE401', 'Core principles of architectural design and lifecycle methodologies.'),
      ('Algorithms & Data Structures', 'CS301', 'Heavy computational science examining trees, graphs, and Big O notation.')
      ON CONFLICT (code) DO NOTHING;
    `);

    console.log('Successfully injected Course infrastructure schemas!');
    process.exit(0);
  } catch(e) {
    console.error('Migration failed: ', e);
    process.exit(1);
  }
}

runDeployPhase3();
