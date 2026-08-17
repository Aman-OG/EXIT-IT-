require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('./src/config/db');

// Course mapping configuration
const COURSE_MAPPINGS = [
  {
    jsonName: 'Advanced Database',
    dbCode: 'ADS308',
    defaultTitle: 'Advanced Database Systems',
    description: 'Query optimization, transactions, distributed databases, and NoSQL'
  },
  {
    jsonName: 'Advanced Programming',
    dbCode: 'AP306',
    defaultTitle: 'Advanced Programming',
    description: 'Advanced data structures, algorithms, and software design principles'
  },
  {
    jsonName: 'Computer Maintenance and Technical Support',
    dbCode: 'CMTS301',
    defaultTitle: 'Computer Maintenance and Technical Support',
    description: 'Hardware troubleshooting, system assembly, and technical support fundamentals'
  },
  {
    jsonName: 'Event Driven Programming',
    dbCode: 'EDP304',
    defaultTitle: 'Event-Driven Programming',
    description: 'GUI development, event handling, and interactive application design'
  },
  {
    jsonName: 'IT Project Management',
    dbCode: 'ITPM303',
    defaultTitle: 'IT Project Management',
    description: 'Project lifecycle, Agile and Waterfall methodologies, risk management'
  },
  {
    jsonName: 'Mobile Application Development',
    dbCode: 'MAD311',
    defaultTitle: 'Mobile Application Development',
    description: 'Native and cross-platform mobile app development for Android and iOS'
  },
  {
    jsonName: 'Network Device and Configuration',
    dbCode: 'NDC314',
    defaultTitle: 'Network Devices and Configuration',
    description: 'Router and switch configuration, VLANs, subnetting, and network design'
  },
  {
    jsonName: 'System Analysis and Design',
    dbCode: 'SAD305',
    defaultTitle: 'System Analysis and Design',
    description: 'Requirements gathering, system modeling, UML diagrams, and design methodologies'
  },
  {
    jsonName: 'Information Assurance and Security',
    dbCode: 'IAS315',
    defaultTitle: 'Information Assurance and Security',
    description: 'Information security principles, cryptography, network security, and risk management'
  },
  {
    jsonName: 'Internet Programming II',
    dbCode: 'IP2310',
    defaultTitle: 'Internet Programming II',
    description: 'Server-side development, APIs, frameworks, and full-stack integration'
  }
];

function resolveCorrectIndices(correctAnswer) {
  if (Array.isArray(correctAnswer)) {
    return correctAnswer;
  }
  if (typeof correctAnswer === 'number') {
    return [correctAnswer];
  }
  if (typeof correctAnswer === 'string') {
    return correctAnswer.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
  }
  return [];
}

