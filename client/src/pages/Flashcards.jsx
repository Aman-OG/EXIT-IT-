import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import {
  Brain, Plus, Trash2, ChevronRight, BookOpen, X, Save,
  RotateCcw, CheckCircle2, Clock, Zap, ArrowLeft, ArrowRight,
  Sparkles, Upload, FileText, Pencil, MoreVertical, PlayCircle,
  HelpCircle, ListFilter, Loader2
} from 'lucide-react';
import { FlashcardDeckSkeleton } from '../components/Skeleton';

/* ─── Helper: Format & Clean Deck Title ─── */
const formatDeckTitle = (title) => {
  if (!title) return '';
  let cleaned = String(title).trim();

  // 1. Remove leading course codes e.g. "SNA313: ", "[SNA313] ", "SNA-313 - ", "CS 101: "
  cleaned = cleaned.replace(/^(\[[^\]]+\]|[A-Za-z]{2,8}\s*[-_]?\s*\d{2,4})\s*[:\-–]\s*/i, '');
  cleaned = cleaned.replace(/^\[[A-Za-z0-9\s_-]+\]\s*/i, '');

  // 2. Remove trailing "- Complete Flashcards (98 Questions)" or variants
  cleaned = cleaned.replace(/\s*[-–:]\s*(complete\s*)?flashcards(\s*\(\d+\s*questions?\))?/i, '');
  cleaned = cleaned.replace(/\s*[-–:]\s*(complete\s*)?deck(\s*\(\d+\s*cards?\))?/i, '');

  // 3. Remove standalone (98 Questions) or (100 Cards)
  cleaned = cleaned.replace(/\s*\(\d+\s*(questions?|cards?)\)/i, '');

  // 4. Remove leftover trailing dashes or colons
  cleaned = cleaned.replace(/\s*[-–:]\s*$/, '').trim();

  return cleaned || title;
};

