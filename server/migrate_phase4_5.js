const pool = require('./src/config/db');

async function migratePhase4And5() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Starting Phase 4 & 5 migration (Friends + Notifications)...');
    
    await client.query('BEGIN');

    // Phase 4: Friend System
    console.log('📋 Creating friendships table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS friendships (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        friend_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, friend_id),
        CHECK (user_id != friend_id)
      )
    `);

    await client.query(`CREATE INDEX IF NOT EXISTS idx_friendships_user ON friendships(user_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_friendships_friend ON friendships(friend_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_friendships_status ON friendships(status)`);

    // Phase 5: Notifications System
    console.log('📋 Creating notifications table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        title VARCHAR(200) NOT NULL,
        message TEXT NOT NULL,
        link VARCHAR(255),
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC)`);

    console.log('📋 Creating notification_preferences table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS notification_preferences (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE,
        email_enabled BOOLEAN DEFAULT TRUE,
        push_enabled BOOLEAN DEFAULT TRUE,
        friend_requests BOOLEAN DEFAULT TRUE,
        streak_warnings BOOLEAN DEFAULT TRUE,
        exam_reminders BOOLEAN DEFAULT TRUE,
        achievements BOOLEAN DEFAULT TRUE,
        daily_goals BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('📋 Creating scheduled_notifications table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS scheduled_notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        scheduled_for TIMESTAMP NOT NULL,
        payload JSONB,
        sent BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`CREATE INDEX IF NOT EXISTS idx_scheduled_notifications_user ON scheduled_notifications(user_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_scheduled_notifications_scheduled ON scheduled_notifications(scheduled_for)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_scheduled_notifications_sent ON scheduled_notifications(sent)`);

    await client.query('COMMIT');
    console.log('✅ Phase 4 & 5 migration completed successfully!');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

migratePhase4And5();
