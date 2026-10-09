import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { 
  CheckSquare, Sparkles, Trash2, HelpCircle, PlayCircle, 
  ChevronDown, Search, Award, CheckCircle2, BookOpen, Layers,
  BarChart2, Filter
} from 'lucide-react';
import { CourseAccordionSkeleton, QuizCardSkeleton } from '../components/Skeleton';

const Quizzes = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [courses, setCourses] = useState([]);
  const [quizzesByCourse, setQuizzesByCourse] = useState({});
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingQuizzes, setLoadingQuizzes] = useState({});
  const [filterType, setFilterType] = useState('all'); // 'all', 'official', 'ai'
  const [searchQuery, setSearchQuery] = useState('');
  
  const [expandedCourse, setExpandedCourse] = useState(() => {
    const saved = localStorage.getItem('quizzes_expanded_course_id');
    return saved ? parseInt(saved) : null;
  });

  const courseRefs = useRef({});

  // Fetch all courses on mount and optionally fetch quizzes
  useEffect(() => {
    const fetchCoursesAndQuizzes = async () => {
      setLoadingCourses(true);
      try {
        const coursesRes = await api.get('/courses');
        const coursesData = coursesRes.data || [];
        setCourses(coursesData);

        // Fetch quizzes for all courses in parallel so badges and stats are accurate
        const quizMap = {};
        await Promise.all(
          coursesData.map(async (c) => {
            try {
              const res = await api.get(`/quizzes/course/${c.id}`);
              quizMap[c.id] = res.data || [];
            } catch (e) {
              quizMap[c.id] = [];
            }
          })
        );
        setQuizzesByCourse(quizMap);

        // If no course is expanded by default and there are courses, expand the first one if preferred,
        // or respect the saved expanded_course_id
        if (!expandedCourse && coursesData.length > 0) {
          // Optional: keep first course expanded or start collapsed
          const savedId = localStorage.getItem('quizzes_expanded_course_id');
          if (savedId) {
            setExpandedCourse(parseInt(savedId));
          }
        }
      } catch (err) {
        console.error('Failed to load courses for quizzes', err);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCoursesAndQuizzes();
  }, []);

  const fetchCourseQuizzes = async (courseId) => {
    if (quizzesByCourse[courseId] && quizzesByCourse[courseId].length > 0) return;
    setLoadingQuizzes(prev => ({ ...prev, [courseId]: true }));
    try {
      const res = await api.get(`/quizzes/course/${courseId}`);
      setQuizzesByCourse(prev => ({ ...prev, [courseId]: res.data }));
    } catch (err) {
      console.error(`Failed to load quizzes for course ${courseId}`, err);
    } finally {
      setLoadingQuizzes(prev => ({ ...prev, [courseId]: false }));
    }
  };

  const toggleCourse = (courseId) => {
    if (expandedCourse === courseId) {
      setExpandedCourse(null);
      localStorage.removeItem('quizzes_expanded_course_id');
    } else {
      setExpandedCourse(courseId);
      localStorage.setItem('quizzes_expanded_course_id', courseId);
      fetchCourseQuizzes(courseId);
      
      // Smoothly scroll the expanded course into view
      setTimeout(() => {
        const el = courseRefs.current[courseId];
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 80);
    }
  };

  const deleteQuiz = async (quizId, title, courseId) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await api.delete(`/quizzes/${quizId}`);
        setQuizzesByCourse(prev => ({
          ...prev,
          [courseId]: (prev[courseId] || []).filter(q => q.id !== quizId)
        }));
      } catch (e) {
        alert('Failed to delete quiz');
      }
    }
  };

  // Compute overall stats
  const allQuizzesList = Object.values(quizzesByCourse).flat();
  const totalQuizzes = allQuizzesList.length;
  const officialQuizzesCount = allQuizzesList.filter(q => q.is_official).length;
  const aiQuizzesCount = allQuizzesList.filter(q => !q.is_official).length;
  const attemptedQuizzesCount = allQuizzesList.filter(q => q.best_score != null).length;

  const courseColors = [
    'from-blue-500/10 to-blue-600/5 border-blue-200 dark:border-blue-800',
    'from-emerald-500/10 to-emerald-600/5 border-emerald-200 dark:border-emerald-800',
    'from-violet-500/10 to-violet-600/5 border-violet-200 dark:border-violet-800',
    'from-amber-500/10 to-amber-600/5 border-amber-200 dark:border-amber-800',
    'from-rose-500/10 to-rose-600/5 border-rose-200 dark:border-rose-800',
    'from-cyan-500/10 to-cyan-600/5 border-cyan-200 dark:border-cyan-800',
  ];
  const iconColors = ['text-blue-500', 'text-emerald-500', 'text-violet-500', 'text-amber-500', 'text-rose-500', 'text-cyan-500'];

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 space-y-6 sm:space-y-8 animate-in fade-in duration-500">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1 flex items-center gap-2.5">
            <CheckSquare className="text-accent" size={28} />
            <span>Course Quizzes</span>
          </h1>
          <p className="text-text/70">
            Expand a course to test your knowledge with official curriculum assessments and AI practice sets.
          </p>
        </div>

        {/* Filter Type Buttons */}
        <div className="flex items-center bg-neutral-100 dark:bg-neutral-800/60 p-1.5 rounded-2xl border border-neutral-200 dark:border-neutral-700/50 self-start md:self-auto shadow-sm">
          <button
            onClick={() => setFilterType('all')}
            className={`flex items-center space-x-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              filterType === 'all'
                ? 'bg-card text-primary shadow-sm border border-neutral-200/50 dark:border-neutral-700'
                : 'text-text/60 hover:text-text'
            }`}
          >
            <Layers size={15} />
            <span>All ({totalQuizzes})</span>
          </button>
          
          <button
            onClick={() => setFilterType('official')}
            className={`flex items-center space-x-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              filterType === 'official'
                ? 'bg-card text-accent shadow-sm border border-neutral-200/50 dark:border-neutral-700'
                : 'text-text/60 hover:text-text'
            }`}
          >
            <CheckSquare size={15} className="text-accent" />
            <span>Official ({officialQuizzesCount})</span>
          </button>

          <button
            onClick={() => setFilterType('ai')}
            className={`flex items-center space-x-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              filterType === 'ai'
                ? 'bg-card text-emerald-600 shadow-sm border border-neutral-200/50 dark:border-neutral-700'
                : 'text-text/60 hover:text-text'
            }`}
          >
            <Sparkles size={15} className="text-emerald-500" />
            <span>AI Practice ({aiQuizzesCount})</span>
          </button>
        </div>
      </div>

      {/* Search & Overview Stats Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text/40" />
          <input
            type="text"
            placeholder="Search quizzes by title or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-text placeholder:text-text/40 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text/40 hover:text-text px-1"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-text/60">
          <span className="flex items-center gap-1 bg-card border border-neutral-200 dark:border-neutral-800 px-3 py-1.5 rounded-lg">
            <BarChart2 size={13} className="text-primary" />
            <span className="font-semibold text-text">{courses.length}</span> Courses
          </span>
          <span className="flex items-center gap-1 bg-card border border-neutral-200 dark:border-neutral-800 px-3 py-1.5 rounded-lg">
            <CheckCircle2 size={13} className="text-emerald-500" />
            <span className="font-semibold text-text">{attemptedQuizzesCount}</span> Attempted
          </span>
        </div>
      </div>

      {/* Courses Accordion List */}
      {loadingCourses ? (
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3, 4, 5].map(i => <CourseAccordionSkeleton key={i} />)}
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-card rounded-2xl border border-neutral-200 dark:border-neutral-800 p-16 text-center">
          <HelpCircle size={48} className="mx-auto text-text/30 mb-4" />
          <p className="text-text/60 text-lg">No courses available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {courses.map((course, idx) => {
            const isExpanded = expandedCourse === course.id;
            const rawQuizzes = quizzesByCourse[course.id] || [];
            
            // Filter quizzes by type & search query
            const filteredQuizzes = rawQuizzes.filter(q => {
              const matchesFilter = 
                filterType === 'all' ? true :
                filterType === 'official' ? q.is_official :
                !q.is_official;

              const matchesSearch = searchQuery.trim() === '' ||
                q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (q.description && q.description.toLowerCase().includes(searchQuery.toLowerCase()));

              return matchesFilter && matchesSearch;
            });

            const courseOfficialCount = rawQuizzes.filter(q => q.is_official).length;
            const courseAiCount = rawQuizzes.filter(q => !q.is_official).length;
            const courseAttemptedCount = rawQuizzes.filter(q => q.best_score != null).length;

            return (
              <div
                key={course.id}
                ref={el => (courseRefs.current[course.id] = el)}
                className={`scroll-mt-4 rounded-2xl overflow-hidden border transition-all duration-300 ${
                  isExpanded
                    ? 'border-primary/50 dark:border-primary/50 shadow-xl ring-2 ring-primary/20 -translate-y-0.5'
                    : 'border-neutral-200 dark:border-neutral-800 shadow-sm hover:border-neutral-300 dark:hover:border-neutral-700'
                }`}
              >
                {/* Accordion Course Header */}
                <div
                  onClick={() => toggleCourse(course.id)}
                  className={`w-full text-left p-4 sm:p-6 bg-gradient-to-r ${courseColors[idx % courseColors.length]} flex items-start sm:items-center justify-between gap-3 sm:gap-4 group hover:shadow-md transition-all cursor-pointer overflow-hidden`}
                >
                  <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                    <div className={`p-2.5 sm:p-3 rounded-xl bg-card/80 shadow-sm shrink-0 transition-transform duration-300 ${isExpanded ? 'scale-105 sm:scale-110' : ''} ${iconColors[idx % iconColors.length]}`}>
                      <CheckSquare size={22} className="text-accent sm:w-6 sm:h-6" strokeWidth={2.2} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                        <h2 className="text-base sm:text-xl font-bold text-text break-words">
                          {course.title}
                        </h2>

                        {/* Badges */}
                        <div className="flex items-center gap-1.5 shrink-0 ml-auto sm:ml-2">
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-card/90 border border-neutral-200/80 dark:border-neutral-700/80 text-text/70 shadow-xs">
                            {rawQuizzes.length} {rawQuizzes.length === 1 ? 'Quiz' : 'Quizzes'}
                          </span>
                          {courseOfficialCount > 0 && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-accent/10 text-accent border border-accent/20 hidden sm:inline-block">
                              {courseOfficialCount} Official
                            </span>
                          )}
                          {courseAiCount > 0 && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hidden sm:inline-block">
                              {courseAiCount} AI
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-text/60 font-medium break-words leading-relaxed">
                        {course.code} • {course.description || 'University Course'}
                      </p>

                      {/* Quiz Completion Mini Stats */}
                      <div className="mt-2.5 flex items-center gap-3">
                        <div className="w-full max-w-[180px] sm:max-w-xs">
                          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider mb-1">
                            <span className="text-text/40">Attempted</span>
                            <span className="text-primary font-mono">
                              {courseAttemptedCount} / {rawQuizzes.length || 0}
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-background rounded-full overflow-hidden border border-neutral-100 dark:border-neutral-800">
                            <div
                              className="h-full bg-accent transition-all duration-1000 ease-out"
                              style={{
                                width: `${rawQuizzes.length > 0 ? (courseAttemptedCount / rawQuizzes.length) * 100 : 0}%`
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expand / Collapse Chevron */}
                  <div className={`p-1 text-text/40 shrink-0 self-start sm:self-center transition-transform duration-300 ${isExpanded ? 'rotate-180 text-primary' : ''}`}>
                    <ChevronDown size={20} />
                  </div>
                </div>

                {/* Expanded Accordion Body */}
                {isExpanded && (
                  <div className={`p-4 sm:p-6 border-t border-neutral-200 dark:border-neutral-800 space-y-5 animate-in fade-in slide-in-from-top-2 duration-200 bg-gradient-to-r ${courseColors[idx % courseColors.length]} overflow-hidden`}>
                    {loadingQuizzes[course.id] ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <QuizCardSkeleton />
                        <QuizCardSkeleton />
                        <QuizCardSkeleton />
                      </div>
                    ) : filteredQuizzes.length === 0 ? (
                      <div className="text-center py-10 bg-background/50 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl p-6">
                        <HelpCircle size={36} className="mx-auto text-text/30 mb-2" />
                        <p className="text-sm font-semibold text-text/70">No quizzes match your current filter.</p>
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery('')}
                            className="mt-2 text-xs font-bold text-primary hover:underline"
                          >
                            Clear search filter
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* 1. Official Quizzes Subgroup */}
                        {filteredQuizzes.some(q => q.is_official) && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-accent" />
                              <h3 className="text-xs font-black uppercase tracking-wider text-text/70">
                                Official Course Quizzes
                              </h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              {filteredQuizzes.filter(q => q.is_official).map(q => {
                                const cleanedDesc = q.description
                                  ? q.description.replace(/:\s*#\d+\s*-\s*#\d+/g, '').replace(/#\d+\s*-\s*#\d+/g, '').trim()
                                  : '';
                                return (
                                  <div
                                    key={q.id}
                                    onClick={() => navigate(`/quiz/${q.id}`, { state: { from: '/quizzes', courseId: course.id } })}
                                    className="bg-card border border-neutral-200 dark:border-neutral-800 hover:border-accent/50 p-4 rounded-2xl shadow-sm transition-all flex flex-col justify-between space-y-3.5 group cursor-pointer hover:shadow-lg hover:-translate-y-1"
                                  >
                                    <div>
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-accent bg-accent/10 px-2.5 py-0.5 rounded-md border border-accent/20">
                                          Official
                                        </span>
                                        {q.best_score != null ? (
                                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                                            <CheckCircle2 size={11} />
                                            Best: {q.best_score}/{q.total_questions || '?'}
                                          </span>
                                        ) : (
                                          <span className="text-[10px] font-medium text-text/40">
                                            {q.total_questions ? `${q.total_questions} Questions` : 'Not Attempted'}
                                          </span>
                                        )}
                                      </div>
                                      
                                      <h4 className="font-bold text-sm text-text group-hover:text-accent transition-colors break-words leading-snug">
                                        {q.title}
                                      </h4>
                                      <p className="text-xs text-text/60 break-words mt-1 leading-relaxed line-clamp-2">
                                        {cleanedDesc || `${q.total_questions || 'Multiple'} questions from course curriculum`}
                                      </p>
                                    </div>

                                    <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
                                      <div className="w-full bg-accent/10 group-hover:bg-accent text-accent group-hover:text-white font-bold py-2.5 px-3 rounded-xl text-xs transition-all flex items-center justify-center space-x-1.5 shadow-xs">
                                        <PlayCircle size={15} />
                                        <span>Start Quiz</span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* 2. AI Practice Quizzes Subgroup */}
                        {filteredQuizzes.some(q => !q.is_official) && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-500" />
                              <h3 className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                                <Sparkles size={13} />
                                <span>AI Practice Quizzes</span>
                              </h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              {filteredQuizzes.filter(q => !q.is_official).map(q => {
                                const cleanedDesc = q.description
                                  ? q.description.replace(/:\s*#\d+\s*-\s*#\d+/g, '').replace(/#\d+\s*-\s*#\d+/g, '').trim()
                                  : '';
                                return (
                                  <div
                                    key={q.id}
                                    onClick={() => navigate(`/quiz/${q.id}`, { state: { from: '/quizzes', courseId: course.id } })}
                                    className="bg-card border border-neutral-200 dark:border-neutral-800 hover:border-emerald-500/50 p-4 rounded-2xl shadow-sm transition-all flex flex-col justify-between space-y-3.5 group cursor-pointer hover:shadow-lg hover:-translate-y-1"
                                  >
                                    <div>
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20 flex items-center gap-1">
                                          <Sparkles size={10} />
                                          AI Practice
                                        </span>
                                        <div className="flex items-center gap-1">
                                          {q.best_score != null && (
                                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                              Best: {q.best_score}/{q.total_questions || '?'}
                                            </span>
                                          )}
                                          {(user?.role === 'admin' || user?.id === q.user_id) && (
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                deleteQuiz(q.id, q.title, course.id);
                                              }}
                                              className="text-text/30 hover:text-red-500 transition p-1 rounded-md hover:bg-red-500/10"
                                              title="Delete Quiz"
                                            >
                                              <Trash2 size={13} />
                                            </button>
                                          )}
                                        </div>
                                      </div>

                                      <h4 className="font-bold text-sm text-text group-hover:text-emerald-600 transition-colors break-words leading-snug">
                                        {q.title}
                                      </h4>
                                      <p className="text-xs text-text/60 break-words mt-1 leading-relaxed line-clamp-2">
                                        {cleanedDesc || `${q.total_questions || 'Practice'} questions generated with AI`}
                                      </p>
                                    </div>

                                    <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
                                      <div className="w-full bg-emerald-500/10 group-hover:bg-emerald-500 text-emerald-600 group-hover:text-white font-bold py-2.5 px-3 rounded-xl text-xs transition-all flex items-center justify-center space-x-1.5 shadow-xs">
                                        <Sparkles size={15} />
                                        <span>Start Practice</span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Quizzes;
