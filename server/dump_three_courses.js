require('dotenv').config();
const pool = require('./src/config/db');
async function check() {
  const res = await pool.query(
    `SELECT m.id, m.title, m.file_url, m.course_id, m.sort_order, c.code
     FROM materials m
     JOIN courses c ON m.course_id = c.id
     WHERE c.code IN ('ITPM303','OOP302','NDC314')
     ORDER BY c.code, m.sort_order ASC, m.id ASC`
  );
  let last = '';
  for (const m of res.rows) {
    if (m.code !== last) { console.log('\n── ' + m.code + ' ──'); last = m.code; }
    console.log(`  id=${String(m.id).padStart(4)}  sort=${String(m.sort_order).padStart(3)}  "${m.title}"   ${m.file_url}`);
  }
  process.exit(0);
}
check().catch(e => { console.error(e); process.exit(1); });
