require('dotenv').config();
const pool = require('./src/config/db');

async function fixOrder() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    /*
      Correct final chapter order per course (set by chapter number in title):
      ──────────────────────────────────────────────────────────────────────────
      ITPM303 (id=6):
        sort 1  → id=60  "Chapter 1 introduction"
        sort 2  → id=81  "chapter 1"          ← the second PM ch1 doc moved from NDC
        sort 3  → id=61  "chapter 2 scope"
        sort 4  → id=62  "chapter 3 schedule"
        sort 5  → id=83  "chapter 3"          ← the second PM ch3 doc moved from NDC
        sort 6  → id=63  "chapter 4 cost mgmt"
        sort 7  → id=64  "chapter 5 HRM Mgt"
        sort 8  → id=66  "chapter 6 quality mgt"
        sort 9  → id=67  "chapter 7 communication and risk mgt"
        sort 10 → id=68  "chapter 8 Procurement mgt"

      OOP302 (id=5):
        sort 1  → id=106  "chapter 1"
        sort 2  → id=107  "chapter 2"
        sort 3  → id=71   "chapter 3"
        sort 4  → id=72   "chapter 4"
        sort 5  → id=73   "chapter 5"
        sort 6  → id=74   "chapter 6"

      NDC314 (id=17):
        sort 1  → id=82   "chapter 2 "   (only 2 remain; keep natural order)
        sort 2  → id=84   "chapter 4"
    */

    const orders = [
      // ITPM303
      { id: 60,  sort: 1  },
      { id: 81,  sort: 2  },
      { id: 61,  sort: 3  },
      { id: 62,  sort: 4  },
      { id: 83,  sort: 5  },
      { id: 63,  sort: 6  },
      { id: 64,  sort: 7  },
      { id: 66,  sort: 8  },
      { id: 67,  sort: 9  },
      { id: 68,  sort: 10 },
      // OOP302
      { id: 106, sort: 1  },
      { id: 107, sort: 2  },
      { id: 71,  sort: 3  },
      { id: 72,  sort: 4  },
      { id: 73,  sort: 5  },
      { id: 74,  sort: 6  },
      // NDC314
      { id: 82,  sort: 1  },
      { id: 84,  sort: 2  },
    ];

    for (const o of orders) {
      await client.query(
        'UPDATE materials SET sort_order = $1 WHERE id = $2',
        [o.sort, o.id]
      );
    }

    await client.query('COMMIT');

    // Verify
    const final = await client.query(
      `SELECT m.id, m.title, m.sort_order, c.code
       FROM materials m JOIN courses c ON m.course_id = c.id
       WHERE c.code IN ('ITPM303','OOP302','NDC314')
       ORDER BY c.code, m.sort_order ASC`
    );
    let last = '';
    console.log('─── Final verified order ───');
    for (const m of final.rows) {
      if (m.code !== last) { console.log('\n  [' + m.code + ']'); last = m.code; }
      console.log(`    sort=${String(m.sort_order).padStart(2)}  id=${m.id}  "${m.title}"`);
    }
    console.log('\n✅ Sort order fixed successfully.');

  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('❌ Error:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

fixOrder();
