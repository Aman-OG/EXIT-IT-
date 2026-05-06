require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER || 'exitit_user',
    password: process.env.DB_PASSWORD || 'password123',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'exitit_db',
});

pool.query('SELECT qz.title, count(q.id) as question_count FROM quizzes qz LEFT JOIN questions q ON qz.id = q.quiz_id WHERE qz.is_official = TRUE GROUP BY qz.title')
    .then(res => {
        console.log("Results:");
        console.table(res.rows);
        pool.end();
    })
    .catch(err => {
        console.error(err);
        pool.end();
    });
