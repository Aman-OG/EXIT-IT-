# Phase 4 & 5 Implementation: Friends System + Notifications

## ✅ Completed Features

### Phase 4: Friend System

#### Backend
- **Database Tables**
  - `friendships` - stores friend relationships with status (pending/accepted/rejected)
  - Indexes on user_id, friend_id, and status for performance

- **API Endpoints** (`/api/friends`)
  - `GET /search?query=` - Search users by name or email
  - `POST /request` - Send friend request
  - `GET /requests/pending` - Get received friend requests
  - `GET /requests/sent` - Get sent friend requests
  - `PUT /requests/:id/accept` - Accept friend request
  - `PUT /requests/:id/reject` - Reject friend request
  - `GET /` - Get all friends
  - `DELETE /:friendId` - Remove friend
  - `GET /leaderboard` - Get friends-only leaderboard with rankings

#### Frontend
- **Friends Page** (`/friends`)
  - 4 tabs: My Friends, Requests, Find Friends, Leaderboard
  - Search users with real-time results
  - Send/accept/reject friend requests
  - View friends list with removal option
  - Friends-only leaderboard showing:
    - Completed materials
    - Current streak
    - Total study time
    - Rankings with gold/silver/bronze styling

- **Navigation**
  - Friends link added to Navbar dropdown
  - Friends link added to Sidebar
  - Notification badges for pending requests

### Phase 5: Email/Push Notifications

#### Backend
- **Database Tables**
  - `notifications` - stores in-app notifications
  - `notification_preferences` - user notification settings
  - `scheduled_notifications` - future notifications (exam reminders, etc.)

- **API Endpoints** (`/api/notifications`)
  - `GET /` - Get user notifications with unread count
  - `PUT /:id/read` - Mark notification as read
  - `PUT /read-all` - Mark all as read
  - `DELETE /:id` - Delete notification
  - `GET /preferences` - Get notification preferences
  - `PUT /preferences` - Update notification preferences

- **Notification Types**
  - 👥 Friend Requests
  - 🔥 Streak Warnings
  - 📝 Exam Reminders
  - 🏆 Achievements
  - 🎯 Daily Goals

- **Cron Jobs** (automated notifications)
  - **Streak Warnings** - Daily at 8 PM
    - Notifies users who haven't studied and have an active streak
  - **Daily Goal Reminders** - Daily at 6 PM
    - Reminds users who haven't met their daily study goal
  - **Exam Reminders** - Daily at 9 AM
    - Notifies about quizzes due within 3 days
  - **Scheduled Notifications** - Every 5 minutes
    - Processes scheduled notifications

- **Email Integration** (optional)
  - Nodemailer integration for email notifications
  - Configurable via SMTP settings in `.env`
  - Respects user preferences
  - HTML email templates with branding

#### Frontend
- **Notification Bell** (Navbar)
  - Real-time notification count badge
  - Dropdown with recent notifications
  - Mark as read/delete actions
  - Auto-refresh every 30 seconds
  - Click notification to navigate to relevant page

- **Notification Settings Page** (`/notifications/settings`)
  - Toggle email notifications on/off
  - Toggle push notifications on/off
  - Individual toggles for each notification type
  - Save preferences with success feedback

## 🗄️ Database Schema

### Friendships Table
```sql
CREATE TABLE friendships (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  friend_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, rejected
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, friend_id),
  CHECK (user_id != friend_id)
);
```

