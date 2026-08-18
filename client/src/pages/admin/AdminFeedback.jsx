import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { 
  MessageSquare, Star, Trash2, CheckCircle2, Clock, 
  AlertTriangle, Filter, Search, RefreshCw, X, ShieldAlert, Sparkles 
} from 'lucide-react';
import { getAvatarUrl } from '../../utils/avatar';

const CATEGORY_LABELS = {
  general: '💡 General',
  suggestion: '✨ Suggestion',
  course_content: '📚 Course Content',
  exam: '⏱️ Exam / Quiz',
  bug: '🐛 Bug Report',
};

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [feedbackToDelete, setFeedbackToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (categoryFilter !== 'all') params.category = categoryFilter;

      const res = await api.get('/feedback', { params });
      setFeedbacks(res.data);
    } catch (err) {
      console.error('Failed to load feedbacks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [statusFilter, categoryFilter]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      await api.patch(`/feedback/${id}`, { status: newStatus });
      setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, status: newStatus } : f));
    } catch (err) {
      console.error('Failed to update feedback status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async () => {
    if (!feedbackToDelete) return;
    try {
      setIsDeleting(true);
      await api.delete(`/feedback/${feedbackToDelete.id}`);
      setFeedbacks(prev => prev.filter(f => f.id !== feedbackToDelete.id));
      setFeedbackToDelete(null);
    } catch (err) {
      console.error('Failed to delete feedback:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredFeedbacks = feedbacks.filter(f => {
    const term = search.toLowerCase();
    return (
      (f.message && f.message.toLowerCase().includes(term)) ||
      (f.name && f.name.toLowerCase().includes(term)) ||
      (f.email && f.email.toLowerCase().includes(term)) ||
      (f.user_account_name && f.user_account_name.toLowerCase().includes(term))
    );
  });

  const pendingCount = feedbacks.filter(f => f.status === 'pending').length;
  const avgRating = feedbacks.length > 0
    ? (feedbacks.reduce((acc, curr) => acc + (curr.rating || 5), 0) / feedbacks.length).toFixed(1)
    : 5.0;

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Student Feedback</h1>
            {pendingCount > 0 && (
              <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold rounded-full border border-amber-500/20">
                {pendingCount} Pending Review
              </span>
            )}
          </div>
          <p className="text-sm text-text/70 mt-0.5">Read reviews, bug reports, and suggestions submitted by students.</p>
        </div>

        <button
          onClick={fetchFeedbacks}
          className="p-2.5 bg-card hover:bg-text/5 border border-neutral-200 dark:border-neutral-800 rounded-xl text-text/70 transition-all flex items-center space-x-2 text-xs font-semibold"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-card border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-text/50 uppercase tracking-wider">Total Submissions</p>
            <p className="text-2xl sm:text-3xl font-bold font-outfit mt-1">{feedbacks.length}</p>
          </div>
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <MessageSquare size={22} />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-text/50 uppercase tracking-wider">Pending Attention</p>
            <p className="text-2xl sm:text-3xl font-bold font-outfit mt-1 text-amber-500">{pendingCount}</p>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
            <Clock size={22} />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-text/50 uppercase tracking-wider">Average Satisfaction</p>
            <p className="text-2xl sm:text-3xl font-bold font-outfit mt-1 text-emerald-500 flex items-center space-x-1.5">
              <span>{avgRating}</span>
              <Star size={20} className="fill-amber-400 text-amber-400" />
            </p>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
            <CheckCircle2 size={22} />
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text/40" />
          <input
            type="text"
            placeholder="Search feedback text, sender name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-background border border-text/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-background border border-text/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="resolved">Resolved</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-background border border-text/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary font-medium"
          >
            <option value="all">All Topics</option>
            <option value="general">💡 General</option>
            <option value="suggestion">✨ Suggestion</option>
            <option value="course_content">📚 Course Content</option>
            <option value="exam">⏱️ Exam / Quiz</option>
            <option value="bug">🐛 Bug Report</option>
          </select>
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-text/50 bg-card rounded-2xl border border-neutral-200 dark:border-neutral-800 text-sm">
            Loading student feedbacks...
          </div>
        ) : filteredFeedbacks.length === 0 ? (
          <div className="p-12 text-center text-text/50 bg-card rounded-2xl border border-neutral-200 dark:border-neutral-800 text-sm">
            No feedback entries found matching the active filters.
          </div>
        ) : (
          filteredFeedbacks.map((f) => (
            <div
              key={f.id}
              className={`p-5 sm:p-6 rounded-2xl bg-card border transition-all space-y-4 shadow-sm ${
                f.status === 'pending'
                  ? 'border-amber-500/30 dark:border-amber-500/20'
                  : 'border-neutral-200 dark:border-neutral-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-text/5 pb-3">
                <div className="flex items-center space-x-3">
                  <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                    {CATEGORY_LABELS[f.category] || f.category}
                  </span>
                  
                  {/* Rating stars */}
                  <div className="flex items-center space-x-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={14}
                        className={
                          s <= (f.rating || 5)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-text/20'
                        }
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs text-text/50">
                  <span>{new Date(f.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              {/* Feedback Content */}
              <p className="text-sm text-text/90 leading-relaxed whitespace-pre-wrap font-normal">
                {f.message}
              </p>

              {/* Footer row: Sender info & Status toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-text/5">
                <div className="flex items-center space-x-2.5 text-xs text-text/60">
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-primary/10 border border-neutral-200 dark:border-neutral-700 shrink-0 flex items-center justify-center">
                    <img 
                      src={getAvatarUrl(f.user_account_avatar, f.email || f.user_account_email, f.name || f.user_account_name)}
                      alt="" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(f.email || f.user_account_email || f.name || 'User')}`;
                      }}
                    />
                  </div>
                  <div>
                    <span className="font-semibold text-text">{f.name || f.user_account_name || 'Anonymous Student'}</span>
                    {(f.email || f.user_account_email) && (
                      <span className="ml-2 opacity-80">&bull; {f.email || f.user_account_email}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Status Dropdown */}
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[11px] font-semibold text-text/50 uppercase">Status:</span>
                    <select
                      value={f.status}
                      disabled={updatingId === f.id}
                      onChange={(e) => handleStatusChange(f.id, e.target.value)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                        f.status === 'resolved'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                          : f.status === 'reviewed'
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => setFeedbackToDelete(f)}
                    className="p-1.5 text-text/40 hover:text-rose-500 rounded-lg hover:bg-rose-500/10 transition-colors"
                    title="Delete Feedback"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {feedbackToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center space-x-3 text-rose-500">
              <div className="p-3 bg-rose-500/10 rounded-2xl">
                <ShieldAlert size={26} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-text">Delete Feedback?</h3>
                <p className="text-xs text-text/60">This entry will be permanently removed.</p>
              </div>
            </div>

            <p className="text-xs text-text/70 italic line-clamp-3 bg-text/5 p-3 rounded-xl border border-text/10">
              "{feedbackToDelete.message}"
            </p>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setFeedbackToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-semibold text-text/70 hover:text-text bg-text/5 hover:bg-text/10 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
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

export default AdminFeedback;
