const pool = require('../config/db');
const nodemailer = require('nodemailer');

// Email transporter setup (configure with your SMTP settings)
let transporter = null;

// In-memory broadcast job tracker: jobId -> { total, sent, failed, done, startedAt }
const broadcastJobs = new Map();
const makeJobId = () => `job_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const initializeEmailTransporter = () => {
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    const pass = (process.env.SMTP_PASS || '').replace(/\s+/g, '');
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });
    console.log(`✅ Email transporter initialized | user=${process.env.SMTP_USER} | host=${process.env.SMTP_HOST || 'smtp.gmail.com'} | port=${process.env.SMTP_PORT || 587} | passLen=${pass.length}`);
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

    const preferences = prefs.rows[0] || { email_enabled: true };
    const typeEnabled = preferences[type] !== false;

    // Send email if enabled
    if (preferences.email_enabled && typeEnabled && transporter) {
      const user = await pool.query(`SELECT email, name FROM users WHERE id = $1`, [userId]);
      if (user.rows.length > 0 && user.rows[0].email) {
        await sendEmail(user.rows[0].email, user.rows[0].name, title, message, link);
      }
    }

    console.log(`✅ [Notifications] Created notification for user ${userId}: ${title}`);
  } catch (error) {
    console.error('❌ [Notifications] Error creating notification:', error);
  }
};

// Helper: send emails in parallel batches, updates job tracker
const sendEmailBatch = async (users, title, message, link, jobId = null) => {
  const BATCH_SIZE = 5;
  let sent = 0;
  let failed = 0;
  let lastError = null;

  for (let i = 0; i < users.length; i += BATCH_SIZE) {
    const batch = users.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map(u => sendEmail(u.email, u.name, title, message, link))
    );
    results.forEach((r, idx) => {
      if (r.status === 'fulfilled') {
        sent++;
      } else {
        failed++;
        lastError = r.reason?.message || String(r.reason);
        console.error(`❌ [Broadcast] Failed to send to ${batch[idx]?.email}: ${lastError}`);
      }
    });
    // Update job tracker
    if (jobId && broadcastJobs.has(jobId)) {
      const job = broadcastJobs.get(jobId);
      job.sent = sent;
      job.failed = failed;
      job.lastError = lastError;
      job.percent = job.total > 0 ? Math.round(((sent + failed) / job.total) * 100) : 100;
    }
    console.log(`📧 [Broadcast] Progress: ${sent} sent, ${failed} failed out of ${i + batch.length}/${users.length}`);
  }
  // Mark job done
  if (jobId && broadcastJobs.has(jobId)) {
    const job = broadcastJobs.get(jobId);
    job.sent = sent;
    job.failed = failed;
    job.lastError = lastError;
    job.done = true;
    job.percent = 100;
    // Auto-cleanup after 15 minutes
    setTimeout(() => broadcastJobs.delete(jobId), 15 * 60 * 1000);
  }
  console.log(`✅ [Broadcast] Done. Sent: ${sent}, Failed: ${failed}${lastError ? ` | Last error: ${lastError}` : ''}`);
};

// Get broadcast job status (for live frontend polling)
exports.getBroadcastStatus = (req, res) => {
  const { jobId } = req.params;
  const job = broadcastJobs.get(jobId);
  if (!job) {
    return res.status(404).json({ error: 'Job not found or already completed', done: true });
  }
  const percent = job.total > 0 ? Math.round(((job.sent + job.failed) / job.total) * 100) : 100;
  res.json({
    jobId,
    total: job.total,
    sent: job.sent,
    failed: job.failed,
    done: job.done,
    lastError: job.lastError,
    percent,
    startedAt: job.startedAt
  });
};

// Admin Broadcast Notification & Email to all users
exports.broadcastNotification = async (req, res) => {
  try {
    const { title, message, link, type = 'system_announcements', sendEmailToAll = true } = req.body;
    
    if (!title || !message) {
      return res.status(400).json({ message: 'Title and message are required' });
    }

    const usersRes = await pool.query('SELECT id, name, email FROM users');
    const users = usersRes.rows;

    if (users.length === 0) {
      return res.json({ success: true, message: 'No users found.', totalRecipients: 0, emailsSent: 0 });
    }

    // 1) Single bulk INSERT for all in-app notifications (one DB round-trip)
    const ids    = users.map(u => u.id);
    const types  = users.map(() => type);
    const titles = users.map(() => title);
    const msgs   = users.map(() => message);
    const links  = users.map(() => link || '/dashboard');

    await pool.query(
      `INSERT INTO notifications (user_id, type, title, message, link)
       SELECT * FROM UNNEST($1::int[], $2::text[], $3::text[], $4::text[], $5::text[])`,
      [ids, types, titles, msgs, links]
    );

    // 2) Create job tracker & respond immediately
    const emailRecipients = sendEmailToAll && transporter
      ? users.filter(u => u.email)
      : [];

    const jobId = makeJobId();
    broadcastJobs.set(jobId, {
      total: emailRecipients.length,
      sent: 0,
      failed: 0,
      done: emailRecipients.length === 0,
      startedAt: Date.now()
    });

    console.log(`📢 [Broadcast] ${users.length} in-app notifications saved. Dispatching ${emailRecipients.length} emails in background... jobId=${jobId}`);
    res.json({
      success: true,
      jobId,
      message: `In-app alerts sent to ${users.length} scholars. ${emailRecipients.length} emails are being dispatched.`,
      totalRecipients: users.length,
      emailsSent: emailRecipients.length
    });

    // 3) Send emails in background batches (non-blocking)
    if (emailRecipients.length > 0) {
      sendEmailBatch(emailRecipients, title, message, link || '/dashboard', jobId).catch(err =>
        console.error('❌ [Broadcast] Background email error:', err)
      );
    }
  } catch (error) {
    console.error('❌ [Notifications] Error in broadcast:', error);
    res.status(500).json({ message: 'Failed to dispatch broadcast announcement', detail: error.message });
  }
};

// Admin Broadcast Weekly Hall of Fame Digest
exports.broadcastHallOfFame = async (req, res) => {
  try {
    const top3Res = await pool.query(`
      SELECT name, total_score, current_streak, COALESCE(is_anonymous, TRUE) as is_anonymous 
      FROM users 
      ORDER BY total_score DESC, current_streak DESC 
      LIMIT 3
    `);

    const top3 = top3Res.rows;
    if (top3.length === 0) {
      return res.status(400).json({ message: 'No scholars found for Hall of Fame digest' });
    }

    const p1 = top3[0] ? `${top3[0].is_anonymous ? 'Anonymous' : top3[0].name} (${(top3[0].total_score || 0).toLocaleString()} pts)` : 'None';
    const p2 = top3[1] ? `${top3[1].is_anonymous ? 'Anonymous' : top3[1].name} (${(top3[1].total_score || 0).toLocaleString()} pts)` : 'None';
    const p3 = top3[2] ? `${top3[2].is_anonymous ? 'Anonymous' : top3[2].name} (${(top3[2].total_score || 0).toLocaleString()} pts)` : 'None';

    const title = '🏆 Weekly Hall of Fame Highlights!';
    const message = `Check out this week's top scholars on the EXIT-IT leaderboard:\n\n🥇 1st Place: ${p1}\n🥈 2nd Place: ${p2}\n🥉 3rd Place: ${p3}\n\nJoin the challenge, study today, and climb into the Hall of Fame!`;

    const usersRes = await pool.query('SELECT id, name, email FROM users');
    const users = usersRes.rows;

    // Single bulk INSERT for all in-app notifications
    if (users.length > 0) {
      const ids    = users.map(u => u.id);
      const titles = users.map(() => title);
      const msgs   = users.map(() => message);

      await pool.query(
        `INSERT INTO notifications (user_id, type, title, message, link)
         SELECT unnest($1::int[]), 'system_announcements', unnest($2::text[]), unnest($3::text[]), '/leaderboard'`,
        [ids, titles, msgs]
      );
    }

    const emailRecipients = transporter ? users.filter(u => u.email) : [];
    const jobId = makeJobId();
    broadcastJobs.set(jobId, {
      total: emailRecipients.length,
      sent: 0,
      failed: 0,
      done: emailRecipients.length === 0,
      startedAt: Date.now()
    });

    // Respond immediately
    res.json({
      success: true,
      jobId,
      message: `Hall of Fame digest sent to ${users.length} scholars! ${emailRecipients.length} emails dispatching in background.`,
      totalRecipients: users.length,
      emailsSent: emailRecipients.length
    });

    // Send emails in background
    if (emailRecipients.length > 0) {
      sendEmailBatch(emailRecipients, title, message, '/leaderboard', jobId).catch(err =>
        console.error('❌ [HallOfFame] Background email error:', err)
      );
    }
  } catch (error) {
    console.error('❌ [Notifications] Error broadcasting Hall of Fame:', error);
    res.status(500).json({ message: 'Failed to broadcast Hall of Fame digest', detail: error.message });
  }
};

