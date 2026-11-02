require('dotenv').config();
const pool = require('./src/config/db');
async function check() {
  const res = await pool.query(
    'SELECT m.id, m.title, m.file_url, m.course_id, m.sort_order, c.code, c.title as course_name FROM materials m JOIN courses c ON m.course_id = c.id WHERE m.id = ANY($1::int[]) ORDER BY m.course_id, m.sort_order',
    [[81, 82, 83, 84, 106, 107, 60, 61, 71, 72]]
  );
  console.log('Details of key materials:');
  console.log('─'.repeat(100));
  for (const m of res.rows) {
    console.log(`id=${String(m.id).padStart(4)}  [${m.code}]  sort=${String(m.sort_order).padStart(3)}  "${m.title}"  → ${m.file_url}`);
  }
  process.exit(0);
}
check().catch(e => { console.error(e); process.exit(1); });
