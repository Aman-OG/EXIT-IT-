import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BookOpen, TrendingUp, Users, AlertTriangle, ChevronRight, ChevronLeft, Award } from 'lucide-react';

const AdminAnalytics = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    api.get('/admin/analytics/courses')
      .then(res => setCourses(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

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

  if (loading) return (
    <div className="h-full flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">Course Analytics</h1>
        <p className="text-text/70">Track student progress and identify weak areas across all courses.</p>
      </div>

      {!selectedCourse ? (
        // Course overview grid
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
                    contentStyle={{ background: 'rgb(var(--card))', border: '1px solid rgba(var(--text), 0.1)', borderRadius: '12px' }}
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
      )}
    </div>
  );
};

export default AdminAnalytics;
