require('dotenv').config();
const pool = require('./src/config/db');

async function reassign() {
  const client = await pool.connect();
  try {
    // Look up course IDs
    const coursesRes = await client.query(
      `SELECT id, code FROM courses WHERE code IN ('ITPM303','OOP302','NDC314')`
    );
    const byCode = {};
    for (const r of coursesRes.rows) byCode[r.code] = r.id;

    const PM  = byCode['ITPM303'];
    const OOP = byCode['OOP302'];
    const NDC = byCode['NDC314'];

    console.log(`Course IDs → ITPM303=${PM}  OOP302=${OOP}  NDC314=${NDC}`);

    /*
      What needs to happen (confirmed by user):
      ─────────────────────────────────────────
      id=106  "chapter 1"   → OOP302  (it is OOP ch1, currently sitting in ITPM)
      id=107  "chapter 2"   → OOP302  (it is OOP ch2, currently sitting in ITPM)
      id=81   "chapter 1"   → ITPM303 (it is PM ch1,  currently sitting in NDC)
      id=83   "chapter 3"   → ITPM303 (it is PM ch3,  currently sitting in NDC)

      id=82  "chapter 2"  stays in NDC  (legitimate NDC chapter)
      id=84  "chapter 4"  stays in NDC  (legitimate NDC chapter)
    */

    await client.query('BEGIN');

    // Move OOP chapters back to OOP
    await client.query(
      `UPDATE materials SET course_id = $1 WHERE id = ANY($2::int[])`,
      [OOP, [106, 107]]
    );
    console.log('✅ Moved id=106,107 → OOP302');

    // Move PM chapters from NDC to ITPM
    await client.query(
      `UPDATE materials SET course_id = $1 WHERE id = ANY($2::int[])`,
      [PM, [81, 83]]
    );
    console.log('✅ Moved id=81,83 → ITPM303');

    // Re-sequence sort_order for OOP (chapters 1,2,3,4,5,6)
    const oopMats = await client.query(
      `SELECT id FROM materials WHERE course_id = $1 ORDER BY id ASC`,
      [OOP]
    );
    for (let i = 0; i < oopMats.rows.length; i++) {
      await client.query(
        `UPDATE materials SET sort_order = $1 WHERE id = $2`,
        [i + 1, oopMats.rows[i].id]
      );
    }
    console.log('✅ Re-sequenced OOP302 sort_order');

    // Re-sequence sort_order for ITPM
    const pmMats = await client.query(
      `SELECT id FROM materials WHERE course_id = $1 ORDER BY id ASC`,
      [PM]
    );
    for (let i = 0; i < pmMats.rows.length; i++) {
      await client.query(
        `UPDATE materials SET sort_order = $1 WHERE id = $2`,
        [i + 1, pmMats.rows[i].id]
      );
    }
    console.log('✅ Re-sequenced ITPM303 sort_order');

    // Re-sequence sort_order for NDC (now only ch2 and ch4 remain → make them 1 and 2)
    const ndcMats = await client.query(
      `SELECT id FROM materials WHERE course_id = $1 ORDER BY id ASC`,
      [NDC]
    );
    for (let i = 0; i < ndcMats.rows.length; i++) {
      await client.query(
        `UPDATE materials SET sort_order = $1 WHERE id = $2`,
        [i + 1, ndcMats.rows[i].id]
      );
    }
    console.log('✅ Re-sequenced NDC314 sort_order');

    await client.query('COMMIT');

    // ── Final verification ────────────────────────────────────────────────
    const final = await client.query(
      `SELECT m.id, m.title, m.sort_order, c.code
       FROM materials m JOIN courses c ON m.course_id = c.id
       WHERE c.code IN ('ITPM303','OOP302','NDC314')
       ORDER BY c.code, m.sort_order ASC, m.id ASC`
    );

    let last = '';
    console.log('\n─── Final state ───');
    for (const m of final.rows) {
      if (m.code !== last) { console.log('\n  [' + m.code + ']'); last = m.code; }
      console.log(`    sort=${String(m.sort_order).padStart(2)}  id=${m.id}  "${m.title}"`);
    }

  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('❌ Error:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

reassign();
