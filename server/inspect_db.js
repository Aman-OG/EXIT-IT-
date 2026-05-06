const pool = require('./src/config/db');

async function inspect() {
  try {
    const lastQuiz = await pool.query('SELECT * FROM quizzes ORDER BY created_at DESC LIMIT 1');
    if (lastQuiz.rows.length === 0) {
      console.log('No quizzes found');
      return;
    }
    const q = lastQuiz.rows[0];
    console.log('--- Last Quiz ---');
    console.log(`ID: ${q.id} | Title: ${q.title} | Created: ${q.created_at}`);

    const questions = await pool.query('SELECT * FROM questions WHERE quiz_id = $1', [q.id]);
    console.log(`\n--- Questions (Total: ${questions.rows.length}) ---`);
    for (const quest of questions.rows) {
       console.log(`- ${quest.id}: ${quest.question_text}`);
       const options = await pool.query('SELECT * FROM options WHERE question_id = $1', [quest.id]);
       console.log(`  options: ${options.rows.length} found`);
       for (const opt of options.rows) {
         console.log(`    [${opt.is_correct ? 'X' : ' '}] ${opt.option_text}`);
       }
    }
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

inspect();