/* ─── Card Flip Study Session (Centered & Mobile-Friendly) ─── */
const StudySession = ({ cards, onFinish, onExit, deckTitle, deckId }) => {
  const { user, triggerPointsEarned, triggerStreakUpdate } = useContext(AuthContext);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState([]);
  const [sessionStats, setSessionStats] = useState({ easy: 0, good: 0, hard: 0, forgot: 0 });
  const [isFinishing, setIsFinishing] = useState(false);

  const card = cards && cards.length > 0 ? cards[index] : null;

  const handleRate = async (quality, label) => {
    if (!card || isFinishing) return;
    try {
      await api.post('/flashcards/review', { cardId: card.id, quality });
    } catch (e) {
      console.error(e);
    }
    const nextStats = { ...sessionStats, [label]: sessionStats[label] + 1 };
    setSessionStats(nextStats);
    setDone(prev => [...prev, card.id]);
    
    if (index < cards.length - 1) {
      setIndex(i => i + 1);
      setFlipped(false);
    } else {
      // Completed full session! Award 100 points via server API
      setIsFinishing(true);
      let pointsAwarded = 100;
      let isFirstTime = false;
      try {
        if (deckId) {
          const res = await api.post(`/flashcards/decks/${deckId}/complete`);
          if (res.data?.pointsEarned) pointsAwarded = res.data.pointsEarned;
          if (res.data?.isFirstTime) isFirstTime = true;
        }
        triggerPointsEarned(pointsAwarded, 'Flashcards Completed! +100 XP');
        triggerStreakUpdate();
      } catch (err) {
        console.error('Failed to record deck completion:', err);
        triggerPointsEarned(100, 'Flashcards Completed! +100 XP');
      }

      onFinish({
        ...nextStats,
        pointsAwarded,
        isFirstTime
      });
    }
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        setFlipped(f => !f);
      } else if (e.key === 'Escape') {
        onExit();
      } else if (flipped) {
        if (e.key === '1') handleRate(1, 'forgot');
        else if (e.key === '2') handleRate(2, 'hard');
        else if (e.key === '3') handleRate(4, 'good');
        else if (e.key === '4') handleRate(5, 'easy');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [flipped, index, cards, isFinishing]);

  if (!card) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <p className="text-text/50 text-base mb-4">No cards found in this study set.</p>
        <button
          onClick={onExit}
          className="px-5 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl text-sm cursor-pointer"
        >
          Exit Study
        </button>
      </div>
    );
  }

  const progress = cards.length > 0 ? ((index) / cards.length) * 100 : 0;

  return (
    <div className="w-full min-h-[calc(100vh-6rem)] md:min-h-full flex flex-col items-center justify-center p-3 sm:p-6 my-auto animate-in fade-in duration-300">
      {/* Top bar with back button & title */}
      <div className="w-full max-w-lg md:max-w-xl flex items-center justify-between gap-3 mb-3 sm:mb-4">
        <button
          onClick={onExit}
          className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 bg-card border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-bold text-text/80 hover:text-primary hover:border-primary/40 transition shadow-xs cursor-pointer shrink-0"
          title="Exit study session"
        >
          <ArrowLeft size={14} />
          <span>Exit</span>
        </button>

        {deckTitle && (
          <span className="text-xs sm:text-sm font-bold text-text/70 truncate text-center max-w-[180px] sm:max-w-[280px]">
            {formatDeckTitle(deckTitle)}
          </span>
        )}

        <span className="text-xs font-bold text-text/50 bg-card border border-neutral-200 dark:border-neutral-800 px-2.5 py-1 rounded-lg shrink-0">
          {index + 1} / {cards.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-lg md:max-w-xl mb-4 sm:mb-6">
        <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* 3D Flip Flashcard */}
      <div
        className="w-full max-w-lg md:max-w-xl cursor-pointer select-none touch-manipulation"
        onClick={() => setFlipped(f => !f)}
        style={{ perspective: '1200px' }}
      >
        <div
          className="relative w-full transition-transform duration-500 rounded-3xl"
          style={{
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            minHeight: '280px'
          }}
        >
          {/* Front (Question - Perfectly Centered) */}
          <div
            className="w-full min-h-[280px] sm:min-h-[320px] md:min-h-[360px] bg-card border-2 border-primary/20 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center shadow-xl text-center relative overflow-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            {/* Top Badge */}
            <div className="absolute top-4 sm:top-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-xs">
              <Brain size={12} />
              <span>Question</span>
            </div>

            {/* Dead Center Question Content */}
            <div className="flex-1 flex flex-col items-center justify-center text-center w-full px-2 sm:px-6 my-auto max-h-[170px] sm:max-h-[210px] overflow-y-auto no-scrollbar">
              <p className="text-base sm:text-xl md:text-2xl font-bold leading-relaxed text-text">
                {card.front}
              </p>
            </div>

            {/* Bottom Cue */}
            <div className="absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-xs text-text/40 font-medium whitespace-nowrap">
              <RotateCcw size={12} />
              <span>Tap card to reveal answer</span>
            </div>
          </div>

          {/* Back (Answer - Perfectly Centered) */}
          <div
            className="absolute inset-0 w-full min-h-[280px] sm:min-h-[320px] md:min-h-[360px] bg-card border-2 border-primary/40 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center shadow-xl text-center overflow-hidden"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            {/* Top Badge */}
            <div className="absolute top-4 sm:top-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-xs">
              <CheckCircle2 size={12} />
              <span>Answer</span>
            </div>

            {/* Dead Center Answer Content */}
            <div className="flex-1 flex flex-col items-center justify-center text-center w-full px-2 sm:px-6 my-auto max-h-[170px] sm:max-h-[210px] overflow-y-auto no-scrollbar">
              <p className="text-base sm:text-xl md:text-2xl font-bold leading-relaxed text-primary">
                {card.back}
              </p>
            </div>

            {/* Bottom Cue */}
            <div className="absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-xs text-text/40 font-medium whitespace-nowrap">
              <RotateCcw size={12} />
              <span>Tap card to flip back</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rating buttons — Mobile-friendly grid */}
      {flipped ? (
        <div className="w-full max-w-lg md:max-w-xl mt-5 sm:mt-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <p className="text-[11px] font-bold text-center text-text/40 uppercase tracking-wider mb-2.5">
            How well did you remember?
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 w-full">
            <button
              onClick={() => handleRate(1, 'forgot')}
              disabled={isFinishing}
              className="flex flex-col items-center justify-center py-3 px-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl font-bold hover:bg-red-500/20 active:scale-95 transition cursor-pointer shadow-xs disabled:opacity-50"
            >
              <span className="text-xl sm:text-2xl mb-0.5">😵</span>
              <span className="text-xs">Forgot</span>
              <span className="text-[9px] text-red-500/60 font-mono mt-0.5 hidden sm:inline">(1)</span>
            </button>

            <button
              onClick={() => handleRate(2, 'hard')}
              disabled={isFinishing}
              className="flex flex-col items-center justify-center py-3 px-3 bg-orange-500/10 text-orange-500 border border-orange-500/20 rounded-2xl font-bold hover:bg-orange-500/20 active:scale-95 transition cursor-pointer shadow-xs disabled:opacity-50"
            >
              <span className="text-xl sm:text-2xl mb-0.5">😓</span>
              <span className="text-xs">Hard</span>
              <span className="text-[9px] text-orange-500/60 font-mono mt-0.5 hidden sm:inline">(2)</span>
            </button>

            <button
              onClick={() => handleRate(4, 'good')}
              disabled={isFinishing}
              className="flex flex-col items-center justify-center py-3 px-3 bg-primary/10 text-primary border border-primary/20 rounded-2xl font-bold hover:bg-primary/20 active:scale-95 transition cursor-pointer shadow-xs disabled:opacity-50"
            >
              <span className="text-xl sm:text-2xl mb-0.5">🙂</span>
              <span className="text-xs">Good</span>
              <span className="text-[9px] text-primary/60 font-mono mt-0.5 hidden sm:inline">(3)</span>
            </button>

            <button
              onClick={() => handleRate(5, 'easy')}
              disabled={isFinishing}
              className="flex flex-col items-center justify-center py-3 px-3 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-2xl font-bold hover:bg-emerald-500/20 active:scale-95 transition cursor-pointer shadow-xs disabled:opacity-50"
            >
              <span className="text-xl sm:text-2xl mb-0.5">😄</span>
              <span className="text-xs">Easy</span>
              <span className="text-[9px] text-emerald-500/60 font-mono mt-0.5 hidden sm:inline">(4)</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-5 sm:mt-6 text-center">
          <button
            onClick={() => setFlipped(true)}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary font-bold rounded-2xl border border-primary/20 transition cursor-pointer text-xs sm:text-sm shadow-xs active:scale-95"
          >
            <RotateCcw size={14} />
            <span>Flip to Reveal Answer</span>
          </button>
          <p className="mt-2 text-[11px] text-text/40">
            Press <kbd className="px-1.5 py-0.5 bg-card border border-neutral-200 dark:border-neutral-700 rounded text-[10px] font-mono">Space</kbd> or tap to flip
          </p>
        </div>
      )}
    </div>
  );
};

