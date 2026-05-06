import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Clock, Play, Award, CheckCircle, XCircle, ArrowRight, ArrowLeft, AlertTriangle, BookOpen, ShieldAlert, Flag, Send, X, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const ExamMode = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(false);
  const [progressData, setProgressData] = useState(null);
  const [officialExams, setOfficialExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState(null);
  
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
  // ANTI-CHEAT SYSTEM
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
      // Sequentially queue animations
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
    if (!active) return;

    // 1. Tab switching / window blur
    const handleVisibilityChange = () => {
      if (document.hidden && activeRef.current) {
        handleViolation('You switched to another tab or minimized the window');
      }
    };

    // 2. Window blur (alt-tab, clicking outside browser)
    const handleWindowBlur = () => {
      if (activeRef.current) {
        handleViolation('The exam window lost focus');
      }
    };

    // 3. Right-click blocked — NO violation, just prevent
    const handleContextMenu = (e) => {
      if (activeRef.current) {
        e.preventDefault();
      }
    };

    // 4. Keyboard shortcuts blocked
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

      // 5. Navigation: Enter -> Next Question
      if (e.key === 'Enter') {
        const isNotLast = currentIndexRef.current < questionsRef.current.length - 1;
        if (isNotLast) {
          e.preventDefault();
          setCurrentIndex(prev => prev + 1);
        }
      }
    };

    // 5. Block copy
    const handleCopy = (e) => {
      if (activeRef.current) {
        e.preventDefault();
        handleViolation('Copying content is disabled during the exam');
      }
    };

    const handleCut = (e) => {
      if (activeRef.current) e.preventDefault();
    };

    // 6. Block drag
    const handleDragStart = (e) => {
      if (activeRef.current) e.preventDefault();
    };

    // 7. Warn before leaving
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
  }, [active, handleViolation]);

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
      // Sequentially queue animations
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

  // Report question
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
        <div className="w-full md:w-96 border-r border-neutral-200 dark:border-neutral-800 bg-card flex flex-col h-1/3 md:h-full overflow-hidden shrink-0 shadow-lg">
          
          {/* Score Card */}
          <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 text-center space-y-3">
            {result.terminated ? (
              <>
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                  <ShieldAlert size={32} className="text-red-500" />
                </div>
                <h2 className="text-xl font-black text-red-500">Exam Terminated</h2>
                <p className="text-xs text-red-400">{result.terminationReason}</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Award size={32} className="text-primary" />
                </div>
                <h2 className="text-xl font-black text-text">Exam Completed!</h2>
              </>
            )}
            <div className={`text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r ${result.terminated ? 'from-red-500 to-orange-500' : 'from-primary to-accent'}`}>
              {result.percentage}%
            </div>
            <p className="text-sm text-text/60">{result.score} / {result.totalQuestions} correct</p>
            <p className="text-xs text-text/40">Time: {formatTime(result.timeSpentSeconds || ((120 * 60) - timeLeft))}</p>
          </div>

          {/* 1-100 Review Grid */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            <p className="text-xs font-bold text-text/40 uppercase tracking-widest mb-3">Question Review</p>
            <div className="grid grid-cols-5 md:grid-cols-6 gap-2">
              {questions.map((q, idx) => {
                const info = answersMap[q.id];
                const isCorrect = info?.isCorrect;
                const wasAnswered = !!info;
                const isReviewing = reviewIndex === idx;

                let btnClass = "relative w-10 h-10 flex items-center justify-center font-bold text-xs rounded-xl border-2 transition-all hover:-translate-y-0.5 ";
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
                      <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center ${isCorrect ? 'bg-emerald-500' : 'bg-red-500'} border-2 border-card`}>
                        {isCorrect ? <CheckCircle size={8} className="text-white" /> : <XCircle size={8} className="text-white" />}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legend + Navigation */}
          <div className="p-4 md:p-6 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
            <div className="space-y-1.5 text-xs font-bold text-text/60">
              <div className="flex items-center space-x-3"><div className="w-3 h-3 rounded-full bg-emerald-500" /> <span>Correct</span></div>
              <div className="flex items-center space-x-3"><div className="w-3 h-3 rounded-full bg-red-500" /> <span>Incorrect</span></div>
              <div className="flex items-center space-x-3"><div className="w-3 h-3 rounded-full bg-neutral-300 dark:bg-neutral-600" /> <span>Unanswered</span></div>
            </div>
            <div className="flex items-center space-x-3 pt-2">
              <button onClick={() => navigate('/leaderboard')} className="flex-1 py-3 bg-primary text-primary-foreground font-bold rounded-xl text-sm hover:opacity-90 transition-all">
                Leaderboard
              </button>
              <button onClick={() => navigate('/')} className="flex-1 py-3 bg-neutral-200 dark:bg-neutral-800 text-text font-bold rounded-xl text-sm hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-all">
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
              <div className="flex-none p-6 border-b border-neutral-200 dark:border-neutral-800/50 bg-card flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <p className="text-sm font-bold text-text/50">
                    Reviewing Question <span className="text-primary">{reviewIndex + 1}</span>
                  </p>
                  {answersMap[reviewQuestion.id]?.isCorrect ? (
                    <span className="flex items-center space-x-1 text-xs font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full"><CheckCircle size={12} /><span>Correct</span></span>
                  ) : (
                    <span className="flex items-center space-x-1 text-xs font-black text-red-500 bg-red-500/10 px-3 py-1 rounded-full"><XCircle size={12} /><span>Incorrect</span></span>
                  )}
                </div>
                <button onClick={() => openReport(reviewQuestion.id)} className="flex items-center space-x-2 px-4 py-2 text-xs font-bold text-amber-600 bg-amber-500/10 border border-amber-500/20 rounded-xl hover:bg-amber-500/20 transition-all">
                  <Flag size={12} />
                  <span>Report Issue</span>
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 md:p-12">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-xl md:text-2xl font-semibold text-text mb-8 leading-relaxed p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-card">
                    {reviewQuestion.question_text}
                  </h2>

                  <div className="space-y-3">
                    {reviewQuestion.options?.map((opt, idx) => {
                      const info = answersMap[reviewQuestion.id];
                      const isUserPick = info?.selectedOptionId == opt.id;
                      const isCorrectOption = info?.correctOptionId == opt.id;
                      const labels = ['A', 'B', 'C', 'D', 'E', 'F'];

                      let optClass = "w-full flex items-center space-x-4 p-4 rounded-2xl border-2 transition-all ";
                      if (isCorrectOption) {
                        optClass += "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";
                      } else if (isUserPick && !isCorrectOption) {
                        optClass += "border-red-500 bg-red-500/10 text-red-600 dark:text-red-400 line-through decoration-2";
                      } else {
                        optClass += "border-neutral-200 dark:border-neutral-800 text-text/60";
                      }

                      return (
                        <div key={opt.id} className={optClass}>
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black flex-shrink-0 ${
                            isCorrectOption ? 'bg-emerald-500 text-white' : isUserPick ? 'bg-red-500 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-text/50'
                          }`}>
                            {labels[idx] || '-'}
                          </div>
                          <span className="text-left font-medium text-base leading-relaxed flex-1">{opt.option_text}</span>
                          {isCorrectOption && <CheckCircle size={20} className="text-emerald-500 flex-shrink-0" />}
                          {isUserPick && !isCorrectOption && <XCircle size={20} className="text-red-500 flex-shrink-0" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Footer nav */}
              <div className="flex-none p-6 border-t border-neutral-200 dark:border-neutral-800 bg-card flex items-center justify-between">
                <button 
                  disabled={reviewIndex === 0}
                  onClick={() => setReviewIndex(p => p - 1)}
                  className="flex items-center space-x-2 px-6 py-3 font-bold text-text/60 disabled:opacity-30 hover:text-primary transition-colors"
                >
                  <ArrowLeft size={18} />
                  <span>Previous</span>
                </button>
                {reviewIndex < questions.length - 1 ? (
                  <button 
                    onClick={() => setReviewIndex(p => p + 1)}
                    className="flex items-center space-x-2 px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95"
                  >
                    <span>Next</span>
                    <ArrowRight size={18} />
                  </button>
                ) : null}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4">
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center">
                <BookOpen size={36} className="text-primary" />
              </div>
              <h2 className="text-2xl font-black text-text">Review Your Answers</h2>
              <p className="text-text/50 max-w-sm">Click any question number on the left to review the question, your answer, and the correct answer.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════
  // EXAM SELECTION SCREEN
  // ═══════════════════════════════════════════

  if (!active && !selectedExamId) {
    return (
       <div className="h-full flex flex-col p-6 md:p-12 animate-in fade-in duration-500 overflow-y-auto w-full">
         <div className="max-w-6xl mx-auto w-full space-y-8">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-text">Select Official Exam</h1>
            <p className="text-lg text-text/60 font-medium">Choose an exam to begin your 120-minute simulation.</p>

            {officialExams.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                   {officialExams.map((exam) => (
                     <button 
                       key={exam.id}
                       onClick={() => setSelectedExamId(exam.id)}
                       className="flex flex-col items-center justify-center p-8 bg-card border-2 border-neutral-200 dark:border-neutral-800 hover:border-primary text-text font-bold rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group"
                     >
                       <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-5 group-hover:scale-110 group-hover:bg-primary transition-all group-hover:text-primary-foreground">
                         <BookOpen size={32} />
                       </div>
                       <span className="text-xl">{exam.title}</span>
                     </button>
                   ))}
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
  // PRE-EXAM SCREEN (RULES) — Single step, no double confirm
  // ═══════════════════════════════════════════

  if (!active && selectedExamId) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 animate-in fade-in duration-500 overflow-y-auto">
         <div className="max-w-xl text-center space-y-8 relative py-12">
           
           <button 
             onClick={() => setSelectedExamId(null)}
             className="absolute top-0 left-0 flex items-center space-x-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-text/60 hover:text-text hover:bg-neutral-200 dark:hover:bg-neutral-700 font-bold rounded-xl transition-colors"
           >
             <ArrowLeft size={16} />
             <span>Back to Exams</span>
           </button>

           <div className="bg-primary/10 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner shadow-primary/20">
              <Award size={40} className="text-primary" />
           </div>
           
           <h1 className="text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              {officialExams.find(e => e.id === selectedExamId)?.title || "Official Exam"}
           </h1>
           <p className="text-lg text-text/60 leading-relaxed font-medium">
             Test your knowledge with a full-length examination from this set.
           </p>

           {/* Progress warning - informational only, doesn't block */}
           {progressData && Number(progressData.overall_progress) < 100 && (
             <div className="bg-amber-500/5 border border-amber-400/20 rounded-2xl p-5 text-left animate-in fade-in slide-in-from-top-2 duration-300">
               <div className="flex items-start space-x-3">
                 <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500 flex-shrink-0 mt-0.5">
                   <AlertTriangle size={20} />
                 </div>
                 <div className="flex-1">
                   <p className="font-bold text-text text-sm mb-1">📚 We recommend completing all courses first</p>
                   <p className="text-xs text-text/50 leading-relaxed">
                     You've started {progressData.started_courses || 0} out of {progressData.total_courses || 0} courses 
                     ({progressData.overall_progress || 0}% overall).
                   </p>
                 </div>
               </div>
             </div>
           )}

           <div className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 grid grid-cols-2 gap-8 text-left shadow-lg">
             <div>
               <p className="text-xs font-bold text-text/40 uppercase tracking-widest mb-1">Time Limit</p>
               <p className="text-2xl font-black text-text">120 Minutes</p>
             </div>
             <div>
               <p className="text-xs font-bold text-text/40 uppercase tracking-widest mb-1">Questions</p>
               <p className="text-2xl font-black text-text">100 Multiple Choice</p>
             </div>
           </div>

           {/* Anti-cheat rules */}
           <div className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 text-left shadow-sm">
             <div className="flex items-center space-x-2 mb-3">
               <ShieldAlert size={16} className="text-primary" />
               <p className="text-xs font-black uppercase tracking-widest text-text/50">Exam Security Rules</p>
             </div>
             <ul className="space-y-2 text-xs text-text/60">
               <li className="flex items-start space-x-2">
                 <span className="text-red-500 mt-0.5">•</span>
                 <span><strong>Do not switch tabs</strong> or minimize the window during the exam</span>
               </li>
               <li className="flex items-start space-x-2">
                 <span className="text-red-500 mt-0.5">•</span>
                 <span><strong>Copy, paste, and right-click</strong> are disabled</span>
               </li>
               <li className="flex items-start space-x-2">
                 <span className="text-red-500 mt-0.5">•</span>
                 <span><strong>Developer tools</strong> and keyboard shortcuts are blocked</span>
               </li>
               <li className="flex items-start space-x-2">
                 <span className="text-warning mt-0.5">•</span>
                 <span>You get <strong>{MAX_VIOLATIONS} warnings</strong> — after that your exam is auto-submitted</span>
               </li>
             </ul>
           </div>

           {/* START BUTTON — always visible, no double gate */}
           <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <button 
               onClick={() => startExam(selectedExamId)}
               disabled={loading}
               className="w-full flex items-center justify-center space-x-3 py-5 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-bold rounded-2xl shadow-xl hover:-translate-y-1 transition-all"
             >
               {loading ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" /> : (
                 <>
                   <Play size={24} fill="currentColor" />
                   <span className="text-lg">START EXAM NOW</span>
                 </>
               )}
             </button>
             <p className="text-sm font-bold text-warning mt-4 underline decoration-warning/30 decoration-2 underline-offset-4">Do not close this window once the exam begins.</p>
           </div>
         </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════
  // ACTIVE EXAM SCREEN — FULLSCREEN OVERLAY
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
    <div className="fixed inset-0 z-50 flex flex-col md:flex-row overflow-hidden bg-background animate-in fade-in duration-500">
       
       {/* Violation Warning Overlay */}
       {showViolationWarning && (
         <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
           <div className="bg-red-500 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-red-500/30 flex items-center space-x-3 max-w-md">
             <ShieldAlert size={24} className="flex-shrink-0" />
             <div>
               <p className="font-black text-sm">⚠️ Warning {violations}/{MAX_VIOLATIONS}</p>
               <p className="text-xs text-white/80 mt-0.5">{violationReason}</p>
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
           <div className="bg-card rounded-2xl p-8 max-w-sm w-full shadow-2xl border border-neutral-200 dark:border-neutral-800 text-center space-y-5">
             <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
               <AlertTriangle size={32} className="text-red-500" />
             </div>
             <h3 className="text-xl font-black text-text">Exit Exam?</h3>
             <p className="text-sm text-text/60">Are you sure you want to leave? <strong>Your progress will NOT be saved</strong> and this attempt will be lost.</p>
             <div className="flex items-center space-x-3">
               <button onClick={() => setShowExitConfirm(false)} className="flex-1 py-3 bg-neutral-200 dark:bg-neutral-800 text-text font-bold rounded-xl hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-all">
                 Cancel
               </button>
               <button onClick={confirmExit} className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all">
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

       {/* Left Sidebar: Navigation Grid */}
       <div className="w-full md:w-80 border-r border-neutral-200 dark:border-neutral-800 bg-card flex flex-col h-1/3 md:h-full overflow-hidden shrink-0 shadow-lg z-20">
          <div className="p-4 md:p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h2 className="font-black text-lg text-text tracking-tight">Questions</h2>
              {violations > 0 && (
                <div className="flex items-center space-x-1 bg-red-500/10 text-red-500 px-2 py-0.5 rounded-lg text-[10px] font-black border border-red-500/20">
                  <ShieldAlert size={10} />
                  <span>{violations}/{MAX_VIOLATIONS}</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2 text-warning font-bold border border-warning/20 bg-warning/10 px-3 py-1 rounded-lg">
              <Clock size={14} />
              <span className="font-mono text-sm">{formatTime(timeLeft)}</span>
            </div>
          </div>
          
          {/* Question Grid */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="grid grid-cols-5 md:grid-cols-6 gap-2">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = !!answers[q.id];
                const isFlagged = !!flagged[q.id];

                let btnClass = "relative w-10 h-10 flex items-center justify-center font-bold text-xs rounded-xl border-2 transition-all hover:-translate-y-0.5 ";
                if (isCurrent) {
                  btnClass += "bg-primary border-primary text-primary-foreground shadow-md";
                } else if (isAnswered) {
                  btnClass += "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 hover:border-emerald-500";
                } else {
                  btnClass += "bg-card border-neutral-200 dark:border-neutral-800 text-text/60 hover:border-primary/50";
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    onContextMenu={(e) => { e.preventDefault(); toggleFlag(q.id); }}
                    className={btnClass}
                  >
                    {idx + 1}
                    {isFlagged && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-card shadow-sm" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legend + Exit + Finish */}
          <div className="p-4 md:p-6 border-t border-neutral-200 dark:border-neutral-800 bg-transparent space-y-3">
             <div className="space-y-1.5 text-xs font-bold text-text/60">
                <div className="flex items-center space-x-3"><div className="w-3 h-3 rounded-full bg-primary" /> <span>Current</span></div>
                <div className="flex items-center space-x-3"><div className="w-3 h-3 rounded-full bg-emerald-500/30 border border-emerald-500" /> <span>Answered</span></div>
                <div className="flex items-center space-x-3"><div className="w-3 h-3 rounded-full border-2 border-neutral-200 dark:border-neutral-700" /> <span>Unanswered</span></div>
                <div className="flex items-center space-x-3"><div className="w-3 h-3 rounded-full bg-red-500" /> <span>Flagged</span></div>
             </div>
             <button 
                onClick={() => submitExam(false)}
                disabled={submitting || !allAnswered}
                title={!allAnswered ? "Answer all questions to finish" : ""}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-primary text-primary-foreground font-black rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 disabled:hover:-translate-y-0 disabled:cursor-not-allowed"
             >
                <Award size={18} />
                <span>{submitting ? 'Submitting...' : 'Finish Exam'}</span>
             </button>
             <button 
                onClick={handleExitExam}
                className="w-full flex items-center justify-center space-x-2 py-2.5 text-red-500 font-bold rounded-xl border-2 border-red-500/20 hover:bg-red-500/10 transition-all text-sm"
             >
                <LogOut size={16} />
                <span>Exit Exam</span>
             </button>
          </div>
       </div>

       {/* Right Column: Question Content */}
       <div className="flex-1 flex flex-col overflow-hidden relative">
           
            {/* Top Header — focus on progress bar */}
            <div className="flex-none p-6 border-b border-neutral-200 dark:border-neutral-800/50 bg-card">
              <div className="flex items-center justify-between mb-3 text-xs font-bold uppercase tracking-widest text-text/40">
                <span>Exam Progress</span>
                <span>{currentIndex + 1} / {questions.length}</span>
              </div>
              <div className="w-full h-3 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300 rounded-full"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

           {/* Main Body */}
           <div className="flex-1 overflow-y-auto p-6 md:p-12 relative">
             <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start gap-8">
                
                {/* Lateral Question Info & Flag */}
                <div className="flex flex-col items-center shrink-0 bg-card border-2 border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
                  <div className="w-16 h-16 flex items-center justify-center text-primary font-black text-2xl border-b-2 border-neutral-100 dark:border-neutral-800 bg-primary/5">
                    #{String(currentIndex + 1).padStart(2, '0')}
                  </div>
                  <button
                    onClick={() => toggleFlag(question.id)}
                    className={`flex flex-col items-center justify-center w-16 h-16 transition-all group ${
                      flagged[question.id] 
                        ? 'bg-red-500/10 text-red-500'
                        : 'text-text/30 hover:text-text/60 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                    }`}
                  >
                    <Flag size={20} className={flagged[question.id] ? "fill-current" : ""} />
                    <span className="text-[10px] font-black uppercase mt-1">Flag</span>
                  </button>
                </div>

                <div className="flex-1 space-y-8">
                  <h2 className="text-xl md:text-2xl font-semibold text-text leading-relaxed p-6 rounded-3xl border border-neutral-100 dark:border-neutral-800 bg-card shadow-sm">
                    {question?.question_text}
                  </h2>

                <div className="space-y-4 mb-20">
                   {question?.options?.map((opt, idx) => {
                      const isSelected = answers[question.id] === opt.id;
                      const labels = ['A', 'B', 'C', 'D', 'E', 'F'];
                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleSelectOption(question.id, opt.id)}
                          className={`w-full flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 space-x-0 md:space-x-5 p-5 rounded-2xl border-2 transition-all group ${
                            isSelected 
                              ? 'border-primary bg-primary/5 text-primary shadow-sm scale-[1.01]' 
                              : 'border-neutral-200 dark:border-neutral-800 text-text/80 hover:border-primary/50 hover:bg-card'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black flex-shrink-0 transition-colors ${
                            isSelected ? 'bg-primary text-primary-foreground' : 'bg-neutral-100 dark:bg-neutral-800 text-text/50 group-hover:bg-primary/20 group-hover:text-primary'
                          }`}>
                            {labels[idx] || '-'}
                          </div>
                          <span className="text-left font-medium text-lg leading-relaxed">{opt.option_text}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
           </div>

           {/* Footer Action Bar */}
           <div className="flex-none p-6 border-t border-neutral-200 dark:border-neutral-800 bg-card flex items-center justify-between">
              <button 
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex(p => p - 1)}
                className="flex items-center space-x-2 px-6 py-3 font-bold text-text/60 disabled:opacity-30 hover:text-primary transition-colors"
              >
                <ArrowLeft size={18} />
                <span>Previous</span>
              </button>
              
              {/* Report button — in the center where flag used to be */}
              <button
                onClick={() => openReport(question.id)}
                className="flex items-center space-x-2 px-5 py-3 font-bold rounded-xl border-2 border-amber-500/20 text-amber-600 bg-amber-500/5 hover:bg-amber-500/15 transition-all"
              >
                <Flag size={16} />
                <span>Report Issue</span>
              </button>
              
              {currentIndex === questions.length - 1 ? (
                 <button 
                    disabled={submitting || !allAnswered}
                    onClick={() => submitExam(false)}
                    className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    title={!allAnswered ? "Answer all questions to finish" : ""}
                 >
                    <span>{submitting ? 'Submitting...' : 'Finish Exam'}</span>
                    <CheckCircle size={18} />
                 </button>
              ) : (
                 <button 
                    onClick={() => setCurrentIndex(p => p + 1)}
                    className="flex items-center space-x-2 px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95"
                 >
                    <span>Next</span>
                    <ArrowRight size={18} />
                 </button>
              )}
           </div>
       </div>
    </div>
  );
};

export default ExamMode;
