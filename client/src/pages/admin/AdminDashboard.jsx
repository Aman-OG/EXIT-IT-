import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { Users, BookOpen, CheckSquare, Settings, Save } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalUsers: 0, activeUsers: 0, totalQuizzes: 0, avgScore: 0 });
  const [examDate, setExamDate] = useState(''); // Text representation DD/MM/YYYY
  const [saving, setSaving] = useState(false);

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
        alert('Failed to update date');
    }
    setSaving(false);
  };

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">Admin Control Center</h1>
        <p className="text-text/70">Analyze student metrics and modify core platform parameters.</p>
      </div>

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

      <div className="bg-card p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm max-w-xl relative overflow-hidden group hover:border-primary/40 transition">
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
             <button disabled={saving} onClick={handleUpdateDate} className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 rounded-xl transition shadow-md hover:shadow-lg flex items-center space-x-2">
                 <Save size={18}/>
                 <span>{saving ? 'Transmitting...' : 'Update Network Date'}</span>
             </button>
         </div>
      </div>

      <div className="bg-card p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm group hover:border-accent/40 transition">
         <div className="flex items-center space-x-3 mb-6 relative z-10">
            <CheckSquare className="text-accent" size={24} />
            <h2 className="text-xl font-bold">Quick Quiz Management</h2>
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <QuizCourseLinks navigate={navigate} />
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
      } catch (e) {}
    };
    fetchCourses();
  }, []);

  return (
    <>
      {courses.map(course => (
        <button 
          key={course.id}
          onClick={() => navigate(`/admin/quiz/${course.id}`)}
          className="p-4 bg-background border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-accent/50 transition text-left group/btn"
        >
          <p className="text-[10px] font-bold text-text/30 uppercase tracking-widest mb-1 group-hover/btn:text-accent transition">{course.code}</p>
          <p className="font-bold text-sm truncate">{course.title}</p>
        </button>
      ))}
    </>
  );
};

export default AdminDashboard;
