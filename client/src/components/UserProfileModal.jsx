import { X, Users, UserCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../api/axios';
import { getAvatarUrl } from '../utils/avatar';

export default function UserProfileModal({ userId, userName, userEmail, userAvatar, onClose }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserStats();
  }, [userId]);

  const fetchUserStats = async () => {
    try {
      const res = await api.get(`/friends/${userId}/stats`);
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const resolvedAvatarUrl = getAvatarUrl(
    stats?.user || stats?.avatar_url || userAvatar,
    userEmail,
    userName
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-card rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-neutral-200 dark:border-neutral-800 animate-scale-in overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-primary/10 border-2 border-primary/20 shadow-sm shrink-0 flex items-center justify-center">
                <img 
                  src={resolvedAvatarUrl} 
                  alt={userName} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(userEmail || userName || 'User')}`;
                  }}
                />
              </div>
              <div className="min-w-0">
                <h3 className="text-xl font-bold text-text truncate">{userName}</h3>
                <p className="text-sm text-text/70 truncate">{userEmail}</p>
                {stats?.user?.bio && (
                  <p className="text-xs text-text/60 italic line-clamp-2 mt-1 bg-text/5 px-2 py-1 rounded-lg">
                    "{stats.user.bio}"
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-text/40 hover:text-text p-1 rounded-lg hover:bg-text/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
            </div>
          ) : stats ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-xs font-semibold text-text/60 uppercase tracking-wider">Friends</span>
                  </div>
                  <p className="text-2xl font-black text-text">{stats.friendsCount || 0}</p>
                </div>

                <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <UserCheck className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-semibold text-text/60 uppercase tracking-wider">Mutual</span>
                  </div>
                  <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{stats.mutualFriendsCount || 0}</p>
                </div>
              </div>

              {stats.mutualFriends && stats.mutualFriends.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-xs font-bold text-text/60 uppercase tracking-wider mb-2.5">
                    Mutual Friends ({stats.mutualFriends.length})
                  </h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {stats.mutualFriends.map((friend) => (
                      <div key={friend.id} className="flex items-center gap-2.5 text-sm p-2 rounded-xl bg-background border border-neutral-100 dark:border-neutral-800">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-primary/10 border border-primary/20 shrink-0 flex items-center justify-center">
                          <img 
                            src={getAvatarUrl(friend)}
                            alt={friend.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(friend.email || friend.name || 'User')}`;
                            }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-text truncate">{friend.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-text/70 py-8">
              Unable to load user stats
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
