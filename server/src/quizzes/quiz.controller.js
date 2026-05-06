const pool = require('../config/db');

// --- Student Controllers ---

exports.getQuizzesByCourse = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;
  const isAdmin = req.user.role === 'admin';

  try {
    let result;
    if (isAdmin) {
      result = await pool.query(`
        SELECT q.id, q.title, q.description, q.is_official, q.user_id, q.difficulty, q.created_at,
               MAX(qa.score) as best_score, MAX(qa.total_questions) as total_questions
        FROM quizzes q
        LEFT JOIN quiz_attempts qa ON q.id = qa.quiz_id
        WHERE q.course_id = $1
        GROUP BY q.id
        ORDER BY q.is_official DESC, q.created_at DESC
      `, [courseId]);
    } else {
      result = await pool.query(`
        SELECT q.id, q.title, q.description, q.is_official, q.user_id, q.difficulty, q.created_at,
               MAX(qa.score) as best_score, MAX(qa.total_questions) as total_questions
        FROM quizzes q
        LEFT JOIN quiz_attempts qa ON q.id = qa.quiz_id AND qa.user_id = $2
        WHERE q.course_id = $1 AND q.is_official = FALSE AND (q.user_id IS NULL OR q.user_id = $2)
        GROUP BY q.id
        ORDER BY q.created_at DESC
      `, [courseId, userId]);
    }
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching quizzes' });
  }
};

