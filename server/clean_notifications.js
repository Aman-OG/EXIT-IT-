const pool = require('./src/config/db');

async function cleanNotifications() {
  try {
    await pool.query(`
      UPDATE notifications 
      SET message = REPLACE(message, 'undefined sent you a friend request', 'A student sent you a friend request')
      WHERE message LIKE '%undefined sent you a friend request%'
    `);

    await pool.query(`
      UPDATE notifications 
      SET message = REPLACE(message, 'undefined accepted your friend request', 'A friend accepted your friend request')
      WHERE message LIKE '%undefined accepted your friend request%'
    `);

    console.log('✅ Cleaned up past undefined notification messages');
  } catch (err) {
    console.error('Error cleaning notifications:', err);
  } finally {
    process.exit(0);
  }
}

cleanNotifications();
