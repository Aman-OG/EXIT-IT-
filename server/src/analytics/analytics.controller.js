const pool = require('../config/db');

// Combined dashboard endpoint - fetches all data in one query
exports.getDashboardOverview = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all dashboard data in optimized queries
    const result = await pool.query(`
      WITH user_stats AS (
        SELECT 
          (SELECT COUNT(*) FROM user_progress WHERE user_id = $1) as completed_materials,
          (SELECT COUNT(*) FROM materials) as total_materials,
          (SELECT AVG(score * 100.0 / total_questions) FROM quiz_attempts WHERE user_id = $1) as avg_accuracy,
          (SELECT COUNT(DISTINCT DATE(completed_at)) FROM user_progress WHERE user_id = $1 AND completed_at > NOW() - INTERVAL '7 days') as streak_days,
          (SELECT current_streak FROM users WHERE id = $1) as current_streak,
          (SELECT streak_freezes FROM users WHERE id = $1) as streak_freeze
      ),
      weakest_subject AS (
        SELECT c.title, AVG(qa.score * 100.0 / qa.total_questions) as avg_score
        FROM quiz_attempts qa
        JOIN quizzes q ON qa.quiz_id = q.id
        JOIN courses c ON q.course_id = c.id
        WHERE qa.user_id = $1
        GROUP BY c.id, c.title
        HAVING AVG(qa.score * 100.0 / qa.total_questions) < 70
        ORDER BY avg_score ASC
        LIMIT 1
      ),
      last_material AS (
        SELECT p.material_id, p.percentage, m.title as material_title, c.title as course_title, c.id as course_id
        FROM user_progress p
        JOIN materials m ON p.material_id = m.id
        JOIN courses c ON m.course_id = c.id
        WHERE p.user_id = $1
        ORDER BY p.last_accessed_at DESC
        LIMIT 1
      ),
      exam_info AS (
        SELECT value as exam_date FROM system_settings WHERE key = 'exam_date' LIMIT 1
      )
      SELECT 
        us.completed_materials,
        us.total_materials,
        ROUND((us.completed_materials::numeric / GREATEST(us.total_materials, 1)) * 100) as overall_progress,
        ROUND(COALESCE(us.avg_accuracy, 0)) as avg_accuracy,
        COALESCE(ws.title, 'None Detected') as weakest_subject,
        us.current_streak,
        us.streak_freeze,
        lm.material_id,
        lm.percentage,
        lm.material_title,
        lm.course_title,
        lm.course_id,
        ei.exam_date
      FROM user_stats us
      LEFT JOIN weakest_subject ws ON true
      LEFT JOIN last_material lm ON true
      LEFT JOIN exam_info ei ON true
    `, [userId]);

    const row = result.rows[0];
    const examDate = new Date(row.exam_date || '2026-05-30');
    const today = new Date();
    const daysUntilExam = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
    const examWarning = daysUntilExam <= 7 && daysUntilExam > 0;

    res.json({
      overallProgress: `${row.overall_progress}%`,
      avgAccuracy: `${row.avg_accuracy}%`,
      weakestSubject: row.weakest_subject,
      currentStreak: row.current_streak || 0,
      streakFreeze: row.streak_freeze || 0,
      lastMaterial: row.material_id ? {
        material_id: row.material_id,
        percentage: row.percentage,
        material_title: row.material_title,
        course_title: row.course_title,
        course_id: row.course_id
      } : null,
      examDate: row.exam_date,
      daysUntilExam,
      examWarning
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching dashboard overview' });
  }
};

