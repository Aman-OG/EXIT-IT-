import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { 
  BookOpen, TrendingUp, Users, AlertTriangle, ChevronRight, ChevronLeft, 
  Award, GraduationCap, Search, Flame, Zap, CheckCircle2, Clock, ArrowUpDown
} from 'lucide-react';
import { getAvatarUrl } from '../../utils/avatar';

const AdminAnalytics = () => {
  const [activeTab, setActiveTab] = useState('courses'); // 'courses' | 'students'
  
  // Course analytics state
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [detail, setDetail] = useState(null);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);

  // Student progress state
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('progress'); // 'progress' | 'name' | 'xp' | 'quizzes' | 'exams'

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = () => {
    setCoursesLoading(true);
    api.get('/admin/analytics/courses')
      .then(res => setCourses(res.data))
      .catch(console.error)
      .finally(() => setCoursesLoading(false));
  };

  const fetchStudents = () => {
    setStudentsLoading(true);
    api.get('/admin/analytics/students')
      .then(res => setStudents(res.data))
      .catch(console.error)
      .finally(() => setStudentsLoading(false));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'students' && students.length === 0) {
      fetchStudents();
    }
  };

  const handleSelectCourse = async (course) => {
    setSelectedCourse(course);
    setDetailLoading(true);
    try {
      const res = await api.get(`/admin/analytics/course/${course.id}`);
      setDetail(res.data);
    } catch(e) {
      console.error(e);
    } finally {
      setDetailLoading(false);
    }
  };

  // Filter and sort students
  const filteredStudents = students
    .filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'progress') return Number(b.overall_progress) - Number(a.overall_progress);
      if (sortBy === 'xp') return Number(b.total_xp) - Number(a.total_xp);
      if (sortBy === 'quizzes') return Number(b.quiz_attempts_count) - Number(a.quiz_attempts_count);
      if (sortBy === 'exams') return Number(b.exam_attempts_count) - Number(a.exam_attempts_count);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  // Calculate summary metrics for students
  const totalStudents = students.length;
  const avgOverallProgress = totalStudents > 0
    ? Math.round(students.reduce((acc, s) => acc + Number(s.overall_progress), 0) / totalStudents)
    : 0;
  const activeRecently = students.filter(s => s.last_active_date).length;

  if (coursesLoading && activeTab === 'courses' && courses.length === 0) return (
    <div className="h-full flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 space-y-6 animate-in fade-in duration-500">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Analytics & Progress</h1>
          <p className="text-text/70">Monitor course performance and student progress across all modules.</p>
        </div>

        {/* Navigation Tabs */}
        {!selectedCourse && (
          <div className="flex items-center bg-neutral-100 dark:bg-neutral-800/60 p-1.5 rounded-2xl border border-neutral-200 dark:border-neutral-700/50 self-start sm:self-auto">
            <button
              onClick={() => handleTabChange('courses')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'courses'
                  ? 'bg-card text-primary shadow-sm border border-neutral-200/50 dark:border-neutral-700'
                  : 'text-text/60 hover:text-text'
              }`}
            >
              <BookOpen size={16} />
              <span>Courses Overview</span>
            </button>
            
            <button
              onClick={() => handleTabChange('students')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'students'
                  ? 'bg-card text-primary shadow-sm border border-neutral-200/50 dark:border-neutral-700'
                  : 'text-text/60 hover:text-text'
              }`}
            >
              <GraduationCap size={16} />
              <span>Student Roster ({students.length || '...'})</span>
            </button>
          </div>
        )}
      </div>

      {/* ================= TAB 1: COURSES ================= */}
      {activeTab === 'courses' && (
        !selectedCourse ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map(course => (
                <button
                  key={course.id}
                  onClick={() => handleSelectCourse(course)}
                  className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 text-left hover:border-primary/50 hover:-translate-y-1 transition-all group shadow-sm"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2.5 bg-primary/10 text-primary rounded-xl group-hover:scale-110 transition-transform">
                      <BookOpen size={20} />
                    </div>
                    <ChevronRight size={16} className="text-text/30 group-hover:text-primary transition-colors mt-1" />
                  </div>
                  <p className="text-[10px] font-bold text-text/40 uppercase tracking-widest mb-1">{course.code}</p>
                  <h3 className="font-bold text-sm mb-4 line-clamp-2">{course.title}</h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-text/50">Avg Completion</span>
                      <span className="font-bold text-primary">{course.avg_completion}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${course.avg_completion}%` }} />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                    <div className="text-center">
                      <p className="text-lg font-black text-text">{course.students_started}</p>
                      <p className="text-[9px] text-text/40 uppercase tracking-wider">Students</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-black text-accent">{course.avg_quiz_score}%</p>
                      <p className="text-[9px] text-text/40 uppercase tracking-wider">Quiz Avg</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-black text-text">{course.total_materials}</p>
                      <p className="text-[9px] text-text/40 uppercase tracking-wider">Chapters</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Overview bar chart */}
            {courses.length > 0 && (
              <div className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold mb-6">Average Completion by Course</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={courses} margin={{ top: 0, right: 0, left: -20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(var(--text), 0.05)" />
                    <XAxis dataKey="code" tick={{ fontSize: 11, fill: 'rgba(var(--text), 0.5)' }} angle={-35} textAnchor="end" />
                    <YAxis tick={{ fontSize: 11, fill: 'rgba(var(--text), 0.5)' }} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{ 
                        background: 'rgb(var(--card))', 
                        border: 'none', 
                        borderRadius: '12px',
                        color: 'rgb(var(--text))'
                      }}
                      labelStyle={{ color: 'rgb(var(--text))' }}
                      itemStyle={{ color: 'rgb(var(--text))' }}
                      formatter={(value) => [`${value}%`, 'Avg Completion']}
                    />
                    <Bar dataKey="avg_completion" radius={[6, 6, 0, 0]}>
                      {courses.map((entry, index) => (
                        <Cell key={index} fill={`rgb(var(--primary))`} fillOpacity={0.7 + (index % 3) * 0.1} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        ) : (
          // Course detail view
          <div className="space-y-6">
            <button
              onClick={() => { setSelectedCourse(null); setDetail(null); }}
              className="flex items-center space-x-2 text-text/60 hover:text-primary transition-colors font-bold"
            >
              <ChevronLeft size={18} />
              <span>Back to All Courses</span>
            </button>

            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 text-primary rounded-xl">
                <BookOpen size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-text/40 uppercase tracking-widest">{selectedCourse.code}</p>
                <h2 className="text-2xl font-bold">{selectedCourse.title}</h2>
              </div>
            </div>

            {detailLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            ) : detail && (
              <div className="space-y-6">
                {/* Chapter completion */}
                <div className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold mb-5 flex items-center space-x-2">
                    <TrendingUp size={18} className="text-primary" />
                    <span>Chapter Completion Rates</span>
                  </h3>
                  <div className="space-y-3">
                    {detail.materials.map(mat => {
                      const completionRate = mat.total_students > 0
                        ? Math.round((mat.students_completed / mat.total_students) * 100)
                        : 0;
                      return (
                        <div key={mat.id} className="space-y-1.5">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-text/80 truncate max-w-xs">{mat.title}</span>
                            <div className="flex items-center space-x-3 shrink-0 ml-4">
                              <span className="text-xs text-text/40">{mat.students_completed}/{mat.total_students} students</span>
                              <span className="text-xs font-bold text-primary w-10 text-right">{completionRate}%</span>
                            </div>
                          </div>
                          <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${completionRate >= 70 ? 'bg-emerald-500' : completionRate >= 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                              style={{ width: `${completionRate}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quiz performance */}
                {detail.quizzes.length > 0 && (
                  <div className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold mb-5 flex items-center space-x-2">
                      <Award size={18} className="text-accent" />
                      <span>Quiz Performance</span>
                    </h3>
                    <div className="space-y-3">
                      {detail.quizzes.map(quiz => (
                        <div key={quiz.id} className="flex items-center justify-between p-3 bg-background rounded-xl border border-neutral-100 dark:border-neutral-800">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{quiz.title}</p>
                            <p className="text-xs text-text/40">{quiz.attempt_count} attempts</p>
                          </div>
                          <div className={`text-sm font-black px-3 py-1 rounded-lg ${quiz.avg_score >= 70 ? 'bg-emerald-500/10 text-emerald-600' : quiz.avg_score >= 50 ? 'bg-amber-500/10 text-amber-600' : 'bg-red-500/10 text-red-500'}`}>
                            {quiz.avg_score}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hardest questions */}
                {detail.hardestQuestions.length > 0 && (
                  <div className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold mb-5 flex items-center space-x-2">
                      <AlertTriangle size={18} className="text-warning" />
                      <span>Hardest Questions</span>
                      <span className="text-xs text-text/40 font-normal">(highest wrong answer rate)</span>
                    </h3>
                    <div className="space-y-3">
                      {detail.hardestQuestions.map((q, idx) => (
                        <div key={q.id} className="flex items-start space-x-4 p-4 bg-background rounded-xl border border-neutral-100 dark:border-neutral-800">
                          <div className="w-8 h-8 rounded-lg bg-warning/10 text-warning flex items-center justify-center font-black text-sm shrink-0">
                            {idx + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium line-clamp-2">{q.question_text}</p>
                            <p className="text-xs text-text/40 mt-1">{q.total_attempts} attempts</p>
                          </div>
                          <div className="text-sm font-black text-red-500 bg-red-500/10 px-3 py-1 rounded-lg shrink-0">
                            {q.error_rate}% wrong
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {detail.hardestQuestions.length === 0 && detail.quizzes.length === 0 && (
                  <div className="bg-card border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl p-12 text-center">
                    <Users size={40} className="mx-auto text-text/20 mb-3" />
                    <p className="text-text/40 font-semibold">No quiz attempts yet for this course</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      )}

      {/* ================= TAB 2: STUDENTS ROSTER & PROGRESS ================= */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-text/50">Total Students</span>
                <Users size={18} className="text-primary" />
              </div>
              <p className="text-2xl font-black">{totalStudents}</p>
            </div>

            <div className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-text/50">Active Recently</span>
                <Clock size={18} className="text-emerald-500" />
              </div>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{activeRecently}</p>
            </div>

            <div className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-text/50">Avg Overall Progress</span>
                <TrendingUp size={18} className="text-accent" />
              </div>
              <p className="text-2xl font-black text-accent">{avgOverallProgress}%</p>
            </div>

            <div className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-text/50">Leaderboard Streak</span>
                <Flame size={18} className="text-orange-500" />
              </div>
              <p className="text-2xl font-black text-orange-500">
                {Math.max(...students.map(s => Number(s.streak_days) || 0), 0)} <span className="text-xs font-medium text-text/40">days</span>
              </p>
            </div>
          </div>

          {/* Controls: Search and Sort */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text/40" />
              <input
                type="text"
                placeholder="Search student by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-card border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs sm:text-sm text-text placeholder-text/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            {/* Sort Select */}
            <div className="flex items-center space-x-2 shrink-0">
              <ArrowUpDown size={14} className="text-text/40" />
              <span className="text-xs text-text/50 font-semibold">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="progress">Highest Progress</option>
                <option value="name">Name (A-Z)</option>
                <option value="xp">Highest XP</option>
                <option value="quizzes">Most Quizzes</option>
                <option value="exams">Most Mock Exams</option>
              </select>
            </div>
          </div>

          {/* Loading Spinner */}
          {studentsLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="bg-card border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl p-12 text-center">
              <Users size={40} className="mx-auto text-text/20 mb-3" />
              <p className="text-text/40 font-semibold">No students found matching your criteria</p>
            </div>
          ) : (
            /* Student Progress Cards / Table List */
            <div className="space-y-4">
              {filteredStudents.map((student) => {
                const progressPct = Number(student.overall_progress) || 0;
                const completedMats = Number(student.completed_materials) || 0;
                const totalMats = Number(student.total_materials) || 0;

                return (
                  <div
                    key={student.id}
                    className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-sm hover:border-primary/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    {/* Student Profile Info */}
                    <div className="flex items-center space-x-4 min-w-[240px]">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-primary/10 border border-neutral-200 dark:border-neutral-700 shadow-sm shrink-0 flex items-center justify-center">
                        <img 
                          src={getAvatarUrl(student)} 
                          alt={student.name || 'Student'} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(student.email || student.name || 'User')}`;
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-sm text-text truncate">{student.name}</h3>
                          {student.streak_days > 0 && (
                            <span className="flex items-center space-x-0.5 text-[10px] font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full shrink-0">
                              <Flame size={12} />
                              <span>{student.streak_days}d</span>
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-text/50 truncate mb-1">{student.email}</p>
                        <div className="flex items-center space-x-3 text-[11px] text-text/40">
                          <span>Joined {new Date(student.created_at).toLocaleDateString()}</span>
                          {student.last_active_date && (
                            <span>• Active {new Date(student.last_active_date).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar & Details */}
                    <div className="flex-1 max-w-md space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-text/70 flex items-center gap-1.5">
                          <CheckCircle2 size={14} className="text-emerald-500" />
                          <span>Course Completion</span>
                        </span>
                        <span className="font-bold text-primary">
                          {progressPct}% <span className="font-normal text-text/40">({completedMats}/{totalMats} modules)</span>
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            progressPct >= 75 ? 'bg-emerald-500' : progressPct >= 40 ? 'bg-primary' : 'bg-amber-500'
                          }`}
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Performance Chips: Quizzes, Mock Exams, XP */}
                    <div className="grid grid-cols-3 gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-neutral-100 dark:border-neutral-800">
                      <div className="text-center px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-100 dark:border-neutral-700/50">
                        <p className="text-xs text-text/50 font-medium">Quizzes</p>
                        <p className="text-sm font-bold text-text mt-0.5">
                          {student.quiz_attempts_count} <span className="text-[10px] font-normal text-text/40">({student.avg_quiz_score}%)</span>
                        </p>
                      </div>

                      <div className="text-center px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-100 dark:border-neutral-700/50">
                        <p className="text-xs text-text/50 font-medium">Exams</p>
                        <p className="text-sm font-bold text-text mt-0.5">
                          {student.exam_attempts_count} <span className="text-[10px] font-normal text-text/40">({student.avg_exam_score}%)</span>
                        </p>
                      </div>

                      <div className="text-center px-3 py-1.5 bg-amber-500/10 rounded-xl border border-amber-500/20">
                        <p className="text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center justify-center gap-1">
                          <Zap size={11} />
                          <span>XP</span>
                        </p>
                        <p className="text-sm font-black text-amber-600 dark:text-amber-400 mt-0.5">
                          {student.total_xp}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminAnalytics;
