import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import {
  BookOpen, Plus, Trash2, ChevronLeft, Save,
  HelpCircle, CheckCircle2, MessageSquare, AlertCircle, X,
  Sparkles, FileText, ClipboardList, Loader2, Upload
} from 'lucide-react';

/* ─────────────────────────────────────────────
   Import CSV Modal
───────────────────────────────────────────── */
const ImportCSVModal = ({ quiz, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);

  const handleImport = async () => {
    if (!file) return;
    setImporting(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await api.post(`/quizzes/${quiz.id}/import-csv`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(res.data);
      if (res.data.imported > 0) {
        setTimeout(() => { onSuccess(); onClose(); }, 2000);
      }
    } catch (err) {
      setResult({ imported: 0, errors: [err.response?.data?.message || 'Import failed'], total: 0 });
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const csv = 'question_text,option_a,option_b,option_c,option_d,correct_option,explanation\nWhat is 2+2?,3,4,5,6,b,Basic arithmetic\n';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'questions_template.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl w-full max-w-lg animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-accent/10 text-accent rounded-xl"><Upload size={20} /></div>
            <div>
              <h3 className="text-xl font-bold">Import Questions from CSV</h3>
              <p className="text-xs text-text/50">Adding to: <span className="font-semibold">{quiz.title}</span></p>
            </div>
          </div>
          <button onClick={onClose} disabled={importing} className="text-text/40 hover:text-text transition"><X size={20} /></button>
        </div>

        <div className="p-6 space-y-5">
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 space-y-2">
            <p className="text-xs font-bold text-primary uppercase tracking-widest">CSV Format</p>
            <p className="text-xs text-text/60 font-mono">question_text, option_a, option_b, option_c, option_d, correct_option, explanation</p>
            <p className="text-xs text-text/50">correct_option must be: a, b, c, or d</p>
            <button onClick={downloadTemplate} className="text-xs font-bold text-primary hover:underline">Download template →</button>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-text/50 mb-2">Select CSV File</label>
            <input
              type="file"
              accept=".csv"
              onChange={e => { setFile(e.target.files[0]); setResult(null); }}
              className="w-full text-sm text-text/70 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition"
            />
          </div>

          {result && (
            <div className={`rounded-xl p-4 space-y-2 ${result.imported > 0 ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
              <p className={`font-bold text-sm ${result.imported > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                ✅ {result.imported} questions imported of {result.total} rows
              </p>
              {result.errors?.length > 0 && (
                <div className="space-y-1">
                  {result.errors.slice(0, 5).map((e, i) => (
                    <p key={i} className="text-xs text-red-500">⚠ {e}</p>
                  ))}
                  {result.errors.length > 5 && <p className="text-xs text-text/40">...and {result.errors.length - 5} more errors</p>}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-neutral-200 dark:border-neutral-800">
          <button
            onClick={handleImport}
            disabled={!file || importing}
            className="w-full flex items-center justify-center space-x-2 bg-accent text-white font-bold py-4 rounded-xl transition hover:bg-accent/90 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {importing ? <><Loader2 size={18} className="animate-spin" /><span>Importing...</span></> : <><Upload size={18} /><span>Import Questions</span></>}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   AI Magic Generate Modal
   Two tabs: "Paste Text" and "Choose Chapter"
───────────────────────────────────────────── */
const AiGenerateModal = ({ quiz, courseId, onClose, onSuccess }) => {
  const [tab, setTab] = useState('paste'); // 'paste' | 'chapter'
  const [pasteText, setPasteText] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [materials, setMaterials] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [loadingMaterials, setLoadingMaterials] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [status, setStatus] = useState('');

  // Load chapters when "Choose Chapter" tab is opened
  useEffect(() => {
    if (tab === 'chapter' && materials.length === 0) {
      setLoadingMaterials(true);
      api.get(`/materials/course/${courseId}`)
        .then(res => setMaterials(res.data))
        .catch(() => setStatus('Failed to load course materials.'))
        .finally(() => setLoadingMaterials(false));
    }
  }, [tab, courseId, materials.length]);

  const handleGenerate = async () => {
    let content = '';

    if (tab === 'paste') {
      if (!pasteText.trim()) {
        setStatus('Please paste some content first.');
        return;
      }
      content = pasteText.trim();
    } else {
      if (!selectedMaterial) {
        setStatus('Please select a chapter.');
        return;
      }
      // Extract full PDF text from server
      setExtracting(true);
      setStatus('Extracting full chapter text from PDF…');
      try {
        const res = await api.get(`/ai/extract-pdf/${selectedMaterial.id}`);
        content = res.data.text;
        if (!content || content.trim().length < 100) {
          setStatus('Could not extract enough text from this PDF. Try pasting the content manually.');
          setExtracting(false);
          return;
        }
        setStatus(`Extracted ${res.data.pages} pages. Generating questions…`);
      } catch (err) {
        setStatus('Failed to extract PDF text. Try the paste option instead.');
        setExtracting(false);
        return;
      }
      setExtracting(false);
    }

    setGenerating(true);
    setStatus('AI is generating 10 questions…');
    try {
      const res = await api.post('/ai/add-questions-to-quiz', {
        quizId: quiz.id,
        content,
        difficulty,
        count: 10
      });
      setStatus(`✅ ${res.data.count} questions added successfully!`);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1200);
    } catch (err) {
      const msg = err.response?.data?.message || 'AI generation failed.';
      setStatus(`❌ ${msg}`);
    } finally {
      setGenerating(false);
    }
  };

  const isLoading = extracting || generating;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl w-full max-w-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 text-primary rounded-xl">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold">AI Magic Generate</h3>
              <p className="text-xs text-text/50">Adding 10 questions to: <span className="font-semibold text-text/70">{quiz.title}</span></p>
            </div>
          </div>
          <button onClick={onClose} disabled={isLoading} className="text-text/40 hover:text-text transition disabled:opacity-30">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-800 shrink-0">
          <button
            onClick={() => setTab('paste')}
            className={`flex items-center space-x-2 px-6 py-3 text-sm font-bold transition border-b-2 ${tab === 'paste' ? 'border-primary text-primary' : 'border-transparent text-text/50 hover:text-text'}`}
          >
            <ClipboardList size={16} />
            <span>Paste Text</span>
          </button>
          <button
            onClick={() => setTab('chapter')}
            className={`flex items-center space-x-2 px-6 py-3 text-sm font-bold transition border-b-2 ${tab === 'chapter' ? 'border-primary text-primary' : 'border-transparent text-text/50 hover:text-text'}`}
          >
            <FileText size={16} />
            <span>Choose Chapter</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {tab === 'paste' ? (
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-widest text-text/50">
                Paste chapter or material content
              </label>
              <textarea
                value={pasteText}
                onChange={e => setPasteText(e.target.value)}
                placeholder="Paste the full chapter text here. The more content you provide, the better the questions will be…"
                rows={12}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-background border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm disabled:opacity-50"
              />
              <p className="text-xs text-text/40">{pasteText.length.toLocaleString()} characters</p>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-widest text-text/50">
                Select a chapter PDF — full text will be extracted automatically
              </label>
              {loadingMaterials ? (
                <div className="flex items-center space-x-3 py-8 justify-center text-text/40">
                  <Loader2 size={20} className="animate-spin" />
                  <span className="text-sm">Loading chapters…</span>
                </div>
              ) : materials.length === 0 ? (
                <div className="py-8 text-center text-text/40 text-sm border border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl">
                  No materials found for this course.
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {materials.map(mat => (
                    <button
                      key={mat.id}
                      onClick={() => setSelectedMaterial(mat)}
                      disabled={isLoading}
                      className={`w-full flex items-center space-x-3 p-3 rounded-xl border text-left transition ${
                        selectedMaterial?.id === mat.id
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-neutral-200 dark:border-neutral-800 hover:border-primary/40 text-text'
                      }`}
                    >
                      <FileText size={16} className="shrink-0" />
                      <span className="text-sm font-medium truncate">{mat.title}</span>
                      {selectedMaterial?.id === mat.id && (
                        <CheckCircle2 size={16} className="ml-auto shrink-0 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              )}
              {selectedMaterial && (
                <p className="text-xs text-primary/70 bg-primary/5 border border-primary/10 rounded-lg px-3 py-2">
                  The entire PDF will be sent to AI — no page limits.
                </p>
              )}
            </div>
          )}

          {/* Difficulty */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-text/50">Difficulty</label>
            <div className="flex space-x-2">
              {['Easy', 'Medium', 'Hard'].map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  disabled={isLoading}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold border transition ${
                    difficulty === d
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-neutral-200 dark:border-neutral-700 text-text/60 hover:border-primary/40'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Status message */}
          {status && (
            <div className={`text-sm px-4 py-3 rounded-xl border ${
              status.startsWith('✅')
                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                : status.startsWith('❌')
                ? 'bg-red-500/10 text-red-500 border-red-500/20'
                : 'bg-primary/5 text-primary border-primary/10'
            }`}>
              {status}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-neutral-200 dark:border-neutral-800 shrink-0">
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 bg-primary text-primary-foreground font-bold py-4 rounded-xl transition hover:bg-primary/90 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>{extracting ? 'Extracting PDF…' : 'Generating Questions…'}</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Generate 10 Questions</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Main QuizManager Component
───────────────────────────────────────────── */
const QuizManager = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeQuiz, setActiveQuiz] = useState(null);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizForm, setQuizForm] = useState({ title: '', description: '' });
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [questionForm, setQuestionForm] = useState({
    question_text: '',
    options: [
      { option_text: '', is_correct: true },
      { option_text: '', is_correct: false },
      { option_text: '', is_correct: false },
      { option_text: '', is_correct: false }
    ]
  });

  useEffect(() => {
    fetchCourseAndQuizzes();
  }, [courseId]);

  const fetchCourseAndQuizzes = async () => {
    setLoading(true);
    try {
      const cRes = await api.get('/courses');
      const currentCourse = cRes.data.find(c => c.id === parseInt(courseId));
      setCourse(currentCourse);
      const qRes = await api.get(`/quizzes/course/${courseId}`);
      setQuizzes(qRes.data);
    } catch (err) {
      console.error('Failed to fetch quizzes', err);
    }
    setLoading(false);
  };

  const handleCreateQuiz = async () => {
    try {
      await api.post('/quizzes', { ...quizForm, course_id: courseId });
      setShowQuizModal(false);
      setQuizForm({ title: '', description: '' });
      fetchCourseAndQuizzes();
    } catch (err) {
      alert('Failed to create quiz');
    }
  };

  const handleDeleteQuiz = async (id) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) return;
    try {
      await api.delete(`/quizzes/${id}`);
      if (activeQuiz?.id === id) setActiveQuiz(null);
      fetchCourseAndQuizzes();
    } catch (err) {
      alert('Failed to delete quiz');
    }
  };

  const loadQuizDetails = async (quiz) => {
    try {
      const res = await api.get(`/quizzes/${quiz.id}`);
      setActiveQuiz(res.data);
    } catch (err) {
      alert('Failed to load quiz details');
    }
  };

  const handleAddQuestion = async () => {
    if (!questionForm.options.some(o => o.is_correct)) {
      alert('Please mark at least one option as correct.');
      return;
    }
    if (!questionForm.question_text) {
      alert('Question text is required.');
      return;
    }
    try {
      await api.post('/quizzes/question', {
        quiz_id: activeQuiz.id,
        question_text: questionForm.question_text,
        options: questionForm.options
      });
      setShowQuestionModal(false);
      setQuestionForm({
        question_text: '',
        options: [
          { option_text: '', is_correct: true },
          { option_text: '', is_correct: false },
          { option_text: '', is_correct: false },
          { option_text: '', is_correct: false }
        ]
      });
      loadQuizDetails(activeQuiz);
    } catch (err) {
      alert('Failed to add question');
    }
  };

  const handleDeleteQuestion = async (qId) => {
    try {
      await api.delete(`/quizzes/question/${qId}`);
      loadQuizDetails(activeQuiz);
    } catch (err) {
      alert('Failed to delete question');
    }
  };

  if (loading) return (
    <div className="p-8 text-center">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
      Loading Quiz Manager...
    </div>
  );

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/admin')} className="p-2 text-text/60 hover:text-primary hover:bg-primary/5 rounded-lg transition">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Quiz Manager</h1>
            <p className="text-text/70">{course?.title} ({course?.code})</p>
          </div>
        </div>
        <button
          onClick={() => setShowQuizModal(true)}
          className="flex items-center space-x-2 bg-primary text-primary-foreground px-5 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all"
        >
          <Plus size={20} />
          <span>New Quiz</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quiz List Sidebar */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-text/40 px-2">Available Quizzes</h2>
          {quizzes.length === 0 ? (
            <div className="bg-card border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 text-center text-text/40">
              No quizzes created for this course.
            </div>
          ) : (
            quizzes.map(q => (
              <div
                key={q.id}
                onClick={() => loadQuizDetails(q)}
                className={`group p-4 bg-card border rounded-2xl cursor-pointer transition-all ${activeQuiz?.id === q.id ? 'border-primary ring-1 ring-primary shadow-md' : 'border-neutral-200 dark:border-neutral-800 hover:border-primary/40'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`font-bold ${activeQuiz?.id === q.id ? 'text-primary' : ''}`}>{q.title}</h3>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteQuiz(q.id); }}
                    className="p-1 text-text/20 hover:text-warning opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <p className="text-xs text-text/50 line-clamp-2 mb-3">{q.description || 'No description provided.'}</p>
                <div className="flex items-center space-x-2 text-[10px] font-bold text-text/30 uppercase tracking-tighter">
                  <HelpCircle size={12} />
                  <span>Official Quiz</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quiz Editor / Question List */}
        <div className="lg:col-span-2">
          {activeQuiz ? (
            <div className="space-y-6">
              <div className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">{activeQuiz.title}</h2>
                    <p className="text-text/60 text-sm">{activeQuiz.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowAiModal(true)}
                      className="flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold transition shadow-sm bg-primary/10 text-primary hover:bg-primary/20"
                    >
                      <Sparkles size={18} />
                      <span>AI Magic Generate</span>
                    </button>
                    <button
                      onClick={() => setShowImportModal(true)}
                      className="flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold transition shadow-sm bg-accent/10 text-accent hover:bg-accent/20"
                    >
                      <Upload size={18} />
                      <span>Import CSV</span>
                    </button>
                    <button
                      onClick={() => setShowQuestionModal(true)}
                      className="flex items-center space-x-2 bg-accent/10 text-accent px-4 py-2.5 rounded-xl font-bold hover:bg-accent/20 transition shadow-sm"
                    >
                      <Plus size={18} />
                      <span>Add Question</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {activeQuiz.questions?.length === 0 ? (
                    <div className="py-12 text-center text-text/30">
                      <MessageSquare size={48} className="mx-auto mb-4 opacity-10" />
                      <p>This quiz has no questions yet.</p>
                    </div>
                  ) : (
                    activeQuiz.questions?.map((q, idx) => (
                      <div key={q.id} className="bg-background border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                        <div className="p-4 flex justify-between items-start border-b border-neutral-200 dark:border-neutral-800">
                          <div className="flex space-x-3">
                            <span className="font-bold text-primary">Q{idx + 1}.</span>
                            <p className="font-semibold">{q.question_text}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteQuestion(q.id)}
                            className="p-1.5 text-text/30 hover:text-warning hover:bg-warning/10 rounded-lg transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                          {q.options?.map(opt => (
                            <div key={opt.id} className={`flex items-center space-x-2 p-2 rounded-lg text-sm ${opt.is_correct ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-neutral-50 dark:bg-neutral-900 text-text/60 border border-neutral-200 dark:border-neutral-800'}`}>
                              {opt.is_correct ? <CheckCircle2 size={14} /> : <AlertCircle size={14} className="opacity-20" />}
                              <span className="truncate">{opt.option_text}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 bg-card border border-neutral-200 dark:border-neutral-800 rounded-3xl text-center">
              <div className="w-20 h-20 bg-primary/5 text-primary rounded-3xl flex items-center justify-center mb-6">
                <BookOpen size={40} />
              </div>
              <h2 className="text-xl font-bold mb-2">Select a Quiz to Manage</h2>
              <p className="text-text/50 max-w-xs">Pick an existing quiz from the sidebar or create a new one to begin adding questions.</p>
            </div>
          )}
        </div>
      </div>

      {/* Quiz Create Modal */}
      {showQuizModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">New Course Quiz</h3>
              <button onClick={() => setShowQuizModal(false)} className="text-text/40 hover:text-text transition"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-text/80">Quiz Title</label>
                <input
                  type="text"
                  value={quizForm.title}
                  onChange={e => setQuizForm({ ...quizForm, title: e.target.value })}
                  placeholder="e.g. Midterm Practice - SE"
                  className="w-full px-4 py-3 bg-background border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-text/80">Description</label>
                <textarea
                  value={quizForm.description}
                  onChange={e => setQuizForm({ ...quizForm, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-3 bg-background border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
            </div>
            <button
              onClick={handleCreateQuiz}
              className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl transition hover:bg-primary/90 shadow-md flex items-center justify-center space-x-2"
            >
              <Save size={18} />
              <span>Initialize Quiz</span>
            </button>
          </div>
        </div>
      )}

      {/* Question Add Modal */}
      {showQuestionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl w-full max-w-xl p-6 space-y-6 my-8 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Add MCQ Question</h3>
              <button onClick={() => setShowQuestionModal(false)} className="text-text/40 hover:text-text transition"><X size={20} /></button>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold mb-2 text-text/80 uppercase tracking-widest">The Question</label>
                <textarea
                  value={questionForm.question_text}
                  onChange={e => setQuestionForm({ ...questionForm, question_text: e.target.value })}
                  placeholder="e.g. Which keyword is used to define a class in Java?"
                  rows="3"
                  className="w-full px-4 py-3 bg-background border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                />
              </div>
              <div className="space-y-3">
                <label className="block text-[10px] font-bold text-text/80 uppercase tracking-widest">Options (Select the correct one)</label>
                {questionForm.options.map((opt, idx) => (
                  <div key={idx} className={`flex items-center space-x-3 p-1 rounded-2xl transition-all ${opt.is_correct ? 'bg-emerald-500/5' : ''}`}>
                    <label className={`w-10 h-10 flex items-center justify-center rounded-xl cursor-pointer transition-all font-bold text-sm ${opt.is_correct ? 'bg-emerald-500 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-text/40 hover:bg-neutral-200'}`}>
                      <input
                        type="radio"
                        name="correct-option"
                        className="hidden"
                        checked={opt.is_correct}
                        onChange={() => {
                          const newOpts = questionForm.options.map((o, i) => ({ ...o, is_correct: i === idx }));
                          setQuestionForm({ ...questionForm, options: newOpts });
                        }}
                      />
                      {opt.is_correct ? <CheckCircle2 size={18} /> : String.fromCharCode(65 + idx)}
                    </label>
                    <input
                      type="text"
                      value={opt.option_text}
                      onChange={e => {
                        const newOpts = [...questionForm.options];
                        newOpts[idx].option_text = e.target.value;
                        setQuestionForm({ ...questionForm, options: newOpts });
                      }}
                      placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                      className={`flex-1 px-4 py-3 bg-background border rounded-xl focus:outline-none focus:ring-2 transition-all ${opt.is_correct ? 'border-emerald-500/50 ring-2 ring-emerald-500/10' : 'border-neutral-200 dark:border-neutral-700 focus:ring-primary'}`}
                    />
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={handleAddQuestion}
              className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl transition hover:bg-primary/90 shadow-md flex items-center justify-center space-x-2"
            >
              <Save size={18} />
              <span>Save Question to Quiz</span>
            </button>
          </div>
        </div>
      )}

      {/* AI Magic Generate Modal */}
      {showAiModal && activeQuiz && (
        <AiGenerateModal
          quiz={activeQuiz}
          courseId={courseId}
          onClose={() => setShowAiModal(false)}
          onSuccess={() => loadQuizDetails(activeQuiz)}
        />
      )}

      {/* Import CSV Modal */}
      {showImportModal && activeQuiz && (
        <ImportCSVModal
          quiz={activeQuiz}
          onClose={() => setShowImportModal(false)}
          onSuccess={() => loadQuizDetails(activeQuiz)}
        />
      )}
    </div>
  );
};

export default QuizManager;