### Notifications Table
```sql
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  link VARCHAR(255),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Notification Preferences Table
```sql
CREATE TABLE notification_preferences (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  email_enabled BOOLEAN DEFAULT TRUE,
  push_enabled BOOLEAN DEFAULT TRUE,
  friend_requests BOOLEAN DEFAULT TRUE,
  streak_warnings BOOLEAN DEFAULT TRUE,
  exam_reminders BOOLEAN DEFAULT TRUE,
  achievements BOOLEAN DEFAULT TRUE,
  daily_goals BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Scheduled Notifications Table
```sql
CREATE TABLE scheduled_notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  scheduled_for TIMESTAMP NOT NULL,
  payload JSONB,
  sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🚀 Setup Instructions

### 1. Run Database Migration
```bash
cd server
node migrate_phase4_5.js
```

### 2. Install Dependencies
```bash
cd server
npm install node-cron nodemailer
```

### 3. Configure Email (Optional)
Edit `server/.env` and add SMTP settings:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=EXIT-IT <noreply@exitit.com>
CLIENT_URL=http://localhost:5173
```

**For Gmail:**
1. Enable 2-factor authentication
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the app password in `SMTP_PASS`

### 4. Restart Server
```bash
cd server
npm run dev
```

The cron jobs will start automatically when the server starts.

## 📱 Usage Guide

### Friend System

1. **Find Friends**
   - Go to Friends page → Find Friends tab
   - Search by name or email
   - Click the + button to send a friend request

2. **Manage Requests**
   - Go to Friends page → Requests tab
   - Accept or reject pending requests
   - View sent requests status

3. **Friends Leaderboard**
   - Go to Friends page → Leaderboard tab
   - See how you rank among your friends
   - Compare study time, streaks, and completed materials

### Notifications

1. **View Notifications**
   - Click the bell icon in the navbar
   - See unread count badge
   - Click notification to navigate to relevant page

2. **Manage Notifications**
   - Mark individual notifications as read
   - Mark all as read
   - Delete notifications

3. **Configure Preferences**
   - Click settings icon in notification dropdown
   - Or go to `/notifications/settings`
   - Toggle email/push notifications
   - Enable/disable specific notification types

## 🔔 Notification Triggers

### Automatic Notifications

1. **Friend Request Received**
   - Triggered when someone sends you a friend request
   - Link: `/friends`

2. **Friend Request Accepted**
   - Triggered when someone accepts your friend request
   - Link: `/friends`

3. **Streak Warning** (8 PM daily)
   - Triggered if you haven't studied today and have an active streak
   - Link: `/dashboard`

4. **Daily Goal Reminder** (6 PM daily)
   - Triggered if you haven't met your daily study goal
   - Link: `/dashboard`

5. **Exam Reminder** (9 AM daily)
   - Triggered for quizzes due within 3 days
   - Link: `/quizzes`

### Manual Notifications

You can create custom notifications programmatically:

```javascript
const notificationsController = require('./notifications/notifications.controller');

await notificationsController.createNotification(
  userId,
  'achievements',
  'New Achievement Unlocked!',
  'You earned the "Study Master" badge!',
  '/trophies'
);
```

### Scheduled Notifications

Schedule future notifications:

```javascript
await notificationsController.scheduleNotification(
  userId,
  'exam_reminders',
  new Date('2026-05-20T09:00:00'),
  {
    title: 'Exam Tomorrow!',
    message: 'Your Advanced Programming exam is tomorrow at 10 AM',
    link: '/exam'
  }
);
```

## 🎨 UI Components

### NotificationBell Component
- Displays unread count badge
- Dropdown with recent 10 notifications
- Auto-refresh every 30 seconds
- Click outside to close
- Emoji icons for notification types

### Friends Page
- Clean tabbed interface
- Real-time search
- Responsive design
- Dark mode support
- Loading states

### Notification Settings Page
- Toggle switches for all preferences
- Visual feedback on save
- Organized by channels and types
- Descriptions for each setting

## 🔧 Technical Details

### Cron Job Schedule
- `0 20 * * *` - 8 PM daily (streak warnings)
- `0 18 * * *` - 6 PM daily (daily goal reminders)
- `0 9 * * *` - 9 AM daily (exam reminders)
- `*/5 * * * *` - Every 5 minutes (scheduled notifications)

### Email Template
HTML emails with:
- EXIT-IT branding
- Responsive design
- Call-to-action buttons
- Unsubscribe information

### Performance Optimizations
- Database indexes on frequently queried columns
- Notification polling every 30 seconds (not real-time WebSocket)
- Limit notifications to 10 in dropdown
- Pagination support for full notification list

## 🐛 Troubleshooting

### Emails Not Sending
1. Check SMTP credentials in `.env`
2. Verify SMTP_HOST and SMTP_PORT
3. For Gmail, ensure App Password is used (not regular password)
4. Check server logs for email errors

### Cron Jobs Not Running
1. Verify server started successfully
2. Check server logs for cron job initialization
3. Ensure database connection is working
4. Check for any errors in cron job execution

### Notifications Not Appearing
1. Check notification preferences are enabled
2. Verify user is logged in
3. Check browser console for errors
4. Ensure API endpoints are accessible

## 📊 Analytics Integration

The friends leaderboard integrates with existing analytics:
- `user_progress` - completed materials count
- `streaks` - current and longest streak
- `study_sessions` - total study time

## 🔐 Security Considerations

1. **Friend Requests**
   - Users can only send requests to other users
   - Cannot send request to self
   - Duplicate requests prevented

2. **Notifications**
   - Users can only see their own notifications
   - Notification preferences are user-specific
   - Email addresses not exposed in friend search

3. **Email**
   - SMTP credentials stored in environment variables
   - Email sending respects user preferences
   - Unsubscribe information included

## 🎯 Future Enhancements

Potential improvements for future phases:

1. **Real-time Notifications**
   - WebSocket integration for instant notifications
   - Browser push notifications API

2. **Friend Activity Feed**
   - See what friends are studying
   - Recent achievements and milestones

3. **Study Groups**
   - Create study groups with friends
   - Group challenges and competitions

4. **Direct Messaging**
   - Chat with friends
   - Share notes and resources

5. **Notification Digest**
   - Daily/weekly email summaries
   - Customizable digest frequency

## ✅ Testing Checklist

- [x] Database migration runs successfully
- [x] Friend search works
- [x] Friend requests can be sent/accepted/rejected
- [x] Friends list displays correctly
- [x] Friends leaderboard shows rankings
- [x] Notification bell shows unread count
- [x] Notifications can be marked as read
- [x] Notification preferences can be updated
- [x] Cron jobs start with server
- [x] Email configuration is optional
- [x] All routes are protected with authentication
- [x] Dark mode works on all new pages
- [x] Responsive design on mobile
- [x] No TypeScript/ESLint errors

## 📝 Notes

- Email notifications are **optional** - the system works without SMTP configuration
- Cron jobs run automatically when the server starts
- Notification polling is client-side (every 30 seconds)
- Friends leaderboard only shows accepted friends
- Rejected friend requests can be re-sent after deletion

---

**Phase 4 & 5 Complete!** 🎉

All features are production-ready with zero diagnostics errors.
