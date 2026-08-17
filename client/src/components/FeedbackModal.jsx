import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { MessageSquare, Star, X, Send, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

const CATEGORIES = [
  { id: 'general', label: '💡 General Feedback' },
  { id: 'suggestion', label: '✨ Feature Suggestion' },
  { id: 'course_content', label: '📚 Course Material Issue' },
  { id: 'exam', label: '⏱️ Quiz / Mock Exam Issue' },
  { id: 'bug', label: '🐛 Bug Report' },
];

const FeedbackModal = ({ isOpen, onClose }) => {
  const { user } = useContext(AuthContext);
  const [category, setCategory] = useState('general');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Please provide a message or comment.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await api.post('/feedback', {
        name: user ? user.name : name,
        email: user ? user.email : email,
        category,
        rating,
        message: message.trim()
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setMessage('');
        onClose();
      }, 2500);
    } catch (err) {
      console.error('Failed to submit feedback', err);
      setError(err.response?.data?.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 relative animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-text/50 hover:text-text hover:bg-text/5 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {success ? (
          <div className="py-10 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 size={36} />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold font-outfit text-text">Thank You for Your Feedback!</h3>
              <p className="text-xs sm:text-sm text-text/60 max-w-xs mx-auto">
                Your input helps make EX-IT the best exam preparation ecosystem for Ethiopian IT students.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Header */}
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                <MessageSquare size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold font-outfit text-text">Share Your Feedback</h3>
                <p className="text-xs text-text/60">Help us improve the platform or report an issue.</p>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs rounded-xl flex items-center space-x-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Rating Stars */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text/70 uppercase tracking-wider">How would you rate your experience?</label>
              <div className="flex items-center space-x-1.5 pt-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 hover:scale-110 transition-transform focus:outline-none"
                  >
                    <Star
                      size={24}
                      className={
                        (hoverRating || rating) >= star
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-text/20'
                      }
                    />
                  </button>
                ))}
                <span className="text-xs font-medium text-text/60 ml-2">
                  {rating === 5 ? 'Excellent ⭐' : rating === 4 ? 'Very Good 👍' : rating === 3 ? 'Average' : 'Needs Improvement'}
                </span>
              </div>
            </div>

            {/* Category Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text/70 uppercase tracking-wider">Topic</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`px-3 py-2 text-xs font-medium rounded-xl border text-left transition-all ${
                      category === cat.id
                        ? 'bg-primary/10 border-primary text-primary font-semibold shadow-xs'
                        : 'bg-card border-text/10 text-text/70 hover:bg-text/5'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* If guest, ask for name/email */}
            {!user && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-text/70">Your Name (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Abebe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs bg-background border border-text/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text/70">Email (Optional)</label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs bg-background border border-text/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            )}

            {/* Feedback Message */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text/70 uppercase tracking-wider">Your Message</label>
              <textarea
                rows={4}
                required
                placeholder="Tell us what you liked, what can be improved, or any incorrect questions you noticed..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-background border border-text/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none placeholder:text-text/40"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2.5 text-xs font-semibold text-text/70 hover:text-text bg-text/5 hover:bg-text/10 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 text-xs font-bold text-background bg-text hover:opacity-90 rounded-xl transition-all shadow-md active:scale-95 flex items-center space-x-2 disabled:opacity-50"
              >
                <span>{loading ? 'Submitting...' : 'Send Feedback'}</span>
                <Send size={13} />
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};

export default FeedbackModal;
