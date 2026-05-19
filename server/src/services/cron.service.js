const cron = require('node-cron');
const pool = require('../config/db');
const notificationsController = require('../notifications/notifications.controller');

// Check for streak warnings every day at 8 PM
const streakWarningJob = cron.schedule('0 20 * * *', async () => {
  console.log('🔔 [Cron] Running streak warning check...');
  
  try {
    // Find users who haven't studied today and have an active streak
    const result = await pool.query(
      `SELECT u.id, u.name, s.current_streak, s.last_study_date, s.freeze_count
       FROM users u
       JOIN streaks s ON u.id = s.user_id
       LEFT JOIN study_sessions ss ON u.id = ss.user_id 
         AND DATE(ss.created_at) = CURRENT_DATE
       WHERE s.current_streak > 0 
         AND DATE(s.last_study_date) < CURRENT_DATE
         AND ss.id IS NULL
       GROUP BY u.id, u.name, s.current_streak, s.last_study_date, s.freeze_count`
    );

    for (const user of result.rows) {
      await notificationsController.createNotification(
        user.id,
        'streak_warnings',
        'Your streak is at risk!',
        `You haven't studied today. Your ${user.current_streak}-day streak will be lost at midnight unless you study now${user.freeze_count > 0 ? ' or use a streak freeze' : ''}.`,
        '/dashboard'
      );
    }

    console.log(`✅ [Cron] Sent ${result.rows.length} streak warnings`);
  } catch (error) {
    console.error('❌ [Cron] Error in streak warning job:', error);
  }
});

// Check for daily goal reminders every day at 6 PM
const dailyGoalReminderJob = cron.schedule('0 18 * * *', async () => {
  console.log('🔔 [Cron] Running daily goal reminder check...');
  
  try {
    // Find users who haven't met their daily goal
    const result = await pool.query(
      `SELECT u.id, u.name, dg.target_minutes, 
              COALESCE(SUM(ss.duration_minutes), 0) as today_minutes
       FROM users u
       JOIN daily_goals dg ON u.id = dg.user_id
       LEFT JOIN study_sessions ss ON u.id = ss.user_id 
         AND DATE(ss.created_at) = CURRENT_DATE
       WHERE dg.target_minutes > 0
       GROUP BY u.id, u.name, dg.target_minutes
       HAVING COALESCE(SUM(ss.duration_minutes), 0) < dg.target_minutes`
    );

    for (const user of result.rows) {
      const remaining = user.target_minutes - user.today_minutes;
      await notificationsController.createNotification(
        user.id,
        'daily_goals',
        'Daily goal reminder',
        `You have ${remaining} minutes left to reach your daily study goal of ${user.target_minutes} minutes!`,
        '/dashboard'
      );
    }

    console.log(`✅ [Cron] Sent ${result.rows.length} daily goal reminders`);
  } catch (error) {
    console.error('❌ [Cron] Error in daily goal reminder job:', error);
  }
});

// Process scheduled notifications every 5 minutes
const scheduledNotificationsJob = cron.schedule('*/5 * * * *', async () => {
  await notificationsController.processScheduledNotifications();
});

// Check for upcoming exams every day at 9 AM
const examReminderJob = cron.schedule('0 9 * * *', async () => {
  console.log('🔔 [Cron] Running exam reminder check...');
  
  try {
    // Find quizzes with upcoming deadlines (within 3 days)
    const result = await pool.query(
      `SELECT DISTINCT u.id, u.name, q.title, q.deadline, c.title as course_title
       FROM users u
       CROSS JOIN quizzes q
       JOIN courses c ON q.course_id = c.id
       LEFT JOIN quiz_attempts qa ON u.id = qa.user_id AND q.id = qa.quiz_id
       WHERE q.deadline IS NOT NULL
         AND q.deadline > CURRENT_TIMESTAMP
         AND q.deadline <= CURRENT_TIMESTAMP + INTERVAL '3 days'
         AND qa.id IS NULL`
    );

    for (const user of result.rows) {
      const daysUntil = Math.ceil((new Date(user.deadline) - new Date()) / (1000 * 60 * 60 * 24));
      await notificationsController.createNotification(
        user.id,
        'exam_reminders',
        'Upcoming exam reminder',
        `"${user.title}" in ${user.course_title} is due in ${daysUntil} day${daysUntil > 1 ? 's' : ''}!`,
        '/quizzes'
      );
    }

    console.log(`✅ [Cron] Sent ${result.rows.length} exam reminders`);
  } catch (error) {
    console.error('❌ [Cron] Error in exam reminder job:', error);
  }
});

// Start all cron jobs
const startCronJobs = () => {
  streakWarningJob.start();
  dailyGoalReminderJob.start();
  scheduledNotificationsJob.start();
  examReminderJob.start();
  console.log('✅ [Cron] All cron jobs started');
};

// Stop all cron jobs
const stopCronJobs = () => {
  streakWarningJob.stop();
  dailyGoalReminderJob.stop();
  scheduledNotificationsJob.stop();
  examReminderJob.stop();
  console.log('⏹️  [Cron] All cron jobs stopped');
};

module.exports = {
  startCronJobs,
  stopCronJobs,
};
