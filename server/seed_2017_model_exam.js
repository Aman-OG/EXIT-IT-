require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('./src/config/db');

async function seed2017ModelExam() {
  const client = await pool.connect();
  try {
    console.log('🚀 Starting Ultra-Fast 2017 Model Exam Seeding...');

    const sourcePath = path.join(__dirname, '..', 'course-material', 'information_technology_2017_model_exam.json');
    const targetDir = path.join(__dirname, 'src', 'data');
    const targetPath = path.join(targetDir, 'information_technology_2017_model_exam.json');

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`📁 Copied JSON dataset to ${targetPath}`);
    }

    const rawData = fs.readFileSync(targetPath, 'utf8');
    const questionsList = JSON.parse(rawData);

    await client.query('BEGIN');

    // Clean up if already exists
    const existingQuizRes = await client.query(
      "SELECT id FROM quizzes WHERE title = '2017 Model Exam'"
    );

    let quizId;
    if (existingQuizRes.rows.length > 0) {
      quizId = existingQuizRes.rows[0].id;
      await client.query(`
        DELETE FROM reported_questions 
        WHERE question_id IN (SELECT id FROM questions WHERE quiz_id = $1)
      `, [quizId]);
      await client.query('DELETE FROM questions WHERE quiz_id = $1', [quizId]);
    } else {
      const courseRes = await client.query('SELECT id FROM courses LIMIT 1');
      const courseId = courseRes.rows.length > 0 ? courseRes.rows[0].id : null;

      const quizRes = await client.query(`
        INSERT INTO quizzes (title, is_official, quiz_type, course_id, description)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
      `, [
        '2017 Model Exam',
        true,
        'exam',
        courseId,
        'Official 100-question exit examination for 2017 Model Exam.'
      ]);
      quizId = quizRes.rows[0].id;
    }

    // 1. Bulk insert questions
    const qPlaceholders = [];
    const qParams = [];
    let pIdx = 1;

    for (const q of questionsList) {
      qPlaceholders.push(`($${pIdx}, $${pIdx+1}, $${pIdx+2}, $${pIdx+3})`);
      qParams.push(quizId, q.question.trim(), 'mcq', q.explanation ? q.explanation.trim() : null);
      pIdx += 4;
    }

    const insertQQuery = `
      INSERT INTO questions (quiz_id, question_text, question_type, explanation)
      VALUES ${qPlaceholders.join(', ')}
      RETURNING id
    `;
    const insertedQuestionsRes = await client.query(insertQQuery, qParams);
    const insertedQuestionIds = insertedQuestionsRes.rows.map(r => r.id);

    // 2. Bulk insert options in chunks
    const allOptions = [];
    for (let i = 0; i < questionsList.length; i++) {
      const q = questionsList[i];
      const qId = insertedQuestionIds[i];

      if (Array.isArray(q.options)) {
        for (let optIdx = 0; optIdx < q.options.length; optIdx++) {
          allOptions.push({
            question_id: qId,
            option_text: String(q.options[optIdx]).trim(),
            is_correct: (optIdx === q.correctAnswer)
          });
        }
      }
    }

    const optChunkSize = 50;
    for (let i = 0; i < allOptions.length; i += optChunkSize) {
      const chunk = allOptions.slice(i, i + optChunkSize);
      const optPlaceholders = [];
      const optParams = [];
      let optPIdx = 1;

      for (const opt of chunk) {
        optPlaceholders.push(`($${optPIdx}, $${optPIdx+1}, $${optPIdx+2})`);
        optParams.push(opt.question_id, opt.option_text, opt.is_correct);
        optPIdx += 3;
      }

      const insertOptQuery = `
        INSERT INTO options (question_id, option_text, is_correct)
        VALUES ${optPlaceholders.join(', ')}
      `;
      await client.query(insertOptQuery, optParams);
    }

    await client.query('COMMIT');
    console.log(`🎉 Successfully seeded 2017 Model Exam (Quiz ID: ${quizId}) with ${questionsList.length} questions and ${allOptions.length} options in bulk!`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error seeding 2017 Model Exam:', err);
  } finally {
    client.release();
    process.exit(0);
  }
}

seed2017ModelExam();