// Notify all accepted friends of a user
exports.notifyAllFriends = async (userId, type, title, message, link = null) => {
  try {
    const friendsRes = await pool.query(
      `SELECT DISTINCT
         CASE 
           WHEN user_id = $1 THEN friend_id
           ELSE user_id
         END as friend_id
       FROM friendships 
       WHERE (user_id = $1 OR friend_id = $1) 
       AND status = 'accepted'`,
      [userId]
    );

    const friends = friendsRes.rows;
    if (friends.length === 0) return;

    for (const f of friends) {
      await exports.createNotification(f.friend_id, type, title, message, link);
    }
    console.log(`✅ [Notifications] Pushed "${title}" to ${friends.length} friends of user ${userId}`);
  } catch (error) {
    console.error('❌ [Notifications] Error notifying friends:', error);
  }
};

// Notify all friends when a user unlocks a trophy / badge
exports.notifyBadgeUnlocked = async (req, res) => {
  try {
    const userId = req.user.id;
    const { badgeId, badgeName, badgeIcon } = req.body;

    const userRes = await pool.query('SELECT name FROM users WHERE id = $1', [userId]);
    const userName = userRes.rows[0]?.name || 'Your friend';
    const icon = badgeIcon || '🏆';
    const bName = badgeName || 'Trophy';

    await exports.notifyAllFriends(
      userId,
      'friend_activity',
      `${userName} Unlocked a Trophy! ${icon}`,
      `${userName} just earned the "${bName}" achievement badge!`,
      `/trophies`
    );

    res.json({ success: true, message: 'Friends notified of badge unlock' });
  } catch (error) {
    console.error('❌ [Notifications] Error notifying friends of badge:', error);
    res.status(500).json({ message: 'Server error notifying friends of badge' });
  }
};

