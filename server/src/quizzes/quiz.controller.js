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
        WHERE q.course_id = $1 AND COALESCE(q.quiz_type, 'quiz') != 'exam'
        GROUP BY q.id
        ORDER BY q.is_official DESC, q.created_at DESC
      `, [courseId]);
    } else {
      result = await pool.query(`
        SELECT q.id, q.title, q.description, q.is_official, q.user_id, q.difficulty, q.created_at,
               MAX(qa.score) as best_score, MAX(qa.total_questions) as total_questions
        FROM quizzes q
        LEFT JOIN quiz_attempts qa ON q.id = qa.quiz_id AND qa.user_id = $2
        WHERE q.course_id = $1 AND COALESCE(q.quiz_type, 'quiz') != 'exam'
        AND (q.is_official = TRUE OR q.user_id = $2)
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
    let result;
    if (isAdmin) {
      // Admins see everything except exam-type quizzes (those are in Exam Mode)
      result = await pool.query(`
        SELECT q.id, q.title, q.description, q.is_official, q.user_id, q.created_at, c.title as course_title, c.code as course_code,
               MAX(qa.score) as best_score, MAX(qa.total_questions) as total_questions
        FROM quizzes q
        JOIN courses c ON q.course_id = c.id
        LEFT JOIN quiz_attempts qa ON q.id = qa.quiz_id AND qa.user_id = $1
        WHERE COALESCE(q.quiz_type, 'quiz') != 'exam'
        GROUP BY q.id, c.title, c.code
        ORDER BY c.title ASC, q.is_official DESC, q.created_at DESC
      `, [userId]);
    } else {
      // Regular users see: all official quizzes (admin-created, type=quiz) + their own private quizzes
      result = await pool.query(`
        SELECT q.id, q.title, q.description, q.is_official, q.user_id, q.created_at, c.title as course_title, c.code as course_code,
               MAX(qa.score) as best_score, MAX(qa.total_questions) as total_questions
        FROM quizzes q
        JOIN courses c ON q.course_id = c.id
        LEFT JOIN quiz_attempts qa ON q.id = qa.quiz_id AND qa.user_id = $1
        WHERE COALESCE(q.quiz_type, 'quiz') != 'exam'
        AND (q.is_official = TRUE OR q.user_id = $1)
        GROUP BY q.id, c.title, c.code
        ORDER BY c.title ASC, q.is_official DESC, q.created_at DESC
      `, [userId]);
    }
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
    const answers_map = {};

    // Get all correct options at once
    const questionIds = questionsRes.rows.map(q => q.id);
    const correctOptionsRes = await pool.query(
      'SELECT question_id, id FROM options WHERE is_correct = TRUE AND question_id = ANY($1::int[])',
      [questionIds]
    );
    const correctMap = {};
    correctOptionsRes.rows.forEach(r => { correctMap[r.question_id] = r.id; });

    for (const q of questionsRes.rows) {
      const correctOptionId = correctMap[q.id];
      const selectedOptionId = answers[q.id];
      const isCorrect = selectedOptionId == correctOptionId;
      if (isCorrect) score++;
      answers_map[q.id] = {
        selectedOptionId: selectedOptionId || null,
        correctOptionId: correctOptionId || null,
        isCorrect
      };
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

    res.json({ score, totalQuestions, answers_map });
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
    // Admin quizzes created via QuizManager are type 'quiz', not 'exam'
    const quizType = 'quiz';

    const result = await pool.query(
      'INSERT INTO quizzes (course_id, title, description, is_official, user_id, quiz_type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [course_id, title, description, officialFlag, ownerId, quizType]
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

exports.importQuestionsFromCSV = async (req, res) => {
  const { quizId } = req.params;
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  try {
    const { parse } = require('csv-parse/sync');
    const records = parse(req.file.buffer.toString('utf-8'), {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    // Expected columns: question_text, option_a, option_b, option_c, option_d, correct_option, explanation
    // correct_option should be: a, b, c, or d (case-insensitive)

    const errors = [];
    let imported = 0;

    for (let i = 0; i < records.length; i++) {
      const row = records[i];
      const rowNum = i + 2; // 1-indexed + header row

      const questionText = row.question_text?.trim();
      const optA = row.option_a?.trim();
      const optB = row.option_b?.trim();
      const optC = row.option_c?.trim();
      const optD = row.option_d?.trim();
      const correctLetter = row.correct_option?.trim().toLowerCase();
      const explanation = row.explanation?.trim() || null;

      if (!questionText) { errors.push(`Row ${rowNum}: missing question_text`); continue; }
      if (!optA || !optB || !optC || !optD) { errors.push(`Row ${rowNum}: all 4 options required`); continue; }
      if (!['a','b','c','d'].includes(correctLetter)) { errors.push(`Row ${rowNum}: correct_option must be a, b, c, or d`); continue; }

      const options = [
        { text: optA, is_correct: correctLetter === 'a' },
        { text: optB, is_correct: correctLetter === 'b' },
        { text: optC, is_correct: correctLetter === 'c' },
        { text: optD, is_correct: correctLetter === 'd' },
      ];

      const qRes = await pool.query(
        'INSERT INTO questions (quiz_id, question_text, explanation) VALUES ($1, $2, $3) RETURNING id',
        [quizId, questionText, explanation]
      );
      const questionId = qRes.rows[0].id;

      for (const opt of options) {
        await pool.query(
          'INSERT INTO options (question_id, option_text, is_correct) VALUES ($1, $2, $3)',
          [questionId, opt.text, opt.is_correct]
        );
      }
      imported++;
    }

    res.json({ imported, errors, total: records.length });
  } catch (err) {
    console.error('CSV import error:', err);
    res.status(500).json({ message: 'Failed to parse CSV: ' + err.message });
  }
};
