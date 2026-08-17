const pool = require('../config/db');

// Submit feedback (User or Guest)
const submitFeedback = async (req, res) => {
  try {
    const { name, email, category = 'general', rating = 5, message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ message: 'Feedback message is required' });
    }

    const userId = req.user ? req.user.id : null;
    const userName = req.user ? req.user.name : (name || 'Anonymous Student');
    const userEmail = req.user ? req.user.email : (email || null);

    const result = await pool.query(
      `INSERT INTO feedbacks (user_id, name, email, category, rating, message, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending')
       RETURNING *`,
      [userId, userName, userEmail, category, rating, message.trim()]
    );

    res.status(201).json({
      message: 'Feedback submitted successfully. Thank you for helping improve EX-IT!',
      feedback: result.rows[0]
    });
  } catch (err) {
    console.error('Error submitting feedback:', err);
    res.status(500).json({ message: 'Failed to submit feedback' });
  }
};

// Get all feedbacks (Admin only)
const getAllFeedbacks = async (req, res) => {
  try {
    const { status, category } = req.query;
    let query = `
      SELECT f.*, u.name as user_account_name, u.email as user_account_email
      FROM feedbacks f
      LEFT JOIN users u ON u.id = f.user_id
    `;
    const params = [];
    const conditions = [];

    if (status && status !== 'all') {
      params.push(status);
      conditions.push(`f.status = $${params.length}`);
    }

    if (category && category !== 'all') {
      params.push(category);
      conditions.push(`f.category = $${params.length}`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(' AND ');
    }

    query += ` ORDER BY f.created_at DESC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching feedbacks:', err);
    res.status(500).json({ message: 'Failed to retrieve feedbacks' });
  }
};

// Update feedback status (Admin only)
const updateFeedbackStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'pending', 'reviewed', 'resolved'

    if (!['pending', 'reviewed', 'resolved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const result = await pool.query(
      `UPDATE feedbacks SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.json({ message: 'Feedback status updated', feedback: result.rows[0] });
  } catch (err) {
    console.error('Error updating feedback status:', err);
    res.status(500).json({ message: 'Failed to update feedback status' });
  }
};

// Delete feedback (Admin only)
const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`DELETE FROM feedbacks WHERE id = $1 RETURNING *`, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.json({ message: 'Feedback deleted successfully' });
  } catch (err) {
    console.error('Error deleting feedback:', err);
    res.status(500).json({ message: 'Failed to delete feedback' });
  }
};

module.exports = {
  submitFeedback,
  getAllFeedbacks,
  updateFeedbackStatus,
  deleteFeedback
};
