import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notificationQueue, setNotificationQueue] = useState([]);

  const enqueueNotification = (notif) => {
    setNotificationQueue(prev => [...prev, notif]);
  };

  const popNotification = () => {
    setNotificationQueue(prev => prev.slice(1));
  };

  // Check if user is logged in
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await api.get('/users/me');
        setUser(data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/users/login', { email, password });
    setUser(data);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/users/register', { name, email, password });
    setUser(data);
    return data;
  };

  const googleLogin = async (googleToken) => {
    const { data } = await api.post('/users/google-login', { token: googleToken });
    setUser(data);
    return data;
  };

  const googleRegister = async (googleToken) => {
    const { data } = await api.post('/users/google-register', { token: googleToken });
    setUser(data);
    return data;
  };

  const logout = async () => {
    await api.post('/users/logout');
    setUser(null);
  };

  /**
   * Centralized streak trigger.
   * Calls API, reads the response, updates user context, fires the right notification in the queue.
   * Returns generic boolean if it updated (for sequential handling).
   */
  const triggerStreakUpdate = async () => {
    try {
      const prevStreak = user?.current_streak ?? 0;
      const { data } = await api.post('/users/streak');
      const { current_streak, streak_freezes, updated, freezesUsed } = data;

      // Always sync user context with fresh streak + freeze values
      setUser(prev => prev ? { ...prev, current_streak, streak_freezes } : prev);

      if (updated) {
        if (freezesUsed > 0) {
          // Streak saved by freeze(s)
          enqueueNotification({ category: 'streak', type: 'freeze_used', streak: current_streak, days: freezesUsed });
        } else if (current_streak === 1 && prevStreak > 1) {
          // Streak was broken — reset to day 1
          enqueueNotification({ category: 'streak', type: 'broken', streak: current_streak });
        } else {
          // Normal extend (or very first day)
          enqueueNotification({ category: 'streak', type: 'extended', streak: current_streak });
        }
      }
      return updated;
    } catch (err) {
      console.error('Streak update failed:', err);
      return false;
    }
  };

  /**
   * Show floating "+X pts" animation and update user total_score in context via queue.
   */
  const triggerPointsEarned = (points, label = 'Points Earned!') => {
    if (!points || points <= 0) return;
    setUser(prev => prev ? { ...prev, total_score: (prev.total_score || 0) + points } : prev);
    enqueueNotification({ category: 'points', points, label });
  };

  /**
   * Fetches the analytics profile safely and queues any newly unlocked badges
   */
  const evaluateBadges = async () => {
    if (!user?.id) return;
    try {
        const res = await api.get('/analytics/profile');
        const fetchedBadges = res.data.badges;
        if (!fetchedBadges) return;
        
        const badgeDetails = {
            initiator:  { icon: '🚀', name: 'The Initiator',      desc: 'Started your first practice quiz' },
            flawless:   { icon: '💎', name: 'Flawless Victory',   desc: 'Achieved a perfect 100% score' },
            consistent: { icon: '🔥', name: 'Consistent Learner', desc: 'Reached a 3-day active streak' },
            marathon:   { icon: '📚', name: 'Marathon Reader',    desc: 'Read 5 different study PDFs' },
            weekend:    { icon: '🌞', name: 'Weekend Warrior',    desc: 'Studied on a Saturday or Sunday' },
            nightowl:   { icon: '🦉', name: 'Night Owl',          desc: 'Studied late (Midnight to 4AM)' },
            centurion:  { icon: '💯', name: 'The Centurion',      desc: 'Solved 100 total questions' },
            examready:  { icon: '🏆', name: 'Exam Ready',         desc: 'Completed > 85% of platform materials' },
        };
        const badgeIds = Object.keys(badgeDetails);
        const storageKey = `exit_unlocked_badges_${user.id}`;
        const prevUnlocked = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const newlyUnlocked = badgeIds.filter(id => fetchedBadges[id]?.isUnlocked && !prevUnlocked.includes(id));
        const currentUnlocked = badgeIds.filter(id => fetchedBadges[id]?.isUnlocked);
        
        localStorage.setItem(storageKey, JSON.stringify(currentUnlocked));
        
        if (newlyUnlocked.length > 0) {
            newlyUnlocked.forEach(id => {
                enqueueNotification({ category: 'badge', ...badgeDetails[id] });
            });
        }
    } catch (err) {
        console.error("Failed to evaluate badges", err);
    }
  };

  return (
    <AuthContext.Provider value={{
      user, setUser, login, register, logout, loading,
      googleLogin, googleRegister,
      notificationQueue, popNotification,
      triggerStreakUpdate,
      triggerPointsEarned,
      evaluateBadges,
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