/* ─── Deck Detail / Questions & Answers Management View ─── */
const DeckDetail = ({ deck, onBack, initialTab = 'list' }) => {
  const { user } = useContext(AuthContext);
  const isAdminOrOwner = user?.role === 'admin' || user?.id === deck.user_id;
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddCard, setShowAddCard] = useState(initialTab === 'add');
  const [cardForm, setCardForm] = useState({ front: '', back: '' });
  const [studying, setStudying] = useState(false);
  const [sessionResult, setSessionResult] = useState(null);
  const [dueCards, setDueCards] = useState([]);
  const [showAIGenerate, setShowAIGenerate] = useState(initialTab === 'ai');
  const [aiTopic, setAiTopic] = useState('');
  const [aiCount, setAiCount] = useState(10);
  const [aiLoading, setAiLoading] = useState(false);
  const [showCSVImport, setShowCSVImport] = useState(initialTab === 'csv');
  const [csvData, setCsvData] = useState('');
  const [csvLoading, setCsvLoading] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [editingCard, setEditingCard] = useState(null); // { id, front, back }
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    fetchCards();
  }, [deck.id]);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const [cardsRes, dueRes] = await Promise.all([
        api.get(`/flashcards/decks/${deck.id}/cards`),
        api.get('/flashcards/due')
      ]);
      setCards(cardsRes.data);
      setDueCards(dueRes.data.filter(c => c.deck_id === deck.id));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = async () => {
    if (!cardForm.front.trim() || !cardForm.back.trim()) return;
    try {
      await api.post(`/flashcards/decks/${deck.id}/cards`, cardForm);
      setCardForm({ front: '', back: '' });
      setShowAddCard(false);
      fetchCards();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteCard = async (id) => {
    try {
      await api.delete(`/flashcards/cards/${id}`);
      fetchCards();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAIGenerate = async () => {
    if (!aiTopic.trim()) return;
    setAiLoading(true);
    try {
      await api.post(`/flashcards/decks/${deck.id}/ai-generate`, { topic: aiTopic, count: aiCount });
      setAiTopic('');
      setShowAIGenerate(false);
      fetchCards();
    } catch (e) {
      console.error(e);
      alert('Failed to generate cards. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleCSVImport = async () => {
    if (!csvData.trim()) return;
    setCsvLoading(true);
    try {
      const res = await api.post(`/flashcards/decks/${deck.id}/csv-import`, { csvData });
      setImportResult(res.data);
      setCsvData('');
      fetchCards();
    } catch (e) {
      console.error(e);
      alert('Failed to import CSV.');
    } finally {
      setCsvLoading(false);
    }
  };

  const handleCSVFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setCsvData(ev.target.result);
    reader.readAsText(file);
  };

  const handleEditCard = async () => {
    if (!editingCard?.front?.trim() || !editingCard?.back?.trim()) return;
    setEditLoading(true);
    try {
      await api.put(`/flashcards/cards/${editingCard.id}`, {
        front: editingCard.front,
        back: editingCard.back,
      });
      setEditingCard(null);
      fetchCards();
    } catch (e) {
      console.error(e);
    } finally {
      setEditLoading(false);
    }
  };

  if (studying) {
    const studySet = dueCards.length > 0 ? dueCards : cards;
    return (
      <div className="h-full w-full overflow-y-auto flex flex-col items-center justify-center">
        <StudySession
          cards={studySet}
          deckTitle={deck.title}
          deckId={deck.id}
          onExit={() => setStudying(false)}
          onFinish={(stats) => {
            setStudying(false);
            setSessionResult(stats);
            fetchCards();
          }}
        />
      </div>
    );
  }

  if (sessionResult) {
    return (
      <div className="h-full w-full overflow-y-auto flex flex-col items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
        <div className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-10 max-w-md w-full text-center space-y-5 sm:space-y-6 shadow-xl my-auto">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={36} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black">Session Complete!</h2>
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 rounded-full text-xs font-black uppercase tracking-wider">
              <span>🎉 +100 Points Earned!</span>
            </div>
            {sessionResult.isFirstTime && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-2 bg-emerald-500/10 border border-emerald-500/20 py-1.5 px-3 rounded-xl">
                🎴 First flashcards completed! Friends notified: "{user?.name || 'You'} just did their first flashcards"
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-3 text-center">
              <p className="text-xl sm:text-2xl font-black text-emerald-500">{sessionResult.easy}</p>
              <p className="text-[10px] sm:text-xs text-text/40 font-bold uppercase">Easy</p>
            </div>
            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-3 text-center">
              <p className="text-xl sm:text-2xl font-black text-primary">{sessionResult.good}</p>
              <p className="text-[10px] sm:text-xs text-text/40 font-bold uppercase">Good</p>
            </div>
            <div className="bg-orange-500/5 border border-orange-500/10 rounded-2xl p-3 text-center">
              <p className="text-xl sm:text-2xl font-black text-orange-500">{sessionResult.hard}</p>
              <p className="text-[10px] sm:text-xs text-text/40 font-bold uppercase">Hard</p>
            </div>
            <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-3 text-center">
              <p className="text-xl sm:text-2xl font-black text-red-500">{sessionResult.forgot}</p>
              <p className="text-[10px] sm:text-xs text-text/40 font-bold uppercase">Forgot</p>
            </div>
          </div>
          <button
            onClick={() => setSessionResult(null)}
            className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition cursor-pointer text-sm shadow-md active:scale-98"
          >
            Back to Deck
          </button>
        </div>
      </div>
    );
  }

  const cleanedTitle = formatDeckTitle(deck.title);

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="p-2 text-text/60 hover:text-primary hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition cursor-pointer" title="Go Back to Decks">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold break-words">{cleanedTitle}</h1>
            <p className="text-xs sm:text-sm text-text/50">Questions & Answers Reference List</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => { setShowCSVImport(v => !v); setShowAIGenerate(false); setShowAddCard(false); }}
            className="flex items-center space-x-1.5 px-3 py-2 bg-card border border-neutral-200 dark:border-neutral-800 rounded-xl font-bold text-xs sm:text-sm hover:border-accent/40 transition cursor-pointer"
          >
            <Upload size={15} /><span>CSV</span>
          </button>
          <button
            onClick={() => { setShowAIGenerate(v => !v); setShowCSVImport(false); setShowAddCard(false); }}
            className="flex items-center space-x-1.5 px-3 py-2 bg-card border border-neutral-200 dark:border-neutral-800 rounded-xl font-bold text-xs sm:text-sm hover:border-primary/40 transition cursor-pointer"
          >
            <Sparkles size={15} className="text-primary" /><span>AI Generate</span>
          </button>
          <button
            onClick={() => { setShowAddCard(true); setShowAIGenerate(false); setShowCSVImport(false); }}
            className="flex items-center space-x-1.5 px-3 py-2 bg-card border border-neutral-200 dark:border-neutral-800 rounded-xl font-bold text-xs sm:text-sm hover:border-primary/40 transition cursor-pointer"
          >
            <Plus size={15} /><span>Add Card</span>
          </button>
          {cards.length > 0 && (
            <button
              onClick={() => setStudying(true)}
              className="flex items-center space-x-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-bold text-xs sm:text-sm hover:opacity-90 transition shadow-md cursor-pointer"
            >
              <Brain size={15} />
              <span>Study {dueCards.length > 0 ? `(${dueCards.length})` : 'All'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-black text-text">{cards.length}</p>
          <p className="text-xs text-text/40 font-bold uppercase tracking-wider">Total Questions</p>
        </div>
        <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 text-center">
          <p className="text-2xl font-black text-primary">{dueCards.length}</p>
          <p className="text-xs text-text/40 font-bold uppercase tracking-wider">Due Today</p>
        </div>
        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4 text-center">
          <p className="text-2xl font-black text-emerald-500">{cards.filter(c => c.repetitions > 0).length}</p>
          <p className="text-xs text-text/40 font-bold uppercase tracking-wider">Reviewed</p>
        </div>
      </div>

      {/* Add card form */}
      {showAddCard && (
        <div className="bg-card border border-primary/20 rounded-2xl p-5 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">New Flashcard</h3>
            <button onClick={() => setShowAddCard(false)} className="text-text/40 hover:text-text transition"><X size={18} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-text/50 mb-2">Front (Question)</label>
              <textarea
                value={cardForm.front}
                onChange={e => setCardForm(f => ({ ...f, front: e.target.value }))}
                rows={3}
                placeholder="e.g. What is encapsulation?"
                className="w-full px-4 py-3 bg-background border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-text/50 mb-2">Back (Answer)</label>
              <textarea
                value={cardForm.back}
                onChange={e => setCardForm(f => ({ ...f, back: e.target.value }))}
                rows={3}
                placeholder="e.g. Bundling data and methods that operate on that data..."
                className="w-full px-4 py-3 bg-background border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm"
              />
            </div>
          </div>
          <button
            onClick={handleAddCard}
            disabled={!cardForm.front.trim() || !cardForm.back.trim()}
            className="flex items-center space-x-2 px-5 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
          >
            <Save size={16} /><span>Save Card</span>
          </button>
        </div>
      )}

      {/* AI Generate panel */}
      {showAIGenerate && (
        <div className="bg-card border border-primary/20 rounded-2xl p-5 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-primary" />
              <h3 className="font-bold">AI Generate Flashcards</h3>
            </div>
            <button onClick={() => setShowAIGenerate(false)} className="text-text/40 hover:text-text transition cursor-pointer"><X size={18} /></button>
          </div>
          <p className="text-sm text-text/60">Enter a topic or paste text and AI will generate flashcards automatically.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-text/50 mb-2">Topic or Text</label>
              <textarea
                value={aiTopic}
                onChange={e => setAiTopic(e.target.value)}
                rows={3}
                placeholder="e.g. 'Database normalization forms' or paste a paragraph of text..."
                className="w-full px-4 py-3 bg-background border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-text/50 mb-2">Number of Cards</label>
              <select
                value={aiCount}
                onChange={e => setAiCount(Number(e.target.value))}
                className="w-full px-4 py-3 bg-background border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {[5, 10, 15, 20].map(n => <option key={n} value={n}>{n} cards</option>)}
              </select>
            </div>
          </div>
          <button
            onClick={handleAIGenerate}
            disabled={!aiTopic.trim() || aiLoading}
            className="flex items-center space-x-2 px-5 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
          >
            {aiLoading ? (
              <><div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /><span>Generating...</span></>
            ) : (
              <><Sparkles size={16} /><span>Generate {aiCount} Cards</span></>
            )}
          </button>
        </div>
      )}

      {/* CSV Import panel */}
      {showCSVImport && (
        <div className="bg-card border border-accent/20 rounded-2xl p-5 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-accent" />
              <h3 className="font-bold">CSV Import</h3>
            </div>
            <button onClick={() => { setShowCSVImport(false); setImportResult(null); }} className="text-text/40 hover:text-text transition cursor-pointer"><X size={18} /></button>
          </div>
          <div className="bg-background rounded-xl p-3 text-xs text-text/60 font-mono">
            Format: <span className="text-accent">front,back</span> — one card per line<br/>
            Example: <span className="text-text/80">What is SQL?,Structured Query Language</span>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-text/50 mb-2">Upload CSV File</label>
              <input
                type="file"
                accept=".csv,.txt"
                onChange={handleCSVFile}
                className="w-full text-sm text-text/60 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-accent/10 file:text-accent file:font-bold hover:file:bg-accent/20 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-text/50 mb-2">Or Paste CSV Data</label>
              <textarea
                value={csvData}
                onChange={e => setCsvData(e.target.value)}
                rows={5}
                placeholder={"What is a primary key?,A unique identifier for each row\nWhat is SQL?,Structured Query Language"}
                className="w-full px-4 py-3 bg-background border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent resize-none text-sm font-mono"
              />
            </div>
          </div>
          {importResult && (
            <div className="bg-accent/10 border border-accent/20 rounded-xl p-3 text-sm">
              <p className="font-bold text-accent">✓ {importResult.message}</p>
              {importResult.errors?.length > 0 && (
                <div className="mt-2 text-text/60">
                  <p className="font-bold text-warning text-xs">Skipped lines:</p>
                  {importResult.errors.map((e, i) => <p key={i} className="text-xs">{e}</p>)}
                </div>
              )}
            </div>
          )}
          <button
            onClick={handleCSVImport}
            disabled={!csvData.trim() || csvLoading}
            className="flex items-center space-x-2 px-5 py-2.5 bg-accent text-background font-bold rounded-xl hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
          >
            {csvLoading ? (
              <><div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" /><span>Importing...</span></>
            ) : (
              <><Upload size={16} /><span>Import Cards</span></>
            )}
          </button>
        </div>
      )}

      {/* Questions list */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-20 bg-neutral-100 dark:bg-neutral-800 rounded-2xl animate-pulse" />)}
        </div>
      ) : cards.length === 0 ? (
        <div className="bg-card border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl p-12 text-center">
          <Brain size={40} className="mx-auto text-text/20 mb-3" />
          <p className="text-text/40 font-semibold">No questions in this deck yet</p>
          <p className="text-text/30 text-sm mt-1">Add your first flashcard or generate them with AI</p>
        </div>
      ) : (
        <div className="space-y-3">
          {cards.map((card, idx) => (
            <div key={card.id} className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 group hover:border-primary/30 transition">
              {editingCard?.id === card.id ? (
                // ── Inline Edit Form ──
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-text/40 mb-1">Front (Question)</label>
                      <textarea
                        value={editingCard.front}
                        onChange={e => setEditingCard(c => ({ ...c, front: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 bg-background border border-primary/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-text/40 mb-1">Back (Answer)</label>
                      <textarea
                        value={editingCard.back}
                        onChange={e => setEditingCard(c => ({ ...c, back: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 bg-background border border-primary/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleEditCard}
                      disabled={editLoading}
                      className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground font-bold rounded-xl text-sm hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
                    >
                      <Save size={14} />
                      {editLoading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => setEditingCard(null)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-card border border-text/10 text-text/60 font-bold rounded-xl text-sm hover:text-text transition cursor-pointer"
                    >
                      <X size={14} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // ── Normal Card View ──
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1 min-w-0">
                    <span className="text-xs font-black text-text/30 mt-1 w-6 shrink-0">{idx + 1}</span>
                    <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <p className="text-[10px] font-bold text-text/30 uppercase tracking-widest mb-1">Question</p>
                        <p className="text-sm font-medium text-text line-clamp-3">{card.front}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-text/30 uppercase tracking-widest mb-1">Answer</p>
                        <p className="text-sm text-text/60 line-clamp-3">{card.back}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 ml-4 shrink-0 opacity-0 group-hover:opacity-100 transition">
                    {card.next_review_date && (
                      <span className="text-[10px] font-bold text-text/30 hidden md:block mr-2">
                        Next: {new Date(card.next_review_date).toLocaleDateString()}
                      </span>
                    )}
                    {isAdminOrOwner && (
                      <button
                        onClick={() => setEditingCard({ id: card.id, front: card.front, back: card.back })}
                        className="p-1.5 text-text/30 hover:text-primary hover:bg-primary/10 rounded-lg transition cursor-pointer"
                        title="Edit card"
                      >
                        <Pencil size={14} />
                      </button>
                    )}
                    {isAdminOrOwner && (
                      <button
                        onClick={() => handleDeleteCard(card.id)}
                        className="p-1.5 text-text/20 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition cursor-pointer"
                        title="Delete card"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── Main Flashcards Page ─── */
const Flashcards = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeckState, setSelectedDeckState] = useState(null); // { deck, tab: 'list'|'ai'|'csv'|'add' }
  const [directStudyState, setDirectStudyState] = useState(null); // { deck, cards }
  const [startingStudyId, setStartingStudyId] = useState(null);
  const [sessionResult, setSessionResult] = useState(null);
  const [showNewDeck, setShowNewDeck] = useState(false);
  const [deckForm, setDeckForm] = useState({ title: '', course_id: '', is_public: false });
  const [courses, setCourses] = useState([]);
  const [totalDue, setTotalDue] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'official', 'custom'
  const [searchQuery, setSearchQuery] = useState('');
  
  // 3-dot dropdown menu state
  const [openMenuDeckId, setOpenMenuDeckId] = useState(null);

  useEffect(() => {
    fetchAll();
    api.get('/courses').then(r => setCourses(r.data)).catch(console.error);
  }, []);

  // Close 3-dot menu on click outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.deck-menu-container')) {
        setOpenMenuDeckId(null);
      }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [decksRes, dueRes] = await Promise.all([
        api.get('/flashcards/decks'),
        api.get('/flashcards/due-count')
      ]);
      setDecks(decksRes.data);
      setTotalDue(dueRes.data.count);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDeck = async () => {
    if (!deckForm.title.trim()) return;
    try {
      await api.post('/flashcards/decks', {
        title: deckForm.title.trim(),
        course_id: deckForm.course_id || null,
        is_public: user?.role === 'admin' ? deckForm.is_public : false
      });
      setDeckForm({ title: '', course_id: '', is_public: false });
      setShowNewDeck(false);
      fetchAll();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteDeck = async (deck, e) => {
    if (e) e.stopPropagation();
    setOpenMenuDeckId(null);
    if (deck.is_public && user?.role !== 'admin') {
      alert('Official course decks can only be managed by administrators.');
      return;
    }
    if (!window.confirm(`Delete deck "${formatDeckTitle(deck.title)}" and all its cards?`)) return;
    try {
      await api.delete(`/flashcards/decks/${deck.id}`);
      fetchAll();
    } catch (e) {
      console.error(e);
    }
  };

  // Direct study click handler on card
  const handleStartDirectStudy = async (deck) => {
    setOpenMenuDeckId(null);
    setStartingStudyId(deck.id);
    try {
      const [cardsRes, dueRes] = await Promise.all([
        api.get(`/flashcards/decks/${deck.id}/cards`),
        api.get('/flashcards/due')
      ]);
      const cards = cardsRes.data || [];
      if (cards.length === 0) {
        // No cards: open the questions view so user can add cards
        setSelectedDeckState({ deck, tab: 'list' });
        return;
      }
      const dueCards = (dueRes.data || []).filter(c => c.deck_id === deck.id);
      const studySet = dueCards.length > 0 ? dueCards : cards;
      setDirectStudyState({ deck, cards: studySet });
    } catch (err) {
      console.error('Failed to load flashcards for study', err);
    } finally {
      setStartingStudyId(null);
    }
  };

  const filteredDecks = decks.filter(deck => {
    const isOfficial = deck.is_public || !deck.user_id;
    const matchesFilter = 
      activeFilter === 'all' ? true :
      activeFilter === 'official' ? isOfficial :
      (deck.user_id === user?.id && !deck.is_public);

    const cleaned = formatDeckTitle(deck.title).toLowerCase();
    const query = searchQuery.trim().toLowerCase();

    const matchesSearch = 
      !query ||
      cleaned.includes(query) ||
      (deck.title && deck.title.toLowerCase().includes(query)) ||
      (deck.course_title && deck.course_title.toLowerCase().includes(query)) ||
      (deck.course_code && deck.course_code.toLowerCase().includes(query));

    return matchesFilter && matchesSearch;
  });

  const officialDecksCount = decks.filter(d => d.is_public || !d.user_id).length;
  const customDecksCount = decks.filter(d => d.user_id === user?.id && !d.is_public).length;

  // Direct Study Session View
  if (directStudyState) {
    return (
      <div className="h-full w-full overflow-y-auto flex flex-col items-center justify-center">
        <StudySession
          cards={directStudyState.cards}
          deckTitle={directStudyState.deck.title}
          deckId={directStudyState.deck.id}
          onExit={() => {
            setDirectStudyState(null);
            fetchAll();
          }}
          onFinish={(stats) => {
            setDirectStudyState(null);
            setSessionResult(stats);
            fetchAll();
          }}
        />
      </div>
    );
  }

  // Session Result View
  if (sessionResult) {
    return (
      <div className="h-full w-full overflow-y-auto flex flex-col items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
        <div className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-10 max-w-md w-full text-center space-y-5 sm:space-y-6 shadow-xl my-auto">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={36} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black">Session Complete!</h2>
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 rounded-full text-xs font-black uppercase tracking-wider">
              <span>🎉 +100 Points Earned!</span>
            </div>
            {sessionResult.isFirstTime && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-2 bg-emerald-500/10 border border-emerald-500/20 py-1.5 px-3 rounded-xl">
                🎴 First flashcards completed! Friends notified: "{user?.name || 'You'} just did their first flashcards"
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-3 text-center">
              <p className="text-xl sm:text-2xl font-black text-emerald-500">{sessionResult.easy}</p>
              <p className="text-[10px] sm:text-xs text-text/40 font-bold uppercase">Easy</p>
            </div>
            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-3 text-center">
              <p className="text-xl sm:text-2xl font-black text-primary">{sessionResult.good}</p>
              <p className="text-[10px] sm:text-xs text-text/40 font-bold uppercase">Good</p>
            </div>
            <div className="bg-orange-500/5 border border-orange-500/10 rounded-2xl p-3 text-center">
              <p className="text-xl sm:text-2xl font-black text-orange-500">{sessionResult.hard}</p>
              <p className="text-[10px] sm:text-xs text-text/40 font-bold uppercase">Hard</p>
            </div>
            <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-3 text-center">
              <p className="text-xl sm:text-2xl font-black text-red-500">{sessionResult.forgot}</p>
              <p className="text-[10px] sm:text-xs text-text/40 font-bold uppercase">Forgot</p>
            </div>
          </div>
          <button
            onClick={() => setSessionResult(null)}
            className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition cursor-pointer text-sm shadow-md active:scale-98"
          >
            Back to Flashcards
          </button>
        </div>
      </div>
    );
  }

  // Questions / Deck Details View (Accessed from 3-dot menu)
  if (selectedDeckState) {
    return (
      <DeckDetail
        deck={selectedDeckState.deck}
        initialTab={selectedDeckState.tab}
        onBack={() => {
          setSelectedDeckState(null);
          fetchAll();
        }}
      />
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 text-text/60 hover:text-primary hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition cursor-pointer"
            title="Go Back"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1 flex items-center gap-2.5">
              <span>Flashcards</span>
              <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Spaced Repetition
              </span>
            </h1>
            <p className="text-text/60 text-sm">
              Click any card to start study mode, or use the 3-dot menu to view questions and answers.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {totalDue > 0 && (
            <div className="flex items-center space-x-2 bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-xl font-bold text-sm">
              <Zap size={16} />
              <span>{totalDue} cards due today</span>
            </div>
          )}
          <button
            onClick={() => setShowNewDeck(true)}
            className="flex items-center space-x-2 bg-primary text-primary-foreground px-5 py-3 rounded-xl font-bold shadow-md hover:shadow-lg hover:opacity-90 transition-all text-sm cursor-pointer"
          >
            <Plus size={18} /><span>New Deck</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-text/10 pb-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-card text-text/70 hover:text-text border border-text/5'
            }`}
          >
            <span>All Decks</span>
            <span className="px-1.5 py-0.2 bg-black/20 text-current rounded-full text-[10px]">{decks.length}</span>
          </button>
          <button
            onClick={() => setActiveFilter('official')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
              activeFilter === 'official'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-card text-text/70 hover:text-text border border-text/5'
            }`}
          >
            <span>⭐ Ready-Made Decks</span>
            <span className="px-1.5 py-0.2 bg-black/20 text-current rounded-full text-[10px]">{officialDecksCount}</span>
          </button>
          <button
            onClick={() => setActiveFilter('custom')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
              activeFilter === 'custom'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-card text-text/70 hover:text-text border border-text/5'
            }`}
          >
            <span>My Custom Decks</span>
            <span className="px-1.5 py-0.2 bg-black/20 text-current rounded-full text-[10px]">{customDecksCount}</span>
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search decks & courses..."
            className="w-full pl-3 pr-8 py-2 bg-card border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text/40 hover:text-text cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* New deck form */}
      {showNewDeck && (
        <div className="bg-card border border-primary/20 rounded-2xl p-5 space-y-4 animate-in slide-in-from-top-4 duration-200 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg">New Flashcard Deck</h3>
            <button onClick={() => setShowNewDeck(false)} className="text-text/40 hover:text-text transition cursor-pointer"><X size={18} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-text/50 mb-2">Deck Title</label>
              <input
                type="text"
                value={deckForm.title}
                onChange={e => setDeckForm(f => ({ ...f, title: e.target.value }))}
                placeholder="e.g. System and Network Administration"
                className="w-full px-4 py-3 bg-background border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-text/50 mb-2">Course (optional)</label>
              <select
                value={deckForm.course_id}
                onChange={e => setDeckForm(f => ({ ...f, course_id: e.target.value }))}
                className="w-full px-4 py-3 bg-background border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              >
                <option value="">No specific course</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
          </div>
          {user?.role === 'admin' && (
            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="is_public"
                checked={deckForm.is_public}
                onChange={e => setDeckForm(f => ({ ...f, is_public: e.target.checked }))}
                className="rounded border-neutral-300 text-primary focus:ring-primary w-4 h-4"
              />
              <label htmlFor="is_public" className="text-xs font-semibold text-text/80 cursor-pointer">
                Make this deck an Official Ready-Made Deck for all students
              </label>
            </div>
          )}
          <button
            onClick={handleCreateDeck}
            disabled={!deckForm.title.trim()}
            className="flex items-center space-x-2 px-5 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition disabled:opacity-50 text-sm shadow-sm cursor-pointer"
          >
            <Save size={16} /><span>Create Deck</span>
          </button>
        </div>
      )}

      {/* Decks grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => <FlashcardDeckSkeleton key={i} />)}
        </div>
      ) : filteredDecks.length === 0 ? (
        <div className="bg-card border border-dashed border-neutral-200 dark:border-neutral-800 rounded-3xl p-16 text-center space-y-4">
          <div className="w-20 h-20 bg-primary/5 text-primary rounded-3xl flex items-center justify-center mx-auto">
            <Brain size={40} />
          </div>
          <h2 className="text-xl font-bold">No flashcard decks found</h2>
          <p className="text-text/40 max-w-sm mx-auto">
            {searchQuery ? 'Try clearing your search query' : 'Create your first deck to start using spaced repetition for smarter studying.'}
          </p>
          <button onClick={() => setShowNewDeck(true)} className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition shadow-md cursor-pointer">
            <Plus size={18} /><span>Create First Deck</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDecks.map(deck => {
            const isOfficial = deck.is_public || !deck.user_id;
            const cleanedTitle = formatDeckTitle(deck.title);
            const isMenuOpen = openMenuDeckId === deck.id;
            const isStarting = startingStudyId === deck.id;
            const canManage = user?.role === 'admin' || user?.id === deck.user_id;

            return (
              <div
                key={deck.id}
                onClick={() => handleStartDirectStudy(deck)}
                className={`bg-card border rounded-2xl p-5 cursor-pointer transition-all group shadow-sm flex flex-col justify-between relative ${
                  isOfficial 
                    ? 'border-primary/30 hover:border-primary hover:shadow-md hover:-translate-y-1' 
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-text/30 hover:-translate-y-1'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2.5 rounded-xl group-hover:scale-110 transition-transform ${
                      isOfficial ? 'bg-amber-500/10 text-amber-500' : 'bg-primary/10 text-primary'
                    }`}>
                      <Brain size={20} />
                    </div>

                    <div className="flex items-center space-x-1.5">
                      {isOfficial && (
                        <span className="text-[10px] font-black bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          ⭐ Official
                        </span>
                      )}
                      {deck.due_count > 0 && (
                        <span className="text-[10px] font-black bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                          {deck.due_count} due
                        </span>
                      )}

                      {/* 3-Dot Menu Dropdown */}
                      <div className="relative deck-menu-container">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuDeckId(isMenuOpen ? null : deck.id);
                          }}
                          className={`p-1.5 rounded-lg text-text/40 hover:text-text hover:bg-neutral-100 dark:hover:bg-neutral-800 transition ${
                            isMenuOpen ? 'bg-neutral-100 dark:bg-neutral-800 text-text' : ''
                          }`}
                          title="More options"
                        >
                          <MoreVertical size={16} />
                        </button>

                        {isMenuOpen && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-0 top-8 z-30 w-52 bg-card/95 backdrop-blur-md border border-neutral-200 dark:border-neutral-700 rounded-2xl p-1.5 shadow-2xl animate-in zoom-in-95 duration-150 text-left space-y-0.5"
                          >
                            <button
                              onClick={() => {
                                setOpenMenuDeckId(null);
                                setSelectedDeckState({ deck, tab: 'list' });
                              }}
                              className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-text rounded-xl hover:bg-primary/10 hover:text-primary transition text-left cursor-pointer"
                            >
                              <FileText size={14} className="text-primary" />
                              <span>Questions & Answers</span>
                            </button>

                            <button
                              onClick={() => {
                                setOpenMenuDeckId(null);
                                setSelectedDeckState({ deck, tab: 'ai' });
                              }}
                              className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-text rounded-xl hover:bg-primary/10 hover:text-primary transition text-left cursor-pointer"
                            >
                              <Sparkles size={14} className="text-emerald-500" />
                              <span>AI Generate Cards</span>
                            </button>

                            <button
                              onClick={() => {
                                setOpenMenuDeckId(null);
                                setSelectedDeckState({ deck, tab: 'csv' });
                              }}
                              className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-text rounded-xl hover:bg-accent/10 hover:text-accent transition text-left cursor-pointer"
                            >
                              <Upload size={14} className="text-accent" />
                              <span>Import CSV</span>
                            </button>

                            {canManage && (
                              <button
                                onClick={(e) => handleDeleteDeck(deck, e)}
                                className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-red-500 rounded-xl hover:bg-red-500/10 transition text-left cursor-pointer border-t border-neutral-100 dark:border-neutral-800/80 mt-1 pt-1.5"
                              >
                                <Trash2 size={14} />
                                <span>Delete Deck</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Cleaned Deck Title (Course Name only) */}
                  <h3 className="font-bold text-base mb-1 group-hover:text-primary transition-colors line-clamp-2">
                    {cleanedTitle}
                  </h3>
                  <p className="text-xs text-text/40">Click to start study session</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800/60 mt-4">
                  <div className="flex items-center space-x-1.5 text-text/50">
                    <BookOpen size={13} />
                    <span className="text-xs font-bold">{deck.card_count} cards</span>
                  </div>

                  {isStarting ? (
                    <span className="text-xs font-bold text-primary inline-flex items-center gap-1">
                      <Loader2 size={13} className="animate-spin" />
                      <span>Loading...</span>
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-primary group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                      <PlayCircle size={14} />
                      <span>Study Mode</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Flashcards;
