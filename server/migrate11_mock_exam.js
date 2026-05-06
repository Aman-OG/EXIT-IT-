require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'exitit_user',
  password: process.env.DB_PASSWORD || 'password123',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'exitit_db',
});

const mockQuestions = [
  { text: "What is the primary function of the CPU?", type: "multiple_choice", options: [
      { text: "To store data permanently", correct: false },
      { text: "To execute instructions and process data", correct: true },
      { text: "To display graphics", correct: false },
      { text: "To cool down the motherboard", correct: false }
  ]},
  { text: "In Object-Oriented Programming, what does encapsulation mean?", type: "multiple_choice", options: [
      { text: "Hiding internal state and requiring all interaction to be performed through an object's methods", correct: true },
      { text: "Inheriting properties from a parent class", correct: false },
      { text: "Creating multiple objects from a single class", correct: false },
      { text: "Converting code into machine language", correct: false }
  ]},
  { text: "Which protocol is used for secure communication over a computer network?", type: "multiple_choice", options: [
      { text: "HTTP", correct: false },
      { text: "FTP", correct: false },
      { text: "HTTPS", correct: true },
      { text: "SMTP", correct: false }
  ]},
  { text: "What defines a Primary Key in a relational database?", type: "multiple_choice", options: [
      { text: "A key that links to another table", correct: false },
      { text: "A unique identifier for each record in a table", correct: true },
      { text: "A column that cannot be indexed", correct: false },
      { text: "A secondary constraint for performance", correct: false }
  ]},
  { text: "What is the purpose of Agile software development?", type: "multiple_choice", options: [
      { text: "To write all the documentation before coding", correct: false },
      { text: "To deliver software in small, incremental, and flexible iterations", correct: true },
      { text: "To strictly follow a linear, sequential design process", correct: false },
      { text: "To avoid testing until the end of the project", correct: false }
  ]}
];

async function seedMockExam() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Check if official quiz exists
    let quizRes = await client.query('SELECT id FROM quizzes WHERE title = $1', ['exit_exam1']);
    let quizId;
    
    if (quizRes.rows.length === 0) {
      console.log('Inserting mock official quiz...');
      const courseRes = await client.query('SELECT id FROM courses LIMIT 1');
      const courseId = courseRes.rows.length ? courseRes.rows[0].id : null;
      
      const insertQuiz = await client.query(
        'INSERT INTO quizzes (title, is_official, course_id) VALUES ($1, $2, $3) RETURNING id',
        ['exit_exam1', true, courseId]
      );
      quizId = insertQuiz.rows[0].id;
    } else {
      quizId = quizRes.rows[0].id;
      console.log('Mock official quiz already exists');
    }

    console.log(`Using Quiz ID: ${quizId}`);
    
    // Clear old mock questions for this quiz to avoid duplicates
    await client.query('DELETE FROM questions WHERE quiz_id = $1', [quizId]);

    // Insert questions and options
    for (const q of mockQuestions) {
      const qRes = await client.query(
        'INSERT INTO questions (quiz_id, question_text, question_type) VALUES ($1, $2, $3) RETURNING id',
        [quizId, q.text, q.type]
      );
      const questionId = qRes.rows[0].id;
      
      for (const opt of q.options) {
        await client.query(
          'INSERT INTO options (question_id, option_text, is_correct) VALUES ($1, $2, $3)',
          [questionId, opt.text, opt.correct]
        );
      }
    }

    await client.query('COMMIT');
    console.log('Successfully seeded mock exam questions!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error seeding mock exam:', err);
  } finally {
    client.release();
    pool.end();
  }
}

seedMockExam();
