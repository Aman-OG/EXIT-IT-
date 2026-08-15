const pool = require('../server/src/config/db');
const { notifyAllFriends } = require('../server/src/notifications/notifications.controller');

async function testFriendNotifications() {
  try {
    // Check if there are any accepted friendships
    const friendships = await pool.query(`SELECT * FROM friendships WHERE status = 'accepted' LIMIT 5`);
    console.log('Accepted friendships count:', friendships.rows.length);

    if (friendships.rows.length > 0) {
      const user1 = friendships.rows[0].user_id;
      const user2 = friendships.rows[0].friend_id;
      console.log(`Testing friend push notification from user ${user1} to friends...`);

      await notifyAllFriends(
        user1,
        'friend_activity',
        'Test Friend Activity! 🎉',
        'This is a test friend completion notification!',
        '/courses'
      );

      const recentNotifs = await pool.query(
        `SELECT * FROM notifications WHERE type = 'friend_activity' ORDER BY created_at DESC LIMIT 3`
      );
      console.log('Recent friend activity notifications in DB:', recentNotifs.rows);
    } else {
      console.log('No accepted friendships found in DB yet to test, but notification function is ready.');
    }
  } catch (err) {
    console.error('Error testing friend notifications:', err);
  } finally {
    await pool.end();
  }
}

testFriendNotifications();