// Send email notification (supports HTTPS Resend API or SMTP Nodemailer)
const sendEmail = async (email, name, title, message, link) => {
  const fullLink = link ? `${process.env.CLIENT_URL || 'http://localhost:5173'}${link}` : null;
  const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 24px; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; background-color: #1e293b; border-radius: 20px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
          <tr>
            <td style="padding: 28px 32px; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); text-align: left;">
              <span style="font-size: 22px; font-weight: 900; color: #ffffff;">🎓 EXIT-IT</span>
              <span style="margin-left: 8px; font-size: 11px; font-weight: 700; background: rgba(255,255,255,0.2); padding: 3px 8px; border-radius: 9999px; text-transform: uppercase; color: #ffffff;">Learning Platform</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px;">
              <h1 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 800; color: #ffffff;">${title}</h1>
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #94a3b8;">Hello <span style="color: #e2e8f0; font-weight: 700;">${name || 'Scholar'}</span>,</p>
              <div style="background-color: #0f172a; border-radius: 14px; padding: 20px; margin: 16px 0 24px 0; border: 1px solid rgba(255,255,255,0.06);">
                <p style="margin: 0; font-size: 15px; color: #cbd5e1; line-height: 1.6;">${message}</p>
              </div>
              ${fullLink ? `<div style="text-align: center; margin: 28px 0 12px 0;"><a href="${fullLink}" style="display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%); color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none; padding: 14px 28px; border-radius: 12px;">Open in EXIT-IT →</a></div>` : ''}
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 32px; background-color: #0f172a; border-top: 1px solid rgba(255,255,255,0.06); text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #64748b;">You received this because notifications are enabled on your EXIT-IT account.<br>
              <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/notifications/settings" style="color: #818cf8;">Manage Notification Settings</a></p>
            </td>
          </tr>
        </table>
      </body>
      </html>
  `;

  // 1) Primary Cloud Method: If RESEND_API_KEY is configured, send via HTTPS REST (never blocked by Render)
  if (process.env.RESEND_API_KEY) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || 'EXIT-IT Platform <onboarding@resend.dev>',
        to: [email],
        subject: `⚡ EXIT-IT: ${title}`,
        html: emailHtml
      })
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `Resend API error: HTTP ${res.status}`);
    }
    console.log(`✅ [Email:Resend] Sent to ${email}: ${title}`);
    return;
  }

  // 2) Fallback to SMTP Nodemailer
  if (!transporter) {
    throw new Error('Email service unconfigured: Neither RESEND_API_KEY nor valid SMTP credentials found.');
  }

  const mailOptions = {
    from: process.env.SMTP_FROM || `"EXIT-IT Platform" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `⚡ EXIT-IT: ${title}`,
    html: emailHtml
  };

  await transporter.sendMail(mailOptions);
  console.log(`✅ [Email:SMTP] Sent to ${email}: ${title}`);
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
