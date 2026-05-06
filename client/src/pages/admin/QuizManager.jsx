import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { 
  BookOpen, Plus, Trash2, ChevronLeft, Save, 
  HelpCircle, CheckCircle2, MessageSquare, AlertCircle, X,
  Pencil
} from 'lucide-react';

const QuizManager = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  
  // Modals / Editors
  const [activeQuiz, setActiveQuiz] = useState(null); // The quiz being edited (with questions)
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizForm, setQuizForm] = useState({ title: '', description: '' });
  const [showQuestionModal, setShowQuestionModal] = useState(false);
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
      const cRes = await api.get(`/courses`); // We might need a single course getter if available
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
    // Validation: at least one correct answer
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

  const handleAiMagicGenerate = async () => {
    if (!activeQuiz) return;
    
    // We need to know which material/content to generate from. 
    const content = window.prompt("Paste the chapter text or material content for AI to analyze and generate 5 questions:");
    if (!content) return;

    setIsAiGenerating(true);
    try {
      await api.post('/ai/generate-quiz', {
        courseId,
        content,
        difficulty: 'Medium',
        count: 5,
        title: activeQuiz.title,
        isOfficial: true // Admin generates official quizzes
      });
      alert('AI Magic complete! 5 official questions have been added to this quiz.');
      loadQuizDetails(activeQuiz);
    } catch (err) {
      console.error(err);
      alert('AI Generation failed. Check server logs or API Key.');
    } finally {
      setIsAiGenerating(false);
    }
  };


  if (loading) return <div className="p-8 text-center"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />Loading Quiz Manager...</div>;

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
                   <HelpCircle size={12}/>
                   <span>Managed via DB Engine</span>
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
                      onClick={handleAiMagicGenerate}
                      disabled={isAiGenerating}
                      className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold transition shadow-sm ${isAiGenerating ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}
                    >
                      <Sparkles size={18} className={isAiGenerating ? 'animate-spin' : ''} />
                      <span>{isAiGenerating ? 'Generating...' : 'AI Magic Generate'}</span>
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
              <button onClick={() => setShowQuizModal(false)} className="text-text/40 hover:text-text transition"><X size={20}/></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-text/80">Quiz Title</label>
                <input 
                  type="text" 
                  value={quizForm.title} 
                  onChange={e => setQuizForm({...quizForm, title: e.target.value})}
                  placeholder="e.g. Midterm Practice - SE"
                  className="w-full px-4 py-3 bg-background border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-text/80">Description</label>
                <textarea 
                  value={quizForm.description} 
                  onChange={e => setQuizForm({...quizForm, description: e.target.value})}
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
              <button onClick={() => setShowQuestionModal(false)} className="text-text/40 hover:text-text transition"><X size={20}/></button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-text/80 uppercase tracking-widest text-[10px]">The Question</label>
                <textarea 
                  value={questionForm.question_text}
                  onChange={e => setQuestionForm({...questionForm, question_text: e.target.value})}
                  placeholder="e.g. Which keyword is used to define a class in Java?"
                  rows="3"
                  className="w-full px-4 py-3 bg-background border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-text/80 uppercase tracking-widest text-[10px]">Options (Select the correct one)</label>
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
    </div>
  );
};

export default QuizManager;
