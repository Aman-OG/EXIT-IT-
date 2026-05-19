import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, Search, Check, X, Trash2, Trophy, Clock, BookOpen } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function Friends() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [friendsLeaderboard, setFriendsLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    fetchFriends();
    fetchPendingRequests();
    fetchSentRequests();
    fetchFriendsLeaderboard();
  }, []);

  const fetchFriends = async () => {
    try {
      const res = await fetch('http://localhost:5005/api/friends', {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setFriends(data);
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const res = await fetch('http://localhost:5005/api/friends/requests/pending', {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setPendingRequests(data);
      }
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    }
  };

  const fetchSentRequests = async () => {
    try {
      const res = await fetch('http://localhost:5005/api/friends/requests/sent', {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setSentRequests(data);
      }
    } catch (error) {
      console.error('Error fetching sent requests:', error);
    }
  };

  const fetchFriendsLeaderboard = async () => {
    try {
      const res = await fetch('http://localhost:5005/api/friends/leaderboard', {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setFriendsLeaderboard(data);
      }
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
      const res = await fetch(`http://localhost:5005/api/friends/search?query=${encodeURIComponent(query)}`, {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const sendFriendRequest = async (friendId) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5005/api/friends/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ friendId }),
      });

      if (res.ok) {
        alert('Friend request sent!');
        setSearchResults([]);
        setSearchQuery('');
        fetchSentRequests();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to send friend request');
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
      alert('Failed to send friend request');
    } finally {
      setLoading(false);
    }
  };

  const acceptFriendRequest = async (requestId) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5005/api/friends/requests/${requestId}/accept`, {
        method: 'PUT',
        credentials: 'include',
      });

      if (res.ok) {
        alert('Friend request accepted!');
        fetchPendingRequests();
        fetchFriends();
        fetchFriendsLeaderboard();
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
    } finally {
      setLoading(false);
    }
  };

  const rejectFriendRequest = async (requestId) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5005/api/friends/requests/${requestId}/reject`, {
        method: 'PUT',
        credentials: 'include',
      });

      if (res.ok) {
        fetchPendingRequests();
      }
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFriend = async (friendId) => {
    if (!confirm('Are you sure you want to remove this friend?')) return;

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5005/api/friends/${friendId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        fetchFriends();
        fetchFriendsLeaderboard();
      }
    } catch (error) {
      console.error('Error removing friend:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Friends</h1>
          <p className="text-gray-600 dark:text-gray-400">Connect with other learners and compete together</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('friends')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'friends'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Users className="inline w-5 h-5 mr-2" />
            My Friends ({friends.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 font-medium transition-colors relative ${
              activeTab === 'requests'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <UserPlus className="inline w-5 h-5 mr-2" />
            Requests
            {pendingRequests.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {pendingRequests.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'search'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Search className="inline w-5 h-5 mr-2" />
            Find Friends
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'leaderboard'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Trophy className="inline w-5 h-5 mr-2" />
            Leaderboard
          </button>
        </div>

        {/* Friends Tab */}
        {activeTab === 'friends' && (
          <div className="grid gap-4">
            {friends.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
                <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">You don't have any friends yet</p>
                <button
                  onClick={() => setActiveTab('search')}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Find Friends
                </button>
              </div>
            ) : (
              friends.map((friend) => (
                <div
                  key={friend.friend_id}
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{friend.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{friend.email}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Friends since {new Date(friend.friends_since).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFriend(friend.friend_id)}
                    disabled={loading}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <div className="space-y-6">
            {/* Pending Requests */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Pending Requests ({pendingRequests.length})
              </h2>
              <div className="grid gap-4">
                {pendingRequests.length === 0 ? (
                  <p className="text-gray-600 dark:text-gray-400 text-center py-8 bg-white dark:bg-gray-800 rounded-lg">
                    No pending friend requests
                  </p>
                ) : (
                  pendingRequests.map((request) => (
                    <div
                      key={request.id}
                      className="bg-white dark:bg-gray-800 p-4 rounded-lg flex items-center justify-between"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{request.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{request.email}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {new Date(request.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => acceptFriendRequest(request.id)}
                          disabled={loading}
                          className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => rejectFriendRequest(request.id)}
                          disabled={loading}
                          className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Sent Requests */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Sent Requests ({sentRequests.length})
              </h2>
              <div className="grid gap-4">
                {sentRequests.length === 0 ? (
                  <p className="text-gray-600 dark:text-gray-400 text-center py-8 bg-white dark:bg-gray-800 rounded-lg">
                    No sent friend requests
                  </p>
                ) : (
                  sentRequests.map((request) => (
                    <div
                      key={request.id}
                      className="bg-white dark:bg-gray-800 p-4 rounded-lg flex items-center justify-between"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{request.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{request.email}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          Sent {new Date(request.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">Pending</span>
                    </div>
                  ))
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
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    searchUsers(e.target.value);
                  }}
                  placeholder="Search by name or email..."
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:text-white"
                />
              </div>
            </div>

            <div className="grid gap-4">
              {searchLoading ? (
                <p className="text-center py-8 text-gray-600 dark:text-gray-400">Searching...</p>
              ) : searchResults.length === 0 && searchQuery.length >= 2 ? (
                <p className="text-center py-8 text-gray-600 dark:text-gray-400">No users found</p>
              ) : searchQuery.length < 2 ? (
                <p className="text-center py-8 text-gray-600 dark:text-gray-400">
                  Enter at least 2 characters to search
                </p>
              ) : (
                searchResults.map((user) => (
                  <div
                    key={user.id}
                    className="bg-white dark:bg-gray-800 p-4 rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{user.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                    </div>
                    <button
                      onClick={() => sendFriendRequest(user.id)}
                      disabled={loading}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                      <UserPlus className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      <BookOpen className="inline w-4 h-4 mr-1" />
                      Materials
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      <Trophy className="inline w-4 h-4 mr-1" />
                      Streak
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      <Clock className="inline w-4 h-4 mr-1" />
                      Study Time
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {friendsLeaderboard.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                            user.rank === 1
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                              : user.rank === 2
                              ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                              : user.rank === 3
                              ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                              : 'text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          {user.rank}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                        {user.completed_materials}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-900 dark:text-white">{user.current_streak} days</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                          (best: {user.longest_streak})
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                        {Math.floor(user.total_study_minutes / 60)}h {user.total_study_minutes % 60}m
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {friendsLeaderboard.length === 0 && (
                <div className="text-center py-12">
                  <Trophy className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No leaderboard data yet</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
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
