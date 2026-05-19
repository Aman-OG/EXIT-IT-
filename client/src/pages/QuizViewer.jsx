import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import {
  CheckCircle2, XCircle, ArrowRight, ArrowLeft, RotateCcw,
  ChevronLeft, Award, HelpCircle, Layout, Sparkles, BookOpen
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const QuizViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
      if (res.data.score > 0) {
        triggerPointsEarned(res.data.score, 'Quiz Completed!');
      }
      setTimeout(() => evaluateBadges(), 500);
    } catch (err) {
      alert('Failed to submit quiz');
    }
  };

  if (loading) return (
    <div className="p-8 text-center">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
      Calibrating Exam Engine...
    </div>
  );

  if (!quiz) return <div className="p-8 text-center text-warning">Quiz not found.</div>;

  if (!quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-3xl p-10 max-w-md w-full text-center">
          <HelpCircle size={48} className="mx-auto mb-4 text-warning" />
          <h2 className="text-2xl font-bold mb-2">Empty Quiz</h2>
          <p className="text-text/50 mb-6">This quiz has no questions yet.</p>
          <button onClick={() => navigate(-1)} className="bg-primary text-primary-foreground font-bold px-6 py-2 rounded-xl">Go Back</button>
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
      <div className="h-full flex flex-col md:flex-row overflow-hidden bg-background animate-in fade-in duration-500">
        {/* Left: Score + Grid */}
        <div className="w-full md:w-96 border-r border-neutral-200 dark:border-neutral-800 bg-card flex flex-col h-1/3 md:h-full overflow-hidden shrink-0">
          {/* Score Card */}
          <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 text-center space-y-3">
            <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${percentage >= 50 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-warning/10 text-warning'}`}>
              <Award size={32} />
            </div>
            <h2 className="text-xl font-black">Quiz Complete!</h2>
            <div className={`text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r ${percentage >= 50 ? 'from-emerald-500 to-accent' : 'from-warning to-orange-500'}`}>
              {percentage}%
            </div>
            <p className="text-sm text-text/60">{score.score} / {score.totalQuestions} correct</p>
          </div>

          {/* Question Grid */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            <p className="text-xs font-bold text-text/40 uppercase tracking-widest mb-3">Review Questions</p>
            <div className="grid grid-cols-5 md:grid-cols-6 gap-2">
              {quiz.questions.map((q, idx) => {
                const info = answersMap[q.id];
                const isCorrect = info?.isCorrect;
                const wasAnswered = info?.selectedOptionId != null;
                const isReviewing = reviewIndex === idx;
                let btnClass = 'relative w-10 h-10 flex items-center justify-center font-bold text-xs rounded-xl border-2 transition-all hover:-translate-y-0.5 ';
                if (isReviewing) btnClass += 'bg-primary border-primary text-primary-foreground shadow-md';
                else if (wasAnswered && isCorrect) btnClass += 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600';
                else if (wasAnswered && !isCorrect) btnClass += 'bg-red-500/10 border-red-500/40 text-red-500';
                else btnClass += 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-text/40';
                return (
                  <button key={q.id} onClick={() => setReviewIndex(idx)} className={btnClass}>
                    {idx + 1}
                    {wasAnswered && (
                      <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center border-2 border-card ${isCorrect ? 'bg-emerald-500' : 'bg-red-500'}`}>
                        {isCorrect ? <CheckCircle2 size={8} className="text-white" /> : <XCircle size={8} className="text-white" />}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legend + Actions */}
          <div className="p-4 md:p-6 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
            <div className="space-y-1.5 text-xs font-bold text-text/60">
              <div className="flex items-center space-x-3"><div className="w-3 h-3 rounded-full bg-emerald-500" /><span>Correct</span></div>
              <div className="flex items-center space-x-3"><div className="w-3 h-3 rounded-full bg-red-500" /><span>Incorrect</span></div>
              <div className="flex items-center space-x-3"><div className="w-3 h-3 rounded-full bg-neutral-300 dark:bg-neutral-600" /><span>Unanswered</span></div>
            </div>
            <div className="flex items-center space-x-3 pt-2">
              <button onClick={() => window.location.reload()} className="flex-1 flex items-center justify-center space-x-2 py-3 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 font-bold rounded-xl text-sm transition">
                <RotateCcw size={16} /><span>Retry</span>
              </button>
              <button onClick={() => navigate('/quizzes')} className="flex-1 py-3 bg-primary text-primary-foreground font-bold rounded-xl text-sm hover:opacity-90 transition">
                Quizzes
              </button>
            </div>
          </div>
        </div>

        {/* Right: Question Review Detail */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {reviewQuestion ? (
            <>
              <div className="flex-none p-6 border-b border-neutral-200 dark:border-neutral-800 bg-card flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <p className="text-sm font-bold text-text/50">Question <span className="text-primary">{reviewIndex + 1}</span></p>
                  {answersMap[reviewQuestion.id]?.isCorrect ? (
                    <span className="flex items-center space-x-1 text-xs font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full"><CheckCircle2 size={12} /><span>Correct</span></span>
                  ) : (
                    <span className="flex items-center space-x-1 text-xs font-black text-red-500 bg-red-500/10 px-3 py-1 rounded-full"><XCircle size={12} /><span>Incorrect</span></span>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-12">
                <div className="max-w-4xl mx-auto space-y-6">
                  <h2 className="text-xl md:text-2xl font-semibold leading-relaxed p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-card">
                    {reviewQuestion.question_text}
                  </h2>

                  <div className="space-y-3">
                    {reviewQuestion.options?.map((opt, idx) => {
                      const info = answersMap[reviewQuestion.id];
                      const isUserPick = info?.selectedOptionId == opt.id;
                      const isCorrectOption = info?.correctOptionId == opt.id;
                      const labels = ['A', 'B', 'C', 'D', 'E', 'F'];
                      let optClass = 'w-full flex items-center space-x-4 p-4 rounded-2xl border-2 transition-all ';
                      if (isCorrectOption) optClass += 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400';
                      else if (isUserPick && !isCorrectOption) optClass += 'border-red-500 bg-red-500/10 text-red-600 dark:text-red-400 line-through decoration-2';
                      else optClass += 'border-neutral-200 dark:border-neutral-800 text-text/60';
                      return (
                        <div key={opt.id} className={optClass}>
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black flex-shrink-0 ${isCorrectOption ? 'bg-emerald-500 text-white' : isUserPick ? 'bg-red-500 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-text/50'}`}>
                            {labels[idx] || '-'}
                          </div>
                          <span className="text-left font-medium text-base leading-relaxed flex-1">{opt.option_text}</span>
                          {isCorrectOption && <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0" />}
                          {isUserPick && !isCorrectOption && <XCircle size={20} className="text-red-500 flex-shrink-0" />}
                        </div>
                      );
                    })}
                  </div>

                  {reviewQuestion.explanation && (
                    <div className="p-5 bg-primary/5 border border-primary/10 rounded-2xl">
                      <div className="flex items-center space-x-2 mb-2 text-primary">
                        <Sparkles size={16} />
                        <span className="text-xs font-black uppercase tracking-widest">AI Explanation</span>
                      </div>
                      <p className="text-sm leading-relaxed text-text/70">{reviewQuestion.explanation}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-none p-6 border-t border-neutral-200 dark:border-neutral-800 bg-card flex items-center justify-between">
                <button disabled={reviewIndex === 0} onClick={() => setReviewIndex(p => p - 1)} className="flex items-center space-x-2 px-6 py-3 font-bold text-text/60 disabled:opacity-30 hover:text-primary transition-colors">
                  <ArrowLeft size={18} /><span>Previous</span>
                </button>
                {reviewIndex < quiz.questions.length - 1 && (
                  <button onClick={() => setReviewIndex(p => p + 1)} className="flex items-center space-x-2 px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-md hover:shadow-lg transition-all">
                    <span>Next</span><ArrowRight size={18} />
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4">
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center">
                <BookOpen size={36} className="text-primary" />
              </div>
              <h2 className="text-2xl font-black">Review Your Answers</h2>
              <p className="text-text/50 max-w-sm">Click any question number on the left to see the correct answer and explanation.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── QUIZ TAKING SCREEN ──
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="h-full flex flex-col p-4 md:p-8 animate-in fade-in duration-500 overflow-y-auto">
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
        <div className="bg-card w-full border border-neutral-200 dark:border-neutral-800 rounded-[2rem] p-6 md:p-8 shadow-xl relative">
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

          <h2 className="text-xl md:text-2xl font-bold mb-8 leading-tight">{currentQuestion.question_text}</h2>

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
                <span className={`text-base font-semibold ${selectedOptionId === opt.id ? 'text-text' : 'text-text/70'}`}>{opt.option_text}</span>
                {selectedOptionId === opt.id && <div className="ml-auto text-primary"><CheckCircle2 size={24} /></div>}
              </button>
            ))}
          </div>

          {currentQuestion.explanation && (
            <div className="mt-8">
              {!showHint ? (
                <button onClick={() => setShowHint(true)} className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors group">
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
                  <p className="text-sm leading-relaxed text-text/70 italic">{currentQuestion.explanation}</p>
                </div>
              )}
            </div>
          )}

          <div className="mt-12 flex justify-end">
            <button
              onClick={handleNext}
              disabled={!selectedOptionId}
              className="flex items-center space-x-3 bg-primary disabled:opacity-30 disabled:grayscale disabled:pointer-events-none text-primary-foreground font-bold px-8 py-4 rounded-2xl transition hover:bg-primary/90 shadow-xl hover:-translate-y-1 active:translate-y-0"
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
