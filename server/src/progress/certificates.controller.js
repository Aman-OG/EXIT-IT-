const pool = require('../config/db');
const crypto = require('crypto');

// GET /progress/certificates — list user's earned certificates
exports.getCertificates = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await pool.query(`
      SELECT cert.id, cert.course_id, cert.issued_at, cert.certificate_code,
             c.title as course_title, c.code as course_code,
             u.name as student_name
      FROM certificates cert
      JOIN courses c ON cert.course_id = c.id
      JOIN users u ON cert.user_id = u.id
      WHERE cert.user_id = $1
      ORDER BY cert.issued_at DESC
    `, [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch certificates' });
  }
};

// POST /progress/certificates/:courseId — issue certificate if course is complete
exports.issueCertificate = async (req, res) => {
  const userId = req.user.id;
  const { courseId } = req.params;
  try {
    // Check if already issued
    const existing = await pool.query(
      'SELECT * FROM certificates WHERE user_id = $1 AND course_id = $2',
      [userId, courseId]
    );
    if (existing.rows.length > 0) {
      return res.json(existing.rows[0]);
    }

    // Check completion: user must have >= 70% on all materials in the course
    const progressRes = await pool.query(`
      SELECT 
        COUNT(m.id) as total_materials,
        COUNT(CASE WHEN COALESCE(up.percentage, 0) >= 70 THEN 1 END) as completed_materials
      FROM materials m
      LEFT JOIN user_progress up ON up.material_id = m.id AND up.user_id = $1
      WHERE m.course_id = $2
    `, [userId, courseId]);

    const { total_materials, completed_materials } = progressRes.rows[0];
    if (parseInt(total_materials) === 0) {
      return res.status(400).json({ message: 'No materials in this course' });
    }
    const completionPct = Math.round((parseInt(completed_materials) / parseInt(total_materials)) * 100);
    if (completionPct < 70) {
      return res.status(400).json({ 
        message: `Course not complete yet (${completionPct}%). Need at least 70%.`,
        completionPct 
      });
    }

    // Issue certificate
    const certCode = 'EXITIT-' + crypto.randomBytes(6).toString('hex').toUpperCase();
    const result = await pool.query(
      'INSERT INTO certificates (user_id, course_id, certificate_code) VALUES ($1, $2, $3) RETURNING *',
      [userId, courseId, certCode]
    );

    // Get full cert data
    const certRes = await pool.query(`
      SELECT cert.*, c.title as course_title, c.code as course_code, u.name as student_name
      FROM certificates cert
      JOIN courses c ON cert.course_id = c.id
      JOIN users u ON cert.user_id = u.id
      WHERE cert.id = $1
    `, [result.rows[0].id]);

    res.status(201).json(certRes.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to issue certificate' });
  }
};
