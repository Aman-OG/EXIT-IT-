import { useState, useEffect } from 'react';
import { Bell, Mail, Smartphone, Save } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function NotificationSettings() {
  const [preferences, setPreferences] = useState({
    email_enabled: true,
    push_enabled: true,
    friend_requests: true,
    streak_warnings: true,
    exam_reminders: true,
    achievements: true,
    daily_goals: true,
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const res = await fetch('http://localhost:5005/api/notifications/preferences', {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setPreferences(data);
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  };

  const savePreferences = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const res = await fetch('http://localhost:5005/api/notifications/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(preferences),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  const togglePreference = (key) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const notificationTypes = [
    {
      key: 'friend_requests',
      icon: '👥',
      title: 'Friend Requests',
      description: 'Get notified when someone sends you a friend request',
    },
    {
      key: 'streak_warnings',
      icon: '🔥',
      title: 'Streak Warnings',
      description: 'Reminders when your study streak is at risk',
    },
    {
      key: 'exam_reminders',
      icon: '📝',
      title: 'Exam Reminders',
      description: 'Notifications about upcoming quizzes and exams',
    },
    {
      key: 'achievements',
      icon: '🏆',
      title: 'Achievements',
      description: 'Celebrate when you unlock new achievements',
    },
    {
      key: 'daily_goals',
      icon: '🎯',
      title: 'Daily Goals',
      description: 'Reminders to complete your daily study goals',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Notification Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage how you receive notifications from EXIT-IT
          </p>
        </div>

        <div className="space-y-6">
          {/* Global Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Notification Channels
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Email Notifications</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Receive notifications via email
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.email_enabled}
                    onChange={() => togglePreference('email_enabled')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Push Notifications</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Receive in-app notifications
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.push_enabled}
                    onChange={() => togglePreference('push_enabled')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Notification Types */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Notification Types
            </h2>
            <div className="space-y-4">
              {notificationTypes.map((type) => (
                <div
                  key={type.key}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{type.icon}</span>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{type.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{type.description}</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences[type.key]}
                      onChange={() => togglePreference(type.key)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-4">
            {saved && (
              <span className="text-green-600 dark:text-green-400 flex items-center gap-2">
                <span className="text-xl">✓</span>
                Settings saved successfully!
              </span>
            )}
            <button
              onClick={savePreferences}
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
