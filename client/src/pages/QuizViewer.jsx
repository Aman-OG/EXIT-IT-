import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { 
  CheckCircle2, XCircle, ArrowRight, RotateCcw, 
  ChevronLeft, Award, HelpCircle, Layout, Sparkles
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const QuizViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { triggerStreakUpdate, triggerPointsEarned, evaluateBadges } = useContext(AuthContext);
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [answers, setAnswers] = useState({}); // { questionId: optionId }
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState(null); // { isCorrect: bool, correctOptionId: id }
  const [loading, setLoading] = useState(true);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/quizzes/${id}`);
        setQuiz(res.data);
      } catch (err) {
        console.error('Failed to load quiz', err);
      }
      setLoading(false);
    };
    fetchQuiz();
  }, [id]);

  const handleOptionSelect = (optionId) => {
    if (feedback) return; // Prevent changing after showing feedback
    setSelectedOptionId(optionId);
  };

  const handleNext = () => {
    if (!selectedOptionId) return;

    // Save answer locally
    const currentQuestion = quiz.questions[currentQuestionIndex];
    const newAnswers = { ...answers, [currentQuestion.id]: selectedOptionId };
    setAnswers(newAnswers);

    // If it's the last question, submit
    if (currentQuestionIndex === quiz.questions.length - 1) {
      submitQuiz(newAnswers);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOptionId(null);
      setFeedback(null);
      setShowHint(false);
    }
  };

  const submitQuiz = async (finalAnswers) => {
    try {
      const res = await api.post(`/quizzes/${id}/submit`, { answers: finalAnswers });
      setScore(res.data);
      setIsSubmitted(true);
      // Sequentially queue animations
      await triggerStreakUpdate();
      // Show points earned animation
      if (res.data.score > 0) {
        triggerPointsEarned(res.data.score, 'Quiz Completed!');
      }
      setTimeout(() => evaluateBadges(), 500);
    } catch (err) {
      alert('Failed to submit quiz');
    }
  };

  if (loading) return <div className="p-8 text-center"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />Calibrating Exam Engine...</div>;
  if (!quiz) return <div className="p-8 text-center text-warning">Quiz not found for this system.</div>;
  
  if (!quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-6 animate-in zoom-in-95 duration-500">
        <div className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-3xl p-10 max-w-md w-full text-center">
          <HelpCircle size={48} className="mx-auto mb-4 text-warning" />
          <h2 className="text-2xl font-bold mb-2">Empty Quiz</h2>
          <p className="text-text/50 mb-6">This quiz has no questions. It might still be generating or failed due to source quality.</p>
          <button onClick={() => navigate(-1)} className="bg-primary text-black font-bold px-6 py-2 rounded-xl">Go Back</button>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    const percentage = Math.round((score.score / score.totalQuestions) * 100);
    return (
      <div className="h-full flex items-center justify-center p-6 animate-in zoom-in-95 duration-500">
        <div className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl p-10 max-w-md w-full text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-accent to-warning" />
          
          <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${percentage >= 50 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-warning/10 text-warning'}`}>
            <Award size={48} />
          </div>

          <h2 className="text-3xl font-bold mb-2">Quiz Completed!</h2>
          <p className="text-text/50 mb-8">You have successfully analyzed the material.</p>

          <div className="bg-background rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 mb-8 space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text/30">Your Final Grade</p>
            <div className="flex items-center justify-center space-x-2">
               <span className="text-5xl font-black">{score.score}</span>
               <span className="text-2xl text-text/20 font-bold">/</span>
               <span className="text-2xl text-text/40 font-bold">{score.totalQuestions}</span>
            </div>
            <div className={`text-sm font-bold ${percentage >= 50 ? 'text-emerald-500' : 'text-warning'}`}>
              {percentage}% Proficiency
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => window.location.reload()}
              className="flex items-center justify-center space-x-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 py-3 rounded-xl font-bold transition"
            >
              <RotateCcw size={18} />
              <span>Retry</span>
            </button>
            <button 
              onClick={() => navigate('/courses')}
              className="flex items-center justify-center space-x-2 bg-primary text-primary-foreground hover:bg-primary/90 py-3 rounded-xl font-bold transition shadow-lg"
            >
              <Layout size={18} />
              <span>Courses</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="h-full flex flex-col p-4 md:p-8 animate-in fade-in duration-500 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => navigate(-1)} className="p-2 text-text/40 hover:text-text transition">
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1 px-8 text-center">
          <h1 className="font-bold text-lg truncate mb-1">{quiz.title}</h1>
          <div className="w-full max-w-xs mx-auto h-1 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="text-xs font-bold font-mono bg-card px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-sm text-text/50">
          {currentQuestionIndex + 1} / {quiz.questions.length}
        </div>
      </div>

      <div className="flex-1 w-full max-w-xl mx-auto py-4">
        {/* Question Card */}
        <div className="bg-card w-full border border-neutral-200 dark:border-neutral-800 rounded-[2rem] p-6 md:p-8 shadow-xl relative scale-in-center">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
               <HelpCircle className="text-primary" size={24} />
               <span className="text-[10px] font-bold uppercase tracking-widest text-text/30">
                 {quiz.is_official ? 'Official Course Challenge' : 'Personal AI Practice'}
               </span>
            </div>
            {!quiz.is_official && (
              <div className="px-2 py-0.5 bg-accent/10 text-accent rounded-full text-[8px] font-black uppercase tracking-tighter border border-accent/20">
                AI Generated
              </div>
            )}
          </div>

          <h2 className="text-xl md:text-2xl font-bold mb-8 leading-tight">
            {currentQuestion.question_text}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((opt, idx) => (
              <button
                key={opt.id}
                onClick={() => handleOptionSelect(opt.id)}
                className={`w-full group flex items-center space-x-4 p-4 rounded-2xl border-2 transition-all text-left ${selectedOptionId === opt.id ? 'border-primary bg-primary/5' : 'border-background hover:border-primary/20 hover:bg-primary/[0.02] bg-background'}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${selectedOptionId === opt.id ? 'bg-primary text-primary-foreground' : 'bg-neutral-100 dark:bg-neutral-800 text-text/40 group-hover:bg-primary/10 group-hover:text-primary'}`}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className={`text-base font-semibold ${selectedOptionId === opt.id ? 'text-text' : 'text-text/70'}`}>
                  {opt.option_text}
                </span>
                {selectedOptionId === opt.id && (
                  <div className="ml-auto text-primary animate-in zoom-in-0 duration-300">
                    <CheckCircle2 size={24} />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* AI Explanation Area - Shown if question has explanation */}
          {currentQuestion.explanation && (
            <div className="mt-8">
               {!showHint ? (
                 <button 
                   onClick={() => setShowHint(true)}
                   className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors group"
                 >
                   <Sparkles size={16} className="group-hover:scale-110 transition-transform" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Show AI Hint</span>
                 </button>
               ) : (
                 <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl animate-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center justify-between mb-2">
                       <div className="flex items-center space-x-2 text-primary">
                          <Sparkles size={16} />
                          <span className="text-xs font-black uppercase tracking-widest">AI Concept Insight</span>
                       </div>
                       <button onClick={() => setShowHint(false)} className="text-[10px] font-bold text-text/40 hover:text-text transition-colors">Hide</button>
                    </div>
                    <p className="text-sm leading-relaxed text-text/70 italic">
                      {currentQuestion.explanation}
                    </p>
                 </div>
               )}
            </div>
          )}

          <div className="mt-12 flex justify-end">
            <button
              onClick={handleNext}
              disabled={!selectedOptionId}
              className="flex items-center space-x-3 bg-primary disabled:opacity-30 disabled:grayscale disabled:pointer-events-none text-primary-foreground font-bold px-8 py-4 rounded-2xl transition hover:bg-primary/90 shadow-xl hover:shadow-primary/20 hover:-translate-y-1 active:translate-y-0"
            >
              <span>{currentQuestionIndex === quiz.questions.length - 1 ? 'Finalize Analysis' : 'Next Question'}</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizViewer;
