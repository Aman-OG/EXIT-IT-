import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import {
  Brain, Plus, Trash2, ChevronRight, BookOpen, X, Save,
  RotateCcw, CheckCircle2, Clock, Zap, ArrowLeft, ArrowRight
} from 'lucide-react';

/* ─── Card Flip Study Session ─── */
const StudySession = ({ cards, onFinish }) => {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState([]);
  const [sessionStats, setSessionStats] = useState({ easy: 0, good: 0, hard: 0, forgot: 0 });

  const card = cards[index];

  const handleRate = async (quality, label) => {
    try {
      await api.post('/flashcards/review', { cardId: card.id, quality });
    } catch (e) {
      console.error(e);
    }
    setSessionStats(prev => ({ ...prev, [label]: prev[label] + 1 }));
    setDone(prev => [...prev, card.id]);
    if (index < cards.length - 1) {
      setIndex(i => i + 1);
      setFlipped(false);
    } else {
      onFinish({ ...sessionStats, [label]: sessionStats[label] + 1 });
    }
  };

  const progress = ((index) / cards.length) * 100;

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
      {/* Progress */}
      <div className="w-full max-w-xl mb-8">
        <div className="flex justify-between text-xs font-bold text-text/40 mb-2">
          <span>{index + 1} / {cards.length}</span>
          <span>{Math.round(progress)}% done</span>
        </div>
        <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Card */}
      <div
        className="w-full max-w-xl cursor-pointer"
        onClick={() => setFlipped(f => !f)}
        style={{ perspective: '1000px' }}
      >
        <div
          className="relative w-full transition-transform duration-500"
          style={{
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            minHeight: '240px'
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 bg-card border-2 border-primary/20 rounded-3xl p-8 flex flex-col items-center justify-center shadow-xl"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-text/30 mb-4">Question</p>
            <p className="text-xl font-bold text-center leading-relaxed">{card.front}</p>
            <p className="text-xs text-text/30 mt-6">Click to reveal answer</p>
          </div>
          {/* Back */}
          <div
            className="absolute inset-0 bg-primary/5 border-2 border-primary/30 rounded-3xl p-8 flex flex-col items-center justify-center shadow-xl"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary/50 mb-4">Answer</p>
            <p className="text-xl font-bold text-center leading-relaxed text-primary">{card.back}</p>
          </div>
        </div>
      </div>

      {/* Rating buttons — only show after flip */}
      {flipped && (
        <div className="flex items-center space-x-3 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <button onClick={() => handleRate(1, 'forgot')} className="flex flex-col items-center px-5 py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl font-bold text-sm hover:bg-red-500/20 transition">
            <span>😵</span><span className="text-xs mt-1">Forgot</span>
          </button>
          <button onClick={() => handleRate(2, 'hard')} className="flex flex-col items-center px-5 py-3 bg-orange-500/10 text-orange-500 border border-orange-500/20 rounded-2xl font-bold text-sm hover:bg-orange-500/20 transition">
            <span>😓</span><span className="text-xs mt-1">Hard</span>
          </button>
          <button onClick={() => handleRate(4, 'good')} className="flex flex-col items-center px-5 py-3 bg-primary/10 text-primary border border-primary/20 rounded-2xl font-bold text-sm hover:bg-primary/20 transition">
            <span>🙂</span><span className="text-xs mt-1">Good</span>
          </button>
          <button onClick={() => handleRate(5, 'easy')} className="flex flex-col items-center px-5 py-3 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-2xl font-bold text-sm hover:bg-emerald-500/20 transition">
            <span>😄</span><span className="text-xs mt-1">Easy</span>
          </button>
        </div>
      )}

      {!flipped && (
        <p className="mt-8 text-xs text-text/30 font-medium">Rate how well you remembered after flipping</p>
      )}
    </div>
  );
};

