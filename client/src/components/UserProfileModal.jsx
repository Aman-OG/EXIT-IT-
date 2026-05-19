import { X, Users, UserCheck } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function UserProfileModal({ userId, userName, userEmail, onClose }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserStats();
  }, [userId]);

  const fetchUserStats = async () => {
    try {
      const res = await fetch(`http://localhost:5005/api/friends/${userId}/stats`, {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const avatarUrl = `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(userEmail || userName)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                <img src={avatarUrl} alt={userName} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{userName}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{userEmail}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
            </div>
          ) : stats ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Friends</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.friendsCount || 0}</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <UserCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Mutual</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.mutualFriendsCount || 0}</p>
                </div>
              </div>

              {stats.mutualFriends && stats.mutualFriends.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mutual Friends ({stats.mutualFriends.length})
                  </h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {stats.mutualFriends.map((friend) => (
                      <div key={friend.id} className="flex items-center gap-2 text-sm">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                          <img 
                            src={`https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(friend.email || friend.name)}`}
                            alt={friend.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-gray-900 dark:text-white">{friend.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-gray-600 dark:text-gray-400 py-8">
              Unable to load user stats
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
