const pool = require('../config/db');

// GET /materials/:id/bookmarks
exports.getBookmarks = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM pdf_bookmarks WHERE user_id = $1 AND material_id = $2 ORDER BY page_number ASC',
      [userId, id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch bookmarks' });
  }
};

// POST /materials/:id/bookmarks
exports.addBookmark = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { page_number, label } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO pdf_bookmarks (user_id, material_id, page_number, label)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, material_id, page_number) DO UPDATE SET label = $4
       RETURNING *`,
      [userId, id, page_number, label || `Page ${page_number}`]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add bookmark' });
  }
};

// DELETE /materials/bookmarks/:bookmarkId
exports.deleteBookmark = async (req, res) => {
  const userId = req.user.id;
  const { bookmarkId } = req.params;
  try {
    await pool.query('DELETE FROM pdf_bookmarks WHERE id = $1 AND user_id = $2', [bookmarkId, userId]);
    res.json({ message: 'Bookmark deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete bookmark' });
  }
};

// GET /materials/:id/highlights
exports.getHighlights = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM pdf_highlights WHERE user_id = $1 AND material_id = $2 ORDER BY page_number ASC, created_at ASC',
      [userId, id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch highlights' });
  }
};

// POST /materials/:id/highlights
exports.addHighlight = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { page_number, selected_text, color } = req.body;
  if (!selected_text?.trim()) return res.status(400).json({ message: 'selected_text required' });
  try {
    const result = await pool.query(
      'INSERT INTO pdf_highlights (user_id, material_id, page_number, selected_text, color) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, id, page_number || 1, selected_text.trim(), color || 'yellow']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add highlight' });
  }
};

// DELETE /materials/highlights/:highlightId
exports.deleteHighlight = async (req, res) => {
  const userId = req.user.id;
  const { highlightId } = req.params;
  try {
    await pool.query('DELETE FROM pdf_highlights WHERE id = $1 AND user_id = $2', [highlightId, userId]);
    res.json({ message: 'Highlight deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete highlight' });
  }
};
