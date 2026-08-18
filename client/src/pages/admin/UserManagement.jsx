import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Search, Trash2, UserCheck, AlertTriangle, X, ShieldAlert, CheckCircle2, Flame, Award } from 'lucide-react';
import { getAvatarUrl } from '../../utils/avatar';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      setIsDeleting(true);
      await api.delete(`/admin/users/${userToDelete.id}`);
      setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
      setStatusMessage({ type: 'success', text: `Student ${userToDelete.name || userToDelete.email} removed successfully.` });
      setUserToDelete(null);
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err) {
      console.error("Failed to delete user", err);
      setStatusMessage({ type: 'error', text: err.response?.data?.message || 'Failed to delete student.' });
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredUsers = users.filter(u => 
    (u.name && u.name.toLowerCase().includes(search.toLowerCase())) || 
    (u.email && u.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Student Management</h1>
            <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded-full">
              {users.length} Enrolled
            </span>
          </div>
          <p className="text-sm text-text/70 mt-0.5">Audit student accounts, profile pictures, and manage user permissions.</p>
        </div>
        
        <div className="relative w-full md:w-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text/50">
            <Search size={17} />
          </div>
          <input 
            type="text" 
            placeholder="Search email or name..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm w-full md:w-72 bg-card border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all"
          />
        </div>
      </div>

      {/* Status Message Notification */}
      {statusMessage && (
        <div className={`p-4 rounded-xl flex items-center justify-between border ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' 
            : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
        }`}>
          <div className="flex items-center space-x-2 text-sm font-medium">
            {statusMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
            <span>{statusMessage.text}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="p-1 hover:opacity-75">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-background/60 dark:bg-neutral-800/20 border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="px-6 py-3.5 font-semibold text-xs text-text/60 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3.5 font-semibold text-xs text-text/60 uppercase tracking-wider">Email Address</th>
                <th className="px-6 py-3.5 font-semibold text-xs text-text/60 uppercase tracking-wider">Joined Date</th>
                <th className="px-6 py-3.5 font-semibold text-xs text-text/60 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3.5 font-semibold text-xs text-text/60 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800/50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-text/50 text-sm">
                    Loading student directory...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-text/50 text-sm">
                    No students found matching your query.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-primary/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3.5">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/10 border border-neutral-200 dark:border-neutral-700 shadow-sm shrink-0 flex items-center justify-center">
                          <img 
                            src={getAvatarUrl(u)} 
                            alt={u.name || 'Student'} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(u.email || u.name || 'User')}`;
                            }}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-text truncate">{u.name || 'Unnamed Student'}</p>
                          {u.bio ? (
                            <p className="text-xs text-text/50 truncate max-w-xs">{u.bio}</p>
                          ) : (
                            <span className="text-[11px] text-text/40">Student Account</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-text/80">{u.email}</td>
                    <td className="px-6 py-4 text-xs text-text/70">
                      {new Date(u.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setUserToDelete(u)}
                        className="text-rose-500 hover:text-rose-600 dark:text-rose-400 p-2 rounded-lg hover:bg-rose-500/10 transition-colors" 
                        title="Delete Student Account"
                        aria-label="Delete Student"
                      >
                        <Trash2 size={17} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center space-x-3 text-rose-500">
              <div className="p-3 bg-rose-500/10 rounded-2xl">
                <ShieldAlert size={26} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-text">Delete Student Account?</h3>
                <p className="text-xs text-text/60">This action cannot be undone.</p>
              </div>
            </div>

            <div className="flex items-center space-x-3.5 p-3.5 bg-text/5 rounded-xl border border-text/10">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-primary/10 border border-neutral-200 dark:border-neutral-700 shadow-sm shrink-0">
                <img 
                  src={getAvatarUrl(userToDelete)} 
                  alt={userToDelete.name || 'Student'} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(userToDelete.email || userToDelete.name || 'User')}`;
                  }}
                />
              </div>
              <div className="min-w-0 flex-1 text-xs">
                <p className="font-bold text-sm text-text truncate">{userToDelete.name || 'Unnamed'}</p>
                <p className="text-text/60 truncate">{userToDelete.email}</p>
              </div>
            </div>

            <p className="text-xs text-text/70 leading-relaxed">
              Deleting this student will permanently delete their quiz attempts, exam scores, saved notes, flashcards, and progress tracking data.
            </p>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setUserToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-semibold text-text/70 hover:text-text bg-text/5 hover:bg-text/10 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={isDeleting}
                className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