exports.getQuizById = async (req, res) => {
  const { id } = req.params;
  const isAdmin = req.user && req.user.role === 'admin';
  try {
    const quizRes = await pool.query('SELECT * FROM quizzes WHERE id = $1', [id]);
    if (quizRes.rows.length === 0) return res.status(404).json({ message: 'Quiz not found' });

    const questionsRes = await pool.query(
      'SELECT id, question_text, question_type, explanation FROM questions WHERE quiz_id = $1',
      [id]
    );

    const questions = questionsRes.rows;
    for (const q of questions) {
      const optionsRes = await pool.query(
        isAdmin 
          ? 'SELECT id, option_text, is_correct FROM options WHERE question_id = $1'
          : 'SELECT id, option_text FROM options WHERE question_id = $1',
        [q.id]
      );
      q.options = optionsRes.rows;
    }

    res.json({ ...quizRes.rows[0], questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching quiz details' });
  }
};

exports.getAllQuizzes = async (req, res) => {
  const userId = req.user.id;
  const isAdmin = req.user.role === 'admin';
  try {
    const result = await pool.query(`
      SELECT q.id, q.title, q.description, q.is_official, q.user_id, q.created_at, c.title as course_title, c.code as course_code,
             MAX(qa.score) as best_score, MAX(qa.total_questions) as total_questions
      FROM quizzes q
      JOIN courses c ON q.course_id = c.id
      LEFT JOIN quiz_attempts qa ON q.id = qa.quiz_id AND qa.user_id = $1
      WHERE q.is_official = FALSE AND (q.user_id IS NULL OR q.user_id = $1)
      GROUP BY q.id, c.title, c.code
      ORDER BY c.title ASC, q.created_at DESC
    `, [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching all quizzes' });
  }
};

exports.submitQuiz = async (req, res) => {
  const { id } = req.params;
  const { answers } = req.body; // { questionId: optionId }
  const userId = req.user.id;

  try {
    const questionsRes = await pool.query('SELECT id FROM questions WHERE quiz_id = $1', [id]);
    const totalQuestions = questionsRes.rows.length;
    let score = 0;

    for (const q of questionsRes.rows) {
      const correctOptionRes = await pool.query(
        'SELECT id FROM options WHERE question_id = $1 AND is_correct = TRUE',
        [q.id]
      );
      const correctOptionId = correctOptionRes.rows[0]?.id;
      if (answers[q.id] == correctOptionId) {
        score++;
      }
    }

    await pool.query(
      'INSERT INTO quiz_attempts (user_id, quiz_id, score, total_questions) VALUES ($1, $2, $3, $4)',
      [userId, id, score, totalQuestions]
    );

    // Update total score in users table (same as exams)
    if (score > 0) {
      await pool.query(
        'UPDATE users SET total_score = total_score + $1 WHERE id = $2',
        [score, userId]
      );
    }

    res.json({ score, totalQuestions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error submitting quiz' });
  }
};

// --- Admin Controllers ---

exports.createQuiz = async (req, res) => {
  const { course_id, title, description, is_official } = req.body;
  const userId = req.user.id;
  const role = req.user.role;

  try {
    // Only admin can create official quizzes
    const officialFlag = (role === 'admin') ? (is_official !== undefined ? is_official : true) : false;
    const ownerId = officialFlag ? null : userId;

    const result = await pool.query(
      'INSERT INTO quizzes (course_id, title, description, is_official, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [course_id, title, description, officialFlag, ownerId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error creating quiz' });
  }
};

exports.updateQuiz = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  try {
    const result = await pool.query(
      'UPDATE quizzes SET title = $1, description = $2 WHERE id = $3 RETURNING *',
      [title, description, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating quiz' });
  }
};

exports.deleteQuiz = async (req, res) => {
  const { id } = req.params;
  const userId = Number(req.user.id);
  const role = req.user.role;
  
  try {
    const checkRes = await pool.query('SELECT user_id FROM quizzes WHERE id = $1', [id]);
    if (checkRes.rows.length === 0) return res.status(404).json({ message: 'Quiz not found' });
    
    const quizOwner = Number(checkRes.rows[0].user_id);
    console.log(`[deleteQuiz] role=${role} userId=${userId} quizOwner=${quizOwner}`);
    
    if (role !== 'admin' && quizOwner !== userId) {
        return res.status(403).json({ message: 'Forbidden: you do not own this quiz' });
    }

    await pool.query('DELETE FROM quizzes WHERE id = $1', [id]);
    res.json({ message: 'Quiz deleted' });
  } catch (err) {
    console.error('[deleteQuiz] Error:', err);
    res.status(500).json({ message: 'Server error deleting quiz' });
  }
};

exports.addQuestion = async (req, res) => {
  const { quiz_id, question_text, options } = req.body; // options: [{text, is_correct}]
  try {
    const qResult = await pool.query(
      'INSERT INTO questions (quiz_id, question_text) VALUES ($1, $2) RETURNING id',
      [quiz_id, question_text]
    );
    const questionId = qResult.rows[0].id;

    for (const opt of options) {
      await pool.query(
        'INSERT INTO options (question_id, option_text, is_correct) VALUES ($1, $2, $3)',
        [questionId, opt.option_text, opt.is_correct]
      );
    }

    res.status(201).json({ id: questionId, message: 'Question added' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error adding question' });
  }
};

exports.deleteQuestion = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM questions WHERE id = $1', [id]);
    res.json({ message: 'Question deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error deleting question' });
  }
};

exports.getQuestion = async (req, res) => {
  const { id } = req.params;
  try {
    const qRes = await pool.query('SELECT * FROM questions WHERE id = $1', [id]);
    if (qRes.rows.length === 0) return res.status(404).json({ message: 'Question not found' });
    
    const oRes = await pool.query('SELECT id, option_text, is_correct FROM options WHERE question_id = $1 ORDER BY id ASC', [id]);
    res.json({ ...qRes.rows[0], options: oRes.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching question details' });
  }
};

exports.updateQuestion = async (req, res) => {
  const { id } = req.params;
  const { question_text, options } = req.body;
  try {
    await pool.query('BEGIN');
    await pool.query('UPDATE questions SET question_text = $1 WHERE id = $2', [question_text, id]);
    
    if (options && options.length > 0) {
      for (const opt of options) {
        if (opt.id) {
          await pool.query('UPDATE options SET option_text = $1, is_correct = $2 WHERE id = $3', [opt.option_text, opt.is_correct, opt.id]);
        }
      }
    }
    
    await pool.query('COMMIT');
    res.json({ message: 'Question updated successfully' });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ message: 'Server error updating question' });
  }
};

exports.searchQuizzes = async (req, res) => {
  try {
    const { q } = req.query;
    const userId = req.user.id;
    
    if (!q || q.trim().length === 0) {
      return res.json([]);
    }

    const searchTerm = `%${q}%`;
    const result = await pool.query(`
      SELECT q.id, q.title, q.description, q.is_official, c.title as course_title, c.id as course_id
      FROM quizzes q
      JOIN courses c ON q.course_id = c.id
      WHERE (q.title ILIKE $1 OR q.description ILIKE $1) AND q.is_official = FALSE
      ORDER BY q.created_at DESC
      LIMIT 10
    `, [searchTerm]);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error searching quizzes' });
  }
};
