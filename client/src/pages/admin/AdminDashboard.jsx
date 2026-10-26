import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { Users, BookOpen, CheckSquare, Settings, Save, Send, Radio, Sparkles, Trophy, Bell, AlertCircle, CheckCircle2 } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalUsers: 0, activeUsers: 0, totalQuizzes: 0, avgScore: 0 });
  const [examDate, setExamDate] = useState(''); // Text representation DD/MM/YYYY
  const [saving, setSaving] = useState(false);

  // Broadcast state
  const [broadcastPreset, setBroadcastPreset] = useState('custom');
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastLink, setBroadcastLink] = useState('/dashboard');
  const [sendEmailToAll, setSendEmailToAll] = useState(true);
  const [broadcasting, setBroadcasting] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState(null);
  const [broadcastingHallOfFame, setBroadcastingHallOfFame] = useState(false);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const statsRes = await api.get('/admin/stats');
        setStats(statsRes.data);
        
        const settingsRes = await api.get(`/settings?t=${new Date().getTime()}`);
        if(settingsRes.data.exam_date) {
            // DB format is YYYY-MM-DD, we need to show DD/MM/YYYY
            const [year, month, day] = settingsRes.data.exam_date.split('-');
            if (year && month && day) {
              setExamDate(`${day}/${month}/${year}`);
            }
        }
      } catch(e) {
         console.error('Error fetching admin data', e);
      }
    };
    fetchAdminData();
  }, []);

  const handleUpdateDate = async () => {
    // Strict DD/MM/YYYY logic testing
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = examDate.match(regex);
    if (!match) {
        alert('Please use the explicit format DD/MM/YYYY (e.g. 30/05/2026)');
        return;
    }
    
    const [_, day, month, year] = match;
    const dbFormattedDate = `${year}-${month}-${day}`;

    setSaving(true);
    try {
        await api.put('/settings', { key: 'exam_date', value: dbFormattedDate });
        alert('Exam Date updated explicitly across the network.');
    } catch(e) {
        console.error('Failed to update date:', e);
        alert('Failed to update date');
    }
    setSaving(false);
  };

  const handlePresetSelect = (preset) => {
    setBroadcastPreset(preset);
    if (preset === 'new_course') {
      setBroadcastTitle('🚀 New Exam Revision & Materials Released!');
      setBroadcastMessage('New Exit Exam practice questions, lecture summaries, and video lessons have been added to the Course Library. Head to the Courses tab now to explore the new content!');
      setBroadcastLink('/courses');
    } else if (preset === 'weekly_digest') {
      setBroadcastTitle('🏆 Weekly Hall of Fame Highlights & Challenge');
      setBroadcastMessage("Congratulations to this week's top scholars on the Leaderboard! The competition is heating up—keep your streaks alive and complete your daily goals to claim a podium spot.");
      setBroadcastLink('/leaderboard');
    } else if (preset === 'general_announcement') {
      setBroadcastTitle('📢 Platform Update & Study Tips');
      setBroadcastMessage('We have updated EXIT-IT with enhanced AI mentoring, study guides, and incognito leaderboards. Make sure to review your flashcards and take mock quizzes today!');
      setBroadcastLink('/dashboard');
    } else {
      setBroadcastTitle('');
      setBroadcastMessage('');
      setBroadcastLink('/dashboard');
    }
  };

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) {
      alert('Please provide both an announcement title and message.');
      return;
    }

    if (!window.confirm(`Are you sure you want to broadcast this announcement to ALL ${stats.totalUsers} registered scholars${sendEmailToAll ? ' (including Email delivery via Exitdbu@gmail.com)' : ''}?`)) {
      return;
    }

    try {
      setBroadcasting(true);
      setBroadcastResult(null);

      const res = await api.post('/notifications/broadcast', {
        title: broadcastTitle.trim(),
        message: broadcastMessage.trim(),
        link: broadcastLink.trim() || '/dashboard',
        sendEmailToAll
      });

      setBroadcastResult({
        type: 'success',
        text: res.data.message || `In-app alerts delivered to ${res.data.totalRecipients} scholars. ${res.data.emailsSent} emails dispatching in background.`
      });

      // Clear form on success
      setBroadcastTitle('');
      setBroadcastMessage('');
    } catch (err) {
      console.error('Broadcast failed:', err);
      setBroadcastResult({
        type: 'error',
        text: err.response?.data?.message || 'Failed to dispatch broadcast. Check server logs.'
      });
    } finally {
      setBroadcasting(false);
    }
  };

  const handleQuickHallOfFameBroadcast = async () => {
    if (!window.confirm('Broadcast live Top 3 Leaderboard highlights to all students via Email & In-App Notification?')) {
      return;
    }

    try {
      setBroadcastingHallOfFame(true);
      setBroadcastResult(null);

      const res = await api.post('/notifications/broadcast/hall-of-fame');

      setBroadcastResult({
        type: 'success',
        text: res.data.message || `Hall of Fame digest sent! ${res.data.emailsSent} emails dispatching in background.`
      });
    } catch (err) {
      console.error('Failed to broadcast Hall of Fame:', err);
      setBroadcastResult({
        type: 'error',
        text: err.response?.data?.message || 'Failed to send Hall of Fame digest.'
      });
    } finally {
      setBroadcastingHallOfFame(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 space-y-8 animate-in fade-in duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">Admin Control Center</h1>
        <p className="text-text/70">Analyze student metrics, dispatch email announcements, and configure platform timelines.</p>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card p-6 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 group hover:border-primary/40 transition">
            <div className="p-3 bg-primary/10 text-primary w-fit rounded-xl mb-4 group-hover:scale-110 transition"><Users size={24}/></div>
            <p className="text-sm text-text/60 font-semibold uppercase tracking-wider mb-1">Total Students</p>
            <h2 className="text-3xl font-bold">{stats.totalUsers}</h2>
        </div>
        <div className="bg-card p-6 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 group hover:border-accent/40 transition">
            <div className="p-3 bg-accent/10 text-accent w-fit rounded-xl mb-4 group-hover:scale-110 transition"><Users size={24}/></div>
            <p className="text-sm text-text/60 font-semibold uppercase tracking-wider mb-1">Active This Week</p>
            <h2 className="text-3xl font-bold">{stats.activeUsers}</h2>
        </div>
        <div className="bg-card p-6 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 group hover:border-warning/40 transition">
            <div className="p-3 bg-warning/10 text-warning w-fit rounded-xl mb-4 group-hover:scale-110 transition"><CheckSquare size={24}/></div>
            <p className="text-sm text-text/60 font-semibold uppercase tracking-wider mb-1">Total Quizzes Done</p>
            <h2 className="text-3xl font-bold">{stats.totalQuizzes}</h2>
        </div>
        <div className="bg-card p-6 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 group hover:border-primary/40 transition">
            <div className="p-3 bg-primary/10 text-primary w-fit rounded-xl mb-4 group-hover:scale-110 transition"><BookOpen size={24}/></div>
            <p className="text-sm text-text/60 font-semibold uppercase tracking-wider mb-1">Average Score</p>
            <h2 className="text-3xl font-bold">{stats.avgScore}%</h2>
        </div>
      </div>

      {/* BROADCAST ANNOUNCEMENTS & EMAIL CENTER */}
      <div className="bg-card p-6 md:p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500">
              <Radio size={26} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text flex items-center gap-2">
                <span>Student Broadcast & Email Center</span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  SMTP Live (Exitdbu@gmail.com)
                </span>
              </h2>
              <p className="text-xs text-text/60">
                Send in-app alerts and branded emails to all registered scholars instantly.
              </p>
            </div>
          </div>

          {/* Quick One-Click Hall of Fame Digest Button */}
          <button
            type="button"
            onClick={handleQuickHallOfFameBroadcast}
            disabled={broadcastingHallOfFame || broadcasting}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-bold text-xs rounded-xl transition shadow-xs cursor-pointer"
          >
            <Trophy size={16} />
            <span>{broadcastingHallOfFame ? 'Broadcasting Podium...' : '1-Click Weekly Hall of Fame Digest'}</span>
          </button>
        </div>

        {broadcastResult && (
          <div className={`p-4 rounded-2xl mb-6 flex items-center space-x-3 text-sm font-semibold animate-in fade-in duration-200 ${
            broadcastResult.type === 'success' 
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
          }`}>
            {broadcastResult.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span>{broadcastResult.text}</span>
          </div>
        )}

        {/* PRESET CHIPS */}
        <div className="space-y-2 mb-6">
          <p className="text-xs font-bold uppercase tracking-wider text-text/50">Quick Message Presets</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handlePresetSelect('new_course')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                broadcastPreset === 'new_course' 
                  ? 'bg-primary text-primary-foreground border-primary' 
                  : 'bg-background hover:bg-text/5 text-text/70 border-neutral-200 dark:border-neutral-800'
              }`}
            >
              🚀 New Course / Quiz Release
            </button>
            <button
              type="button"
              onClick={() => handlePresetSelect('weekly_digest')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                broadcastPreset === 'weekly_digest' 
                  ? 'bg-primary text-primary-foreground border-primary' 
                  : 'bg-background hover:bg-text/5 text-text/70 border-neutral-200 dark:border-neutral-800'
              }`}
            >
              🏆 Weekly Podium Highlights
            </button>
            <button
              type="button"
              onClick={() => handlePresetSelect('general_announcement')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                broadcastPreset === 'general_announcement' 
                  ? 'bg-primary text-primary-foreground border-primary' 
                  : 'bg-background hover:bg-text/5 text-text/70 border-neutral-200 dark:border-neutral-800'
              }`}
            >
              📢 General Announcement
            </button>
            <button
              type="button"
              onClick={() => handlePresetSelect('custom')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                broadcastPreset === 'custom' 
                  ? 'bg-primary text-primary-foreground border-primary' 
                  : 'bg-background hover:bg-text/5 text-text/70 border-neutral-200 dark:border-neutral-800'
              }`}
            >
              ✏️ Custom Message
            </button>
          </div>
        </div>

        {/* BROADCAST FORM */}
        <form onSubmit={handleSendBroadcast} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text/70 mb-1.5">
              Announcement Title / Email Subject *
            </label>
            <input 
              type="text"
              placeholder="e.g., 🚀 2024 Exam Revision Quizzes Now Live!"
              value={broadcastTitle}
              onChange={(e) => setBroadcastTitle(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary font-bold text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text/70 mb-1.5">
              Message Content *
            </label>
            <textarea 
              rows={4}
              placeholder="Write your announcement details here. This message will be delivered to students' in-app notification centers and emailed directly to their inboxes..."
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm leading-relaxed"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text/70 mb-1.5">
                Target Platform Link (Optional)
              </label>
              <input 
                type="text"
                placeholder="/courses or /quizzes or /leaderboard"
                value={broadcastLink}
                onChange={(e) => setBroadcastLink(e.target.value)}
                className="w-full px-4 py-2.5 bg-background border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-xs font-mono"
              />
            </div>

            <div className="flex items-center space-x-3 sm:pt-6">
              <label className="relative flex items-center cursor-pointer select-none">
                <input 
                  type="checkbox"
                  checked={sendEmailToAll}
                  onChange={(e) => setSendEmailToAll(e.target.checked)}
                  className="w-4 h-4 text-primary bg-background border-neutral-300 rounded focus:ring-primary"
                />
                <span className="ml-2.5 text-xs font-bold text-text">
                  Dispatch Email via Exitdbu@gmail.com
                </span>
              </label>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={broadcasting || broadcastingHallOfFame}
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm rounded-xl shadow-lg shadow-primary/20 flex items-center space-x-2 transition cursor-pointer active:scale-95"
            >
              <Send size={18} />
              <span>{broadcasting ? 'Sending...' : 'Broadcast to All Scholars Now'}</span>
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* TIMELINE CONFIGURATION */}
        <div className="bg-card p-6 md:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm relative overflow-hidden group hover:border-primary/40 transition">
           <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />
           <div className="flex items-center space-x-3 mb-6 relative z-10">
              <Settings className="text-primary" size={24} />
              <h2 className="text-xl font-bold">Global Timeline Configuration</h2>
           </div>
           <div className="space-y-4 relative z-10">
               <div>
                  <label className="block text-sm font-semibold mb-2 text-text/80">Target Exam Date (DD/MM/YYYY)</label>
                  <input 
                      type="text"
                      placeholder="30/05/2026"
                      value={examDate}
                      onChange={(e) => setExamDate(e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary font-medium tracking-wide"
                  />
               </div>
               <button disabled={saving} onClick={handleUpdateDate} className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 rounded-xl transition shadow-md hover:shadow-lg flex items-center space-x-2 cursor-pointer">
                   <Save size={18}/>
                   <span>{saving ? 'Transmitting...' : 'Update Network Date'}</span>
               </button>
           </div>
        </div>

        {/* QUICK QUIZ MANAGEMENT */}
        <div className="bg-card p-6 md:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm group hover:border-accent/40 transition">
           <div className="flex items-center space-x-3 mb-6 relative z-10">
              <CheckSquare className="text-accent" size={24} />
              <h2 className="text-xl font-bold">Quick Quiz Management</h2>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <QuizCourseLinks navigate={navigate} />
           </div>
        </div>
      </div>
    </div>
  );
};

const QuizCourseLinks = ({ navigate }) => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/courses');
        setCourses(res.data);
      } catch (e) {
        console.error('Error fetching courses:', e);
      }
    };
    fetchCourses();
  }, []);

  return (
    <>
      {courses.map(course => (
        <button 
          key={course.id}
          onClick={() => navigate(`/admin/quiz/${course.id}`)}
          className="p-4 bg-background border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-accent/50 transition text-left group/btn cursor-pointer"
        >
          <p className="text-[10px] font-bold text-text/30 uppercase tracking-widest mb-1 group-hover/btn:text-accent transition">{course.code}</p>
          <p className="font-bold text-sm truncate">{course.title}</p>
        </button>
      ))}
    </>
  );
};

export default AdminDashboard;
