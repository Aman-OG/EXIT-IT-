const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const userRoutes = require('./users/user.routes');
const adminRoutes = require('./admin/admin.routes');
const settingsRoutes = require('./settings/settings.routes');
const coursesRoutes = require('./courses/courses.routes');
const materialsRoutes = require('./materials/materials.routes');
const progressRoutes = require('./progress/progress.routes');
const quizRoutes = require('./quizzes/quiz.routes');
const notesRoutes = require('./notes/notes.routes');
const analyticsRoutes = require('./analytics/analytics.routes');
const examsRoutes = require('./exams/exams.routes');
const aiRoutes = require('./ai/ai.routes');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Global Request Logger for Debugging 404s
app.use((req, res, next) => {
  console.log(`📡 [REQUEST] ${req.method} ${req.originalUrl}`);
  next();
});

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/materials', materialsRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/exams', examsRoutes);
app.use('/api/ai', aiRoutes);

// Basic health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'EXIT-IT API is running' });
});

// Catch-all 404 Debugger
app.use((req, res, next) => {
  console.log(`❌ [404-HIT] ${req.method} ${req.originalUrl} matched NO routes.`);
  res.status(404).json({ message: `Route ${req.originalUrl} not found on this server.` });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

module.exports = app;
