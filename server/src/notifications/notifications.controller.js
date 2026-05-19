const pool = require('../config/db');
const nodemailer = require('nodemailer');

// Email transporter setup (configure with your SMTP settings)
let transporter = null;

const initializeEmailTransporter = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    console.log('✅ Email transporter initialized');
  } else {
    console.log('⚠️  Email not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS in .env');
  }
};

initializeEmailTransporter();

// Get all notifications for user
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 50, offset = 0 } = req.query;

    const result = await pool.query(
      `SELECT * FROM notifications 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    const unreadCount = await pool.query(
      `SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND is_read = FALSE`,
      [userId]
    );

    res.json({
      notifications: result.rows,
      unreadCount: parseInt(unreadCount.rows[0].count),
    });
  } catch (error) {
    console.error('❌ [Notifications] Error getting notifications:', error);
    res.status(500).json({ error: 'Failed to get notifications' });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    await pool.query(
      `UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2`,
      [notificationId, userId]
    );

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('❌ [Notifications] Error marking as read:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await pool.query(
      `UPDATE notifications SET is_read = TRUE WHERE user_id = $1 AND is_read = FALSE`,
      [userId]
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('❌ [Notifications] Error marking all as read:', error);
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    await pool.query(
      `DELETE FROM notifications WHERE id = $1 AND user_id = $2`,
      [notificationId, userId]
    );

    res.json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('❌ [Notifications] Error deleting notification:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
};

// Get notification preferences
exports.getPreferences = async (req, res) => {
  try {
    const userId = req.user.id;

    let result = await pool.query(
      `SELECT * FROM notification_preferences WHERE user_id = $1`,
      [userId]
    );

    // Create default preferences if none exist
    if (result.rows.length === 0) {
      result = await pool.query(
        `INSERT INTO notification_preferences (user_id) VALUES ($1) RETURNING *`,
        [userId]
      );
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ [Notifications] Error getting preferences:', error);
    res.status(500).json({ error: 'Failed to get notification preferences' });
  }
};

// Update notification preferences
exports.updatePreferences = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      email_enabled,
      push_enabled,
      friend_requests,
      streak_warnings,
      exam_reminders,
      achievements,
      daily_goals,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO notification_preferences 
       (user_id, email_enabled, push_enabled, friend_requests, streak_warnings, exam_reminders, achievements, daily_goals, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id) 
       DO UPDATE SET 
         email_enabled = EXCLUDED.email_enabled,
         push_enabled = EXCLUDED.push_enabled,
         friend_requests = EXCLUDED.friend_requests,
         streak_warnings = EXCLUDED.streak_warnings,
         exam_reminders = EXCLUDED.exam_reminders,
         achievements = EXCLUDED.achievements,
         daily_goals = EXCLUDED.daily_goals,
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [userId, email_enabled, push_enabled, friend_requests, streak_warnings, exam_reminders, achievements, daily_goals]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ [Notifications] Error updating preferences:', error);
    res.status(500).json({ error: 'Failed to update notification preferences' });
  }
};

// Create notification (internal use)
exports.createNotification = async (userId, type, title, message, link = null) => {
  try {
    // Create in-app notification
    await pool.query(
      `INSERT INTO notifications (user_id, type, title, message, link) VALUES ($1, $2, $3, $4, $5)`,
      [userId, type, title, message, link]
    );

    // Check user preferences
    const prefs = await pool.query(
      `SELECT * FROM notification_preferences WHERE user_id = $1`,
      [userId]
    );

    if (prefs.rows.length === 0) return;

    const preferences = prefs.rows[0];
    const typeEnabled = preferences[type] !== false;

    // Send email if enabled
    if (preferences.email_enabled && typeEnabled && transporter) {
      const user = await pool.query(`SELECT email, name FROM users WHERE id = $1`, [userId]);
      if (user.rows.length > 0) {
        await sendEmail(user.rows[0].email, user.rows[0].name, title, message, link);
      }
    }

    console.log(`✅ [Notifications] Created notification for user ${userId}: ${title}`);
  } catch (error) {
    console.error('❌ [Notifications] Error creating notification:', error);
  }
};

// Send email notification
const sendEmail = async (email, name, title, message, link) => {
  if (!transporter) return;

  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: `EXIT-IT: ${title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">${title}</h2>
          <p>Hi ${name},</p>
          <p>${message}</p>
          ${link ? `<p><a href="${process.env.CLIENT_URL || 'http://localhost:3000'}${link}" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View in EXIT-IT</a></p>` : ''}
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px;">You received this email because you have notifications enabled in EXIT-IT. You can change your notification preferences in your account settings.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ [Email] Sent to ${email}: ${title}`);
  } catch (error) {
    console.error('❌ [Email] Error sending email:', error);
  }
};

// Schedule notification (for exam reminders, etc.)
exports.scheduleNotification = async (userId, type, scheduledFor, payload) => {
  try {
    await pool.query(
      `INSERT INTO scheduled_notifications (user_id, type, scheduled_for, payload) VALUES ($1, $2, $3, $4)`,
      [userId, type, scheduledFor, JSON.stringify(payload)]
    );
    console.log(`✅ [Notifications] Scheduled notification for user ${userId} at ${scheduledFor}`);
  } catch (error) {
    console.error('❌ [Notifications] Error scheduling notification:', error);
  }
};

// Process scheduled notifications (called by cron job)
exports.processScheduledNotifications = async () => {
  try {
    const result = await pool.query(
      `SELECT * FROM scheduled_notifications 
       WHERE scheduled_for <= CURRENT_TIMESTAMP AND sent = FALSE 
       ORDER BY scheduled_for 
       LIMIT 100`
    );

    for (const notification of result.rows) {
      const payload = notification.payload;
      await exports.createNotification(
        notification.user_id,
        notification.type,
        payload.title,
        payload.message,
        payload.link
      );

      await pool.query(
        `UPDATE scheduled_notifications SET sent = TRUE WHERE id = $1`,
        [notification.id]
      );
    }

    if (result.rows.length > 0) {
      console.log(`✅ [Notifications] Processed ${result.rows.length} scheduled notifications`);
    }
  } catch (error) {
    console.error('❌ [Notifications] Error processing scheduled notifications:', error);
  }
};

module.exports = exports;
