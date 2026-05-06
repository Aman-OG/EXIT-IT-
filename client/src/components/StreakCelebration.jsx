import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Flame, Snowflake, RefreshCw, Trophy, Star } from 'lucide-react';
import { playPopSound, playStreakSound, playBadgeSound } from '../utils/sounds';

const StreakCelebration = () => {
  const {
    notificationQueue, popNotification
  } = useContext(AuthContext);
  const [visible, setVisible] = useState(false);
  
  const currentNotification = notificationQueue && notificationQueue.length > 0 ? notificationQueue[0] : null;

  useEffect(() => {
    if (currentNotification) {
      setVisible(true);
      
      // Play Audio
      if (currentNotification.category === 'points') playPopSound();
      else if (currentNotification.category === 'streak') playStreakSound();
      else if (currentNotification.category === 'badge') playBadgeSound();

      const displayTime = currentNotification.category === 'points' ? 4000 : 5000;
      
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => { popNotification(); }, 500); // Allow fade out before loading next notification
      }, displayTime);
      
      return () => clearTimeout(timer);
    }
  }, [currentNotification, popNotification]);

  if (!currentNotification) return null;

  const content = () => {
    // ── STREAK ──
    if (currentNotification.category === 'streak') {
      switch (currentNotification.type) {
        case 'extended':
          return (
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-orange-500 rounded-full blur-[40px] opacity-60 animate-pulse" />
                <Flame size={120} className="text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.8)] relative z-10" style={{ animation: 'bounce 1s ease-in-out infinite' }} />
              </div>
              <h2 className="text-4xl font-black text-white mt-8 mb-2 tracking-tight">Streak Extended!</h2>
              <p className="text-xl text-orange-200 font-medium">You're on fire! {currentNotification.streak} days strong. 🔥</p>
            </div>
          );
        case 'freeze_used':
          return (
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 rounded-full blur-[40px] opacity-60 animate-pulse" />
                <Snowflake size={120} className="text-blue-300 drop-shadow-[0_0_15px_rgba(147,197,253,0.8)] relative z-10" style={{ animation: 'spin 4s linear infinite' }} />
              </div>
              <h2 className="text-4xl font-black text-white mt-8 mb-2 tracking-tight">Streak Saved! ❄️</h2>
              <p className="text-xl text-blue-200 font-medium">Your Streak Freeze protected {currentNotification.days} missed day(s).</p>
              <p className="text-sm text-blue-300/70 mt-2">Your streak is still alive at {currentNotification.streak} days!</p>
            </div>
          );
        case 'broken':
          return (
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-neutral-500 rounded-full blur-[40px] opacity-40" />
                <RefreshCw size={100} className="text-neutral-400 relative z-10" />
              </div>
              <h2 className="text-4xl font-black text-white mt-8 mb-2 tracking-tight">Streak Broken</h2>
              <p className="text-xl text-neutral-300 font-medium">Let's build it back up. Day 1 starts today!</p>
            </div>
          );
        default:
          return null;
      }
    }

    // ── POINTS ──
    if (currentNotification.category === 'points') {
      return (
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500 rounded-full blur-[50px] opacity-50 animate-pulse" />
            <Star size={100} className="text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.7)] relative z-10" style={{ animation: 'bounce 0.8s ease-in-out infinite' }} fill="currentColor" />
          </div>
          <h2 className="text-5xl font-black text-white mt-8 mb-2 tracking-tight" style={{ animation: 'scaleIn 0.5s ease-out' }}>
            +{currentNotification.points} pts
          </h2>
          <p className="text-xl text-emerald-200 font-medium">{currentNotification.label}</p>
        </div>
      );
    }

    // ── BADGE ──
    if (currentNotification.category === 'badge') {
      return (
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-500 rounded-full blur-[50px] opacity-60 animate-pulse" />
            <div className="relative z-10 w-28 h-28 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-2xl shadow-amber-500/40" style={{ animation: 'bounce 1s ease-in-out infinite' }}>
              <span className="text-6xl filter drop-shadow-lg">{currentNotification.icon}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-8 mb-2">
            <Trophy size={24} className="text-amber-400" />
            <h2 className="text-3xl font-black text-white tracking-tight">Achievement Unlocked!</h2>
          </div>
          <p className="text-2xl text-amber-200 font-black">{currentNotification.name}</p>
          <p className="text-base text-amber-100/70 mt-1">{currentNotification.desc}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center pointer-events-none transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto" onClick={() => setVisible(false)} />
      <div className={`relative z-10 p-12 rounded-3xl transform transition-transform duration-700 ${visible ? 'scale-100 translate-y-0' : 'scale-50 translate-y-12'}`}>
        {content()}
      </div>
    </div>
  );
};

export default StreakCelebration;
