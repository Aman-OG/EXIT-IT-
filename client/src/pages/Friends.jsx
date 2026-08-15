import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, Search, Check, X, UserMinus, Trophy, Clock, BookOpen } from 'lucide-react';
import Toast from '../components/Toast';
import ConfirmDialog from '../components/ConfirmDialog';
import UserProfileModal from '../components/UserProfileModal';
import api from '../api/axios';

export default function Friends() {
  const [activeTab, setActiveTab] = useState('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [friendsLeaderboard, setFriendsLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  useEffect(() => {
    fetchFriends();
    fetchPendingRequests();
    fetchSentRequests();
    fetchFriendsLeaderboard();
  }, []);

  const fetchFriends = async () => {
    try {
      const res = await api.get('/friends');
      setFriends(res.data);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const res = await api.get('/friends/requests/pending');
      setPendingRequests(res.data);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    }
  };

  const fetchSentRequests = async () => {
    try {
      const res = await api.get('/friends/requests/sent');
      setSentRequests(res.data);
    } catch (error) {
      console.error('Error fetching sent requests:', error);
    }
  };

  const fetchFriendsLeaderboard = async () => {
    try {
      const res = await api.get('/friends/leaderboard');
      setFriendsLeaderboard(res.data);
    } catch (error) {
      console.error('Error fetching friends leaderboard:', error);
    }
  };

  const searchUsers = async (query) => {
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      const res = await api.get(`/friends/search?query=${encodeURIComponent(query)}`);
      setSearchResults(res.data);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const sendFriendRequest = async (friendId) => {
    setLoading(true);
    try {
      await api.post('/friends/request', { friendId });
      showToast('Friend request sent!', 'success');
      setSearchResults([]);
      setSearchQuery('');
      fetchSentRequests();
    } catch (error) {
      console.error('Error sending friend request:', error);
      showToast(error.response?.data?.error || 'Failed to send friend request', 'error');
    } finally {
      setLoading(false);
    }
  };

  const acceptFriendRequest = async (requestId) => {
    setLoading(true);
    try {
      await api.put(`/friends/requests/${requestId}/accept`);
      showToast('Friend request accepted!', 'success');
      fetchPendingRequests();
      fetchFriends();
      fetchFriendsLeaderboard();
    } catch (error) {
      console.error('Error accepting friend request:', error);
      showToast('Failed to accept friend request', 'error');
    } finally {
      setLoading(false);
    }
  };

  const rejectFriendRequest = async (requestId) => {
    setLoading(true);
    try {
      await api.put(`/friends/requests/${requestId}/reject`);
      showToast('Friend request rejected', 'info');
      fetchPendingRequests();
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      showToast('Failed to reject friend request', 'error');
    } finally {
      setLoading(false);
    }
  };

  const removeFriend = async (friendId) => {
    setConfirmDialog({
      title: 'Remove Friend',
      message: 'Are you sure you want to remove this friend? This action cannot be undone.',
      onConfirm: async () => {
        setConfirmDialog(null);
        setLoading(true);
        try {
          await api.delete(`/friends/${friendId}`);
          showToast('Friend removed', 'info');
          fetchFriends();
          fetchFriendsLeaderboard();
        } catch (error) {
          console.error('Error removing friend:', error);
          showToast('Failed to remove friend', 'error');
        } finally {
          setLoading(false);
        }
      },
      onCancel: () => setConfirmDialog(null),
    });
  };

  return (
    <div className="h-full overflow-y-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
      {confirmDialog && (
        <ConfirmDialog
          title={confirmDialog.title}
          message={confirmDialog.message}
          onConfirm={confirmDialog.onConfirm}
          onCancel={confirmDialog.onCancel}
        />
      )}
      {selectedUser && (
        <UserProfileModal
          userId={selectedUser.id}
          userName={selectedUser.name}
          userEmail={selectedUser.email}
          onClose={() => setSelectedUser(null)}
        />
      )}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text mb-2">Friends</h1>
          <p className="text-text/70">Connect with other learners and compete together</p>
        </div>

        {/* Tabs - Scrollable on mobile */}
        <div className="flex gap-2 mb-6 border-b border-text/10 overflow-x-auto no-scrollbar whitespace-nowrap pb-1">
          <button
            onClick={() => setActiveTab('friends')}
            className={`px-4 py-2 font-medium text-sm sm:text-base transition-colors shrink-0 ${
              activeTab === 'friends'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text/70 hover:text-text'
            }`}
          >
            <Users className="inline w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            My Friends ({friends.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 font-medium text-sm sm:text-base transition-colors relative shrink-0 ${
              activeTab === 'requests'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text/70 hover:text-text'
            }`}
          >
            <UserPlus className="inline w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Requests
            {pendingRequests.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {pendingRequests.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`px-4 py-2 font-medium text-sm sm:text-base transition-colors shrink-0 ${
              activeTab === 'search'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text/70 hover:text-text'
            }`}
          >
            <Search className="inline w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Find Friends
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-4 py-2 font-medium text-sm sm:text-base transition-colors shrink-0 ${
              activeTab === 'leaderboard'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text/70 hover:text-text'
            }`}
          >
            <Trophy className="inline w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Leaderboard
          </button>
        </div>

        {/* Friends Tab */}
        {activeTab === 'friends' && (
          <div className="grid gap-4">
            {friends.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800">
                <Users className="w-16 h-16 mx-auto text-text/40 mb-4" />
                <p className="text-text/70 mb-4 font-semibold">You don't have any friends yet</p>
                <button
                  onClick={() => setActiveTab('search')}
                  className="px-5 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition shadow-md"
                >
                  Find Friends
                </button>
              </div>
            ) : (
              friends.map((friend) => {
                const avatarUrl = `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(friend.email || friend.name)}`;
                return (
                <div
                  key={friend.friend_id}
                  className="bg-card p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow"
                >
                  <div 
                    className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                    onClick={() => setSelectedUser({ id: friend.friend_id, name: friend.name, email: friend.email })}
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-background flex-shrink-0 border border-neutral-200 dark:border-neutral-800">
                      <img src={avatarUrl} alt={friend.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-text truncate">{friend.name}</h3>
                      <p className="text-sm text-text/70 truncate">{friend.email}</p>
                      <p className="text-xs text-text/50 mt-1">
                        Friends since {new Date(friend.friends_since).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFriend(friend.friend_id)}
                    disabled={loading}
                    className="self-end sm:self-center flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-500 hover:bg-red-500/10 rounded-xl transition-colors font-medium"
                  >
                    <UserMinus className="w-4 h-4" />
                    Unfollow
                  </button>
                </div>
              );
              })
            )}
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <div className="space-y-6">
            {/* Pending Requests */}
            <div>
              <h2 className="text-xl font-semibold text-text mb-4">
                Pending Requests ({pendingRequests.length})
              </h2>
              <div className="grid gap-4">
                {pendingRequests.length === 0 ? (
                  <p className="text-text/70 text-center py-8 bg-card rounded-2xl border border-neutral-200 dark:border-neutral-800 font-medium">
                    No pending friend requests
                  </p>
                ) : (
                  pendingRequests.map((request) => {
                    const avatarUrl = `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(request.email || request.name)}`;
                    return (
                    <div
                      key={request.id}
                      className="bg-card p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-background flex-shrink-0 border border-neutral-200 dark:border-neutral-800">
                          <img src={avatarUrl} alt={request.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-text truncate">{request.name}</h3>
                          <p className="text-sm text-text/70 truncate">{request.email}</p>
                          <p className="text-xs text-text/50 mt-1">
                            {new Date(request.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 self-end sm:self-center">
                        <button
                          onClick={() => acceptFriendRequest(request.id)}
                          disabled={loading}
                          className="p-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-sm"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => rejectFriendRequest(request.id)}
                          disabled={loading}
                          className="p-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors shadow-sm"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  );
                  })
                )}
              </div>
            </div>

            {/* Sent Requests */}
            <div>
              <h2 className="text-xl font-semibold text-text mb-4">
                Sent Requests ({sentRequests.length})
              </h2>
              <div className="grid gap-4">
                {sentRequests.length === 0 ? (
                  <p className="text-text/70 text-center py-8 bg-card rounded-2xl border border-neutral-200 dark:border-neutral-800 font-medium">
                    No sent friend requests
                  </p>
                ) : (
                  sentRequests.map((request) => {
                    const avatarUrl = `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(request.email || request.name)}`;
                    return (
                    <div
                      key={request.id}
                      className="bg-card p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-background flex-shrink-0 border border-neutral-200 dark:border-neutral-800">
                          <img src={avatarUrl} alt={request.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-text truncate">{request.name}</h3>
                          <p className="text-sm text-text/70 truncate">{request.email}</p>
                          <p className="text-xs text-text/50 mt-1">
                            Sent {new Date(request.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs sm:text-sm text-amber-600 dark:text-amber-400 font-bold bg-amber-500/10 px-3 py-1 rounded-full shrink-0">Pending</span>
                    </div>
                  );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* Search Tab */}
        {activeTab === 'search' && (
          <div>
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-text/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    searchUsers(e.target.value);
                  }}
                  placeholder="Search by name or email..."
                  className="w-full pl-11 pr-4 py-3 bg-card border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-primary text-sm transition"
                />
              </div>
            </div>

            <div className="grid gap-4">
              {searchLoading ? (
                <p className="text-center py-8 text-text/70 font-medium">Searching...</p>
              ) : searchResults.length === 0 && searchQuery.length >= 2 ? (
                <p className="text-center py-8 text-text/70 font-medium">No users found</p>
              ) : searchQuery.length < 2 ? (
                <p className="text-center py-8 text-text/70 font-medium">
                  Enter at least 2 characters to search
                </p>
              ) : (
                searchResults.map((user) => {
                  const avatarUrl = `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(user.email || user.name)}`;
                  return (
                  <div
                    key={user.id}
                    className="bg-card p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-background flex-shrink-0 border border-neutral-200 dark:border-neutral-800">
                        <img src={avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-text truncate">{user.name}</h3>
                        <p className="text-sm text-text/70 truncate">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => sendFriendRequest(user.id)}
                      disabled={loading}
                      className="px-4 py-2 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-colors disabled:opacity-50 flex items-center gap-2 text-sm shrink-0 shadow-sm"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                  </div>
                );
                })
              )}
            </div>
          </div>
        )}

        {/* Leaderboard Tab - Horizontally Scrollable Table */}
        {activeTab === 'leaderboard' && (
          <div>
            <div className="bg-card rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead className="bg-background border-b border-neutral-200 dark:border-neutral-800">
                    <tr>
                      <th className="px-4 sm:px-6 py-3.5 text-left text-xs font-bold text-text/50 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-4 sm:px-6 py-3.5 text-left text-xs font-bold text-text/50 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 sm:px-6 py-3.5 text-left text-xs font-bold text-text/50 uppercase tracking-wider">
                        <BookOpen className="inline w-4 h-4 mr-1" />
                        Materials
                      </th>
                      <th className="px-4 sm:px-6 py-3.5 text-left text-xs font-bold text-text/50 uppercase tracking-wider">
                        <Trophy className="inline w-4 h-4 mr-1" />
                        Streak
                      </th>
                      <th className="px-4 sm:px-6 py-3.5 text-left text-xs font-bold text-text/50 uppercase tracking-wider">
                        <Clock className="inline w-4 h-4 mr-1" />
                        Study Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {friendsLeaderboard.map((user) => {
                      const avatarUrl = `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(user.email || user.name)}`;
                      return (
                      <tr key={user.id} className="hover:bg-background/50 transition-colors">
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-xs sm:text-sm ${
                              user.rank === 1
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                                : user.rank === 2
                                ? 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300'
                                : user.rank === 3
                                ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                                : 'text-text/70'
                            }`}
                          >
                            {user.rank}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-background flex-shrink-0 border border-neutral-200 dark:border-neutral-800">
                              <img src={avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <div className="font-medium text-text">{user.name}</div>
                              <div className="text-xs text-text/40">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-text">
                          {user.completed_materials}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                          <span className="font-semibold text-text">{user.current_streak} days</span>
                          <span className="text-xs text-text/40 ml-1.5">
                            (best: {user.longest_streak})
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-text">
                          {Math.floor(user.total_study_minutes / 60)}h {user.total_study_minutes % 60}m
                        </td>
                      </tr>
                    );
                    })}
                  </tbody>
                </table>
              </div>
              {friendsLeaderboard.length === 0 && (
                <div className="text-center py-12">
                  <Trophy className="w-16 h-16 mx-auto text-text/40 mb-4" />
                  <p className="text-text/70 font-semibold">No leaderboard data yet</p>
                  <p className="text-xs text-text/50 mt-2">
                    Add friends to see how you compare!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
