require('dotenv').config();
const pool = require('./src/config/db');

async function check() {
  const res = await pool.query(`
    SELECT c.id, c.code, c.title, 
           COUNT(DISTINCT q.id) as practice_quizzes, 
           COUNT(DISTINCT qu.id) as total_questions
    FROM courses c
    LEFT JOIN quizzes q ON q.course_id = c.id AND COALESCE(q.quiz_type, 'quiz') = 'quiz' AND q.is_official = TRUE
    LEFT JOIN questions qu ON qu.quiz_id = q.id
    GROUP BY c.id, c.code, c.title
    ORDER BY c.id ASC
  `);
  console.table(res.rows);
  await pool.end();
}
check();