/* ─── Deck Detail View ─── */
const DeckDetail = ({ deck, onBack }) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardForm, setCardForm] = useState({ front: '', back: '' });
  const [studying, setStudying] = useState(false);
  const [sessionResult, setSessionResult] = useState(null);
  const [dueCards, setDueCards] = useState([]);

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

  if (studying) {
    const studySet = dueCards.length > 0 ? dueCards : cards;
    return (
      <StudySession
        cards={studySet}
        onFinish={(stats) => {
          setStudying(false);
          setSessionResult(stats);
          fetchCards();
        }}
      />
    );
  }

  if (sessionResult) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
        <div className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-3xl p-10 max-w-md w-full text-center space-y-6 shadow-xl">
          <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-2xl font-black">Session Complete!</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3 text-center">
              <p className="text-2xl font-black text-emerald-500">{sessionResult.easy}</p>
              <p className="text-xs text-text/40 font-bold uppercase">Easy</p>
            </div>
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 text-center">
              <p className="text-2xl font-black text-primary">{sessionResult.good}</p>
              <p className="text-xs text-text/40 font-bold uppercase">Good</p>
            </div>
            <div className="bg-orange-500/5 border border-orange-500/10 rounded-xl p-3 text-center">
              <p className="text-2xl font-black text-orange-500">{sessionResult.hard}</p>
              <p className="text-xs text-text/40 font-bold uppercase">Hard</p>
            </div>
            <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-3 text-center">
              <p className="text-2xl font-black text-red-500">{sessionResult.forgot}</p>
              <p className="text-xs text-text/40 font-bold uppercase">Forgot</p>
            </div>
          </div>
          <button onClick={() => setSessionResult(null)} className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition">
            Back to Deck
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="p-2 text-text/60 hover:text-primary hover:bg-primary/5 rounded-lg transition">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">{deck.title}</h1>
            {deck.course_title && <p className="text-sm text-text/50">{deck.course_title}</p>}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAddCard(true)}
            className="flex items-center space-x-2 px-4 py-2.5 bg-card border border-neutral-200 dark:border-neutral-800 rounded-xl font-bold text-sm hover:border-primary/40 transition"
          >
            <Plus size={16} /><span>Add Card</span>
          </button>
          {cards.length > 0 && (
            <button
              onClick={() => setStudying(true)}
              className="flex items-center space-x-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:opacity-90 transition shadow-md"
            >
              <Brain size={16} />
              <span>Study {dueCards.length > 0 ? `(${dueCards.length} due)` : 'All'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-black text-text">{cards.length}</p>
          <p className="text-xs text-text/40 font-bold uppercase tracking-wider">Total Cards</p>
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
            className="flex items-center space-x-2 px-5 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition disabled:opacity-50"
          >
            <Save size={16} /><span>Save Card</span>
          </button>
        </div>
      )}

      {/* Cards list */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-20 bg-neutral-100 dark:bg-neutral-800 rounded-2xl animate-pulse" />)}
        </div>
      ) : cards.length === 0 ? (
        <div className="bg-card border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl p-12 text-center">
          <Brain size={40} className="mx-auto text-text/20 mb-3" />
          <p className="text-text/40 font-semibold">No cards yet</p>
          <p className="text-text/30 text-sm mt-1">Add your first flashcard to start studying</p>
        </div>
      ) : (
        <div className="space-y-3">
          {cards.map((card, idx) => (
            <div key={card.id} className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 flex items-start justify-between group hover:border-primary/30 transition">
              <div className="flex items-start space-x-4 flex-1 min-w-0">
                <span className="text-xs font-black text-text/30 mt-1 w-6 shrink-0">{idx + 1}</span>
                <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] font-bold text-text/30 uppercase tracking-widest mb-1">Front</p>
                    <p className="text-sm font-medium text-text line-clamp-2">{card.front}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-text/30 uppercase tracking-widest mb-1">Back</p>
                    <p className="text-sm text-text/60 line-clamp-2">{card.back}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4 shrink-0">
                {card.next_review_date && (
                  <span className="text-[10px] font-bold text-text/30 hidden md:block">
                    Next: {new Date(card.next_review_date).toLocaleDateString()}
                  </span>
                )}
                <button
                  onClick={() => handleDeleteCard(card.id)}
                  className="p-1.5 text-text/20 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── Main Flashcards Page ─── */
const Flashcards = () => {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [showNewDeck, setShowNewDeck] = useState(false);
  const [deckForm, setDeckForm] = useState({ title: '', course_id: '' });
  const [courses, setCourses] = useState([]);
  const [totalDue, setTotalDue] = useState(0);

  useEffect(() => {
    fetchAll();
    api.get('/courses').then(r => setCourses(r.data)).catch(console.error);
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
        course_id: deckForm.course_id || null
      });
      setDeckForm({ title: '', course_id: '' });
      setShowNewDeck(false);
      fetchAll();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteDeck = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this deck and all its cards?')) return;
    try {
      await api.delete(`/flashcards/decks/${id}`);
      fetchAll();
    } catch (e) {
      console.error(e);
    }
  };

  if (selectedDeck) {
    return <DeckDetail deck={selectedDeck} onBack={() => { setSelectedDeck(null); fetchAll(); }} />;
  }

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Flashcards</h1>
          <p className="text-text/60">Spaced repetition study — review cards at the optimal time.</p>
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
            className="flex items-center space-x-2 bg-primary text-primary-foreground px-5 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all"
          >
            <Plus size={20} /><span>New Deck</span>
          </button>
        </div>
      </div>

      {/* New deck form */}
      {showNewDeck && (
        <div className="bg-card border border-primary/20 rounded-2xl p-5 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">New Flashcard Deck</h3>
            <button onClick={() => setShowNewDeck(false)} className="text-text/40 hover:text-text transition"><X size={18} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-text/50 mb-2">Deck Title</label>
              <input
                type="text"
                value={deckForm.title}
                onChange={e => setDeckForm(f => ({ ...f, title: e.target.value }))}
                placeholder="e.g. OOP Concepts"
                className="w-full px-4 py-3 bg-background border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-text/50 mb-2">Course (optional)</label>
              <select
                value={deckForm.course_id}
                onChange={e => setDeckForm(f => ({ ...f, course_id: e.target.value }))}
                className="w-full px-4 py-3 bg-background border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">No course</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.code}: {c.title}</option>)}
              </select>
            </div>
          </div>
          <button
            onClick={handleCreateDeck}
            disabled={!deckForm.title.trim()}
            className="flex items-center space-x-2 px-5 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition disabled:opacity-50"
          >
            <Save size={16} /><span>Create Deck</span>
          </button>
        </div>
      )}

      {/* Decks grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-40 bg-neutral-100 dark:bg-neutral-800 rounded-2xl animate-pulse" />)}
        </div>
      ) : decks.length === 0 ? (
        <div className="bg-card border border-dashed border-neutral-200 dark:border-neutral-800 rounded-3xl p-16 text-center space-y-4">
          <div className="w-20 h-20 bg-primary/5 text-primary rounded-3xl flex items-center justify-center mx-auto">
            <Brain size={40} />
          </div>
          <h2 className="text-xl font-bold">No flashcard decks yet</h2>
          <p className="text-text/40 max-w-sm mx-auto">Create your first deck to start using spaced repetition for smarter studying.</p>
          <button onClick={() => setShowNewDeck(true)} className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition">
            <Plus size={18} /><span>Create First Deck</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {decks.map(deck => (
            <div
              key={deck.id}
              onClick={() => setSelectedDeck(deck)}
              className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 cursor-pointer hover:border-primary/50 hover:-translate-y-1 transition-all group shadow-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 bg-primary/10 text-primary rounded-xl group-hover:scale-110 transition-transform">
                  <Brain size={20} />
                </div>
                <div className="flex items-center space-x-2">
                  {deck.due_count > 0 && (
                    <span className="text-[10px] font-black bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                      {deck.due_count} due
                    </span>
                  )}
                  <button
                    onClick={(e) => handleDeleteDeck(deck.id, e)}
                    className="p-1.5 text-text/20 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              {deck.course_title && (
                <p className="text-[10px] font-bold text-text/30 uppercase tracking-widest mb-1">{deck.course_title}</p>
              )}
              <h3 className="font-bold text-base mb-3 group-hover:text-primary transition-colors">{deck.title}</h3>
              <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center space-x-1 text-text/40">
                  <BookOpen size={12} />
                  <span className="text-xs font-bold">{deck.card_count} cards</span>
                </div>
                <ChevronRight size={16} className="text-text/30 group-hover:text-primary transition-colors" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Flashcards;
