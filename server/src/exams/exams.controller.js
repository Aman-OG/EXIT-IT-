const pool = require('../config/db');

exports.getOfficialList = async (req, res) => {
  try {
    const query = `
      SELECT id, title 
      FROM quizzes 
      WHERE is_official = TRUE 
      ORDER BY title ASC
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching official list:', err);
    res.status(500).json({ message: 'Server error fetching formal exams list' });
  }
};

exports.startExam = async (req, res) => {
  try {
    const { quizId } = req.query;
    
    // We expect a specific Official Quiz ID. If none is given, we must error out.
    if (!quizId) {
      return res.status(400).json({ message: 'quizId query parameter is required' });
    }

    // Fetch the 100 fixed questions for this quiz, shuffled randomly
    const query = `
      SELECT q.id, q.question_text, q.question_type, q.quiz_id,
        COALESCE(
          json_agg(
            json_build_object('id', o.id, 'option_text', o.option_text)
          ) FILTER (WHERE o.id IS NOT NULL), '[]'
        ) as options
      FROM questions q
      LEFT JOIN options o ON q.id = o.question_id
      WHERE q.quiz_id = $1
      GROUP BY q.id
      ORDER BY RANDOM()
    `;
    const result = await pool.query(query, [quizId]);
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error starting exam:', err);
    res.status(500).json({ message: 'Server error starting exam' });
  }
};

exports.submitExam = async (req, res) => {
  const { answers, timeSpentSeconds, totalQuestions } = req.body;
  const userId = req.user.id;

  try {
    let score = 0;
    const answers_map = {};

    const questionIds = Object.keys(answers).length > 0 ? Object.keys(answers) : [0];
    
    // Fetch correct options for all questions given
    const correctOptionsRes = await pool.query(
      'SELECT question_id, id FROM options WHERE is_correct = TRUE AND question_id = ANY($1::int[])',
      [questionIds]
    );

    const correctMap = {};
    correctOptionsRes.rows.forEach(r => {
      correctMap[r.question_id] = r.id;
    });

    for (const [questionId, optionId] of Object.entries(answers)) {
      const isCorrect = correctMap[questionId] == optionId;
      if (isCorrect) score++;

      answers_map[questionId] = {
        selectedOptionId: optionId,
        correctOptionId: correctMap[questionId] || null,
        isCorrect: isCorrect
      };
    }

    const tq = totalQuestions || 0;

    // Insert exam attempt
    await pool.query(
      'INSERT INTO exam_attempts (user_id, score, total_questions, time_spent_seconds) VALUES ($1, $2, $3, $4)',
      [userId, score, tq, timeSpentSeconds]
    );

    // Update total score in users table
    await pool.query(
      'UPDATE users SET total_score = total_score + $1 WHERE id = $2',
      [score, userId]
    );

    const percentage = tq > 0 ? Math.round((score / tq) * 100) : 0;
    res.json({ score, totalQuestions: tq, percentage, answers_map });
  } catch (err) {
    console.error('Error submitting exam:', err);
    res.status(500).json({ message: 'Server error submitting exam' });
  }
};

exports.reportQuestion = async (req, res) => {
  const { questionId, reason } = req.body;
  try {
    await pool.query(
      'INSERT INTO reported_questions (question_id, reason, user_id) VALUES ($1, $2, $3)',
      [questionId, reason, req.user.id]
    );
    res.json({ message: 'Question reported successfully' });
  } catch(e) {
    console.error('Error reporting question:', e);
    res.status(500).json({message: 'Failed to report question'});
  }
};

exports.getReportedQuestions = async (req, res) => {
  try {
    const q = `
      SELECT r.id, r.reason, r.status, r.created_at, q.question_text, q.id as question_id, u.email as user_email
      FROM reported_questions r
      JOIN questions q ON r.question_id = q.id
      JOIN users u ON r.user_id = u.id
      ORDER BY r.created_at DESC
    `;
    const resDb = await pool.query(q);
    res.json(resDb.rows);
  } catch(e) {
    console.error('Error fetching reports:', e);
    res.status(500).json({message: 'Failed to fetch reports'});
  }
};

exports.resolveReport = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('UPDATE reported_questions SET status = $1 WHERE id = $2', ['resolved', id]);
    res.json({ message: 'Report resolved' });
  } catch(e) {
    console.error('Error resolving report:', e);
    res.status(500).json({message: 'Failed to resolve report'});
  }
};
