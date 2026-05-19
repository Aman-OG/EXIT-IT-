import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import StudyViewer from './pages/StudyViewer';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import QuizManager from './pages/admin/QuizManager';
import AdminReports from './pages/admin/AdminReports';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import QuizViewer from './pages/QuizViewer';
import Quizzes from './pages/Quizzes';
import Notes from './pages/Notes';
import ExamMode from './pages/ExamMode';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import TrophyRoom from './pages/TrophyRoom';
import RoadmapPage from './pages/RoadmapPage';
import LandingPage from './pages/LandingPage';
import Flashcards from './pages/Flashcards';
import Friends from './pages/Friends';
import NotificationSettings from './pages/NotificationSettings';
import StreakCelebration from './components/StreakCelebration';

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
        <Route path="notifications/settings" element={<NotificationSettings />} />
        
        {/* Strictly Guarded Admin Zone */}
        <Route path="admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
        <Route path="admin/quiz/:courseId" element={<AdminRoute><QuizManager /></AdminRoute>} />
        <Route path="admin/reports" element={<AdminRoute><AdminReports /></AdminRoute>} />
        <Route path="admin/analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
      </Route>
    </Routes>
    </>
  );
}

export default App;
