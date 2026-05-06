import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { CheckSquare, BookOpen, Clock, ChevronRight, HelpCircle, Trophy, Sparkles, Trash2, CheckCircle2, ChevronDown } from 'lucide-react';
import { QuizSkeleton } from '../components/Skeleton';

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingQuizId, setDeletingQuizId] = useState(null);
  const { user } = React.useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await api.get('/quizzes');
        setQuizzes(res.data);
      } catch (err) {
        console.error('Failed to load quizzes', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/quizzes/${id}`);
      setQuizzes(prev => prev.filter(q => q.id !== id));
      setDeletingQuizId(null);
    } catch (err) {
      console.error('Failed to delete quiz', err);
      alert('Failed to delete quiz. Please try again.');
    }
  };

  // Group quizzes by course
  const groupedQuizzes = quizzes.reduce((groups, quiz) => {
    const key = `${quiz.course_code}: ${quiz.course_title}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(quiz);
    return groups;
  }, {});

  if (loading) return (
    <div className="h-full overflow-y-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="w-full max-w-lg space-y-3">
          <div className="h-10 w-3/4 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded-xl" />
          <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded-lg" />
        </div>
      </div>
      <div className="space-y-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="space-y-3">
            <div className="h-6 w-48 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(j => <QuizSkeleton key={j} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Quiz Repository</h1>
          <p className="text-text/60">Challenge yourself with course-specific assessments and verify your expertise.</p>
        </div>
        <div className="bg-primary/5 border border-primary/10 rounded-2xl px-6 py-4 flex items-center space-x-4">
           <div className="p-3 bg-primary/10 text-primary rounded-xl">
             <Trophy size={20} />
           </div>
           <div>
             <p className="text-[10px] font-bold text-text/30 uppercase tracking-[0.2em] mb-0.5">Total Challenges</p>
             <p className="text-xl font-black text-primary">{quizzes.length}</p>
           </div>
        </div>
      </div>

      {quizzes.length === 0 ? (
        <div className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-3xl p-20 text-center space-y-4">
           <div className="w-20 h-20 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-2">
             <CheckSquare size={32} className="text-text/20" />
           </div>
           <h2 className="text-xl font-bold">No Quizzes Found</h2>
           <p className="text-text/40 max-w-sm mx-auto">Admins haven't deployed any active quizzes for your courses yet. Practice with lecture notes in the meantime!</p>
        </div>
      ) : (
        Object.keys(groupedQuizzes).map((courseKey) => (
          <CourseQuizGroup 
            key={courseKey} 
            courseKey={courseKey} 
            courseQuizzes={groupedQuizzes[courseKey]} 
            navigate={navigate} 
            user={user} 
            handleDelete={handleDelete}
            deletingQuizId={deletingQuizId}
            setDeletingQuizId={setDeletingQuizId}
          />
        ))
      )}
    </div>
  );
};

const CourseQuizGroup = ({ courseKey, courseQuizzes, navigate, user, handleDelete, deletingQuizId, setDeletingQuizId }) => {
  const [isExpanded, setIsExpanded] = React.useState(true);
  
  return (
    <div className="space-y-4 pt-2">
      <button 
        onClick={() => setIsExpanded(!isExpanded)} 
        className="flex items-center justify-between w-full text-left px-3 py-2 -mx-3 hover:bg-primary/5 rounded-xl transition group"
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
            <BookOpen size={16} />
          </div>
          <h2 className="text-lg font-bold tracking-tight group-hover:text-primary transition-colors">{courseKey}</h2>
          <span className="text-xs font-bold text-text/40 bg-neutral-200 dark:bg-neutral-800 group-hover:bg-primary/10 group-hover:text-primary transition-colors px-2 py-0.5 rounded-full">{courseQuizzes.length}</span>
        </div>
        <ChevronDown size={20} className={`text-text/40 group-hover:text-primary transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
      
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-800/50 last:border-0 last:pb-0">
          {courseQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-card hover:bg-background hover:border-primary/50 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group relative overflow-hidden cursor-pointer"
              onClick={() => navigate(`/quiz/${quiz.id}`)}
            >
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <ChevronRight className="text-primary" size={20} />
              </div>
              {quiz.is_official ? (
                <div className="absolute top-4 right-4 px-2 py-0.5 bg-accent/10 text-accent rounded-full text-[8px] font-black uppercase tracking-[0.1em] border border-accent/20 group-hover:opacity-0 transition-opacity pointer-events-none">
                  Official Quiz
                </div>
              ) : (
                <div className="absolute top-4 right-4 px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-full text-[8px] font-black uppercase tracking-[0.1em] border border-emerald-500/20 group-hover:opacity-0 transition-opacity pointer-events-none">
                  Practice
                </div>
              )}
              
              {quiz.is_official ? (
                <div className="p-3 bg-accent/10 text-accent rounded-xl w-fit mb-4 group-hover:bg-accent/20 transition-colors">
                  <HelpCircle size={20} />
                </div>
              ) : (
                <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl w-fit mb-4 group-hover:bg-emerald-500/20 transition-colors">
                  <Sparkles size={20} />
                </div>
              )}
              
              <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors pr-8">{quiz.title}</h3>
              <p className="text-xs text-text/50 line-clamp-2 mb-4 h-8">{quiz.description || (quiz.is_official ? 'Verify your official course knowledge.' : 'AI generated personal practice.')}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-800 relative z-10">
                <div className="flex items-center space-x-1.5 text-text/40">
                  <Clock size={12} />
                  <span className="text-[10px] font-bold uppercase">{new Date(quiz.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                  {quiz.best_score != null ? (
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded-md flex items-center space-x-1 border border-emerald-500/20">
                      <CheckCircle2 size={10} />
                      <span>{quiz.best_score}/{quiz.total_questions}</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary/60 bg-primary/5 px-2 py-1 rounded-md">Start Exam</span>
                  )}
                  
                  {(!quiz.is_official && (user?.role === 'admin' || Number(user?.id) === Number(quiz.user_id))) && (
                    deletingQuizId === quiz.id ? (
                      <div className="flex items-center space-x-1">
                        <span className="text-[9px] font-bold text-warning">Delete?</span>
                        <button onClick={() => handleDelete(quiz.id)} className="text-[9px] font-black text-warning hover:text-red-500 px-1.5 py-0.5 rounded bg-warning/10 hover:bg-warning/20 transition">Yes</button>
                        <button onClick={() => setDeletingQuizId(null)} className="text-[9px] font-black text-text/40 hover:text-text px-1.5 py-0.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">No</button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setDeletingQuizId(quiz.id)}
                        className="p-1.5 text-text/30 hover:text-warning hover:bg-warning/10 rounded-md transition-colors"
                        title="Delete Quiz"
                      >
                        <Trash2 size={14} />
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Quizzes;