async function seedCourseQuizzes() {
  const client = await pool.connect();

  try {
    console.log('🚀 Starting Course Quizzes Seeding (15 questions per quiz)...');

    // 1. Read quiz.json
    const jsonPath = path.join(__dirname, '../course-material/quiz.json');
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const parsedData = JSON.parse(rawData);
    const coursesList = parsedData['2015_official_exam'] || parsedData['quiz-exam'] || [];

    if (coursesList.length === 0) {
      throw new Error('No courses found in quiz.json');
    }

    console.log(`📖 Loaded ${coursesList.length} courses from quiz.json`);

    await client.query('BEGIN');

    // Fix potential typos in course titles
    await client.query(`
      UPDATE courses 
      SET title = 'System Analysis and Design' 
      WHERE code = 'SAD305' AND title = 'System Analaysis and Design';
    `);

    let totalQuizzesInserted = 0;
    let totalQuestionsInserted = 0;
    let totalOptionsInserted = 0;

    for (const mapping of COURSE_MAPPINGS) {
      // Find course in JSON
      const jsonCourse = coursesList.find(c =>
        c.course.trim().toLowerCase() === mapping.jsonName.toLowerCase() ||
        c.course.trim().toLowerCase().includes(mapping.jsonName.toLowerCase()) ||
        mapping.jsonName.toLowerCase().includes(c.course.trim().toLowerCase())
      );

      if (!jsonCourse || !jsonCourse.questions || jsonCourse.questions.length === 0) {
        console.warn(`⚠️ Warning: No questions found in quiz.json for course "${mapping.jsonName}"`);
        continue;
      }

      // Ensure course exists in DB
      let courseRes = await client.query('SELECT id, title, code FROM courses WHERE code = $1', [mapping.dbCode]);
      let courseId;
      let courseTitle;

      if (courseRes.rows.length === 0) {
        // Insert course
        const insertRes = await client.query(
          `INSERT INTO courses (title, code, description) 
           VALUES ($1, $2, $3) 
           RETURNING id, title, code`,
          [mapping.defaultTitle, mapping.dbCode, mapping.description]
        );
        courseId = insertRes.rows[0].id;
        courseTitle = insertRes.rows[0].title;
        console.log(`➕ Created missing course: "${courseTitle}" (${mapping.dbCode}) [ID: ${courseId}]`);
      } else {
        courseId = courseRes.rows[0].id;
        courseTitle = courseRes.rows[0].title;
      }

      console.log(`\n📚 Processing "${courseTitle}" (DB ID: ${courseId}) - Total Questions: ${jsonCourse.questions.length}`);

      // Delete any previous practice quizzes for this course if they match the naming pattern
      // To avoid duplicate seeding on re-runs while preserving mock/exit exams (quiz_type = 'exam')
      await client.query(`
        DELETE FROM quizzes 
        WHERE course_id = $1 
        AND COALESCE(quiz_type, 'quiz') = 'quiz' 
        AND is_official = TRUE
        AND title LIKE $2
      `, [courseId, `${courseTitle} - Quiz %`]);

      const questions = jsonCourse.questions;
      const CHUNK_SIZE = 15;
      const totalQuizzes = Math.ceil(questions.length / CHUNK_SIZE);

      for (let i = 0; i < totalQuizzes; i++) {
        const startIdx = i * CHUNK_SIZE;
        const endIdx = Math.min((i + 1) * CHUNK_SIZE, questions.length);
        const quizQuestions = questions.slice(startIdx, endIdx);
        const quizNumber = i + 1;
        const quizDesc = `Practice Quiz ${quizNumber} (${quizQuestions.length} Questions)`;

        // Insert Quiz
        const quizInsertRes = await client.query(
          `INSERT INTO quizzes (course_id, title, description, is_official, quiz_type, difficulty, created_at)
           VALUES ($1, $2, $3, TRUE, 'quiz', 'Medium', CURRENT_TIMESTAMP)
           RETURNING id`,
          [courseId, quizTitle, quizDesc]
        );
        const quizId = quizInsertRes.rows[0].id;
        totalQuizzesInserted++;

        // Insert Questions for this Quiz
        for (let qIdx = 0; qIdx < quizQuestions.length; qIdx++) {
          const q = quizQuestions[qIdx];
          const questionText = q.question.trim();
          const explanation = q.explanation ? q.explanation.trim() : null;

          const questionInsertRes = await client.query(
            `INSERT INTO questions (quiz_id, question_text, question_type, explanation, created_at)
             VALUES ($1, $2, 'mcq', $3, CURRENT_TIMESTAMP)
             RETURNING id`,
            [quizId, questionText, explanation]
          );
          const questionId = questionInsertRes.rows[0].id;
          totalQuestionsInserted++;

          // Insert Options
          const correctIndices = resolveCorrectIndices(q.correctAnswer);
          for (let optIdx = 0; optIdx < q.options.length; optIdx++) {
            const optText = q.options[optIdx].trim();
            const isCorrect = correctIndices.includes(optIdx);

            await client.query(
              `INSERT INTO options (question_id, option_text, is_correct, created_at)
               VALUES ($1, $2, $3, CURRENT_TIMESTAMP)`,
              [questionId, optText, isCorrect]
            );
            totalOptionsInserted++;
          }
        }

        console.log(`  ✅ Inserted ${quizTitle}: ${quizQuestions.length} questions (Quiz ID: ${quizId})`);
      }
    }

    await client.query('COMMIT');

    console.log('\n🎉 ================================================');
    console.log('✅ COURSE QUIZZES SEEDING COMPLETED SUCCESSFULLY!');
    console.log(`📊 Summary:`);
    console.log(`   - Total Quizzes Created: ${totalQuizzesInserted}`);
    console.log(`   - Total Questions Inserted: ${totalQuestionsInserted}`);
    console.log(`   - Total Options Inserted: ${totalOptionsInserted}`);
    console.log('================================================\n');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seedCourseQuizzes()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
