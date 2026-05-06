import React, { useState } from 'react';
import { Zap, AlertCircle, Check } from 'lucide-react';
import api from '../api/axios';

const StreakFreeze = ({ currentStreak, streakFreeze, onFreezeUsed }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const streakAtRisk = currentStreak > 0 && currentStreak <= 2;

  const handleUseFreeze = async () => {
    if (streakFreeze <= 0) return;
    
    setLoading(true);
    try {
      const { data } = await api.post('/users/use-freeze');
      setMessage({ type: 'success', text: 'Streak freeze activated! Your streak is protected for 24 hours.' });
      onFreezeUsed && onFreezeUsed(data);
      setTimeout(() => setMessage(null), 4000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to use streak freeze. Try again.' });
      setTimeout(() => setMessage(null), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {streakAtRisk && (
        <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 flex items-start space-x-3">
          <AlertCircle className="text-warning flex-shrink-0 mt-0.5" size={20} />
          <div className="flex-1">
            <p className="font-semibold text-warning mb-2">Your streak is at risk!</p>
            <p className="text-sm text-text/70 mb-3">You haven't studied in a while. Study now or use a streak freeze to protect your streak.</p>
            {streakFreeze > 0 && (
              <button
                onClick={handleUseFreeze}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-warning hover:bg-warning/90 disabled:opacity-50 text-white rounded-lg font-semibold text-sm transition"
              >
                <Zap size={16} />
                <span>Use Freeze ({streakFreeze} left)</span>
              </button>
            )}
          </div>
        </div>
      )}

      {message && (
        <div className={`rounded-xl p-4 flex items-center space-x-3 ${message.type === 'success' ? 'bg-accent/10 border border-accent/30' : 'bg-warning/10 border border-warning/30'}`}>
          <Check className={message.type === 'success' ? 'text-accent' : 'text-warning'} size={20} />
          <p className={message.type === 'success' ? 'text-accent' : 'text-warning'}>{message.text}</p>
        </div>
      )}

      {streakFreeze > 0 && !streakAtRisk && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-center space-x-2 text-sm">
          <Zap className="text-primary flex-shrink-0" size={16} />
          <span className="text-text/70">You have <strong>{streakFreeze}</strong> streak freeze{streakFreeze !== 1 ? 's' : ''} available</span>
        </div>
      )}
    </div>
  );
};

export default StreakFreeze;
