const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const fs = require('fs');
const pool = require('./src/config/db');

async function seed2017ExitExams() {
  const client = await pool.connect();
  try {
    console.log('🚀 Starting 2017 Official Exit Exams Seeding...');

    const sourcePath = path.join(__dirname, '..', 'course-material', 'information_technology_2017_exit_exams.json');
    const targetDir = path.join(__dirname, 'src', 'data');
    const targetPath = path.join(targetDir, 'information_technology_2017_exit_exams.json');

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`📁 Copied JSON dataset to ${targetPath}`);
    } else if (!fs.existsSync(targetPath)) {
      throw new Error(`Cannot find dataset JSON at ${sourcePath} or ${targetPath}`);
    }

    const rawData = fs.readFileSync(targetPath, 'utf8');
    const examData = JSON.parse(rawData);

    await client.query('BEGIN');

    const examMapping = [
      { key: '2017_tir_exit_exam', title: '2017 Tir Exit Exam' },
      { key: '2017_sene_exit_exam', title: '2017 Sene Exit Exam' }
    ];

    let totalQuestionsInserted = 0;
    let totalOptionsInserted = 0;

    const courseRes = await client.query('SELECT id FROM courses LIMIT 1');
    const courseId = courseRes.rows.length > 0 ? courseRes.rows[0].id : null;

    for (const item of examMapping) {
      const questionsList = examData[item.key] || [];
      console.log(`⏳ Importing "${item.title}" (${questionsList.length} questions)...`);

      // Clean up existing quiz with this title if present
      const existingQuizRes = await client.query(
        "SELECT id FROM quizzes WHERE title = $1", [item.title]
      );
      if (existingQuizRes.rows.length > 0) {
        const qId = existingQuizRes.rows[0].id;
        await client.query(`
          DELETE FROM reported_questions 
          WHERE question_id IN (SELECT id FROM questions WHERE quiz_id = $1)
        `, [qId]);
        await client.query('DELETE FROM questions WHERE quiz_id = $1', [qId]);
        await client.query('DELETE FROM quizzes WHERE id = $1', [qId]);
      }

      // Insert Quiz entry
      const quizRes = await client.query(`
        INSERT INTO quizzes (title, is_official, quiz_type, course_id, description)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
      `, [
        item.title,
        true,
        'exam',
        courseId,
        `Official exit examination for ${item.title} (${questionsList.length} questions).`
      ]);

      const quizId = quizRes.rows[0].id;

      if (questionsList.length > 0) {
        // Bulk insert questions
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
        const qResult = await client.query(insertQQuery, qParams);
        const insertedQuestionIds = qResult.rows.map(r => r.id);
        totalQuestionsInserted += insertedQuestionIds.length;

        // Bulk insert options
        const allOptions = [];
        for (let i = 0; i < questionsList.length; i++) {
          const qObj = questionsList[i];
          const questionId = insertedQuestionIds[i];
          const options = qObj.options || [];
          const correctIndex = qObj.correctAnswer;

          for (let optIdx = 0; optIdx < options.length; optIdx++) {
            allOptions.push({
              question_id: questionId,
              option_text: String(options[optIdx]).trim(),
              is_correct: optIdx === correctIndex
            });
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
            totalOptionsInserted++;
          }

          const insertOptQuery = `
            INSERT INTO options (question_id, option_text, is_correct)
            VALUES ${optPlaceholders.join(', ')}
          `;
          await client.query(insertOptQuery, optParams);
        }
      }

      console.log(`  ✓ Inserted ${questionsList.length} questions for ${item.title}`);
    }

    await client.query('COMMIT');
    console.log(`\n🎉 Success! Seeded 2017 Exit Exams: ${totalQuestionsInserted} questions and ${totalOptionsInserted} options.`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error during 2017 exit exams seeding:', err);
  } finally {
    client.release();
    process.exit(0);
  }
}

seed2017ExitExams();
