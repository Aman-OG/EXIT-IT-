require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('./src/config/db');

async function seedExams() {
  const client = await pool.connect();
  try {
    console.log('🚀 Starting Ultra-Fast 2015 & 2016 Official Exam Migration...');

    // 1. Copy JSON file to server/src/data/ directory for easy persistent access
    const sourcePath = path.join(__dirname, '..', 'course-material', 'information_technology_2015_2016_simple.json');
    const targetDir = path.join(__dirname, 'src', 'data');
    const targetPath = path.join(targetDir, 'information_technology_2015_2016_simple.json');

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`📁 Copied JSON dataset to ${targetPath}`);
    } else if (!fs.existsSync(targetPath)) {
      throw new Error(`Cannot find dataset JSON at ${sourcePath} or ${targetPath}`);
    }

    // Read and parse JSON data
    const rawData = fs.readFileSync(targetPath, 'utf8');
    const examData = JSON.parse(rawData);

    await client.query('BEGIN');

    // 2. Clear old official exams (questions, options, reports)
    console.log('🗑️ Cleaning up existing official exams from database...');

    const oldQuizzesRes = await client.query(`
      SELECT id FROM quizzes WHERE is_official = TRUE OR COALESCE(quiz_type, 'exam') = 'exam'
    `);
    const oldQuizIds = oldQuizzesRes.rows.map(r => r.id);

    if (oldQuizIds.length > 0) {
      await client.query(`
        DELETE FROM reported_questions 
        WHERE question_id IN (
          SELECT id FROM questions WHERE quiz_id = ANY($1::int[])
        )
      `, [oldQuizIds]);

      await client.query(`
        DELETE FROM quizzes WHERE id = ANY($1::int[])
      `, [oldQuizIds]);
      console.log(`✅ Deleted ${oldQuizIds.length} old official quiz records and associated questions.`);
    }

    // 3. Define the 4 exam categories & titles as requested
    const examMapping = [
      { key: '2015_exit_model_exam', title: '2015 Model Exam' },
      { key: '2015_official_exam', title: '2015 Exit Exam' },
      { key: '2016_exit_model_exam', title: '2016 Model Exam' },
      { key: '2016_official_exam', title: '2016 Exit Exam' }
    ];

    let totalQuestionsInserted = 0;
    let totalOptionsInserted = 0;

    const courseRes = await client.query('SELECT id FROM courses LIMIT 1');
    const courseId = courseRes.rows.length > 0 ? courseRes.rows[0].id : null;

    for (const item of examMapping) {
      const questionsList = examData[item.key] || [];
      console.log(`⏳ Importing "${item.title}" (${questionsList.length} questions)...`);

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
        `Official 100-question exit examination for ${item.title}.`
      ]);

      const quizId = quizRes.rows[0].id;

      if (questionsList.length > 0) {
        // Bulk insert all questions for this quiz
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

        // Bulk insert all options for all questions in this quiz
        const optPlaceholders = [];
        const optParams = [];
        let optParamIdx = 1;

        for (let i = 0; i < questionsList.length; i++) {
          const qObj = questionsList[i];
          const questionId = insertedQuestionIds[i];
          const options = qObj.options || [];
          const correctIndex = qObj.correctAnswer;

          for (let optIdx = 0; optIdx < options.length; optIdx++) {
            optPlaceholders.push(`($${optParamIdx}, $${optParamIdx+1}, $${optParamIdx+2})`);
            optParams.push(questionId, options[optIdx].trim(), optIdx === correctIndex);
            optParamIdx += 3;
            totalOptionsInserted++;
          }
        }

        if (optPlaceholders.length > 0) {
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
    console.log(`\n🎉 Success! Inserted 4 exams, ${totalQuestionsInserted} questions, and ${totalOptionsInserted} options.`);
    process.exit(0);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error during seeding:', err);
    process.exit(1);
  } finally {
    client.release();
  }
}

seedExams();
