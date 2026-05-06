const pool = require('../config/db');

exports.getAllNotes = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT n.id, n.material_id, n.content, n.title as note_title, n.updated_at, m.title as material_title, c.title as course_title, c.code as course_code
      FROM user_notes n
      JOIN materials m ON n.material_id = m.id
      JOIN courses c ON m.course_id = c.id
      WHERE n.user_id = $1
      ORDER BY n.updated_at DESC
    `, [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching notes' });
  }
};

exports.getNoteByMaterial = async (req, res) => {
  const { materialId } = req.params;
  try {
    const result = await pool.query(
      'SELECT content, title FROM user_notes WHERE user_id = $1 AND material_id = $2',
      [req.user.id, materialId]
    );
    if (result.rows.length === 0) {
      return res.json({ content: '' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching note' });
  }
};

exports.updateNote = async (req, res) => {
  const { materialId } = req.params;
  const { content, title } = req.body;
  try {
    const result = await pool.query(`
      INSERT INTO user_notes (user_id, material_id, content, title, updated_at)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id, material_id)
      DO UPDATE SET content = $3, title = $4, updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `, [req.user.id, materialId, content, title || 'My Notes']);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating note' });
  }
};

exports.deleteNote = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM user_notes WHERE id = $1 AND user_id = $2', [id, req.user.id]);
    res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error deleting note' });
  }
};
