import { useState, useEffect, useRef } from 'react';
import { Bell, Check, Trash2, Settings, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function NotificationBell() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications?limit=10');
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unreadCount);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await api.delete(`/notifications/${notificationId}`);
      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    if (notification.link) {
      navigate(notification.link);
      setIsOpen(false);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'friend_request':
        return <span className="bg-blue-500/20 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0"><UserPlus className="w-5 h-5 text-blue-500" /></span>;
      case 'streak_warnings':
        return <span className="text-2xl bg-orange-500/20 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">🔥</span>;
      case 'exam_reminders':
        return <span className="text-2xl bg-purple-500/20 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">📝</span>;
      case 'achievements':
        return <span className="text-2xl bg-yellow-500/20 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">🏆</span>;
      case 'daily_goals':
        return <span className="text-2xl bg-green-500/20 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">🎯</span>;
      default:
        return <span className="text-2xl bg-text/10 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">🔔</span>;
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = Math.floor((now - time) / 1000); // seconds

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return time.toLocaleDateString();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-text hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Mobile Overlay Backdrop */}
          <div 
            className="fixed inset-0 bg-black/40 z-40 sm:hidden animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Container */}
          <div className="fixed inset-x-3 top-16 sm:absolute sm:inset-x-auto sm:right-0 sm:top-auto sm:mt-2 w-auto sm:w-96 bg-card border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl z-50 max-h-[calc(100vh-5rem)] sm:max-h-[600px] overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Header */}
            <div className="p-4 border-b border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
              <h3 className="font-bold text-text">Notifications</h3>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-accent hover:underline"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => {
                  navigate('/notifications/settings');
                  setIsOpen(false);
                }}
                className="p-1 text-text/60 hover:bg-background rounded"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-text/50">
                <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-text/10 hover:bg-background/50 transition-colors ${
                    !notification.is_read ? 'bg-accent/5' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <div
                        onClick={() => handleNotificationClick(notification)}
                        className="cursor-pointer"
                      >
                        <h4 className="font-medium text-text text-sm">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-text/70 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-text/40 mt-2">
                          {formatTime(notification.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {!notification.is_read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                          className="p-1 text-accent hover:bg-accent/20 rounded"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="p-1 text-warning hover:bg-warning/20 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-text/10 text-center">
              <button
                onClick={() => {
                  navigate('/notifications');
                  setIsOpen(false);
                }}
                className="text-sm text-accent hover:underline"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
        </>
      )}
    </div>
  );
}
