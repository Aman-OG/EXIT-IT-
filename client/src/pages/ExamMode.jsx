import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Clock, Play, Award, CheckCircle, XCircle, ArrowRight, ArrowLeft, AlertTriangle, BookOpen, ShieldAlert, Flag, Send, X, LogOut, Menu } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const ExamMode = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(false);
  const [progressData, setProgressData] = useState(null);
  const [officialExams, setOfficialExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [examMode, setExamMode] = useState('practice'); // 'practice' or 'test'
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState({});
  const [timeLeft, setTimeLeft] = useState(120 * 60);
  
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Results review state
  const [reviewIndex, setReviewIndex] = useState(null);

  // Report state
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportingQuestionId, setReportingQuestionId] = useState(null);
  const [reportSending, setReportSending] = useState(false);

  // Exit confirmation state
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Anti-cheat state
  const [violations, setViolations] = useState(0);
  const [showViolationWarning, setShowViolationWarning] = useState(false);
  const [violationReason, setViolationReason] = useState('');
  const [terminated, setTerminated] = useState(false);
  const violationsRef = useRef(0);
  const activeRef = useRef(false);
  const answersRef = useRef({});
  const questionsRef = useRef([]);
  const currentIndexRef = useRef(0);
  const timeLeftRef = useRef(120 * 60);

  const MAX_VIOLATIONS = 3;

  const navigate = useNavigate();
  const { triggerStreakUpdate, triggerPointsEarned, evaluateBadges } = useContext(AuthContext);
  const allAnswered = questions.length > 0 && Object.keys(answers).length === questions.length;

  // Keep refs in sync
  useEffect(() => { activeRef.current = active; }, [active]);
  useEffect(() => { answersRef.current = answers; }, [answers]);
  useEffect(() => { questionsRef.current = questions; }, [questions]);
  useEffect(() => { currentIndexRef.current = currentIndex; }, [currentIndex]);
  useEffect(() => { timeLeftRef.current = timeLeft; }, [timeLeft]);

  // Fetch overall course progress for soft banner
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await api.get('/progress/overall-course');
        setProgressData(res.data);
      } catch (e) {
        console.error('Failed to fetch course progress for exam banner:', e);
      }
    };
    fetchProgress();
  }, []);

  // Fetch official exams
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await api.get('/exams/official-list');
        setOfficialExams(res.data);
      } catch (e) {
        console.error('Failed to fetch official exams:', e);
      }
    };
    fetchExams();
  }, []);

  // Timer
  useEffect(() => {
    let timer;
    if (active && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            submitExam(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [active, timeLeft]);

  // ═══════════════════════════════════════════
  // ANTI-CHEAT SYSTEM (Scoped to Test Mode)
  // ═══════════════════════════════════════════

  const handleViolation = useCallback((reason) => {
    if (!activeRef.current) return;
    
    violationsRef.current += 1;
    const newCount = violationsRef.current;
    setViolations(newCount);
    setViolationReason(reason);
    setShowViolationWarning(true);

    setTimeout(() => setShowViolationWarning(false), 4000);

    if (newCount >= MAX_VIOLATIONS) {
      terminateExam(reason);
    }
  }, []);

  const terminateExam = useCallback(async (reason) => {
    if (terminated) return;
    setTerminated(true);
    setActive(false);
    
    try {
      const timeSpentSeconds = (120 * 60) - timeLeftRef.current;
      const res = await api.post('/exams/submit', {
        answers: answersRef.current,
        timeSpentSeconds,
        totalQuestions: questionsRef.current.length,
      });
      setResult({
        ...res.data,
        terminated: true,
        terminationReason: reason,
      });
      await triggerStreakUpdate();
      if (res.data.score > 0) {
        triggerPointsEarned(res.data.score, 'Exam Terminated');
      }
      setTimeout(() => evaluateBadges(), 500);
    } catch (err) {
      console.error('Failed to submit terminated exam:', err);
      setResult({
        score: 0,
        totalQuestions: questionsRef.current.length,
        percentage: 0,
        terminated: true,
        terminationReason: reason,
        answers_map: {},
      });
    }
  }, [terminated]);

  useEffect(() => {
    if (!active || examMode !== 'test') return;

    const handleVisibilityChange = () => {
      if (document.hidden && activeRef.current) {
        handleViolation('You switched to another tab or minimized the window');
      }
    };

    const handleWindowBlur = () => {
      if (activeRef.current) {
        handleViolation('The exam window lost focus');
      }
    };

    const handleContextMenu = (e) => {
      if (activeRef.current) e.preventDefault();
    };

    const handleKeyDown = (e) => {
      if (!activeRef.current) return;

      const blockedCtrl = ['c', 'v', 'x', 'a', 'u', 's', 'p'];
      const blockedCtrlShift = ['i', 'j', 'c'];
      
      if (e.key === 'F12') {
        e.preventDefault();
        handleViolation('Developer tools shortcut detected');
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.shiftKey && blockedCtrlShift.includes(e.key.toLowerCase())) {
        e.preventDefault();
        handleViolation('Developer tools shortcut detected');
        return;
      }

      if ((e.ctrlKey || e.metaKey) && blockedCtrl.includes(e.key.toLowerCase())) {
        e.preventDefault();
        handleViolation('Copy/paste shortcuts are disabled during the exam');
        return;
      }

      if (e.key === 'PrintScreen') {
        e.preventDefault();
        handleViolation('Screenshots are not allowed during the exam');
      }

      if (e.key === 'Enter') {
        const isNotLast = currentIndexRef.current < questionsRef.current.length - 1;
        if (isNotLast) {
          e.preventDefault();
          setCurrentIndex(prev => prev + 1);
        }
      }
    };

    const handleCopy = (e) => {
      if (activeRef.current) {
        e.preventDefault();
        handleViolation('Copying content is disabled during the exam');
      }
    };

    const handleCut = (e) => {
      if (activeRef.current) e.preventDefault();
    };

    const handleDragStart = (e) => {
      if (activeRef.current) e.preventDefault();
    };

    const handleBeforeUnload = (e) => {
      if (activeRef.current) {
        e.preventDefault();
        e.returnValue = 'Your exam is still in progress. Leaving will terminate your exam.';
        return e.returnValue;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCut);
    document.addEventListener('dragstart', handleDragStart);
    window.addEventListener('beforeunload', handleBeforeUnload);

    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCut);
      document.removeEventListener('dragstart', handleDragStart);
      window.removeEventListener('beforeunload', handleBeforeUnload);

      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
    };
  }, [active, examMode, handleViolation]);

  // ═══════════════════════════════════════════
  // EXAM ACTIONS
  // ═══════════════════════════════════════════

  const startExam = async (quizId) => {
    setLoading(true);
    try {
      const res = await api.get('/exams/start?quizId=' + quizId);
      const parsedQuestions = res.data.map(q => ({
        ...q,
        options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
      }));
      
      if (parsedQuestions.length === 0) {
        alert('No exam questions available right now!');
        setLoading(false);
        return;
      }

      setQuestions(parsedQuestions);
      setActive(true);
      setTimeLeft(120 * 60);
      setAnswers({});
      setFlagged({});
      setCurrentIndex(0);
      setResult(null);
      setViolations(0);
      violationsRef.current = 0;
      setTerminated(false);
      setReviewIndex(null);
    } catch (err) {
      console.error('Failed to start exam', err);
      alert('Failed to load exam questions');
    } finally {
      setLoading(false);
    }
  };

  const submitExam = async (auto = false) => {
    setSubmitting(true);
    setActive(false);
    try {
      const timeSpentSeconds = (120 * 60) - timeLeft;
      const res = await api.post('/exams/submit', { 
        answers, 
        timeSpentSeconds,
        totalQuestions: questions.length 
      });
      setResult(res.data);
      await triggerStreakUpdate();
      if (res.data.score > 0) {
        triggerPointsEarned(res.data.score, 'Exam Completed!');
      }
      setTimeout(() => evaluateBadges(), 500);
    } catch (err) {
      console.error('Failed to submit exam', err);
      alert('Failed to submit exam. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleExitExam = () => {
    setShowExitConfirm(true);
  };

  const confirmExit = () => {
    setActive(false);
    setShowExitConfirm(false);
    setSelectedExamId(null);
    setQuestions([]);
    setAnswers({});
    setFlagged({});
    setCurrentIndex(0);
  };

  const handleSelectOption = (questionId, optionId) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const toggleFlag = (questionId) => {
    setFlagged(prev => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m < 10 && h > 0 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const formatElapsed = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const openReport = (questionId) => {
    setReportingQuestionId(questionId);
    setReportReason('');
    setShowReportModal(true);
  };

  const sendReport = async () => {
    if (!reportReason.trim()) return;
    setReportSending(true);
    try {
      await api.post('/exams/report', { questionId: reportingQuestionId, reason: reportReason });
      setShowReportModal(false);
      setReportReason('');
    } catch (e) {
      console.error('Failed to report:', e);
      alert('Failed to send report. Try again.');
    } finally {
      setReportSending(false);
    }
  };

  const resetToExamCards = () => {
    setResult(null);
    setSelectedExamId(null);
    setActive(false);
    setQuestions([]);
  };

  // Stats calculation
  const answeredCount = Object.keys(answers).length;
  const flaggedCount = Object.values(flagged).filter(Boolean).length;
  const unansweredCount = questions.length - answeredCount;
  const timeSpentSeconds = (120 * 60) - timeLeft;

  // ═══════════════════════════════════════════
  // RESULTS SCREEN WITH REVIEW GRID
  // ═══════════════════════════════════════════

  if (result) {
    const answersMap = result.answers_map || {};
    const reviewQuestion = reviewIndex !== null ? questions[reviewIndex] : null;

    return (
      <div className="h-full flex flex-col md:flex-row overflow-hidden bg-background animate-in fade-in duration-500">
        
        {/* Report Modal */}
        {showReportModal && (
          <div className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-card rounded-2xl p-6 max-w-md w-full shadow-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-text">Report Question Issue</h3>
                <button onClick={() => setShowReportModal(false)} className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"><X size={18} /></button>
              </div>
              <p className="text-xs text-text/50">Describe the issue with this question (wrong answer, missing option, unclear wording, etc.)</p>
              <textarea 
                value={reportReason} 
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Explain the issue..."
                className="w-full h-24 p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-background text-text text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button 
                onClick={sendReport} 
                disabled={reportSending || !reportReason.trim()}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-primary text-primary-foreground font-bold rounded-xl disabled:opacity-50 hover:opacity-90 transition-all"
              >
                <Send size={16} />
                <span>{reportSending ? 'Sending...' : 'Submit Report'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Left: Score Summary + Question Grid */}
        <div className="w-full md:w-80 border-r border-neutral-200 dark:border-neutral-800 bg-card flex flex-col h-1/3 md:h-full overflow-hidden shrink-0 shadow-lg">
          
          {/* Score Card */}
          <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 text-center space-y-2">
            {result.terminated ? (
              <>
                <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                  <ShieldAlert size={24} className="text-red-500" />
                </div>
                <h2 className="text-lg font-black text-red-500">Exam Terminated</h2>
                <p className="text-xs text-red-400">{result.terminationReason}</p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Award size={24} className="text-primary" />
                </div>
                <h2 className="text-lg font-black text-text">Exam Completed!</h2>
              </>
            )}
            <div className={`text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r ${result.terminated ? 'from-red-500 to-orange-500' : 'from-primary to-accent'}`}>
              {result.percentage}%
            </div>
            <p className="text-xs text-text/60">{result.score} / {result.totalQuestions} correct</p>
            <p className="text-[11px] text-text/40">Time: {formatTime(result.timeSpentSeconds || ((120 * 60) - timeLeft))}</p>
          </div>

          {/* 1-100 Review Grid */}
          <div className="flex-1 overflow-y-auto p-4">
            <p className="text-[10px] font-bold text-text/40 uppercase tracking-widest mb-3">Question Review (1 - 100)</p>
            <div className="grid grid-cols-5 md:grid-cols-6 gap-1.5">
              {questions.map((q, idx) => {
                const info = answersMap[q.id];
                const isCorrect = info?.isCorrect;
                const wasAnswered = !!info;
                const isReviewing = reviewIndex === idx;

                let btnClass = "relative w-9 h-9 flex items-center justify-center font-bold text-xs rounded-lg border transition-all hover:-translate-y-0.5 ";
                if (isReviewing) {
                  btnClass += "bg-primary border-primary text-primary-foreground shadow-md ring-2 ring-primary/30";
                } else if (wasAnswered && isCorrect) {
                  btnClass += "bg-emerald-500/10 border-emerald-500/40 text-emerald-600";
                } else if (wasAnswered && !isCorrect) {
                  btnClass += "bg-red-500/10 border-red-500/40 text-red-500";
                } else {
                  btnClass += "bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-text/40";
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setReviewIndex(idx)}
                    className={btnClass}
                  >
                    {idx + 1}
                    {wasAnswered && (
                      <div className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center ${isCorrect ? 'bg-emerald-500' : 'bg-red-500'} border-2 border-card`}>
                        {isCorrect ? <CheckCircle size={7} className="text-white" /> : <XCircle size={7} className="text-white" />}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
            <button 
              onClick={resetToExamCards} 
              className="w-full flex items-center justify-center space-x-2 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl text-xs shadow hover:opacity-90 transition-all"
            >
              <ArrowLeft size={14} />
              <span>Back to Exam Cards</span>
            </button>
            <div className="flex items-center space-x-2 pt-1">
              <button onClick={() => navigate('/leaderboard')} className="flex-1 py-2 bg-neutral-200 dark:bg-neutral-800 text-text font-bold rounded-xl text-xs hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-all">
                Leaderboard
              </button>
              <button onClick={() => navigate('/')} className="flex-1 py-2 bg-neutral-200 dark:bg-neutral-800 text-text font-bold rounded-xl text-xs hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-all">
                Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Right: Question Review Detail */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {reviewQuestion ? (
            <>
              {/* Header */}
              <div className="flex-none p-5 border-b border-neutral-200 dark:border-neutral-800/50 bg-card flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <p className="text-xs font-bold text-text/50">
                    Reviewing Question <span className="text-primary font-black text-sm">{reviewIndex + 1}</span>
                  </p>
                  {answersMap[reviewQuestion.id]?.isCorrect ? (
                    <span className="flex items-center space-x-1 text-[11px] font-black text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full"><CheckCircle size={10} /><span>Correct</span></span>
                  ) : (
                    <span className="flex items-center space-x-1 text-[11px] font-black text-red-500 bg-red-500/10 px-2.5 py-0.5 rounded-full"><XCircle size={10} /><span>Incorrect</span></span>
                  )}
                </div>
                <button onClick={() => openReport(reviewQuestion.id)} className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-amber-600 bg-amber-500/10 border border-amber-500/20 rounded-lg hover:bg-amber-500/20 transition-all">
                  <Flag size={12} />
                  <span>Report Issue</span>
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 md:p-10">
                <div className="max-w-3xl mx-auto space-y-6">
                  <h2 className="text-base md:text-lg font-bold text-text leading-relaxed p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-card shadow-sm">
                    {reviewQuestion.question_text}
                  </h2>

                  <div className="space-y-3">
                    {reviewQuestion.options?.map((opt, idx) => {
                      const info = answersMap[reviewQuestion.id];
                      const isUserPick = info?.selectedOptionId == opt.id;
                      const isCorrectOption = info?.correctOptionId == opt.id;
                      const labels = ['A', 'B', 'C', 'D', 'E', 'F'];

                      let optClass = "w-full flex items-center space-x-3 p-4 rounded-xl border-2 transition-all text-sm ";
                      if (isCorrectOption) {
                        optClass += "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium";
                      } else if (isUserPick && !isCorrectOption) {
                        optClass += "border-red-500 bg-red-500/10 text-red-600 dark:text-red-400 line-through decoration-2";
                      } else {
                        optClass += "border-neutral-200 dark:border-neutral-800 text-text/60";
                      }

                      return (
                        <div key={opt.id} className={optClass}>
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-black flex-shrink-0 text-xs ${
                            isCorrectOption ? 'bg-emerald-500 text-white' : isUserPick ? 'bg-red-500 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-text/50'
                          }`}>
                            {labels[idx] || '-'}
                          </div>
                          <span className="text-left font-medium leading-relaxed flex-1">{opt.option_text}</span>
                          {isCorrectOption && <CheckCircle size={18} className="text-emerald-500 shrink-0" />}
                          {isUserPick && !isCorrectOption && <XCircle size={18} className="text-red-500 shrink-0" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Footer nav */}
              <div className="flex-none p-4 border-t border-neutral-200 dark:border-neutral-800 bg-card flex items-center justify-between">
                <button 
                  disabled={reviewIndex === 0}
                  onClick={() => setReviewIndex(p => p - 1)}
                  className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-text/60 disabled:opacity-30 hover:text-primary transition-colors"
                >
                  <ArrowLeft size={16} />
                  <span>Previous</span>
                </button>
                {reviewIndex < questions.length - 1 ? (
                  <button 
                    onClick={() => setReviewIndex(p => p + 1)}
                    className="flex items-center space-x-1.5 px-6 py-2 bg-primary text-primary-foreground font-bold rounded-xl text-xs shadow hover:opacity-90 transition-all active:scale-95"
                  >
                    <span>Next</span>
                    <ArrowRight size={16} />
                  </button>
                ) : null}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-3">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                <BookOpen size={28} className="text-primary" />
              </div>
              <h2 className="text-xl font-black text-text">Review Your Answers</h2>
              <p className="text-xs text-text/50 max-w-xs">Click any question number on the left to review the question, your answer, and the correct answer.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════
  // EXAM SELECTION SCREEN (4 Cards)
  // ═══════════════════════════════════════════

  if (!active && !selectedExamId) {
    return (
       <div className="h-full flex flex-col p-6 md:p-10 animate-in fade-in duration-500 overflow-y-auto w-full">
         <div className="max-w-6xl mx-auto w-full space-y-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-text mb-2">Select Official Exam</h1>
              <p className="text-sm md:text-base text-text/60 font-medium">Choose an exam to begin your simulation with 100 randomized questions.</p>
            </div>

            {officialExams.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                   {officialExams.map((exam) => {
                     const isModel = exam.title.toLowerCase().includes('model');
                     const year = exam.title.includes('2015') ? '2015' : '2016';

                     return (
                       <button 
                         key={exam.id}
                         onClick={() => setSelectedExamId(exam.id)}
                         className="flex flex-col text-left p-6 bg-card border border-neutral-200 dark:border-neutral-800 hover:border-primary text-text font-bold rounded-3xl shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 group relative overflow-hidden"
                       >
                         <div className="flex items-center justify-between w-full mb-5">
                           <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                             isModel 
                               ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20' 
                               : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                           }`}>
                             {isModel ? 'Model Exam' : 'Official Exit Exam'}
                           </span>
                           <span className="text-xs font-bold text-text/40">{year}</span>
                         </div>

                         <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 ${
                           isModel 
                             ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 group-hover:bg-sky-600 group-hover:text-white' 
                             : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white'
                         }`}>
                           <BookOpen size={24} />
                         </div>

                         <h3 className="text-xl font-black text-text mb-2 group-hover:text-primary transition-colors">
                           {exam.title}
                         </h3>
                         <p className="text-xs font-medium text-text/50 mb-6 leading-relaxed">
                           Full length exam with 100 questions covering core Information Technology topics.
                         </p>

                         <div className="mt-auto pt-4 border-t border-neutral-100 dark:border-neutral-800/80 w-full flex items-center justify-between text-xs text-text/60">
                           <div className="flex items-center space-x-1 font-bold">
                             <Clock size={14} className="text-primary" />
                             <span>120 Mins</span>
                           </div>
                           <span className="font-extrabold text-primary flex items-center group-hover:translate-x-1 transition-transform">
                             Select <ArrowRight size={14} className="ml-1" />
                           </span>
                         </div>
                       </button>
                     );
                   })}
                 </div>
               ) : (
                  <div className="p-12 text-center bg-neutral-100 dark:bg-neutral-800 rounded-3xl font-bold text-lg text-text/50">
                    No Official Exams Found. Waiting for database initialization...
                  </div>
            )}
         </div>
       </div>
    );
  }

  // ═══════════════════════════════════════════
  // PRE-EXAM MODE SELECTOR MODAL (Resized & Matching Theme)
  // ═══════════════════════════════════════════

  if (!active && selectedExamId) {
    const selectedExam = officialExams.find(e => e.id === selectedExamId);

    return (
      <div className="h-full flex flex-col items-center justify-center p-4 md:p-6 animate-in fade-in duration-500 overflow-y-auto w-full">
         <div className="max-w-lg w-full bg-card border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 md:p-8 shadow-2xl relative space-y-6">
           
           {/* Header & Back Button */}
           <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
             <button 
               onClick={() => setSelectedExamId(null)}
               className="flex items-center space-x-1.5 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 text-text/60 hover:text-text hover:bg-neutral-200 dark:hover:bg-neutral-700 font-bold rounded-xl transition-colors text-xs"
             >
               <ArrowLeft size={14} />
               <span>Back to Exams</span>
             </button>
             <h2 className="text-lg font-black text-text tracking-tight">{selectedExam?.title || "Official Exam"}</h2>
           </div>

           {/* Select Mode Section */}
           <div className="space-y-3 text-left">
             <h3 className="text-base font-black text-text">Select Mode</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
               
               {/* Practice Mode Selector Box */}
               <button
                 type="button"
                 onClick={() => setExamMode('practice')}
                 className={`flex flex-col text-left p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                   examMode === 'practice'
                     ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary/20 shadow-sm'
                     : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-background'
                 }`}
               >
                 <div className="flex items-center space-x-2.5 mb-1.5">
                   <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                     examMode === 'practice' ? 'border-primary' : 'border-neutral-400'
                   }`}>
                     {examMode === 'practice' && <div className="w-2 h-2 rounded-full bg-primary" />}
                   </div>
                   <span className="text-base font-bold text-text">Practice</span>
                 </div>
                 <p className="text-xs text-text/60 pl-6 leading-relaxed">
                   Instant feedback after each question. Learn as you go.
                 </p>
               </button>

               {/* Test Mode Selector Box */}
               <button
                 type="button"
                 onClick={() => setExamMode('test')}
                 className={`flex flex-col text-left p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                   examMode === 'test'
                     ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary/20 shadow-sm'
                     : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-background'
                 }`}
               >
                 <div className="flex items-center space-x-2.5 mb-1.5">
                   <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                     examMode === 'test' ? 'border-primary' : 'border-neutral-400'
                   }`}>
                     {examMode === 'test' && <div className="w-2 h-2 rounded-full bg-primary" />}
                   </div>
                   <span className="text-base font-bold text-text">Test</span>
                 </div>
                 <p className="text-xs text-text/60 pl-6 leading-relaxed">
                   Take under exam conditions. Results at the end.
                 </p>
               </button>

             </div>
           </div>

           {/* Mode Options / Rules List */}
           <div className="space-y-3 text-left pt-1">
             <h4 className="text-sm font-bold text-text">
               {examMode === 'practice' ? 'Practice Options' : 'Test Mode Rules'}
             </h4>
             <ul className="space-y-2 text-xs text-text/70 font-medium">
               {examMode === 'practice' ? (
                 <>
                   <li className="flex items-start space-x-2">
                     <span className="text-primary font-bold">•</span>
                     <span>Get instant feedback after each answer</span>
                   </li>
                   <li className="flex items-start space-x-2">
                     <span className="text-primary font-bold">•</span>
                     <span>View explanations for correct answers</span>
                   </li>
                   <li className="flex items-start space-x-2">
                     <span className="text-primary font-bold">•</span>
                     <span>Take as long as you need</span>
                   </li>
                   <li className="flex items-start space-x-2">
                     <span className="text-primary font-bold">•</span>
                     <span>Review and retry questions</span>
                   </li>
                 </>
               ) : (
                 <>
                   <li className="flex items-start space-x-2">
                     <span className="text-primary font-bold">•</span>
                     <span>Do not switch tabs or minimize the window during the exam</span>
                   </li>
                   <li className="flex items-start space-x-2">
                     <span className="text-primary font-bold">•</span>
                     <span>Copy, paste, and right-click are disabled</span>
                   </li>
                   <li className="flex items-start space-x-2">
                     <span className="text-primary font-bold">•</span>
                     <span>Developer tools and keyboard shortcuts are blocked</span>
                   </li>
                   <li className="flex items-start space-x-2">
                     <span className="text-primary font-bold">•</span>
                     <span>You get 3 warnings — after that your exam is auto-submitted</span>
                   </li>
                   <li className="flex items-start space-x-2">
                     <span className="text-primary font-bold">•</span>
                     <span>Results shown after submission</span>
                   </li>
                 </>
               )}
             </ul>
           </div>

           {/* Start Action Button */}
           <div className="pt-2">
             <button 
               onClick={() => startExam(selectedExamId)}
               disabled={loading}
               className="w-full py-3.5 bg-primary hover:opacity-90 text-primary-foreground font-bold rounded-2xl shadow-lg transition-all text-sm disabled:opacity-50"
             >
               {loading ? 'Loading Questions...' : (examMode === 'practice' ? 'Start Practice' : 'Start Test')}
             </button>
           </div>

         </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════
  // ACTIVE EXAM SCREEN — COMPACT & RESPONSIVE (3-COLUMN DESKTOP / MOBILIFIED)
  // ═══════════════════════════════════════════

  const question = questions[currentIndex];

  if (!question) {
    return (
      <div className="h-full flex items-center justify-center p-6 bg-background">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-background animate-in fade-in duration-500">
       
       {/* Violation Warning Overlay */}
       {showViolationWarning && (
         <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
           <div className="bg-red-500 text-white px-5 py-3 rounded-2xl shadow-2xl shadow-red-500/30 flex items-center space-x-3 max-w-md">
             <ShieldAlert size={20} className="flex-shrink-0" />
             <div>
               <p className="font-black text-xs">⚠️ Warning {violations}/{MAX_VIOLATIONS}</p>
               <p className="text-[11px] text-white/80 mt-0.5">{violationReason}</p>
               {violations < MAX_VIOLATIONS && (
                 <p className="text-[10px] text-white/60 mt-1 font-bold">{MAX_VIOLATIONS - violations} warning(s) remaining before auto-submit</p>
               )}
             </div>
           </div>
         </div>
       )}

       {/* Exit Confirmation Modal */}
       {showExitConfirm && (
         <div className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200">
           <div className="bg-card rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-neutral-200 dark:border-neutral-800 text-center space-y-4">
             <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
               <AlertTriangle size={24} className="text-red-500" />
             </div>
             <h3 className="text-lg font-black text-text">Exit Exam?</h3>
             <p className="text-xs text-text/60">Are you sure you want to leave? <strong>Your progress will NOT be saved</strong> and this attempt will be lost.</p>
             <div className="flex items-center space-x-3 pt-2">
               <button onClick={() => setShowExitConfirm(false)} className="flex-1 py-2.5 bg-neutral-200 dark:bg-neutral-800 text-text font-bold rounded-xl text-xs hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-all">
                 Cancel
               </button>
               <button onClick={confirmExit} className="flex-1 py-2.5 bg-red-500 text-white font-bold rounded-xl text-xs hover:bg-red-600 transition-all">
                 Exit Exam
               </button>
             </div>
           </div>
         </div>
       )}

       {/* Report Modal */}
       {showReportModal && (
         <div className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200">
           <div className="bg-card rounded-2xl p-6 max-w-md w-full shadow-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
             <div className="flex items-center justify-between">
               <h3 className="font-black text-text">Report Question Issue</h3>
               <button onClick={() => setShowReportModal(false)} className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"><X size={18} /></button>
             </div>
             <p className="text-xs text-text/50">Describe the issue with this question (wrong answer, missing option, unclear wording, etc.)</p>
             <textarea 
               value={reportReason} 
               onChange={(e) => setReportReason(e.target.value)}
               placeholder="Explain the issue..."
               className="w-full h-24 p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-background text-text text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
             />
             <button 
               onClick={sendReport} 
               disabled={reportSending || !reportReason.trim()}
               className="w-full flex items-center justify-center space-x-2 py-3 bg-primary text-primary-foreground font-bold rounded-xl disabled:opacity-50 hover:opacity-90 transition-all"
             >
               <Send size={16} />
               <span>{reportSending ? 'Sending...' : 'Submit Report'}</span>
             </button>
           </div>
         </div>
       )}

       {/* Top Header Bar for Mobile Toggle & Title */}
       <div className="bg-card border-b border-neutral-200 dark:border-neutral-800 px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowMobileSidebar(!showMobileSidebar)}
              className="md:hidden p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-text/80 hover:text-text"
              title="Toggle Question Grid & Stats"
            >
              <Menu size={18} />
            </button>
            <h2 className="font-black text-sm md:text-base text-text tracking-tight flex items-center space-x-2">
              <span>{officialExams.find(e => e.id === selectedExamId)?.title || "Exam"}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${examMode === 'practice' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                {examMode === 'practice' ? 'Practice Mode' : 'Test Mode'}
              </span>
            </h2>
          </div>

          <button 
            onClick={handleExitExam}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-red-500 bg-red-500/10 rounded-xl hover:bg-red-500/20 transition-all"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Exit Exam</span>
          </button>
       </div>

       {/* Main Content Layout: 3-Column Responsive (Left: 100 Navigator, Middle: Question, Right: Screenshot Stats Widget) */}
       <div className="flex-1 flex overflow-hidden relative">

          {/* LEFT PANEL: 100 Questions Navigator (Visible on Desktop / Drawer on Mobile) */}
          <div className={`${
            showMobileSidebar ? 'fixed inset-y-0 left-0 z-40 w-72 bg-card shadow-2xl border-r border-neutral-200 dark:border-neutral-800 flex flex-col' : 'hidden md:flex md:w-64 border-r border-neutral-200 dark:border-neutral-800 bg-card flex-col shrink-0'
          }`}>
             <div className="p-3.5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
               <h3 className="font-black text-xs uppercase tracking-wider text-text/60">Questions (1 - 100)</h3>
               {showMobileSidebar && (
                 <button onClick={() => setShowMobileSidebar(false)} className="p-1 text-text/40 hover:text-text"><X size={16} /></button>
               )}
             </div>

             {/* 100 Numbers Grid (10 columns x 10 rows) */}
             <div className="flex-1 overflow-y-auto p-3">
               <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-1">
                 {questions.map((q, idx) => {
                   const isCurrent = idx === currentIndex;
                   const isAnswered = !!answers[q.id];
                   const isFlagged = !!flagged[q.id];

                   let btnClass = "relative w-6.5 h-6.5 md:w-7 md:h-7 text-[10px] md:text-xs font-bold rounded-md border flex items-center justify-center transition-all hover:scale-105 ";
                   if (isCurrent) {
                     btnClass += "bg-primary border-primary text-primary-foreground font-black shadow-sm ring-2 ring-primary/20 scale-105 z-10";
                   } else if (isAnswered) {
                     btnClass += "bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-bold";
                   } else {
                     btnClass += "bg-background border-neutral-200 dark:border-neutral-800 text-text/50 hover:border-primary/50";
                   }

                   return (
                     <button
                       key={q.id}
                       onClick={() => { setCurrentIndex(idx); setShowMobileSidebar(false); }}
                       onContextMenu={(e) => { e.preventDefault(); toggleFlag(q.id); }}
                       className={btnClass}
                       title={`Question ${idx + 1}`}
                     >
                       {idx + 1}
                       {isFlagged && (
                         <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-card" />
                       )}
                     </button>
                   );
                 })}
               </div>
             </div>

             {/* Legend */}
             <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 bg-background text-[10px] font-bold text-text/60 grid grid-cols-2 gap-1.5">
               <div className="flex items-center space-x-1.5"><div className="w-2.5 h-2.5 rounded-full bg-primary" /> <span>Current</span></div>
               <div className="flex items-center space-x-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> <span>Answered</span></div>
               <div className="flex items-center space-x-1.5"><div className="w-2.5 h-2.5 rounded-full border border-neutral-400" /> <span>Unanswered</span></div>
               <div className="flex items-center space-x-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500" /> <span>Flagged</span></div>
             </div>
          </div>

          {/* CENTER PANEL: Question Text & Options (Resized Smaller) */}
          <div className="flex-1 flex flex-col overflow-hidden relative bg-background">
             
             {/* Progress bar line */}
             <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800">
               <div 
                 className="h-full bg-primary transition-all duration-300"
                 style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
               />
             </div>

             {/* Main Scrollable Question Content */}
             <div className="flex-1 overflow-y-auto p-4 md:p-8">
               <div className="max-w-3xl mx-auto space-y-6">
                  
                  {/* Question Header & Flag Toggle */}
                  <div className="flex items-center justify-between bg-card p-3 md:p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
                    <span className="text-xs font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-lg">
                      Question {currentIndex + 1} of {questions.length}
                    </span>
                    <button
                      onClick={() => toggleFlag(question.id)}
                      className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        flagged[question.id] 
                          ? 'bg-red-500/10 text-red-500 border border-red-500/20' 
                          : 'text-text/40 hover:text-text hover:bg-neutral-100 dark:hover:bg-neutral-800'
                      }`}
                    >
                      <Flag size={14} className={flagged[question.id] ? "fill-current" : ""} />
                      <span>{flagged[question.id] ? 'Flagged' : 'Flag'}</span>
                    </button>
                  </div>

                  {/* Question Text (Resized smaller) */}
                  <h2 className="text-base md:text-lg font-semibold text-text leading-relaxed p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-card shadow-sm">
                    {question?.question_text}
                  </h2>

                  {/* Options List (Resized compact) */}
                  <div className="space-y-3">
                    {question?.options?.map((opt, idx) => {
                       const isSelected = answers[question.id] === opt.id;
                       const isAnswered = !!answers[question.id];
                       const labels = ['A', 'B', 'C', 'D', 'E', 'F'];

                       let optClass = "w-full flex items-center space-x-3 p-3.5 md:p-4 rounded-xl border-2 transition-all text-sm md:text-base text-left group ";
                       
                       if (examMode === 'practice' && isAnswered) {
                         if (opt.is_correct) {
                           optClass += "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium";
                         } else if (isSelected && !opt.is_correct) {
                           optClass += "border-red-500 bg-red-500/10 text-red-600 dark:text-red-400 line-through decoration-2";
                         } else {
                           optClass += "border-neutral-200 dark:border-neutral-800 opacity-60";
                         }
                       } else {
                         if (isSelected) {
                           optClass += "border-primary bg-primary/5 text-primary shadow-sm font-medium";
                         } else {
                           optClass += "border-neutral-200 dark:border-neutral-800 text-text/80 hover:border-primary/50 hover:bg-card";
                         }
                       }

                       return (
                         <button
                           key={opt.id}
                           onClick={() => handleSelectOption(question.id, opt.id)}
                           className={optClass}
                         >
                           <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 transition-colors ${
                             examMode === 'practice' && isAnswered
                               ? (opt.is_correct ? 'bg-emerald-500 text-white' : isSelected ? 'bg-red-500 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-text/50')
                               : (isSelected ? 'bg-primary text-primary-foreground' : 'bg-neutral-100 dark:bg-neutral-800 text-text/50 group-hover:bg-primary/20 group-hover:text-primary')
                           }`}>
                             {labels[idx] || '-'}
                           </div>
                           <span className="leading-relaxed flex-1">{opt.option_text}</span>
                           {examMode === 'practice' && isAnswered && opt.is_correct && (
                             <CheckCircle size={20} className="text-emerald-500 shrink-0" />
                           )}
                           {examMode === 'practice' && isAnswered && isSelected && !opt.is_correct && (
                             <XCircle size={20} className="text-red-500 shrink-0" />
                           )}
                         </button>
                       );
                     })}
                  </div>

                  {/* Practice Mode Instant Explanation Box */}
                  {examMode === 'practice' && answers[question.id] && question.explanation && (
                    <div className="p-5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-text space-y-1.5 animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-center space-x-2 text-primary font-black text-xs uppercase tracking-widest">
                        <BookOpen size={14} />
                        <span>Explanation</span>
                      </div>
                      <p className="text-xs md:text-sm text-text/80 leading-relaxed font-medium">
                        {question.explanation}
                      </p>
                    </div>
                  )}
               </div>
             </div>

             {/* Footer Navigation Bar */}
             <div className="flex-none p-4 border-t border-neutral-200 dark:border-neutral-800 bg-card flex items-center justify-between">
                <button 
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex(p => p - 1)}
                  className="flex items-center space-x-1.5 px-4 py-2 font-bold text-text/60 disabled:opacity-30 hover:text-primary transition-colors text-xs md:text-sm"
                >
                  <ArrowLeft size={16} />
                  <span>Previous</span>
                </button>
                
                <button
                  onClick={() => openReport(question.id)}
                  className="flex items-center space-x-1 px-3 py-2 text-xs font-bold rounded-lg border border-neutral-200 dark:border-neutral-700 text-text/60 hover:text-text transition-all"
                >
                  <Flag size={14} />
                  <span>Report</span>
                </button>
                
                {currentIndex === questions.length - 1 ? (
                   <button 
                      disabled={submitting || !allAnswered}
                      onClick={() => submitExam(false)}
                      className="flex items-center space-x-1.5 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs md:text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      title={!allAnswered ? "Answer all questions to finish" : ""}
                   >
                      <span>{submitting ? 'Submitting...' : 'Finish Exam'}</span>
                      <CheckCircle size={16} />
                   </button>
                ) : (
                   <button 
                      onClick={() => setCurrentIndex(p => p + 1)}
                      className="flex items-center space-x-1.5 px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl text-xs md:text-sm shadow-md hover:opacity-90 transition-all active:scale-95"
                   >
                      <span>Next</span>
                      <ArrowRight size={16} />
                   </button>
                )}
             </div>
          </div>

          {/* RIGHT PANEL: Time Remaining & Progress Widget (MATCHING USER'S SCREENSHOT EXACTLY!) */}
          <div className="hidden lg:flex w-72 border-l border-neutral-200 dark:border-neutral-800 bg-card p-5 flex-col space-y-4 shrink-0 overflow-y-auto">
             
             {/* Time Remaining Card Widget */}
             <div className="bg-background border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 space-y-2.5 shadow-sm">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text/60 font-medium">Time Remaining</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    {formatTime(timeLeft)}
                  </span>
                </div>
                <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-600 dark:bg-emerald-500 transition-all duration-300 rounded-full"
                    style={{ width: `${(timeLeft / (120 * 60)) * 100}%` }}
                  />
                </div>
             </div>

             {/* Progress Stats Widget Card */}
             <div className="bg-background border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 space-y-3 shadow-sm">
                <h4 className="font-bold text-sm text-text">Progress</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-text/70">
                    <span>Answered</span>
                    <span className="font-bold text-text">{answeredCount} / {questions.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-text/70">
                    <span>Flagged</span>
                    <span className="font-bold text-text">{flaggedCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-text/70">
                    <span>Unanswered</span>
                    <span className="font-bold text-text">{unansweredCount}</span>
                  </div>
                </div>

                <div className="border-t border-neutral-200 dark:border-neutral-800 pt-3 flex items-center space-x-2 text-xs text-text/60">
                  <Clock size={14} className="text-text/40" />
                  <span>Elapsed: <span className="font-mono font-bold text-text">{formatElapsed(timeSpentSeconds)}</span></span>
                </div>
             </div>

             {/* Action Buttons */}
             <div className="pt-2 space-y-2 mt-auto">
               <button 
                 onClick={() => submitExam(false)}
                 disabled={submitting || !allAnswered}
                 title={!allAnswered ? "Answer all questions to finish" : ""}
                 className="w-full flex items-center justify-center space-x-2 py-3 bg-primary text-primary-foreground font-black rounded-xl text-xs shadow-lg hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 <Award size={16} />
                 <span>{submitting ? 'Submitting...' : (examMode === 'practice' ? 'Finish Practice' : 'Finish Exam')}</span>
               </button>

               <button 
                 onClick={handleExitExam}
                 className="w-full flex items-center justify-center space-x-2 py-2 text-red-500 font-bold rounded-xl border border-red-500/20 hover:bg-red-500/10 transition-all text-xs"
               >
                 <LogOut size={14} />
                 <span>Exit Exam</span>
               </button>
             </div>

          </div>

       </div>
    </div>
  );
};

export default ExamMode;
