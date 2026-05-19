import { useState, useEffect } from 'react';
import { Bell, Check, Trash2, Settings, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('http://localhost:5005/api/notifications', {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const res = await fetch(`http://localhost:5005/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        credentials: 'include',
      });
      if (res.ok) {
        fetchNotifications();
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await fetch('http://localhost:5005/api/notifications/read-all', {
        method: 'PUT',
        credentials: 'include',
      });
      if (res.ok) {
        fetchNotifications();
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const res = await fetch(`http://localhost:5005/api/notifications/${notificationId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        fetchNotifications();
      }
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
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'friend_request':
        return <span className="bg-blue-500/20 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0"><UserPlus className="w-6 h-6 text-blue-500" /></span>;
      case 'streak_warnings':
        return <span className="text-2xl bg-orange-500/20 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">🔥</span>;
      case 'exam_reminders':
        return <span className="text-2xl bg-purple-500/20 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">📝</span>;
      case 'achievements':
        return <span className="text-2xl bg-yellow-500/20 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">🏆</span>;
      case 'daily_goals':
        return <span className="text-2xl bg-green-500/20 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">🎯</span>;
      default:
        return <span className="text-2xl bg-text/10 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">🔔</span>;
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
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text mb-2">
            All Notifications
          </h1>
          <p className="text-text/70">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        <div className="flex gap-3">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 text-sm bg-accent text-background rounded-lg hover:opacity-90 transition-opacity"
            >
              Mark all read
            </button>
          )}
          <button
            onClick={() => navigate('/notifications/settings')}
            className="px-4 py-2 text-sm bg-card text-text rounded-lg hover:opacity-80 transition-opacity flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-text/70">Loading notifications...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg">
          <Bell className="w-16 h-16 mx-auto text-text/40 mb-4 opacity-50" />
          <p className="text-text/70 text-lg mb-2">No notifications yet</p>
          <p className="text-text/50 text-sm">
            When you get notifications, they'll show up here
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-card rounded-lg p-4 hover:bg-card/80 transition-colors ${
                !notification.is_read ? 'ring-1 ring-accent/30' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                {getNotificationIcon(notification.type)}
                <div className="flex-1 min-w-0">
                  <div
                    onClick={() => handleNotificationClick(notification)}
                    className="cursor-pointer"
                  >
                    <h3 className="font-semibold text-text mb-1">
                      {notification.title}
                    </h3>
                    <p className="text-text/70 mb-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-text/50">
                      {formatTime(notification.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!notification.is_read && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification.id);
                      }}
                      className="p-2 text-accent hover:bg-accent/20 rounded-lg transition-colors"
                      title="Mark as read"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                    className="p-2 text-warning hover:bg-warning/20 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
