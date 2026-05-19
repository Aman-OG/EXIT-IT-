const pool = require('../config/db');

// POST /progress/session — log a study session
exports.logSession = async (req, res) => {
  const userId = req.user.id;
  const { materialId, durationSeconds } = req.body;
  if (!durationSeconds || durationSeconds < 10) return res.status(400).json({ message: 'durationSeconds must be >= 10' });
  try {
    await pool.query(
      'INSERT INTO study_sessions (user_id, material_id, duration_seconds) VALUES ($1, $2, $3)',
      [userId, materialId || null, durationSeconds]
    );
    res.json({ message: 'Session logged' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to log session' });
  }
};

// GET /progress/today — today's study minutes + goal
exports.getTodayProgress = async (req, res) => {
  const userId = req.user.id;
  try {
    const [sessionRes, goalRes] = await Promise.all([
      pool.query(
        'SELECT COALESCE(SUM(duration_seconds), 0) as total_seconds FROM study_sessions WHERE user_id = $1 AND DATE(created_at) = CURRENT_DATE',
        [userId]
      ),
      pool.query('SELECT daily_goal_minutes FROM users WHERE id = $1', [userId])
    ]);
    const totalMinutes = Math.floor(parseInt(sessionRes.rows[0].total_seconds) / 60);
    const goalMinutes = goalRes.rows[0]?.daily_goal_minutes || 20;
    res.json({ totalMinutes, goalMinutes, goalMet: totalMinutes >= goalMinutes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch today progress' });
  }
};

// PUT /progress/goal — update daily goal
exports.updateGoal = async (req, res) => {
  const userId = req.user.id;
  const { minutes } = req.body;
  if (!minutes || minutes < 5 || minutes > 480) return res.status(400).json({ message: 'Goal must be between 5 and 480 minutes' });
  try {
    await pool.query('UPDATE users SET daily_goal_minutes = $1 WHERE id = $2', [minutes, userId]);
    res.json({ dailyGoalMinutes: minutes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update goal' });
  }
};

// GET /progress/study-time — total study time per course
exports.getStudyTimePerCourse = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await pool.query(`
      SELECT 
        c.id as course_id,
        c.title as course_title,
        c.code as course_code,
        COALESCE(SUM(ss.duration_seconds), 0) as total_seconds,
        ROUND(COALESCE(SUM(ss.duration_seconds), 0) / 60.0) as total_minutes
      FROM courses c
      LEFT JOIN materials m ON m.course_id = c.id
      LEFT JOIN study_sessions ss ON ss.material_id = m.id AND ss.user_id = $1
      GROUP BY c.id, c.title, c.code
      ORDER BY total_seconds DESC
    `, [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch study time' });
  }
};

// GET /progress/weekly — last 7 days study minutes per day
exports.getWeeklyStudyTime = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await pool.query(`
      SELECT 
        DATE(created_at) as date,
        ROUND(SUM(duration_seconds) / 60.0) as minutes
      FROM study_sessions
      WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `, [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch weekly study time' });
  }
};
