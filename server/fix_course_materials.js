/**
 * fix_course_materials.js
 *
 * Diagnoses and fixes Project Management chapter PDFs that were uploaded
 * under the wrong course (Network Device Configuration or Object Oriented Java).
 *
 * Root cause: When an admin uploaded Project Management materials, the
 * wrong course was expanded in the UI, so the wrong course_id was sent
 * to the server and stored in the materials table.
 *
 * Usage:
 *   node fix_course_materials.js          <- dry-run (shows what would change)
 *   node fix_course_materials.js --fix    <- applies the fixes to the DB
 */

require('dotenv').config();
const pool = require('./src/config/db');

const DRY_RUN = !process.argv.includes('--fix');

async function fixCourseMaterials() {
  const client = await pool.connect();
  try {
    if (DRY_RUN) {
      console.log('🔍 DRY-RUN mode — no changes will be made. Pass --fix to apply.\n');
    } else {
      console.log('🔧 FIX mode — changes WILL be written to the database.\n');
    }

    // ──────────────────────────────────────────────────────────────────────
    // 1. Show all courses so you can verify the IDs
    // ──────────────────────────────────────────────────────────────────────
    const coursesRes = await client.query(
      'SELECT id, title, code FROM courses ORDER BY title ASC'
    );
    console.log('📚 All Courses in DB:');
    console.log('─'.repeat(60));
    for (const c of coursesRes.rows) {
      console.log(`  ID ${c.id.toString().padStart(3)}  [${c.code}]  ${c.title}`);
    }
    console.log('');

    // ──────────────────────────────────────────────────────────────────────
    // 2. Find the three relevant courses
    // ──────────────────────────────────────────────────────────────────────
    const findCourse = (code) =>
      coursesRes.rows.find((c) => c.code === code) || null;

    const pmCourse   = findCourse('ITPM303'); // IT Project Management
    const ndcCourse  = findCourse('NDC314');  // Network Device and Configuration
    const oopCourse  = findCourse('OOP302');  // Object Oriented Programming (Java)

    if (!pmCourse) {
      console.error('❌ Could not find IT Project Management course (ITPM303). Check the course code in your DB.');
      return;
    }
    console.log(`✅ Project Management course found  → ID ${pmCourse.id}  (${pmCourse.code}) ${pmCourse.title}`);
    if (ndcCourse) console.log(`✅ Network Device Config course found → ID ${ndcCourse.id}  (${ndcCourse.code}) ${ndcCourse.title}`);
    else console.log('⚠️  NDC314 course not found — skipping NDC check.');
    if (oopCourse) console.log(`✅ Object Oriented Java course found  → ID ${oopCourse.id}  (${oopCourse.code}) ${oopCourse.title}`);
    else console.log('⚠️  OOP302 course not found — skipping OOP check.');
    console.log('');

    // ──────────────────────────────────────────────────────────────────────
    // 3. Show ALL materials for each affected course so you can confirm
    //    which ones belong to Project Management
    // ──────────────────────────────────────────────────────────────────────
    const wrongCourseIds = [ndcCourse?.id, oopCourse?.id].filter(Boolean);

    for (const wrongId of wrongCourseIds) {
      const wrongCourse = coursesRes.rows.find((c) => c.id === wrongId);
      const mats = await client.query(
        `SELECT id, title, sort_order, created_at
         FROM materials WHERE course_id = $1
         ORDER BY sort_order ASC, created_at ASC`,
        [wrongId]
      );
      console.log(`\n📂 Materials currently in "${wrongCourse.title}" (ID ${wrongId}):`);
      if (mats.rows.length === 0) {
        console.log('   (no materials)');
        continue;
      }
      for (const m of mats.rows) {
        console.log(
          `   mat.id=${m.id.toString().padStart(5)}  sort=${String(m.sort_order).padStart(3)}  "${m.title}"`
        );
      }
    }

    // ──────────────────────────────────────────────────────────────────────
    // 4. Show current Project Management materials for reference
    // ──────────────────────────────────────────────────────────────────────
    const pmMats = await client.query(
      `SELECT id, title, sort_order, created_at
       FROM materials WHERE course_id = $1
       ORDER BY sort_order ASC, created_at ASC`,
      [pmCourse.id]
    );
    console.log(`\n📂 Materials currently in "${pmCourse.title}" (ID ${pmCourse.id}):`);
    if (pmMats.rows.length === 0) {
      console.log('   (no materials — this confirms chapters are missing here)');
    } else {
      for (const m of pmMats.rows) {
        console.log(
          `   mat.id=${m.id.toString().padStart(5)}  sort=${String(m.sort_order).padStart(3)}  "${m.title}"`
        );
      }
    }

    // ──────────────────────────────────────────────────────────────────────
    // 5. Identify misassigned materials
    //
    // Diagnostic findings (run without --fix to verify):
    //
    //  NDC314 (ID 17): mat IDs 81-84 → all uploaded in the same 37-second
    //    window — these are legitimate NDC chapters, DO NOT move them.
    //
    //  OOP302 (ID 5):
    //    mat IDs 71-74 (chapters 3-6) uploaded early alongside ITPM chapters → legitimate OOP chapters
    //    mat IDs 106-107 ("chapter 1", "chapter 2") uploaded ~70 days LATER
    //    with generic names — these are the misassigned Project Management chapters.
    //
    //  ITPM303 (ID 6): already has its own Chapter 1 and Chapter 2 (IDs 60-61)
    //    but is MISSING the generic "chapter 1" and "chapter 2" PDFs that were
    //    accidentally uploaded under OOP302.
    //
    // CONFIRMED MISASSIGNED: mat IDs 106 and 107 (currently in OOP302,
    // should be in ITPM303 IT Project Management).
    //
    // NDC chapters 81 and 82 are intentional — DO NOT reassign them.
    // ──────────────────────────────────────────────────────────────────────

    // Confirmed misassigned material IDs — verified by upload timestamp analysis.
    // IDs 106 & 107 were uploaded ~70 days after the OOP chapter set, with generic
    // titles, while the ITPM course was the active upload target.
    const CONFIRMED_MISASSIGNED = [106, 107];

    // Add any additional IDs you identify from the lists printed above
    const MANUAL_REASSIGN = []; // <-- add more mat.id numbers here if needed

    const allToFix = [...new Set([...CONFIRMED_MISASSIGNED, ...MANUAL_REASSIGN])];

    // Verify confirmed IDs actually exist in a wrong course (safety check)
    const verifyRes = await client.query(
      `SELECT m.id, m.title, m.course_id, c.code, c.title as course_name
       FROM materials m JOIN courses c ON m.course_id = c.id
       WHERE m.id = ANY($1::int[])`,
      [allToFix]
    );
    console.log('\n🔍 Confirmed misassigned materials (to be moved to IT Project Management):');
    for (const m of verifyRes.rows) {
      console.log(
        `   mat.id=${m.id.toString().padStart(5)}  "${m.title}"  ← currently in [${m.code}] ${m.course_name}`
      );
    }

    if (allToFix.length === 0) {
      console.log('\nℹ️  Nothing to fix. Add material IDs to MANUAL_REASSIGN if needed.');
      return;
    }

    console.log(`\n📋 Will reassign ${allToFix.length} material(s) → "${pmCourse.title}" (ID ${pmCourse.id})`);
    console.log('   IDs:', allToFix.join(', '));

    if (DRY_RUN) {
      console.log('\n⏭️  Dry-run complete. Re-run with --fix to apply these changes.');
      return;
    }

    // ──────────────────────────────────────────────────────────────────────
    // 6. Apply the fix — reassign materials to Project Management course
    // ──────────────────────────────────────────────────────────────────────
    await client.query('BEGIN');

    // Reassign course_id
    await client.query(
      'UPDATE materials SET course_id = $1 WHERE id = ANY($2::int[])',
      [pmCourse.id, allToFix]
    );

    // Re-sequence sort_order for PM course so Chapter 1 and Chapter 2 come first
    const allPmMats = await client.query(
      `SELECT id FROM materials WHERE course_id = $1 ORDER BY sort_order ASC, created_at ASC`,
      [pmCourse.id]
    );
    const reorderUpdates = allPmMats.rows.map((m, i) =>
      client.query('UPDATE materials SET sort_order = $1 WHERE id = $2', [i + 1, m.id])
    );
    await Promise.all(reorderUpdates);

    await client.query('COMMIT');

    console.log(`\n✅ Fixed! Reassigned ${allToFix.length} material(s) to "${pmCourse.title}".`);
    console.log('   sort_order for all PM materials has been re-sequenced from 1.\n');

    // ── Verify final state ─────────────────────────────────────────────
    const finalPmMats = await client.query(
      `SELECT id, title, sort_order FROM materials WHERE course_id = $1 ORDER BY sort_order ASC`,
      [pmCourse.id]
    );
    console.log(`📂 "${pmCourse.title}" after fix (${finalPmMats.rows.length} materials):`);
    for (const m of finalPmMats.rows) {
      console.log(`   sort=${String(m.sort_order).padStart(3)}  "${m.title}"`);
    }

  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('❌ Error:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

fixCourseMaterials();
