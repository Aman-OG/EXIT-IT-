require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

async function setupExams() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        console.log('Fetching all official questions...');
        const qRes = await client.query(`
            SELECT q.id 
            FROM questions q
            JOIN quizzes qz ON q.quiz_id = qz.id
            WHERE qz.is_official = TRUE
        `);
        
        let allQuestionIds = qRes.rows.map(r => r.id);
        console.log(`Found ${allQuestionIds.length} official questions.`);

        if (allQuestionIds.length < 800) {
            console.error('Error: Not enough questions to form 8 exams! You need at least 800.', allQuestionIds.length);
            process.exit(1);
        }

        // Shuffle all questions
        allQuestionIds = shuffleArray(allQuestionIds);

        // We will take exactly 800 questions and create 8 quizzes
        const examsToCreate = 8;
        const questionsPerExam = 100;
        
        // Let's get a random course to attach these quizzes to, just in case (course_id might be NOT NULL depending on schema)
        const courseRes = await client.query('SELECT id FROM courses LIMIT 1');
        const courseId = courseRes.rows.length ? courseRes.rows[0].id : null;

        let usedQuestionIds = [];

        for (let i = 1; i <= examsToCreate; i++) {
            const title = `Official Exam ${i}`;
            console.log(`Creating ${title}...`);
            
            // Delete if somehow exists to avoid duplicates
            await client.query('DELETE FROM quizzes WHERE title = $1', [title]);

            // Insert new quiz
            const insertQuiz = await client.query(
                'INSERT INTO quizzes (title, is_official, course_id) VALUES ($1, $2, $3) RETURNING id',
                [title, true, courseId]
            );
            const newQuizId = insertQuiz.rows[0].id;

            // Get the 100 questions for this exam
            const startIndex = (i - 1) * questionsPerExam;
            const endIndex = startIndex + questionsPerExam;
            const subset = allQuestionIds.slice(startIndex, endIndex);

            // Update the quiz_id of these questions to our new official quiz
            await client.query(
                `UPDATE questions SET quiz_id = $1 WHERE id = ANY($2::int[])`,
                [newQuizId, subset]
            );

            usedQuestionIds = [...usedQuestionIds, ...subset];
        }

        // Determine leftovers
        const leftOvers = allQuestionIds.filter(id => !usedQuestionIds.includes(id));
        console.log(`There are ${leftOvers.length} unused questions. Deleting them to maintain clean set...`);
        if (leftOvers.length > 0) {
            await client.query('DELETE FROM questions WHERE id = ANY($1::int[])', [leftOvers]);
        }

        // Now, delete all quizzes that are official but are NOT one of our new 'Official Exam %'
        console.log('Cleaning up old official quizzes (exit_exam1, etc.)...');
        await client.query(`
            DELETE FROM quizzes 
            WHERE is_official = TRUE AND title NOT LIKE 'Official Exam %'
        `);

        await client.query('COMMIT');
        console.log('Successfully completed 8 permanent exams setup!');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error during setup:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

setupExams();