exports.getOverviewStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Overall Progress (%)
    // (Materials completed by user / Total materials in system) * 100
    const progressRes = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM user_progress WHERE user_id = $1) as completed,
        (SELECT COUNT(*) FROM materials) as total
    `, [userId]);
    
    const completed = parseInt(progressRes.rows[0].completed);
    const total = parseInt(progressRes.rows[0].total);
    const overallProgress = total > 0 ? Math.round((completed / total) * 100) : 0;

    // 2. Quiz Accuracy (Average Score %)
    const quizRes = await pool.query(`
      SELECT AVG(score * 100.0 / total_questions) as avg_accuracy
      FROM quiz_attempts
      WHERE user_id = $1
    `, [userId]);
    
    const avgAccuracy = quizRes.rows[0].avg_accuracy ? Math.round(parseFloat(quizRes.rows[0].avg_accuracy)) : 0;

    // 3. Weakest Subject (Course with lowest avg quiz score)
    const weakRes = await pool.query(`
      SELECT c.title, AVG(qa.score * 100.0 / qa.total_questions) as avg_score
      FROM quiz_attempts qa
      JOIN quizzes q ON qa.quiz_id = q.id
      JOIN courses c ON q.course_id = c.id
      WHERE qa.user_id = $1
      GROUP BY c.id, c.title
      HAVING AVG(qa.score * 100.0 / qa.total_questions) < 70
      ORDER BY avg_score ASC
      LIMIT 1
    `, [userId]);

    const weakestSubject = weakRes.rows.length > 0 ? weakRes.rows[0].title : 'None Detected';

    // 4. Streak (Simplified: Days active in the last 7 days)
    const streakRes = await pool.query(`
        SELECT COUNT(DISTINCT DATE(completed_at)) as days
        FROM user_progress
        WHERE user_id = $1 AND completed_at > NOW() - INTERVAL '7 days'
    `, [userId]);
    const streak = streakRes.rows[0].days || 0;

    res.json({
      overallProgress: `${overallProgress}%`,
      avgAccuracy: `${avgAccuracy}%`,
      weakestSubject,
      streak: `${streak} Days`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching analytics' });
  }
};

exports.getCourseProgress = async (req, res) => {
  const { courseId } = req.params;
  try {
    const result = await pool.query(`
      SELECT 
        (SELECT COUNT(*) 
         FROM user_progress up
         JOIN materials m ON up.material_id = m.id
         WHERE up.user_id = $1 AND m.course_id = $2) as completed,
        (SELECT COUNT(*) FROM materials WHERE course_id = $2) as total
    `, [req.user.id, courseId]);

    const completed = parseInt(result.rows[0].completed);
    const total = parseInt(result.rows[0].total);
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    res.json({ percentage, completed, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching course progress' });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const { sort } = req.query;
    let orderBy = 'total_score DESC, current_streak DESC';

    if (sort === 'streak') orderBy = 'current_streak DESC, total_score DESC';
    if (sort === 'accuracy') orderBy = 'avg_accuracy DESC NULLS LAST, total_score DESC';
    if (sort === 'quizzes') orderBy = 'total_quizzes DESC, total_score DESC';

    const result = await pool.query(`
      WITH user_metrics AS (
        SELECT 
          u.id, 
          u.name, 
          u.email,
          u.total_score, 
          u.current_streak,
          (SELECT COUNT(*) FROM quiz_attempts qa WHERE qa.user_id = u.id) as total_quizzes,
          COALESCE((SELECT AVG(score * 100.0 / NULLIF(total_questions, 0)) FROM quiz_attempts qa WHERE qa.user_id = u.id), 0) as avg_accuracy
        FROM users u
      )
      SELECT * FROM user_metrics
      ORDER BY ${orderBy}
      LIMIT 100
    `);
    
    // Attach rank to each user
    const leaderboard = result.rows.map((u, index) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      total_score: parseInt(u.total_score || 0),
      current_streak: parseInt(u.current_streak || 0),
      total_quizzes: parseInt(u.total_quizzes || 0),
      avg_accuracy: Math.round(parseFloat(u.avg_accuracy || 0)),
      rank: index + 1
    }));

    res.json(leaderboard);
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    res.status(500).json({ message: 'Server error fetching leaderboard' });
  }
};

exports.getProfileStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. User info
    const userRes = await pool.query(`
      SELECT name, email, role, created_at, total_score, current_streak
      FROM users WHERE id = $1
    `, [userId]);
    const user = userRes.rows[0];

    // 2. Global stats
    const statsRes = await pool.query(`
      SELECT 
        (SELECT COUNT(DISTINCT material_id) FROM user_progress WHERE user_id = $1 AND status = 'completed') as materials_completed,
        (SELECT SUM(total_questions) FROM quiz_attempts WHERE user_id = $1) as questions_solved,
        (SELECT AVG(score * 100.0 / NULLIF(total_questions, 0)) FROM quiz_attempts WHERE user_id = $1) as avg_accuracy,
        (SELECT COUNT(DISTINCT m.course_id) FROM user_progress up JOIN materials m ON up.material_id = m.id WHERE up.user_id = $1 AND up.status = 'completed') as courses_active,
        (SELECT COUNT(*) FROM materials) as total_materials
    `, [userId]);
    
    // 3. Radar Data (Accuracy per course)
    const radarRes = await pool.query(`
      SELECT c.title as subject, COALESCE(AVG(qa.score * 100.0 / NULLIF(qa.total_questions, 0)), 0) as accuracy
      FROM courses c
      JOIN quizzes q ON c.id = q.course_id
      JOIN quiz_attempts qa ON q.id = qa.quiz_id AND qa.user_id = $1
      GROUP BY c.id, c.title
    `, [userId]);
    
    let radarData = radarRes.rows.map(r => ({ subject: r.subject, accuracy: Math.round(parseFloat(r.accuracy)) }));
    if (radarData.length === 0) {
       radarData = [{subject: 'General', accuracy: 0}];
    }

    // 4. Activity Timeline
    const activityRes = await pool.query(`
      (SELECT 'Completed ' || m.title as action, up.completed_at as date, 'material' as type
       FROM user_progress up JOIN materials m ON up.material_id = m.id WHERE up.user_id = $1 AND up.status = 'completed')
      UNION ALL
      (SELECT 'Scored ' || qa.score || '/' || qa.total_questions || ' on ' || q.title, qa.completed_at as date, 'quiz' as type
       FROM quiz_attempts qa JOIN quizzes q ON qa.quiz_id = q.id WHERE qa.user_id = $1)
      ORDER BY date DESC
      LIMIT 10
    `, [userId]);

    // 5. Badges Calculation / Progress Tracking
    const badgesRes = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM quiz_attempts WHERE user_id = $1) as initiator_count,
        (SELECT COUNT(*) FROM quiz_attempts WHERE user_id = $1 AND score = total_questions AND total_questions > 0) as flawless_count,
        (SELECT COUNT(*) FROM user_progress WHERE user_id = $1 AND status = 'completed') as marathon_count,
        (
          (SELECT COUNT(*) FROM quiz_attempts WHERE user_id = $1 AND EXTRACT(ISODOW FROM completed_at) IN (6, 7)) +
          (SELECT COUNT(*) FROM user_progress WHERE user_id = $1 AND status = 'completed' AND EXTRACT(ISODOW FROM completed_at) IN (6, 7))
        ) as weekend_count,
        (
          (SELECT COUNT(*) FROM quiz_attempts WHERE user_id = $1 AND EXTRACT(HOUR FROM completed_at) BETWEEN 0 AND 4) +
          (SELECT COUNT(*) FROM user_progress WHERE user_id = $1 AND status = 'completed' AND EXTRACT(HOUR FROM completed_at) BETWEEN 0 AND 4)
        ) as nightowl_count
    `, [userId]);

    const materialsCompleted = parseInt(statsRes.rows[0].materials_completed || '0');
    const totalMaterials = parseInt(statsRes.rows[0].total_materials || '1');
    const overallProgress = Math.round((materialsCompleted / Math.max(totalMaterials, 1)) * 100);

    const badges = {
      initiator: { current: Math.min(parseInt(badgesRes.rows[0].initiator_count || 0), 1), max: 1 },
      flawless: { current: Math.min(parseInt(badgesRes.rows[0].flawless_count || 0), 1), max: 1 },
      consistent: { current: Math.min(user.current_streak, 3), max: 3 },
      marathon: { current: Math.min(parseInt(badgesRes.rows[0].marathon_count || 0), 5), max: 5 },
      weekend: { current: Math.min(parseInt(badgesRes.rows[0].weekend_count || 0), 1), max: 1 },
      nightowl: { current: Math.min(parseInt(badgesRes.rows[0].nightowl_count || 0), 1), max: 1 },
      centurion: { current: Math.min(parseInt(statsRes.rows[0].questions_solved || 0), 100), max: 100 },
      examready: { current: Math.min(overallProgress, 85), max: 85, isPercentage: true },
    };

    // Calculate boolean 'isUnlocked' dynamically
    for (const key in badges) {
       badges[key].isUnlocked = badges[key].current >= badges[key].max;
    }

    // 6. Activity Heatmap (Last 90 Days)
    const heatmapRes = await pool.query(`
      SELECT DATE(date) as date, count(*) as count
      FROM (
        SELECT completed_at as date FROM user_progress WHERE user_id = $1
        UNION ALL
        SELECT completed_at as date FROM quiz_attempts WHERE user_id = $1
      ) combined
      WHERE date >= NOW() - INTERVAL '365 days'
      GROUP BY DATE(date)
      ORDER BY date ASC
    `, [userId]);

    res.json({
      user,
      stats: {
        materials_completed: parseInt(statsRes.rows[0].materials_completed || '0'),
        questions_solved: parseInt(statsRes.rows[0].questions_solved || '0'),
        avg_accuracy: statsRes.rows[0].avg_accuracy ? Math.round(parseFloat(statsRes.rows[0].avg_accuracy)) : 0,
        courses_active: parseInt(statsRes.rows[0].courses_active || '0')
      },
      radarData,
      timeline: activityRes.rows,
      heatmap: heatmapRes.rows,
      badges
    });
  } catch (err) {
    console.error('Error fetching profile stats', err);
    res.status(500).json({ message: 'Server error' });
  }
};
