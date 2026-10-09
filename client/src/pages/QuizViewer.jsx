import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';
import {
  CheckCircle2, XCircle, ArrowRight, ArrowLeft, RotateCcw,
  ChevronLeft, Award, HelpCircle, Layout, Sparkles, BookOpen
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const QuizViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { triggerStreakUpdate, triggerPointsEarned, evaluateBadges } = useContext(AuthContext);
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showHint, setShowHint] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(null);

  const handleBack = () => {
    const fromPath = location.state?.from;
    const courseId = location.state?.courseId || quiz?.course_id;

    if (fromPath === '/courses') {
      if (courseId) {
        localStorage.setItem('expanded_course_id', courseId);
      }
      localStorage.setItem('courses_content_type', 'quiz');
      navigate('/courses');
    } else if (fromPath === '/quizzes') {
      if (courseId) {
        localStorage.setItem('quizzes_expanded_course_id', courseId);
      }
      navigate('/quizzes');
    } else if (fromPath) {
      navigate(fromPath);
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/quizzes');
    }
  };

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
    setSelectedOptionId(optionId);
  };

  const handleNext = () => {
    if (!selectedOptionId) return;
    const currentQuestion = quiz.questions[currentQuestionIndex];
    const newAnswers = { ...answers, [currentQuestion.id]: selectedOptionId };
    setAnswers(newAnswers);
    if (currentQuestionIndex === quiz.questions.length - 1) {
      submitQuiz(newAnswers);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOptionId(null);
      setShowHint(false);
    }
  };

  const submitQuiz = async (finalAnswers) => {
    try {
      const res = await api.post(`/quizzes/${id}/submit`, { answers: finalAnswers });
      setScore(res.data);
      setIsSubmitted(true);
      await triggerStreakUpdate();
      const pts = res.data.pointsEarned !== undefined ? res.data.pointsEarned : (res.data.score * 10);
      if (pts > 0) {
        triggerPointsEarned(pts, `Quiz Completed! +${pts} XP`);
      }
      setTimeout(() => evaluateBadges(), 500);
    } catch (err) {
      alert('Failed to submit quiz');
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="animate-spin w-7 h-7 border-3 border-primary border-t-transparent rounded-full mx-auto mb-3" />
      <span className="text-xs text-text/60 font-semibold">Loading quiz questions...</span>
    </div>
  );

  if (!quiz) return <div className="p-8 text-center text-warning text-sm">Quiz not found.</div>;

  if (!quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-4 sm:p-6">
        <div className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 max-w-sm w-full text-center">
          <HelpCircle size={36} className="mx-auto mb-3 text-warning" />
          <h2 className="text-lg font-bold mb-1">Empty Quiz</h2>
          <p className="text-text/50 text-xs mb-5">This quiz has no questions yet.</p>
          <button onClick={handleBack} className="bg-primary text-primary-foreground font-bold px-5 py-2 text-xs rounded-xl shadow-sm">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // ── RESULTS + REVIEW SCREEN ──
  if (isSubmitted && score) {
    const answersMap = score.answers_map || {};
    const percentage = Math.round((score.score / score.totalQuestions) * 100);
    const reviewQuestion = reviewIndex !== null ? quiz.questions[reviewIndex] : null;

    return (
      <div className="h-full flex flex-col md:flex-row overflow-hidden bg-background animate-in fade-in duration-300">
        {/* Left: Score + Question Grid */}
        <div className="w-full md:w-80 lg:w-88 border-r border-neutral-200 dark:border-neutral-800 bg-card flex flex-col h-1/3 md:h-full overflow-hidden shrink-0">
          {/* Score Card */}
          <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 text-center space-y-2">
            <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center ${percentage >= 50 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-warning/10 text-warning'}`}>
              <Award size={24} />
            </div>
            <h2 className="text-base sm:text-lg font-bold">Quiz Complete!</h2>
            <div className={`text-3xl sm:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r ${percentage >= 50 ? 'from-emerald-500 to-accent' : 'from-warning to-orange-500'}`}>
              {percentage}%
            </div>
            <p className="text-xs text-text/60">{score.score} / {score.totalQuestions} correct</p>
          </div>

          {/* Question Grid */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4">
            <p className="text-[10px] font-bold text-text/40 uppercase tracking-widest mb-2.5">Review Questions</p>
            <div className="grid grid-cols-6 sm:grid-cols-7 md:grid-cols-5 gap-1.5">
              {quiz.questions.map((q, idx) => {
                const info = answersMap[q.id];
                const isCorrect = info?.isCorrect;
                const wasAnswered = info?.selectedOptionId != null;
                const isReviewing = reviewIndex === idx;
                let btnClass = 'relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center font-bold text-xs rounded-lg border transition-all ';
                if (isReviewing) btnClass += 'bg-primary border-primary text-primary-foreground shadow-sm scale-105';
                else if (wasAnswered && isCorrect) btnClass += 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600';
                else if (wasAnswered && !isCorrect) btnClass += 'bg-red-500/10 border-red-500/40 text-red-500';
                else btnClass += 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-text/40';
                return (
                  <button key={q.id} onClick={() => setReviewIndex(idx)} className={btnClass}>
                    {idx + 1}
                    {wasAnswered && (
                      <div className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center border border-card ${isCorrect ? 'bg-emerald-500' : 'bg-red-500'}`}>
                        {isCorrect ? <CheckCircle2 size={7} className="text-white" /> : <XCircle size={7} className="text-white" />}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legend + Actions */}
          <div className="p-3 sm:p-4 border-t border-neutral-200 dark:border-neutral-800 space-y-2.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-text/60 px-1">
              <div className="flex items-center space-x-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /><span>Correct</span></div>
              <div className="flex items-center space-x-1.5"><div className="w-2 h-2 rounded-full bg-red-500" /><span>Incorrect</span></div>
              <div className="flex items-center space-x-1.5"><div className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-600" /><span>Skipped</span></div>
            </div>
            <div className="flex items-center space-x-2 pt-1">
              <button onClick={() => window.location.reload()} className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 font-bold rounded-xl text-xs transition">
                <RotateCcw size={14} /><span>Retry</span>
              </button>
              <button onClick={handleBack} className="flex-1 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl text-xs hover:opacity-90 transition flex items-center justify-center space-x-1 shadow-sm">
                <span>{location.state?.from === '/courses' ? 'Back' : 'Quizzes'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Question Review Detail */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {reviewQuestion ? (
            <>
              <div className="flex-none p-3.5 sm:p-4 border-b border-neutral-200 dark:border-neutral-800 bg-card flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <p className="text-xs font-bold text-text/50">Question <span className="text-primary font-bold">{reviewIndex + 1}</span> of {quiz.questions.length}</p>
                  {answersMap[reviewQuestion.id]?.isCorrect ? (
                    <span className="flex items-center space-x-1 text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full"><CheckCircle2 size={11} /><span>Correct</span></span>
                  ) : (
                    <span className="flex items-center space-x-1 text-[11px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full"><XCircle size={11} /><span>Incorrect</span></span>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
                <div className="max-w-3xl mx-auto space-y-4">
                  <h2 className="text-sm sm:text-base font-semibold leading-relaxed p-3.5 sm:p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-card">
                    {reviewQuestion.question_text}
                  </h2>

                  <div className="space-y-2">
                    {reviewQuestion.options?.map((opt, idx) => {
                      const info = answersMap[reviewQuestion.id];
                      const isUserPick = info?.selectedOptionId == opt.id;
                      const isCorrectOption = info?.correctOptionId == opt.id;
                      const labels = ['A', 'B', 'C', 'D', 'E', 'F'];
                      let optClass = 'w-full flex items-center space-x-3 p-3 rounded-xl border transition-all text-xs sm:text-sm ';
                      if (isCorrectOption) optClass += 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium';
                      else if (isUserPick && !isCorrectOption) optClass += 'border-red-500 bg-red-500/10 text-red-600 dark:text-red-400 line-through decoration-1';
                      else optClass += 'border-neutral-200 dark:border-neutral-800 text-text/60';
                      return (
                        <div key={opt.id} className={optClass}>
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 ${isCorrectOption ? 'bg-emerald-500 text-white' : isUserPick ? 'bg-red-500 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-text/50'}`}>
                            {labels[idx] || '-'}
                          </div>
                          <span className="text-left leading-relaxed flex-1">{opt.option_text}</span>
                          {isCorrectOption && <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />}
                          {isUserPick && !isCorrectOption && <XCircle size={16} className="text-red-500 flex-shrink-0" />}
                        </div>
                      );
                    })}
                  </div>

                  {reviewQuestion.explanation && (
                    <div className="p-3.5 sm:p-4 bg-primary/5 border border-primary/10 rounded-xl">
                      <div className="flex items-center space-x-1.5 mb-1.5 text-primary">
                        <Sparkles size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Concept Explanation</span>
                      </div>
                      <p className="text-xs leading-relaxed text-text/70">{reviewQuestion.explanation}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-none p-3.5 sm:p-4 border-t border-neutral-200 dark:border-neutral-800 bg-card flex items-center justify-between">
                <button disabled={reviewIndex === 0} onClick={() => setReviewIndex(p => p - 1)} className="flex items-center space-x-1.5 px-4 py-2 font-bold text-xs text-text/60 disabled:opacity-30 hover:text-primary transition-colors">
                  <ArrowLeft size={14} /><span>Previous</span>
                </button>
                {reviewIndex < quiz.questions.length - 1 && (
                  <button onClick={() => setReviewIndex(p => p + 1)} className="flex items-center space-x-1.5 px-5 py-2 bg-primary text-primary-foreground font-bold text-xs rounded-xl shadow-sm hover:opacity-90 transition-all">
                    <span>Next</span><ArrowRight size={14} />
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                <BookOpen size={24} className="text-primary" />
              </div>
              <h3 className="text-base font-bold">Review Your Answers</h3>
              <p className="text-text/50 text-xs max-w-xs">Select any question number on the left to see the correct answer and explanations.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── QUIZ TAKING SCREEN (COMPACT & MOBILE-FRIENDLY) ──
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="h-full flex flex-col p-3 sm:p-5 md:p-6 animate-in fade-in duration-300 overflow-y-auto">
      {/* Top Navigation & Progress Header */}
      <div className="w-full max-w-xl mx-auto flex items-center justify-between gap-2 mb-3 sm:mb-5">
        <button
          onClick={handleBack}
          className="p-1.5 sm:p-2 text-text/50 hover:text-primary transition flex items-center space-x-1 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 shrink-0"
          title={location.state?.from === '/courses' ? "Back to Course" : "Back to Quizzes"}
        >
          <ChevronLeft size={20} />
          <span className="text-xs font-semibold hidden sm:inline">
            {location.state?.from === '/courses' ? "Courses" : "Quizzes"}
          </span>
        </button>

        <div className="flex-1 px-3 sm:px-4 text-center min-w-0">
          <h1 className="font-bold text-xs sm:text-sm text-text truncate mb-1">{quiz.title}</h1>
          <div className="w-full max-w-[140px] sm:max-w-xs mx-auto h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="text-[11px] sm:text-xs font-bold font-mono bg-card px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-xs text-text/60 shrink-0">
          {currentQuestionIndex + 1} / {quiz.questions.length}
        </div>
      </div>

      {/* Question Card Container */}
      <div className="flex-1 w-full max-w-xl mx-auto flex flex-col justify-center my-auto pb-4">
        <div className="bg-card w-full border border-neutral-200 dark:border-neutral-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-7 shadow-md relative">
          
          {/* Tag & AI Indicator */}
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center space-x-2">
              <HelpCircle className="text-primary" size={18} />
              <span className="text-[10px] font-bold uppercase tracking-wider text-text/40">
                {quiz.is_official ? 'Official Quiz' : 'AI Practice'}
              </span>
            </div>
            {!quiz.is_official && (
              <span className="px-2 py-0.5 bg-accent/10 text-accent rounded-full text-[9px] font-bold uppercase tracking-wider border border-accent/20">
                AI Generated
              </span>
            )}
          </div>

          {/* Question Text (Compact & Readable) */}
          <h2 className="text-sm sm:text-base md:text-lg font-bold mb-4 sm:mb-5 leading-snug text-text">
            {currentQuestion.question_text}
          </h2>

          {/* Options List */}
          <div className="space-y-2 sm:space-y-2.5">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = selectedOptionId === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleOptionSelect(opt.id)}
                  className={`w-full group flex items-center space-x-2.5 sm:space-x-3 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border transition-all text-left cursor-pointer active:scale-[0.99] ${
                    isSelected
                      ? 'border-primary bg-primary/5 ring-1 ring-primary/30 shadow-xs'
                      : 'border-neutral-200 dark:border-neutral-800 hover:border-primary/30 hover:bg-primary/[0.02] bg-background'
                  }`}
                >
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm transition-all flex-shrink-0 ${
                      isSelected
                        ? 'bg-primary text-primary-foreground shadow-xs'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-text/50 group-hover:bg-primary/10 group-hover:text-primary'
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className={`text-xs sm:text-sm font-medium leading-relaxed flex-1 ${isSelected ? 'text-text font-semibold' : 'text-text/70'}`}>
                    {opt.option_text}
                  </span>
                  {isSelected && (
                    <div className="ml-auto text-primary flex-shrink-0">
                      <CheckCircle2 size={18} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* AI Concept Insight / Hint */}
          {currentQuestion.explanation && (
            <div className="mt-4 sm:mt-5">
              {!showHint ? (
                <button
                  onClick={() => setShowHint(true)}
                  className="flex items-center space-x-1.5 text-primary hover:text-primary/80 transition-colors group text-xs font-bold cursor-pointer"
                >
                  <Sparkles size={13} className="group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] uppercase tracking-wider">Show AI Hint</span>
                </button>
              ) : (
                <div className="p-3.5 sm:p-4 bg-primary/5 border border-primary/10 rounded-xl animate-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center space-x-1.5 text-primary">
                      <Sparkles size={13} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">AI Concept Insight</span>
                    </div>
                    <button onClick={() => setShowHint(false)} className="text-[10px] font-semibold text-text/40 hover:text-text transition-colors cursor-pointer">
                      Hide
                    </button>
                  </div>
                  <p className="text-xs leading-relaxed text-text/70 italic">{currentQuestion.explanation}</p>
                </div>
              )}
            </div>
          )}

          {/* Action / Next Button */}
          <div className="mt-5 sm:mt-7 flex justify-end">
            <button
              onClick={handleNext}
              disabled={!selectedOptionId}
              className="flex items-center space-x-2 bg-primary disabled:opacity-30 disabled:grayscale disabled:pointer-events-none text-primary-foreground font-bold px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl transition hover:bg-primary/90 shadow-md hover:-translate-y-0.5 active:translate-y-0 text-xs sm:text-sm cursor-pointer"
            >
              <span>{currentQuestionIndex === quiz.questions.length - 1 ? 'Finish & Submit' : 'Next Question'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizViewer;
