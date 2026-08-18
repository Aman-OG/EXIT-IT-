import React, { useContext, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import LoadingSpinner from './components/LoadingSpinner';
import StreakCelebration from './components/StreakCelebration';

// Lazy load all route pages
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Courses = lazy(() => import('./pages/Courses'));
const StudyViewer = lazy(() => import('./pages/StudyViewer'));
const QuizViewer = lazy(() => import('./pages/QuizViewer'));
const Quizzes = lazy(() => import('./pages/Quizzes'));
const Notes = lazy(() => import('./pages/Notes'));
const ExamMode = lazy(() => import('./pages/ExamMode'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const Profile = lazy(() => import('./pages/Profile'));
const TrophyRoom = lazy(() => import('./pages/TrophyRoom'));
const RoadmapPage = lazy(() => import('./pages/RoadmapPage'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Flashcards = lazy(() => import('./pages/Flashcards'));
const Friends = lazy(() => import('./pages/Friends'));
const Notifications = lazy(() => import('./pages/Notifications'));
const NotificationSettings = lazy(() => import('./pages/NotificationSettings'));

// Lazy load admin pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const UserManagement = lazy(() => import('./pages/admin/UserManagement'));
const QuizManager = lazy(() => import('./pages/admin/QuizManager'));
const AdminReports = lazy(() => import('./pages/admin/AdminReports'));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'));
const AdminFeedback = lazy(() => import('./pages/admin/AdminFeedback'));

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/welcome" replace />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

function App() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <StreakCelebration />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/welcome" element={user ? <Navigate to="/" replace /> : <LandingPage />} />
          <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />
          <Route path="/trophies" element={<ProtectedRoute><TrophyRoom /></ProtectedRoute>} />
        
          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Navigate to="/" replace />} />
            <Route path="courses" element={<Courses />} />
            <Route path="roadmap" element={<RoadmapPage />} />
            <Route path="quizzes" element={<Quizzes />} />
            <Route path="notes" element={<Notes />} />
            <Route path="study/:id" element={<StudyViewer />} />
            <Route path="quiz/:id" element={<QuizViewer />} />
            <Route path="exam" element={<ExamMode />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="flashcards" element={<Flashcards />} />
            <Route path="friends" element={<Friends />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="notifications/settings" element={<NotificationSettings />} />
            
            {/* Strictly Guarded Admin Zone */}
            <Route path="admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
            <Route path="admin/quiz/:courseId" element={<AdminRoute><QuizManager /></AdminRoute>} />
            <Route path="admin/reports" element={<AdminRoute><AdminReports /></AdminRoute>} />
            <Route path="admin/analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
            <Route path="admin/feedback" element={<AdminRoute><AdminFeedback /></AdminRoute>} />

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
