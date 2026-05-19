import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import api from '../api/axios';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { 
  ArrowLeft, ZoomIn, ZoomOut, Sparkles, FileQuestion, HelpCircle, CheckSquare, 
  Plus, StickyNote, ChevronLeft, ChevronRight, CheckCircle2, Loader2, Maximize, 
  Download, Clock, Bookmark, BookmarkCheck, Trash2
} from 'lucide-react';
import Skeleton, { StudySkeleton } from '../components/Skeleton';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const StudyViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isNotesMode = searchParams.get('mode') === 'notes';
  const { user, triggerStreakUpdate, evaluateBadges } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const [material, setMaterial] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [numPages, setNumPages] = useState(null);
  const [zoom, setZoom] = useState(1); // 1 = 100%
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState('1');
  const [sidebarTab, setSidebarTab] = useState('notes');
  const [showSidebar, setShowSidebar] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [noteContent, setNoteContent] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [selectionPopup, setSelectionPopup] = useState({ visible: false, text: '', x: 0, y: 0 });
  
  // AI Feature States
  const [aiResponse, setAiResponse] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResponseMode, setAiResponseMode] = useState(null);

  // Bookmarks state
  const [bookmarks, setBookmarks] = useState([]);

  // Timer States
  const [studyTime, setStudyTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  
  const timerIntervalRef = useRef(null);

  // Timer tick
  useEffect(() => {
    if (isTimerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setStudyTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [isTimerRunning]);

  // Auto-log study session when component unmounts (SPA navigation)
  const studyTimeRef = useRef(0);
  const materialRef = useRef(null);
  useEffect(() => { studyTimeRef.current = studyTime; }, [studyTime]);
  useEffect(() => { materialRef.current = material; }, [material]);
  useEffect(() => {
    return () => {
      if (studyTimeRef.current >= 10 && materialRef.current) {
        api.post('/progress/session', {
          materialId: materialRef.current.id,
          durationSeconds: studyTimeRef.current
        }).catch(() => {});
      }
    };
  }, []);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs > 0 ? hrs + ':' : ''}${mins < 10 && hrs > 0 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };


  const quillRef = useRef(null);
  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'color', 'background'
  ];
  const quillModules = { toolbar: false };
  
  const lastPageRef = useRef(null);
  const streakFiredRef = useRef(false);

  // Map theme to PDF filter class (light = no filter)
  const pdfThemeClass = theme === 'light' ? '' : `pdf-theme-${theme}`;



  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        const res = await api.get(`/materials/${id}`);
        setMaterial(res.data);
        
        // Fetch quizzes for this course
        const quizRes = await api.get(`/quizzes/course/${res.data.course_id}`);
        setQuizzes(quizRes.data);
        
        // Also check if already completed
        const progressRes = await api.get(`/materials/course/${res.data.course_id}`);
        const currentMat = progressRes.data.find(m => m.id === parseInt(id));
        if (currentMat?.is_completed) setIsCompleted(true);
        
        // Fetch User Note for this material
        const noteRes = await api.get(`/notes/${id}`);
        setNoteContent(noteRes.data.content || '');

        // Fetch bookmarks
        const bkRes = await api.get(`/materials/${id}/bookmarks`);
        setBookmarks(bkRes.data);
        
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to load material', err);
        setIsLoading(false);
      }
    };
    fetchMaterial();
  }, [id]);

  const handleAiAction = async (type, text) => {
    if (!text) return;
    setSelectionPopup(p => ({ ...p, visible: false }));
    setAiResponse(''); // Initialize as empty string for streaming
    setAiResponseMode(type);
    setIsAiLoading(true);
    setSidebarTab('ai');
    if (!showSidebar) setShowSidebar(true);

    try {
      const endpoint = type === 'explain' ? '/ai/explain' : '/ai/summarize';
      
      // Use fetch for streaming support
      const response = await fetch(`http://localhost:5005/api${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Ensure token is passed
        },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'AI request failed');
      }

      // Check if it's a cached JSON response or an SSE stream
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        setAiResponse(data.result);
        setIsAiLoading(false);
        return;
      }

      // Handle Streaming (SSE)
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedResponse = '';
      setIsAiLoading(false); // Stop pulse once streaming starts

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (dataStr === '[DONE]') break;
            try {
              const data = JSON.parse(dataStr);
              if (data.chunk) {
                accumulatedResponse += data.chunk;
                setAiResponse(accumulatedResponse);
              }
            } catch (e) {
              console.error('Error parsing SSE chunk', e);
            }
          }
        }
      }
    } catch (err) {
      setAiResponse(`Error: ${err.message || 'Failed to contact AI Assistant.'}`);
      setIsAiLoading(false);
    }
  };

  const handleGeneratePracticeQuiz = async (difficulty = 'Medium') => {
    if (!material) return;
    setIsAiLoading(true);
    setAiResponseMode('quiz_gen');
    setAiResponse(null);
    setSidebarTab('ai');

    try {
      // Extract full PDF text via server-side endpoint (no page limit)
      let payloadContent = `Topic: ${material.title}. Context: Study material for this course chapter.`;
      try {
        const extractRes = await api.get(`/ai/extract-pdf/${material.id}`);
        if (extractRes.data.text && extractRes.data.text.trim().length > 50) {
          payloadContent = `Material Content: ${extractRes.data.text}`;
        }
      } catch (pdfErr) {
        console.error('Failed to extract PDF text via server, using title fallback', pdfErr);
      }

      const res = await api.post('/ai/generate-quiz', {
        courseId: material.course_id,
        content: payloadContent,
        difficulty,
        count: 5,
        title: `Practice: ${material.title} (${difficulty})`,
        isOfficial: false
      });
      setAiResponse(`✅ Successfully generated a ${difficulty} practice quiz with 5 questions based on the full chapter content! You can find it in the Quizzes tab or Course Assessments.`);
      // Refresh quizzes list
      const quizRes = await api.get(`/quizzes/course/${material.course_id}`);
      setQuizzes(quizRes.data);
    } catch (err) {
      setAiResponse('Failed to generate practice quiz. Please check AI service status.');
    } finally {
      setIsAiLoading(false);
    }
  };


  const handleAddBookmark = async () => {
    try {
      const res = await api.post(`/materials/${id}/bookmarks`, {
        page_number: currentPage,
        label: `Page ${currentPage}`
      });
      setBookmarks(prev => [...prev.filter(b => b.page_number !== currentPage), res.data]);
    } catch (e) { console.error(e); }
  };

  const handleDeleteBookmark = async (bookmarkId) => {
    try {
      await api.delete(`/materials/bookmarks/${bookmarkId}`);
      setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
    } catch (e) { console.error(e); }
  };

  // Keyboard navigation for PDF pages (arrow keys)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't hijack when user is typing in an input/textarea
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable) return;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        scrollToPage(currentPage + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        scrollToPage(currentPage - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, numPages]);

  // Scroll Tracking & Last Page Persistence
  // Global text selection listener for "Add to Notes" popup
  useEffect(() => {
    const handleMouseUp = (e) => {
      // Small delay so selection is finalized
      setTimeout(() => {
        const selection = window.getSelection();
        // Remove hard line breaks from PDF text selection so it doesn't wrap unnecessarily
        const text = selection?.toString().replace(/\s+/g, ' ').trim();
        if (text && text.length > 2) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          // Only trigger inside the PDF viewer area
          const pdfArea = document.querySelector('.pdf-viewer-area');
          if (pdfArea && pdfArea.contains(range.commonAncestorContainer)) {
            setSelectionPopup({
              visible: true,
              text,
              x: rect.left + rect.width / 2,
              y: rect.top - 20, // Adjusted for bubble arrow
            });
            return;
          }
        }
        // Don't hide if clicking the popup itself
        if (e.target.closest('.ai-selection-bubble')) return;
        setSelectionPopup(p => ({ ...p, visible: false }));
      }, 10);

    };
    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, []);

  useEffect(() => {
    const viewer = document.querySelector('.pdf-viewer-area');
    if (!viewer || !numPages) return;

    // 1. Initial Scroll to Last Read Page
    const savedPage = localStorage.getItem(`pdf_page_${id}`);
    if (savedPage) {
      setTimeout(() => {
        const pageElement = document.getElementById(`pdf-page-${savedPage}`);
        if (pageElement) {
          pageElement.scrollIntoView({ behavior: 'auto', block: 'start' });
        }
      }, 500); // Small delay to ensure react-pdf has rendered the target page
    }

    // 2. Track Visible Page on Scroll
    let timeoutId;
    const handleScroll = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const pages = viewer.querySelectorAll('.pdf-page-wrapper');
        let currentPage = 1;
        let minDistance = Infinity;

        pages.forEach((page, index) => {
          const rect = page.getBoundingClientRect();
          const distance = Math.abs(rect.top - 64); // 64 is the toolbar height approximately
          if (distance < minDistance) {
            minDistance = distance;
            currentPage = index + 1;
          }
        });

        localStorage.setItem(`pdf_page_${id}`, currentPage);
        setCurrentPage(currentPage);
        setPageInput(String(currentPage));
        
        // Continuous Percentage Tracking
        if (numPages && !isCompleted) {
            const percentage = Math.round((currentPage / numPages) * 100);
            const savedPct = parseInt(localStorage.getItem(`pdf_pct_${id}`) || '0');
            
            // Only update backend if going forward
            if (percentage > savedPct) {
                localStorage.setItem(`pdf_pct_${id}`, percentage);
                
                // Track streak safely
                if (!streakFiredRef.current) {
                   streakFiredRef.current = true;
                   triggerStreakUpdate();
                }
                
                api.post(`/progress/${id}`, { percentage }).then(() => {
                   if (percentage >= 100 && !isCompleted) {
                       setIsCompleted(true);
                       setTimeout(() => evaluateBadges(), 500);
                   }
                }).catch(console.error);
            }
        }
      }, 500); // Throttled to 500ms
    };

    viewer.addEventListener('scroll', handleScroll);
    
    // 3. Complete Progress Detection (Last Page)
    if (isCompleted) return;
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting) {
          try {
            await api.post(`/progress/${id}`, { percentage: 100 });
            localStorage.setItem(`pdf_pct_${id}`, '100');
            setIsCompleted(true);
            setTimeout(() => evaluateBadges(), 500);
          } catch (e) {
            console.error('Failed to sync progress', e);
          }
        }
      },
      { threshold: 0.1 }
    );

    if (lastPageRef.current) observer.observe(lastPageRef.current);
    
    return () => {
      viewer.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [numPages, id, isCompleted]);

  const scrollToPage = (page) => {
    if (!numPages) return;
    const target = Math.max(1, Math.min(numPages, page));
    const pageElement = document.getElementById(`pdf-page-${target}`);
    if (pageElement) {
      pageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setCurrentPage(target);
      setPageInput(String(target));
    }
  };

  const handlePageInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      const parsed = parseInt(pageInput);
      if (!isNaN(parsed)) scrollToPage(parsed);
    }
  };

  const handleFullscreen = () => {
    const container = document.getElementById('study-container');
    if (container) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        container.requestFullscreen();
      }
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    // Restore last read page indicator
    const savedPage = parseInt(localStorage.getItem(`pdf_page_${id}`) || '1');
    const restoredPage = Math.min(savedPage, numPages);
    setCurrentPage(restoredPage);
    setPageInput(String(restoredPage));
    // Force a progress ping to update last_accessed_at in DB
    const savedPct = parseInt(localStorage.getItem(`pdf_pct_${id}`) || '0');
    api.post(`/progress/${id}`, { percentage: savedPct }).catch(e => console.error(e));
  };

  const pdfUrl = material ? `http://localhost:5005${material.file_url}` : null;

  if (isLoading) return (
    <div className="h-full bg-background flex flex-col">
       <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex justify-between">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
       </div>
       <div className="flex-1 overflow-y-auto">
          <StudySkeleton />
       </div>
    </div>
  );

  return (
    <div
      id="study-container"
      className="flex flex-col h-full overflow-hidden animate-in fade-in duration-300 relative z-0"
      onClick={(e) => {
        // Dismiss popup if clicking outside the PDF text content
        if (!e.target.closest('.react-pdf__Page__textLayer')) {
          setSelectionPopup(p => ({ ...p, visible: false }));
        }
      }}
    >
      {/* Dynamic Background Mesh */}
      <div className="absolute inset-0 z-[-2] bg-background"></div>
      <div className="absolute inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-blue-500/5 pointer-events-none"></div>

      {/* MODERN AI SELECTION BUBBLE — fixed to viewport */}
      {selectionPopup.visible && (
        <div
          style={{ position: 'fixed', left: selectionPopup.x, top: selectionPopup.y - 12, transform: 'translate(-50%, -100%)', zIndex: 9999 }}
          className="animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center p-1.5 bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] space-x-1 ring-1 ring-black/5">
             {/* Explain */}
             <button
               onClick={() => handleAiAction('explain', selectionPopup.text)}
               className="flex flex-col items-center justify-center w-14 h-12 rounded-xl text-primary hover:bg-primary/10 transition-colors group"
               title="Explain Text"
             >
                <Sparkles size={16} className="mb-0.5 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-tight">Explain</span>
             </button>
             
             <div className="w-px h-6 bg-neutral-200 dark:bg-white/10 mx-1" />

             {/* Summarize */}
             <button
               onClick={() => handleAiAction('summarize', selectionPopup.text)}
               className="flex flex-col items-center justify-center w-18 h-12 px-2 rounded-xl text-emerald-500 hover:bg-emerald-500/10 transition-colors group"
               title="Summarize Text"
             >
                <HelpCircle size={16} className="mb-0.5 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-tight">Summary</span>
             </button>

             <div className="w-px h-6 bg-neutral-200 dark:bg-white/10 mx-1" />

             {/* Add to Notes */}
             <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  const append = `<br/>📎 <i>${selectionPopup.text}</i><br/>`;
                  const q = quillRef.current?.getEditor();
                  if (q) {
                    const len = q.getLength();
                    q.clipboard.dangerouslyPasteHTML(len - 1, append);
                    setNoteContent(q.root.innerHTML);
                  }
                  setSelectionPopup(p => ({ ...p, visible: false }));
                  setSidebarTab('notes');
                  if (!showSidebar) setShowSidebar(true);
                }}
                className="flex flex-col items-center justify-center w-14 h-12 rounded-xl text-amber-500 hover:bg-amber-500/10 transition-colors group"
                title="Add to Notes"
             >
                <Plus size={16} className="mb-0.5 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-tight">Note</span>
             </button>
          </div>
          {/* Caret arrow */}
          <div className="w-4 h-4 bg-card border-r border-b border-neutral-200 dark:border-white/10 rotate-45 mx-auto -mt-2 shadow-sm" />
        </div>
      )}

      {/* Study Header - Hidden in Focused Notes Mode */}
      {!isNotesMode && (
        <div className="flex items-center justify-between backdrop-blur-xl bg-white/60 dark:bg-black/40 border-b border-white/20 dark:border-white/10 px-4 py-3 z-20 shadow-sm">
          <div className="flex items-center space-x-3">
            <button onClick={() => navigate('/courses')} className="p-2 text-text/60 hover:text-primary hover:bg-primary/5 rounded-lg transition">
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center space-x-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="font-bold text-lg leading-tight truncate max-w-[150px] sm:max-w-[300px] md:max-w-none">{material?.title || 'Loading...'}</h2>
                  <a 
                    href={pdfUrl} 
                    download={`${material?.title || 'material'}.pdf`}
                    className="p-1.5 text-text/40 hover:text-primary hover:bg-primary/5 rounded-lg transition" 
                    title="Download Chapter"
                  >
                    <Download size={16} />
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                   <p className="text-[10px] text-text/50 uppercase tracking-widest font-bold">University Study Engine</p>
                   {isCompleted && (
                     <span className="flex items-center space-x-1 bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full text-[9px] font-bold border border-emerald-500/20">
                       <CheckCircle2 size={10} />
                       <span>Completed</span>
                     </span>
                   )}
                </div>
              </div>
              
              <div className="w-px h-8 bg-neutral-200 dark:bg-neutral-800 mx-2 hidden sm:block" />
              
              {/* Study Timer display - Click to start/pause */}
              <button 
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl border transition-all ${isTimerRunning ? 'bg-primary/10 border-primary text-primary' : 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-text/40 hover:text-text/60'}`}
                title={isTimerRunning ? "Pause Timer" : "Start Timer"}
              >
                <Clock size={14} className={isTimerRunning ? 'animate-pulse' : ''} />
                <span className="text-xs font-mono font-bold">{formatTime(studyTime)}</span>
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={handleFullscreen} className="p-2 text-text/60 hover:text-primary hover:bg-primary/5 rounded-lg transition" title="Slideshow Fullscreen">
              <Maximize size={18} />
            </button>
            <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-700 mx-1" />
            <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="p-2 text-text/60 hover:text-primary hover:bg-primary/5 rounded-lg transition" title="Zoom Out">
              <ZoomOut size={18} />
            </button>
            <span className="text-sm font-bold text-text/70 min-w-[3rem] text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="p-2 text-text/60 hover:text-primary hover:bg-primary/5 rounded-lg transition" title="Zoom In">
              <ZoomIn size={18} />
            </button>
            <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-700 mx-1" />
            <button 
              onClick={() => setShowSidebar(!showSidebar)} 
              className={`p-2 rounded-lg transition ${showSidebar ? 'bg-primary/10 text-primary' : 'text-text/60 hover:text-primary hover:bg-primary/5'}`}
              title={showSidebar ? "Collapse Sidebar" : "Expand Sidebar"}
            >
              {showSidebar ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* PDF Viewer Panel */}
        {!isNotesMode && (
          <div className={`pdf-viewer-area flex-1 overflow-y-auto relative ${showSidebar ? '' : 'w-full'}`}>

          {/* Floating Page Navigation Pill — fixed bottom center of viewport */}
          {numPages && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
              <div className="pointer-events-auto flex items-center space-x-1 px-3 py-2 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.18)] ring-1 ring-black/5">
                <button
                  onClick={() => scrollToPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="p-1.5 rounded-xl text-text/50 hover:text-primary hover:bg-primary/10 transition disabled:opacity-25 disabled:cursor-not-allowed"
                  title="Previous Page (← or ↑)"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="flex items-center space-x-1.5 px-2">
                  <input
                    type="text"
                    value={pageInput}
                    onChange={e => setPageInput(e.target.value)}
                    onKeyDown={handlePageInputKeyDown}
                    onBlur={() => { const p = parseInt(pageInput); if (!isNaN(p)) scrollToPage(p); else setPageInput(String(currentPage)); }}
                    className="w-9 text-center text-sm font-bold bg-transparent border-b-2 border-primary/40 focus:border-primary focus:outline-none transition-colors text-text"
                  />
                  <span className="text-xs text-text/50 font-semibold">/ {numPages}</span>
                </div>
                <button
                  onClick={() => scrollToPage(currentPage + 1)}
                  disabled={currentPage >= numPages}
                  className="p-1.5 rounded-xl text-text/50 hover:text-primary hover:bg-primary/10 transition disabled:opacity-25 disabled:cursor-not-allowed"
                  title="Next Page (→ or ↓)"
                >
                  <ChevronRight size={16} />
                </button>
                <div className="w-px h-4 bg-neutral-200 dark:bg-neutral-700 mx-0.5" />
                <button
                  onClick={handleAddBookmark}
                  disabled={bookmarks.some(b => b.page_number === currentPage)}
                  className={`p-1.5 rounded-xl transition ${bookmarks.some(b => b.page_number === currentPage) ? 'text-primary' : 'text-text/40 hover:text-primary hover:bg-primary/10'} disabled:cursor-default`}
                  title={bookmarks.some(b => b.page_number === currentPage) ? 'Page bookmarked' : 'Bookmark this page'}
                >
                  {bookmarks.some(b => b.page_number === currentPage) ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
                </button>
              </div>
            </div>
          )}
          {pdfUrl ? (
            <div className="flex flex-col items-center p-4">
              <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                  <div className="w-full flex justify-center py-10">
                    <StudySkeleton />
                  </div>
                }
              >
                {numPages && Array.from(new Array(numPages), (el, index) => (
                  <div 
                    key={`page_${index + 1}`} 
                    id={`pdf-page-${index + 1}`}
                    ref={index === numPages - 1 ? lastPageRef : null}
                    className={`pdf-page-wrapper mb-6 shadow-xl rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 ${pdfThemeClass}`}
                  >
                    <Page 
                      pageNumber={index + 1} 
                      scale={zoom} 
                      renderTextLayer={true}
                      renderAnnotationLayer={true}
                      className="bg-transparent"
                    />
                  </div>
                ))}
              </Document>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <FileQuestion size={28} />
                </div>
                <p className="text-text/50 font-medium">Loading document...</p>
              </div>
            </div>
          )}
        </div>
      )}

        {/* === FOCUSED NOTES MODE: Full-page dedicated layout === */}
        {isNotesMode && (
          <div className="flex-1 flex flex-col overflow-hidden p-6">
            {/* Header row */}
            <div className="flex items-center justify-between mb-4 shrink-0">
              <div className="flex items-center space-x-3">
                <button onClick={() => navigate('/notes')} className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg hover:bg-primary/10 hover:text-primary transition">
                  <ArrowLeft size={16} />
                </button>
                <div>
                  <p className="text-xs uppercase tracking-widest text-text/40 font-bold">Document Note</p>
                  <p className="text-sm font-bold text-text">{material?.title}</p>
                </div>
              </div>
              {savingNote && <span className="text-[10px] text-primary/60 font-medium animate-pulse bg-primary/5 px-3 py-1 rounded-full">Saving...</span>}
            </div>

            {/* Custom Toolbar */}
            <div className="flex flex-wrap gap-1.5 p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl mb-3 shrink-0">
              {/* Heading */}
              <select
                onChange={e => { const q = quillRef.current?.getEditor(); if (q) { const val = e.target.value; q.format('header', val ? parseInt(val) : false); } }}
                className="text-xs font-bold px-2 py-1.5 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 cursor-pointer hover:border-primary transition"
              >
                <option value="">Normal</option>
                <option value="1">Heading 1</option>
                <option value="2">Heading 2</option>
              </select>
              <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-700 self-center mx-1" />
              {/* Bold */}
              <button type="button" title="Bold" onClick={() => { const q = quillRef.current?.getEditor(); if (q) { const f = q.getFormat(); q.format('bold', !f.bold); }}} className="w-8 h-8 rounded-lg hover:bg-primary/10 hover:text-primary transition font-black text-sm flex items-center justify-center cursor-pointer">B</button>
              {/* Italic */}
              <button type="button" title="Italic" onClick={() => { const q = quillRef.current?.getEditor(); if (q) { const f = q.getFormat(); q.format('italic', !f.italic); }}} className="w-8 h-8 rounded-lg hover:bg-primary/10 hover:text-primary transition italic text-sm flex items-center justify-center cursor-pointer">I</button>
              {/* Underline */}
              <button type="button" title="Underline" onClick={() => { const q = quillRef.current?.getEditor(); if (q) { const f = q.getFormat(); q.format('underline', !f.underline); }}} className="w-8 h-8 rounded-lg hover:bg-primary/10 hover:text-primary transition underline text-sm flex items-center justify-center cursor-pointer">U</button>
              {/* Strikethrough */}
              <button type="button" title="Strikethrough" onClick={() => { const q = quillRef.current?.getEditor(); if (q) { const f = q.getFormat(); q.format('strike', !f.strike); }}} className="w-8 h-8 rounded-lg hover:bg-primary/10 hover:text-primary transition line-through text-sm flex items-center justify-center cursor-pointer">S</button>
              <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-700 self-center mx-1" />
              {/* Text Colors */}
              <span className="text-[10px] text-text/40 font-bold self-center">Color</span>
              {['#ef4444','#f97316','#eab308','#22c55e','#3b82f6','#8b5cf6','#111827'].map(color => (
                <button key={color} type="button" title={`Text: ${color}`} onClick={() => { const q = quillRef.current?.getEditor(); if (q) q.format('color', color); }} className="w-5 h-5 rounded-full border-2 border-white dark:border-neutral-700 hover:scale-125 transition-transform shadow cursor-pointer" style={{ backgroundColor: color }} />
              ))}
              <button type="button" title="Default color" onClick={() => { const q = quillRef.current?.getEditor(); if (q) q.format('color', false); }} className="w-5 h-5 rounded-full border-2 border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 hover:scale-125 transition-transform text-[9px] flex items-center justify-center cursor-pointer">✕</button>
              <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-700 self-center mx-1" />
              {/* Highlights */}
              <span className="text-[10px] text-text/40 font-bold self-center">HL</span>
              {['#fef08a','#bbf7d0','#bfdbfe','#fecaca','#e9d5ff','#fed7aa'].map(color => (
                <button key={color} type="button" title={`Highlight: ${color}`} onClick={() => { const q = quillRef.current?.getEditor(); if (q) q.format('background', color); }} className="w-5 h-5 rounded-full border-2 border-white dark:border-neutral-700 hover:scale-125 transition-transform shadow cursor-pointer" style={{ backgroundColor: color }} />
              ))}
              <button type="button" title="Remove highlight" onClick={() => { const q = quillRef.current?.getEditor(); if (q) q.format('background', false); }} className="w-5 h-5 rounded-full border-2 border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 hover:scale-125 transition-transform text-[9px] flex items-center justify-center cursor-pointer">✕</button>
              <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-700 self-center mx-1" />
              {/* Lists */}
              <button type="button" title="Bullet list" onClick={() => { const q = quillRef.current?.getEditor(); if (q) { const f = q.getFormat(); q.format('list', f.list === 'bullet' ? false : 'bullet'); }}} className="w-8 h-8 rounded-lg hover:bg-primary/10 hover:text-primary transition text-base flex items-center justify-center cursor-pointer">•</button>
              <button type="button" title="Numbered list" onClick={() => { const q = quillRef.current?.getEditor(); if (q) { const f = q.getFormat(); q.format('list', f.list === 'ordered' ? false : 'ordered'); }}} className="w-8 h-8 rounded-lg hover:bg-primary/10 hover:text-primary transition text-xs font-bold flex items-center justify-center cursor-pointer">1.</button>
              <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-700 self-center mx-1" />
              <button type="button" title="Clear formatting" onClick={() => { const q = quillRef.current?.getEditor(); if (q) { const range = q.getSelection(); if (range) q.removeFormat(range.index, range.length); }}} className="w-8 h-8 rounded-lg hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 transition text-xs font-bold flex items-center justify-center cursor-pointer">✕</button>
            </div>

            {/* Editor */}
            <div className="flex-1 overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-background">
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={noteContent}
                onChange={(content) => {
                  setNoteContent(content);
                  if (window.noteTimeout) clearTimeout(window.noteTimeout);
                  setSavingNote(true);
                  window.noteTimeout = setTimeout(async () => {
                    try { await api.post(`/notes/${id}`, { content }); setSavingNote(false); }
                    catch (e) { setSavingNote(false); }
                  }, 1000);
                }}
                modules={quillModules}
                formats={quillFormats}
                placeholder="Start your professional study notes here..."
                style={{ height: '100%' }}
              />
            </div>
          </div>
        )}

        {/* === NORMAL SIDEBAR MODE === */}
        {showSidebar && !isNotesMode && (
          <div className={`${isNotesMode ? 'flex-1' : 'w-80'} backdrop-blur-xl bg-white/60 dark:bg-black/40 ${isNotesMode ? '' : 'border-l border-white/20 dark:border-white/10 shadow-[-10px_0_30px_rgb(0,0,0,0.05)]'} flex flex-col shrink-0 hidden md:flex z-10`}>
            {/* Sidebar Tabs - Hidden in Notes Mode */}
            {!isNotesMode && (
              <div className="flex border-b border-neutral-200 dark:border-neutral-800">
                <button
                  onClick={() => setSidebarTab('notes')}
                  className={`flex-1 py-3 text-sm font-bold transition-colors flex items-center justify-center space-x-2 border-b-2 ${sidebarTab === 'notes' ? 'border-primary text-primary' : 'border-transparent text-text/50 hover:text-text'}`}
                >
                  <StickyNote size={16} />
                  <span>Notes</span>
                </button>
                <button
                  onClick={() => setSidebarTab('ai')}
                  className={`flex-1 py-3 text-sm font-bold transition-colors flex items-center justify-center space-x-2 border-b-2 ${sidebarTab === 'ai' ? 'border-primary text-primary' : 'border-transparent text-text/50 hover:text-text'}`}
                >
                  <Sparkles size={16} />
                  <span>AI Tools</span>
                </button>
                <button
                  onClick={() => setSidebarTab('quizzes')}
                  className={`flex-1 py-3 text-sm font-bold transition-colors flex items-center justify-center space-x-2 border-b-2 ${sidebarTab === 'quizzes' ? 'border-primary text-primary' : 'border-transparent text-text/50 hover:text-text'}`}
                >
                  <HelpCircle size={16} />
                  <span>Quizzes</span>
                </button>
                <button
                  onClick={() => setSidebarTab('bookmarks')}
                  className={`flex-1 py-3 text-sm font-bold transition-colors flex items-center justify-center space-x-2 border-b-2 ${sidebarTab === 'bookmarks' ? 'border-primary text-primary' : 'border-transparent text-text/50 hover:text-text'}`}
                >
                  <Bookmark size={16} />
                  <span>Marks</span>
                </button>
              </div>
            )}

            {/* Tab Content - Changed to overflow-visible for rich text dropdowns */}
            <div className={`flex-1 ${isNotesMode ? 'overflow-visible' : 'overflow-y-auto'} p-4`}>
              {sidebarTab === 'notes' ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                       {isNotesMode && (
                         <button onClick={() => navigate('/notes')} className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg hover:bg-neutral-200 transition">
                            <ArrowLeft size={16} />
                         </button>
                       )}
                       <p className="text-xs uppercase tracking-widest text-text/40 font-bold">
                         {isNotesMode ? `Document Note: ${material?.title}` : 'Your Notes'}
                       </p>
                    </div>
                    {savingNote && <span className="text-[10px] text-primary/60 font-medium animate-pulse">Saving...</span>}
                  </div>
                  
                  {/* Custom Toolbar - outside editor container to avoid clipping */}
                  <div id="quill-toolbar" className="flex flex-wrap gap-1 p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl mb-2">
                    {/* Heading Selector */}
                    <select
                      onChange={e => { const q = quillRef.current?.getEditor(); if (q) { const val = e.target.value; q.format('header', val ? parseInt(val) : false); } }}
                      className="text-xs font-bold px-2 py-1.5 rounded-lg bg-background border border-neutral-200 dark:border-neutral-700 cursor-pointer hover:border-primary transition"
                    >
                      <option value="">Normal</option>
                      <option value="1">Heading 1</option>
                      <option value="2">Heading 2</option>
                    </select>

                    <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-700 self-center" />

                    {/* Bold */}
                    <button type="button" title="Bold" onClick={() => { const q = quillRef.current?.getEditor(); if (q) { const f = q.getFormat(); q.format('bold', !f.bold); } }} className="p-1.5 rounded-lg hover:bg-primary/10 hover:text-primary transition font-black text-sm w-7 h-7 flex items-center justify-center">B</button>
                    {/* Italic */}
                    <button type="button" title="Italic" onClick={() => { const q = quillRef.current?.getEditor(); if (q) { const f = q.getFormat(); q.format('italic', !f.italic); } }} className="p-1.5 rounded-lg hover:bg-primary/10 hover:text-primary transition italic text-sm w-7 h-7 flex items-center justify-center">I</button>
                    {/* Underline */}
                    <button type="button" title="Underline" onClick={() => { const q = quillRef.current?.getEditor(); if (q) { const f = q.getFormat(); q.format('underline', !f.underline); } }} className="p-1.5 rounded-lg hover:bg-primary/10 hover:text-primary transition underline text-sm w-7 h-7 flex items-center justify-center">U</button>
                    {/* Strikethrough */}
                    <button type="button" title="Strikethrough" onClick={() => { const q = quillRef.current?.getEditor(); if (q) { const f = q.getFormat(); q.format('strike', !f.strike); } }} className="p-1.5 rounded-lg hover:bg-primary/10 hover:text-primary transition line-through text-sm w-7 h-7 flex items-center justify-center">S</button>

                    <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-700 self-center" />

                    {/* Text Color */}
                    <div className="flex items-center space-x-1">
                      <span className="text-[10px] text-text/40 font-bold">Color</span>
                      {['#ef4444','#f97316','#eab308','#22c55e','#3b82f6','#8b5cf6','#000000'].map(color => (
                        <button key={color} type="button" title={color} onClick={() => { const q = quillRef.current?.getEditor(); if (q) q.format('color', color); }} className="w-5 h-5 rounded-full border-2 border-white dark:border-neutral-700 hover:scale-125 transition-transform shadow-sm cursor-pointer" style={{ backgroundColor: color }} />
                      ))}
                      <button type="button" title="Default color" onClick={() => { const q = quillRef.current?.getEditor(); if (q) q.format('color', false); }} className="w-5 h-5 rounded-full border-2 border-neutral-300 bg-white hover:scale-125 transition-transform text-[8px] flex items-center justify-center cursor-pointer">✕</button>
                    </div>

                    <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-700 self-center" />

                    {/* Highlight */}
                    <div className="flex items-center space-x-1">
                      <span className="text-[10px] text-text/40 font-bold">HL</span>
                      {['#fef08a','#bbf7d0','#bfdbfe','#fecaca','#e9d5ff'].map(color => (
                        <button key={color} type="button" title={`Highlight ${color}`} onClick={() => { const q = quillRef.current?.getEditor(); if (q) q.format('background', color); }} className="w-5 h-5 rounded-full border-2 border-white dark:border-neutral-700 hover:scale-125 transition-transform shadow-sm cursor-pointer" style={{ backgroundColor: color }} />
                      ))}
                      <button type="button" title="Remove highlight" onClick={() => { const q = quillRef.current?.getEditor(); if (q) q.format('background', false); }} className="w-5 h-5 rounded-full border-2 border-neutral-300 bg-white hover:scale-125 transition-transform text-[8px] flex items-center justify-center cursor-pointer">✕</button>
                    </div>

                    <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-700 self-center" />

                    {/* Lists */}
                    <button type="button" title="Bullet list" onClick={() => { const q = quillRef.current?.getEditor(); if (q) { const f = q.getFormat(); q.format('list', f.list === 'bullet' ? false : 'bullet'); } }} className="p-1.5 rounded-lg hover:bg-primary/10 hover:text-primary transition text-sm w-7 h-7 flex items-center justify-center">•</button>
                    <button type="button" title="Numbered list" onClick={() => { const q = quillRef.current?.getEditor(); if (q) { const f = q.getFormat(); q.format('list', f.list === 'ordered' ? false : 'ordered'); } }} className="p-1.5 rounded-lg hover:bg-primary/10 hover:text-primary transition text-sm w-7 h-7 flex items-center justify-center">1.</button>

                    <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-700 self-center" />

                    {/* Clear Formatting */}
                    <button type="button" title="Clear formatting" onClick={() => { const q = quillRef.current?.getEditor(); if (q) { const range = q.getSelection(); if (range) q.removeFormat(range.index, range.length); } }} className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 transition text-xs font-bold w-7 h-7 flex items-center justify-center">✕</button>
                  </div>

                  {/* Quill Editor - no toolbar */}
                  <div className="bg-background border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden flex flex-col" style={{ minHeight: isNotesMode ? 'calc(100vh - 220px)' : '300px' }}>
                    <ReactQuill
                      ref={quillRef}
                      theme="snow"
                      value={noteContent}
                      onChange={(content) => {
                        setNoteContent(content);
                        if (window.noteTimeout) clearTimeout(window.noteTimeout);
                        setSavingNote(true);
                        window.noteTimeout = setTimeout(async () => {
                           try {
                             await api.post(`/notes/${id}`, { content });
                             setSavingNote(false);
                           } catch (e) {
                             setSavingNote(false);
                           }
                        }, 1000);
                      }}
                      modules={quillModules}
                      formats={quillFormats}
                      placeholder="Start your professional study notes here..."
                      style={{ flex: 1 }}
                    />
                  </div>
                  
                  {!isNotesMode && isCompleted && (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center space-x-3 text-emerald-600 animate-in slide-in-from-bottom-2 duration-300">
                        <CheckCircle2 size={24} />
                        <div>
                            <p className="font-bold text-sm">Chapter Completed!</p>
                            <p className="text-xs opacity-70">Your progress has been synced.</p>
                        </div>
                    </div>
                  )}
                </div>
              ) : sidebarTab === 'ai' ? (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-widest text-text/40 font-bold">AI Intelligence</p>
                    {aiResponse && (
                      <button 
                        onClick={() => { setAiResponse(null); setAiResponseMode(null); }}
                        className="text-[10px] font-bold text-primary hover:underline"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {isAiLoading ? (
                    <div className="space-y-3 p-4 bg-primary/5 rounded-2xl border border-primary/10 animate-pulse">
                      <div className="h-4 bg-primary/10 rounded w-3/4"></div>
                      <div className="h-4 bg-primary/10 rounded w-full"></div>
                      <div className="h-4 bg-primary/10 rounded w-5/6"></div>
                      <p className="text-[10px] text-center text-primary/40 font-bold mt-4 uppercase">AI is thinking...</p>
                    </div>
                  ) : aiResponse ? (
                    <div className="space-y-4">
                      <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-30 transition-opacity">
                          <Sparkles size={40} className="text-primary" />
                        </div>
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                          {aiResponseMode === 'explain' ? 'Concept Explanation' : aiResponseMode === 'summarize' ? 'Executive Summary' : 'AI Notification'}
                        </p>
                        <div className="text-sm leading-relaxed text-text/80 whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none">
                          {aiResponse}
                        </div>
                        
                        {(aiResponseMode === 'explain' || aiResponseMode === 'summarize') && (
                          <button 
                             onClick={() => {
                               const append = `<br/>🤖 <b>AI ${aiResponseMode}:</b><br/><i>${aiResponse}</i><br/>`;
                               const q = quillRef.current?.getEditor();
                               if (q) {
                                 const len = q.getLength();
                                 q.clipboard.dangerouslyPasteHTML(len - 1, append);
                                 setNoteContent(q.root.innerHTML);
                                 setSidebarTab('notes');
                               }
                             }}
                             className="mt-6 w-full flex items-center justify-center space-x-2 py-2.5 bg-primary text-white rounded-xl font-bold text-xs shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                          >
                             <Plus size={14} />
                             <span>Add AI Insights to Notes</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-5 bg-card border border-neutral-200 dark:border-neutral-800 rounded-2xl flex flex-col items-center text-center shadow-sm">
                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3">
                           <Sparkles size={24} />
                        </div>
                        <h4 className="font-bold text-sm mb-1">Your AI Copilot</h4>
                        <p className="text-xs text-text/50 leading-relaxed mb-4">Highlight any text in the viewer to instantly explain or summarize concepts.</p>
                      </div>

                      <div className="bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border border-emerald-500/20 rounded-2xl p-5">
                         <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4">Practice Engine</p>
                         <h4 className="font-bold text-sm mb-2">Struggling with this topic?</h4>
                         <p className="text-xs text-text/60 mb-4 leading-relaxed">Let AI build a custom set of practice questions just for you.</p>
                         
                         <div className="grid grid-cols-2 gap-2">
                           <button 
                             onClick={() => handleGeneratePracticeQuiz('Easy')}
                             className="flex flex-col items-center justify-center p-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:border-emerald-500/50 hover:bg-emerald-500/[0.02] transition"
                           >
                             <span className="text-[10px] font-black text-emerald-500">EASY</span>
                             <span className="text-xs font-bold">5 Questions</span>
                           </button>
                           <button 
                             onClick={() => handleGeneratePracticeQuiz('Medium')}
                             className="flex flex-col items-center justify-center p-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:border-emerald-500/50 hover:bg-emerald-500/[0.02] transition"
                           >
                             <span className="text-[10px] font-black text-amber-500">MEDIUM</span>
                             <span className="text-xs font-bold">5 Questions</span>
                           </button>
                         </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : sidebarTab === 'bookmarks' ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-widest text-text/40 font-bold">Bookmarks</p>
                    <button
                      onClick={handleAddBookmark}
                      disabled={bookmarks.some(b => b.page_number === currentPage)}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-bold hover:bg-primary/20 transition disabled:opacity-40"
                    >
                      <Bookmark size={12} />
                      <span>{bookmarks.some(b => b.page_number === currentPage) ? 'Bookmarked' : 'Bookmark Page'}</span>
                    </button>
                  </div>
                  {bookmarks.length === 0 ? (
                    <div className="py-8 text-center text-text/30">
                      <Bookmark size={32} className="mx-auto mb-2 opacity-20" />
                      <p className="text-sm">No bookmarks yet</p>
                      <p className="text-xs mt-1">Bookmark pages to return to them quickly</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {bookmarks.sort((a,b) => a.page_number - b.page_number).map(bk => (
                        <div key={bk.id} className="flex items-center justify-between p-3 bg-background rounded-xl border border-neutral-100 dark:border-neutral-800 group">
                          <button
                            onClick={() => scrollToPage(bk.page_number)}
                            className="flex items-center space-x-2 flex-1 text-left hover:text-primary transition-colors"
                          >
                            <BookmarkCheck size={14} className="text-primary shrink-0" />
                            <span className="text-sm font-medium">{bk.label || `Page ${bk.page_number}`}</span>
                          </button>
                          <button
                            onClick={() => handleDeleteBookmark(bk.id)}
                            className="p-1 text-text/20 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                   <p className="text-xs uppercase tracking-widest text-text/40 font-bold">Course Assessments</p>
                   
                   {user?.role === 'admin' && (
                      <button 
                         onClick={() => navigate(`/admin/quiz/${material?.course_id}`)}
                         className="w-full flex items-center space-x-3 px-4 py-3 bg-primary text-primary-foreground rounded-xl hover:shadow-lg transition group text-left"
                      >
                        <div className="p-2 bg-white/20 rounded-lg group-hover:scale-110 transition-transform">
                          <Plus size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-sm">Manage Quizzes</p>
                          <p className="text-[10px] opacity-70">Admin Access Control</p>
                        </div>
                      </button>
                   )}

                   {quizzes.length === 0 ? (
                      <div className="p-6 bg-background border border-neutral-200 dark:border-neutral-800 rounded-xl text-center">
                         <HelpCircle size={32} className="text-text/10 mx-auto mb-2" />
                         <p className="text-sm text-text/50 mb-1">No quizzes available for this course yet.</p>
                      </div>
                   ) : (
                      <div className="space-y-2">
                         {quizzes.map(quiz => (
                            <button 
                               key={quiz.id}
                               onClick={() => navigate(`/quiz/${quiz.id}`)}
                               className={`w-full flex items-center justify-between p-4 bg-background border rounded-xl hover:bg-primary/[0.02] transition group relative overflow-hidden ${quiz.is_official ? 'border-neutral-200 dark:border-neutral-800 hover:border-primary/50' : 'border-emerald-500/20 bg-emerald-500/[0.01] hover:border-emerald-500/50'}`}
                            >
                               <div className="flex items-center space-x-3">
                                  <div className={`p-2 rounded-lg group-hover:scale-110 transition-transform ${quiz.is_official ? 'bg-accent/10 text-accent' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                     {quiz.is_official ? <CheckSquare size={16} /> : <Sparkles size={16} />}
                                  </div>
                                  <div className="text-left">
                                     <p className="font-bold text-sm group-hover:text-primary transition-colors line-clamp-1">{quiz.title}</p>
                                     <div className="flex items-center space-x-2 mt-0.5">
                                        <span className={`text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded ${quiz.is_official ? 'bg-neutral-100 dark:bg-neutral-800 text-text/40' : 'bg-emerald-500 text-white'}`}>
                                          {quiz.is_official ? 'Course Official' : 'Personal Practice'}
                                        </span>
                                        {quiz.difficulty && <span className="text-[8px] font-bold text-text/30 uppercase">{quiz.difficulty}</span>}
                                     </div>
                                  </div>
                               </div>
                               <ChevronRight size={16} className="text-text/20 group-hover:text-primary transition-colors" />
                            </button>
                         ))}
                      </div>
                   )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyViewer;
