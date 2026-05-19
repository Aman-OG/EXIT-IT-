const pool = require('../config/db');

// Search users by name or email
exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const userId = req.user.id;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const result = await pool.query(
      `SELECT id, name, email, created_at 
       FROM users 
       WHERE (LOWER(name) LIKE LOWER($1) OR LOWER(email) LIKE LOWER($1))
       AND id != $2
       ORDER BY name
       LIMIT 20`,
      [`%${query}%`, userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('❌ [Friends] Error searching users:', error);
    res.status(500).json({ error: 'Failed to search users' });
  }
};

// Send friend request
exports.sendFriendRequest = async (req, res) => {
  try {
    const { friendId } = req.body;
    const userId = req.user.id;

    if (!friendId) {
      return res.status(400).json({ error: 'Friend ID is required' });
    }

    if (friendId === userId) {
      return res.status(400).json({ error: 'Cannot send friend request to yourself' });
    }

    // Check if friendship already exists
    const existing = await pool.query(
      `SELECT * FROM friendships 
       WHERE (user_id = $1 AND friend_id = $2) 
       OR (user_id = $2 AND friend_id = $1)`,
      [userId, friendId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Friend request already exists' });
    }

    // Create friend request
    const result = await pool.query(
      `INSERT INTO friendships (user_id, friend_id, status) 
       VALUES ($1, $2, 'pending') 
       RETURNING *`,
      [userId, friendId]
    );

    // Create notification for the recipient
    await pool.query(
      `INSERT INTO notifications (user_id, type, title, message, link) 
       VALUES ($1, 'friend_request', 'New Friend Request', $2, '/friends')`,
      [friendId, `${req.user.name} sent you a friend request`]
    );

    res.json({ message: 'Friend request sent', friendship: result.rows[0] });
  } catch (error) {
    console.error('❌ [Friends] Error sending friend request:', error);
    res.status(500).json({ error: 'Failed to send friend request' });
  }
};

// Get pending friend requests (received)
exports.getPendingRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT f.id, f.user_id, f.created_at, u.name, u.email
       FROM friendships f
       JOIN users u ON f.user_id = u.id
       WHERE f.friend_id = $1 AND f.status = 'pending'
       ORDER BY f.created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('❌ [Friends] Error getting pending requests:', error);
    res.status(500).json({ error: 'Failed to get pending requests' });
  }
};

// Get sent friend requests
exports.getSentRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT f.id, f.friend_id, f.created_at, u.name, u.email
       FROM friendships f
       JOIN users u ON f.friend_id = u.id
       WHERE f.user_id = $1 AND f.status = 'pending'
       ORDER BY f.created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('❌ [Friends] Error getting sent requests:', error);
    res.status(500).json({ error: 'Failed to get sent requests' });
  }
};

// Accept friend request
exports.acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.id;

    // Verify the request is for this user
    const friendship = await pool.query(
      `SELECT * FROM friendships WHERE id = $1 AND friend_id = $2 AND status = 'pending'`,
      [requestId, userId]
    );

    if (friendship.rows.length === 0) {
      return res.status(404).json({ error: 'Friend request not found' });
    }

    // Update status to accepted
    await pool.query(
      `UPDATE friendships SET status = 'accepted', updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [requestId]
    );

    // Create notification for the sender
    await pool.query(
      `INSERT INTO notifications (user_id, type, title, message, link) 
       VALUES ($1, 'friend_request', 'Friend Request Accepted', $2, '/friends')`,
      [friendship.rows[0].user_id, `${req.user.name} accepted your friend request`]
    );

    res.json({ message: 'Friend request accepted' });
  } catch (error) {
    console.error('❌ [Friends] Error accepting friend request:', error);
    res.status(500).json({ error: 'Failed to accept friend request' });
  }
};

// Reject friend request
exports.rejectFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.id;

    // Verify the request is for this user
    const friendship = await pool.query(
      `SELECT * FROM friendships WHERE id = $1 AND friend_id = $2 AND status = 'pending'`,
      [requestId, userId]
    );

    if (friendship.rows.length === 0) {
      return res.status(404).json({ error: 'Friend request not found' });
    }

    // Update status to rejected
    await pool.query(
      `UPDATE friendships SET status = 'rejected', updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [requestId]
    );

    res.json({ message: 'Friend request rejected' });
  } catch (error) {
    console.error('❌ [Friends] Error rejecting friend request:', error);
    res.status(500).json({ error: 'Failed to reject friend request' });
  }
};

// Get all friends
exports.getFriends = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT DISTINCT
         CASE 
           WHEN f.user_id = $1 THEN f.friend_id
           ELSE f.user_id
         END as friend_id,
         u.name,
         u.email,
         f.created_at as friends_since
       FROM friendships f
       JOIN users u ON (
         CASE 
           WHEN f.user_id = $1 THEN f.friend_id
           ELSE f.user_id
         END = u.id
       )
       WHERE (f.user_id = $1 OR f.friend_id = $1) 
       AND f.status = 'accepted'
       ORDER BY u.name`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('❌ [Friends] Error getting friends:', error);
    res.status(500).json({ error: 'Failed to get friends' });
  }
};

// Remove friend
exports.removeFriend = async (req, res) => {
  try {
    const { friendId } = req.params;
    const userId = req.user.id;

    await pool.query(
      `DELETE FROM friendships 
       WHERE ((user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1))
       AND status = 'accepted'`,
      [userId, friendId]
    );

    res.json({ message: 'Friend removed' });
  } catch (error) {
    console.error('❌ [Friends] Error removing friend:', error);
    res.status(500).json({ error: 'Failed to remove friend' });
  }
};

// Get friends-only leaderboard
exports.getFriendsLeaderboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `WITH friend_ids AS (
         SELECT DISTINCT
           CASE 
             WHEN f.user_id = $1 THEN f.friend_id
             ELSE f.user_id
           END as friend_id
         FROM friendships f
         WHERE (f.user_id = $1 OR f.friend_id = $1) 
         AND f.status = 'accepted'
       ),
       user_stats AS (
         SELECT 
           u.id,
           u.name,
           u.email,
           COUNT(DISTINCT up.material_id) as completed_materials,
           COALESCE(s.current_streak, 0) as current_streak,
           COALESCE(s.longest_streak, 0) as longest_streak,
           COALESCE(SUM(ss.duration_minutes), 0) as total_study_minutes
         FROM users u
         LEFT JOIN user_progress up ON u.id = up.user_id
         LEFT JOIN streaks s ON u.id = s.user_id
         LEFT JOIN study_sessions ss ON u.id = ss.user_id
         WHERE u.id IN (SELECT friend_id FROM friend_ids UNION SELECT $1)
         GROUP BY u.id, u.name, u.email, s.current_streak, s.longest_streak
       )
       SELECT 
         id,
         name,
         email,
         completed_materials,
         current_streak,
         longest_streak,
         total_study_minutes,
         RANK() OVER (ORDER BY completed_materials DESC, current_streak DESC, total_study_minutes DESC) as rank
       FROM user_stats
       ORDER BY rank`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('❌ [Friends] Error getting friends leaderboard:', error);
    res.status(500).json({ error: 'Failed to get friends leaderboard' });
  }
};
