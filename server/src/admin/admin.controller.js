const pool = require('../config/db');

const getStats = async (req, res) => {
  try {
    const userCountRes = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'user'");
    const totalUsers = parseInt(userCountRes.rows[0].count, 10);
    res.json({
      totalUsers,
      totalQuizzes: 0, // Placeholder until Quizzes Phase
      avgScore: 0, // Placeholder
      activeUsers: Math.ceil(totalUsers * 0.8) // Placeholder metric
    });
  } catch(e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to retrieve stats' });
  }
};

const getUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, email, role, created_at FROM users WHERE role = 'user' ORDER BY created_at DESC");
    res.json(result.rows);
  } catch(e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to retrieve users' });
  }
};

module.exports = { getStats, getUsers };
