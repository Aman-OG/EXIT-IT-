const pool = require('../config/db');

const getStats = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE role = 'user') as total_users,
        (SELECT COUNT(*) FROM users WHERE role = 'user' AND last_active_date >= CURRENT_DATE - INTERVAL '7 days') as active_users,
        (SELECT COUNT(*) FROM quiz_attempts) as total_quizzes,
        (SELECT COALESCE(ROUND(AVG(score * 100.0 / NULLIF(total_questions, 0))), 0) FROM quiz_attempts) as avg_score
    `);
    const row = result.rows[0];
    res.json({
      totalUsers: parseInt(row.total_users),
      activeUsers: parseInt(row.active_users),
      totalQuizzes: parseInt(row.total_quizzes),
      avgScore: parseInt(row.avg_score)
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

const getCourseAnalytics = async (req, res) => {
  try {
    // Per-course: total materials, avg completion %, total students who started, avg quiz score
    const result = await pool.query(`
      SELECT 
        c.id,
        c.title,
        c.code,
        COUNT(DISTINCT m.id) as total_materials,
        COUNT(DISTINCT up.user_id) as students_started,
        COALESCE(ROUND(AVG(up.percentage)), 0) as avg_completion,
        COALESCE(ROUND(AVG(qa.score * 100.0 / NULLIF(qa.total_questions, 0))), 0) as avg_quiz_score,
        COUNT(DISTINCT q.id) as total_quizzes
      FROM courses c
      LEFT JOIN materials m ON m.course_id = c.id
      LEFT JOIN user_progress up ON up.material_id = m.id
      LEFT JOIN quizzes q ON q.course_id = c.id AND COALESCE(q.quiz_type, 'quiz') != 'exam'
      LEFT JOIN quiz_attempts qa ON qa.quiz_id = q.id
      GROUP BY c.id, c.title, c.code
      ORDER BY c.title ASC
    `);
    res.json(result.rows);
  } catch(e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to retrieve course analytics' });
  }
};

const getCourseDetail = async (req, res) => {
  const { courseId } = req.params;
  try {
    // Per-material completion rates
    const materialsRes = await pool.query(`
      SELECT 
        m.id,
        m.title,
        COUNT(DISTINCT up.user_id) as students_completed,
        COALESCE(ROUND(AVG(up.percentage)), 0) as avg_progress,
        (SELECT COUNT(*) FROM users WHERE role = 'user') as total_students
      FROM materials m
      LEFT JOIN user_progress up ON up.material_id = m.id
      WHERE m.course_id = $1
      GROUP BY m.id, m.title
      ORDER BY m.sort_order ASC, m.created_at ASC
    `, [courseId]);

    // Top 5 hardest questions (highest wrong answer rate)
    const hardestRes = await pool.query(`
      SELECT 
        q.id,
        q.question_text,
        COUNT(DISTINCT qa_detail.attempt_id) as total_attempts,
        SUM(CASE WHEN qa_detail.is_correct = false THEN 1 ELSE 0 END) as wrong_count,
        ROUND(100.0 * SUM(CASE WHEN qa_detail.is_correct = false THEN 1 ELSE 0 END) / NULLIF(COUNT(DISTINCT qa_detail.attempt_id), 0), 1) as error_rate
      FROM questions q
      JOIN quizzes qz ON q.quiz_id = qz.id
      JOIN (
        SELECT 
          qa.id as attempt_id,
          ques.id as question_id,
          (qa.answers_json IS NOT NULL) as has_answers
        FROM quiz_attempts qa
        JOIN questions ques ON ques.quiz_id = qa.quiz_id
        WHERE qa.answers_json IS NOT NULL
      ) qa_detail ON qa_detail.question_id = q.id
      WHERE qz.course_id = $1
      GROUP BY q.id, q.question_text
      HAVING COUNT(DISTINCT qa_detail.attempt_id) > 0
      ORDER BY error_rate DESC NULLS LAST
      LIMIT 5
    `, [courseId]);

    // Per-quiz avg scores
    const quizzesRes = await pool.query(`
      SELECT 
        q.id,
        q.title,
        COUNT(qa.id) as attempt_count,
        COALESCE(ROUND(AVG(qa.score * 100.0 / NULLIF(qa.total_questions, 0))), 0) as avg_score
      FROM quizzes q
      LEFT JOIN quiz_attempts qa ON qa.quiz_id = q.id
      WHERE q.course_id = $1 AND COALESCE(q.quiz_type, 'quiz') != 'exam'
      GROUP BY q.id, q.title
      ORDER BY avg_score ASC
    `, [courseId]);

    res.json({
      materials: materialsRes.rows,
      hardestQuestions: hardestRes.rows,
      quizzes: quizzesRes.rows
    });
  } catch(e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to retrieve course detail analytics' });
  }
};

module.exports = { getStats, getUsers, getCourseAnalytics, getCourseDetail };
