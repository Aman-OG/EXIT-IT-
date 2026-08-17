import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api, { SERVER_URL, API_BASE_URL } from '../api/axios';
import { 
  BookOpen, FileText, Upload, X, FolderOpen, Plus, Pencil, Trash2, 
  CheckCircle2, AlertCircle, HelpCircle, Sparkles, ChevronDown, Download, 
  GripVertical, PlayCircle, CheckSquare 
} from 'lucide-react';
import { CourseSkeleton } from '../components/Skeleton';
import VideoPanel from '../components/VideoPanel';

const YoutubeIcon = ({ size = 16, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const Courses = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [materials, setMaterials] = useState({});
  const [contentType, setContentType] = useState(() => {
    const saved = localStorage.getItem('courses_content_type');
    return saved || 'pdf';
  }); // 'pdf' | 'video' | 'quiz'
  const [expandedCourse, setExpandedCourse] = useState(() => {
    const saved = localStorage.getItem('expanded_course_id');
    return saved ? parseInt(saved) : null;
  });
  const [uploading, setUploading] = useState(false);
  const [uploadModal, setUploadModal] = useState(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  
  // Admin & Edit States
  const [courseModal, setCourseModal] = useState(null); // { mode: 'add'|'edit', data?: course }
  const [editMaterial, setEditMaterial] = useState(null); // material object
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { type: 'course'|'material', id, title }
  const [courseForm, setCourseForm] = useState({ title: '', code: '', description: '' });
  const [isLoading, setIsLoading] = useState(true);

  // Drag-and-drop state (admin only)
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const courseRefs = useRef({});

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/courses');
        setCourses(res.data);
        
        // If a course is auto-expanded from localStorage, fetch its materials
        if (expandedCourse) {
          fetchMaterials(expandedCourse);
        }
      } catch (err) {
        console.error('Failed to load courses', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const fetchMaterials = async (courseId) => {
    try {
      const res = await api.get(`/materials/course/${courseId}`);
      setMaterials(prev => ({ ...prev, [courseId]: res.data }));
    } catch (err) {
      console.error('Failed to load materials', err);
    }
  };

  const toggleCourse = (courseId) => {
    if (expandedCourse === courseId) {
      setExpandedCourse(null);
      localStorage.removeItem('expanded_course_id');
    } else {
      setExpandedCourse(courseId);
      localStorage.setItem('expanded_course_id', courseId);
      if (!materials[courseId]) {
        fetchMaterials(courseId);
      }
      // Smoothly scroll the expanded course to the top of the screen/container
      setTimeout(() => {
        const el = courseRefs.current[courseId];
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 60);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile || !uploadTitle) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('course_id', uploadModal);
    formData.append('title', uploadTitle);
    try {
      await api.post('/materials/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadModal(null);
      setUploadTitle('');
      setUploadFile(null);
      fetchMaterials(uploadModal);
    } catch (e) {
      alert('Upload failed. Make sure you are an Admin.');
    }
    setUploading(false);
  };

  const handleCourseSubmit = async () => {
    try {
      if (courseModal.mode === 'add') {
        await api.post('/courses', courseForm);
      } else {
        await api.put(`/courses/${courseModal.data.id}`, courseForm);
      }
      setCourseModal(null);
      setCourseForm({ title: '', code: '', description: '' });
      const res = await api.get('/courses');
      setCourses(res.data);
    } catch (e) {
      alert('Failed to save course');
    }
  };

  const handleMaterialUpdate = async () => {
    try {
      await api.put(`/materials/${editMaterial.id}`, { title: uploadTitle });
      setEditMaterial(null);
      setUploadTitle('');
      fetchMaterials(expandedCourse);
    } catch (e) {
      alert('Failed to update material');
    }
  };

  const confirmDelete = async () => {
    try {
      if (deleteConfirm.type === 'course') {
        await api.delete(`/courses/${deleteConfirm.id}`);
        const res = await api.get('/courses');
        setCourses(res.data);
        if (expandedCourse === deleteConfirm.id) setExpandedCourse(null);
      } else {
        await api.delete(`/materials/${deleteConfirm.id}`);
        fetchMaterials(expandedCourse);
      }
      setDeleteConfirm(null);
    } catch (e) {
      alert('Delete failed');
    }
  };

  // Drag-and-drop handlers for chapter reordering (admin only)
  const handleDragStart = (e, courseId, index) => {
    dragItem.current = { courseId, index };
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnter = (e, courseId, index) => {
    dragOverItem.current = { courseId, index };
    e.preventDefault();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, courseId) => {
    e.preventDefault();
    if (
      dragItem.current === null ||
      dragOverItem.current === null ||
      dragItem.current.index === dragOverItem.current.index
    ) return;

    const courseIdKey = courseId;
    const items = [...(materials[courseIdKey] || [])];
    const fromIndex = dragItem.current.index;
    const toIndex = dragOverItem.current.index;

    // Reorder locally for instant feedback
    const [moved] = items.splice(fromIndex, 1);
    items.splice(toIndex, 0, moved);

    setMaterials(prev => ({ ...prev, [courseIdKey]: items }));

    dragItem.current = null;
    dragOverItem.current = null;

    // Persist to server
    try {
      await api.patch('/materials/reorder', { orderedIds: items.map(m => m.id) });
    } catch (e) {
      console.error('Failed to save order', e);
      // Revert on failure
      fetchMaterials(courseIdKey);
    }
  };

  const handleDragEnd = () => {
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const courseColors = [
    'from-blue-500/10 to-blue-600/5 border-blue-200 dark:border-blue-800',
    'from-emerald-500/10 to-emerald-600/5 border-emerald-200 dark:border-emerald-800',
    'from-violet-500/10 to-violet-600/5 border-violet-200 dark:border-violet-800',
    'from-amber-500/10 to-amber-600/5 border-amber-200 dark:border-amber-800',
    'from-rose-500/10 to-rose-600/5 border-rose-200 dark:border-rose-800',
    'from-cyan-500/10 to-cyan-600/5 border-cyan-200 dark:border-cyan-800',
  ];
  const iconColors = ['text-blue-500', 'text-emerald-500', 'text-violet-500', 'text-amber-500', 'text-rose-500', 'text-cyan-500'];

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 space-y-8 animate-in fade-in duration-500">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Your Courses</h1>
          <p className="text-text/70">Select a course to study materials, watch tutorials, or take quizzes.</p>
        </div>

        {/* Middle Tab Switcher (PDFs vs Videos vs Quizzes) */}
        <div className="flex items-center bg-neutral-100 dark:bg-neutral-800/60 p-1.5 rounded-2xl border border-neutral-200 dark:border-neutral-700/50 self-start md:self-auto shadow-sm">
          <button
            onClick={() => { setContentType('pdf'); localStorage.setItem('courses_content_type', 'pdf'); }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              contentType === 'pdf'
                ? 'bg-card text-primary shadow-sm border border-neutral-200/50 dark:border-neutral-700'
                : 'text-text/60 hover:text-text'
            }`}
          >
            <FileText size={16} className="text-red-500" />
            <span>PDFs</span>
          </button>
          
          <button
            onClick={() => { setContentType('video'); localStorage.setItem('courses_content_type', 'video'); }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              contentType === 'video'
                ? 'bg-card text-primary shadow-sm border border-neutral-200/50 dark:border-neutral-700'
                : 'text-text/60 hover:text-text'
            }`}
          >
            <YoutubeIcon size={16} className="text-red-600" />
            <span>Videos</span>
          </button>

          <button
            onClick={() => { setContentType('quiz'); localStorage.setItem('courses_content_type', 'quiz'); }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              contentType === 'quiz'
                ? 'bg-card text-primary shadow-sm border border-neutral-200/50 dark:border-neutral-700'
                : 'text-text/60 hover:text-text'
            }`}
          >
            <CheckSquare size={16} className="text-accent" />
            <span>Quizzes</span>
          </button>
        </div>

        {user?.role === 'admin' && (
          <button 
            onClick={() => { setCourseForm({ title: '', code: '', description: '' }); setCourseModal({ mode: 'add' }); }}
            className="flex items-center space-x-2 bg-primary text-primary-foreground px-5 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            <Plus size={20} />
            <span>Create New Course</span>
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => <CourseSkeleton key={i} />)}
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-card rounded-2xl border border-neutral-200 dark:border-neutral-800 p-16 text-center">
          <FolderOpen size={48} className="mx-auto text-text/30 mb-4" />
          <p className="text-text/60 text-lg">No courses available yet.</p>
          {user?.role === 'admin' && <p className="text-text/40 text-sm mt-2">Add courses via the database to get started.</p>}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {courses.map((course, idx) => {
            const isExpanded = expandedCourse === course.id;
            return (
              <div 
                key={course.id} 
                ref={el => courseRefs.current[course.id] = el}
                className={`scroll-mt-4 rounded-2xl overflow-hidden border transition-all duration-300 ${
                  isExpanded
                    ? 'border-primary/50 dark:border-primary/50 shadow-xl ring-2 ring-primary/20 -translate-y-0.5'
                    : 'border-neutral-200 dark:border-neutral-800 shadow-sm hover:border-neutral-300 dark:hover:border-neutral-700'
                }`}
              >
                {/* Course Header */}
                <div
                  onClick={() => toggleCourse(course.id)}
                  className={`w-full text-left p-4 sm:p-6 bg-gradient-to-r ${courseColors[idx % courseColors.length]} flex items-start sm:items-center justify-between gap-3 sm:gap-4 group hover:shadow-md transition-all cursor-pointer overflow-hidden`}
                >
                  <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                    <div className={`p-2.5 sm:p-3 rounded-xl bg-card/80 shadow-sm shrink-0 transition-transform duration-300 ${isExpanded ? 'scale-105 sm:scale-110' : ''} ${iconColors[idx % iconColors.length]}`}>
                      {contentType === 'video' ? (
                        <YoutubeIcon size={22} className="text-red-600 sm:w-6 sm:h-6" />
                      ) : contentType === 'quiz' ? (
                        <CheckSquare size={22} className="text-accent sm:w-6 sm:h-6" />
                      ) : (
                        <BookOpen size={22} strokeWidth={2.5} className="sm:w-6 sm:h-6" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                        <h2 className="text-base sm:text-xl font-bold text-text break-words">
                          {course.title}
                        </h2>
                        <div className="flex items-center gap-1 shrink-0 ml-auto sm:ml-0">
                          <button 
                            onClick={(e) => { e.stopPropagation(); window.open(`${API_BASE_URL}/materials/download-course/${course.id}`, '_blank'); }} 
                            className="p-1.5 text-text/40 hover:text-primary transition rounded-lg hover:bg-primary/10 opacity-70 sm:opacity-0 sm:group-hover:opacity-100 shrink-0"
                            title="Download Course (ZIP)"
                          >
                            <Download size={14} />
                          </button>
                          {user?.role === 'admin' && (
                             <div className="flex items-center space-x-0.5 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
                                <button onClick={(e) => { e.stopPropagation(); setCourseForm({title: course.title, code: course.code, description: course.description}); setCourseModal({mode: 'edit', data: course}); }} className="p-1.5 text-text/40 hover:text-primary transition rounded-lg hover:bg-primary/10">
                                   <Pencil size={14} />
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); setDeleteConfirm({ type: 'course', id: course.id, title: course.title }); }} className="p-1.5 text-text/40 hover:text-warning transition rounded-lg hover:bg-warning/10">
                                   <Trash2 size={14} />
                                </button>
                             </div>
                          )}
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-text/60 font-medium break-words leading-relaxed">{course.code} • {course.description || 'University Course'}</p>
                      
                      {/* Progress Bar */}
                      <div className="mt-2.5 w-full max-w-[220px] sm:max-w-xs">
                          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider mb-1">
                             <span className="text-text/40">Progress</span>
                             <span className="text-primary font-mono">{Math.round((course.completed_materials / (course.total_materials || 1)) * 100)}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-background rounded-full overflow-hidden border border-neutral-100 dark:border-neutral-800">
                             <div 
                                className="h-full bg-primary transition-all duration-1000 ease-out" 
                                style={{ width: `${(course.completed_materials / (course.total_materials || 1)) * 100}%` }}
                             />
                          </div>
                      </div>
                    </div>
                  </div>
                  <div className={`p-1 text-text/40 shrink-0 self-start sm:self-center transition-transform duration-300 ${isExpanded ? 'rotate-180 text-primary' : ''}`}>
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>
                  </div>
                </div>

              {/* Expanded Content View */}
              {expandedCourse === course.id && (
                <div className={`p-4 sm:p-6 border-t border-neutral-200 dark:border-neutral-800 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 bg-gradient-to-r ${courseColors[idx % courseColors.length]} overflow-hidden`}>
                  
                  {/* ================= MODE 1: PDF TAB ================= */}
                  {contentType === 'pdf' && (
                    <>

                      {user?.role === 'admin' && (
                        <div className="flex items-center gap-3 mb-3">
                          <button
                            onClick={() => setUploadModal(course.id)}
                            className="flex items-center space-x-2 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-semibold text-sm hover:bg-primary/20 transition"
                          >
                            <Upload size={16} />
                            <span>Upload Material</span>
                          </button>
                          {materials[course.id]?.length > 1 && (
                            <span className="flex items-center space-x-1.5 text-[11px] text-text/40 font-medium">
                              <GripVertical size={13} />
                              <span>Drag cards to reorder chapters</span>
                            </span>
                          )}
                        </div>
                      )}

                      {(!materials[course.id] || materials[course.id].length === 0) ? (
                        <p className="text-text/50 text-center py-6">No materials uploaded for this course yet.</p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-2">
                          {materials[course.id].map((mat, matIdx) => (
                            <div
                              key={mat.id}
                              draggable={user?.role === 'admin'}
                              onDragStart={user?.role === 'admin' ? (e) => handleDragStart(e, course.id, matIdx) : undefined}
                              onDragEnter={user?.role === 'admin' ? (e) => handleDragEnter(e, course.id, matIdx) : undefined}
                              onDragOver={user?.role === 'admin' ? handleDragOver : undefined}
                              onDrop={user?.role === 'admin' ? (e) => handleDrop(e, course.id) : undefined}
                              onDragEnd={user?.role === 'admin' ? handleDragEnd : undefined}
                              className={`relative group ${user?.role === 'admin' ? '' : ''}`}
                            >
                              <button
                                onClick={() => navigate(`/study/${mat.id}`)}
                                className="w-full bg-background rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 flex flex-col items-center text-center hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
                              >
                                {/* Drag handle — admin only */}
                                {user?.role === 'admin' && (
                                  <div
                                    className="absolute top-2 left-2 p-1.5 rounded-lg text-text/30 opacity-0 group-hover:opacity-100 group-hover:text-primary group-hover:bg-primary/10 hover:scale-110 transition-all duration-200 cursor-grab active:cursor-grabbing"
                                    title="Drag to reorder"
                                  >
                                    <GripVertical size={20} strokeWidth={2} />
                                  </div>
                                )}

                                <div className="absolute top-0 right-0 p-2 flex space-x-1">
                                   {user?.role === 'admin' && (
                                     <>
                                       <div onClick={(e) => { e.stopPropagation(); setEditMaterial(mat); setUploadTitle(mat.title); }} className="bg-card/80 backdrop-blur-sm text-text/40 hover:text-primary p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition shadow-sm border border-neutral-200 dark:border-neutral-800">
                                         <Pencil size={12}/>
                                       </div>
                                       <div onClick={(e) => { e.stopPropagation(); setDeleteConfirm({ type: 'material', id: mat.id, title: mat.title }); }} className="bg-card/80 backdrop-blur-sm text-text/40 hover:text-warning p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition shadow-sm border border-neutral-200 dark:border-neutral-800">
                                         <Trash2 size={12}/>
                                       </div>
                                     </>
                                   )}
                                   <a 
                                     href={`${SERVER_URL}${mat.file_url}`} 
                                     download={`${mat.title}.pdf`}
                                     onClick={(e) => e.stopPropagation()}
                                     className="bg-card/80 backdrop-blur-sm text-text/40 hover:text-primary p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition shadow-sm border border-neutral-200 dark:border-neutral-800"
                                     title="Download PDF"
                                   >
                                      <Download size={12} />
                                   </a>
                                   {mat.is_completed && (
                                     <div className="bg-emerald-500 text-white p-1 rounded-lg shadow-md scale-110">
                                        <CheckCircle2 size={12} strokeWidth={3} />
                                     </div>
                                   )}
                                   {!mat.is_completed && (
                                      <div className="bg-primary/10 text-primary p-1 rounded-lg opacity-0 group-hover:opacity-100 transition">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                                      </div>
                                   )}
                                </div>
                                
                                <div className="w-16 h-16 bg-primary/5 text-primary rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500">
                                  <FileText size={32} strokeWidth={1.5} />
                                </div>
                                
                                <h3 className="font-bold text-sm mb-1 break-words flex items-center justify-center text-center group-hover:text-primary transition-colors leading-tight min-h-[2.5rem]">
                                  {mat.title}
                                </h3>
                                
                                <div className="w-full h-px bg-neutral-100 dark:bg-neutral-800 my-4" />
                                
                                <div className="flex items-center justify-between w-full mt-auto">
                                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary/60 bg-primary/5 px-2 py-0.5 rounded-md">{mat.type}</span>
                                  <span className="text-[10px] font-medium text-text/40">{new Date(mat.created_at).toLocaleDateString()}</span>
                                </div>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {/* ================= MODE 2: VIDEOS TAB ================= */}
                  {contentType === 'video' && (
                    <div className="space-y-4">
                      {(!materials[course.id] || materials[course.id].length === 0) ? (
                        <p className="text-text/50 text-center py-6">No video materials available for this course yet.</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {materials[course.id].map((mat) => (
                            <div key={mat.id} className="bg-background border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-sm">
                              <div className="flex items-center space-x-2 mb-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
                                <FileText size={16} className="text-primary shrink-0" />
                                <h4 className="font-bold text-sm text-text break-words leading-snug">{mat.title}</h4>
                              </div>
                              <VideoPanel materialId={mat.id} materialTitle={mat.title} defaultExpanded={true} />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ================= MODE 3: QUIZZES TAB ================= */}
                  {contentType === 'quiz' && (
                    <div className="space-y-4">
                      <QuizSection courseId={course.id} navigate={navigate} user={user} />
                    </div>
                  )}

                </div>
              )}
            </div>
          );
        })}
        </div>
      )}

      {/* Material Upload Modal */}
      {uploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Upload Study Material</h3>
              <button onClick={() => setUploadModal(null)} className="text-text/40 hover:text-text transition"><X size={20}/></button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-text/80">Document Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Lecture Notes - Week 1"
                  value={uploadTitle} 
                  onChange={e => setUploadTitle(e.target.value)} 
                  className="w-full px-4 py-3 bg-background border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition" 
                />
              </div>

              <div className="relative group/file">
                <label className="block text-sm font-semibold mb-1.5 text-text/80">PDF Document</label>
                <div className="relative">
                  <input 
                    type="file" 
                    accept=".pdf"
                    onChange={e => setUploadFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  />
                  <div className="border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 text-center group-hover/file:border-primary/50 transition-colors bg-background/50">
                    <Upload className="mx-auto text-text/30 mb-3 group-hover/file:scale-110 transition-transform" size={32} />
                    <p className="text-sm font-medium text-text/70">
                      {uploadFile ? <span className="text-primary font-bold">{uploadFile.name}</span> : "Click or drag your PDF here"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={handleUpload} 
              disabled={uploading || !uploadFile || !uploadTitle}
              className="w-full bg-primary disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-bold py-4 rounded-xl transition hover:bg-primary/90 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
            >
              {uploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                   <Upload size={18} />
                   <span>Start Uploading</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Course CRUD Modal */}
      {courseModal && (
        <CourseModal 
          modal={courseModal} 
          form={courseForm} 
          setForm={setCourseForm} 
          onClose={() => setCourseModal(null)} 
          onSubmit={handleCourseSubmit} 
        />
      )}

      {/* Material Edit Modal (reusing upload logic for title edit) */}
      {editMaterial && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">Edit Material Title</h3>
              <button onClick={() => setEditMaterial(null)} className="text-text/40 hover:text-text transition"><X size={20}/></button>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-text/80">Document Title</label>
              <input type="text" value={uploadTitle} onChange={e => setUploadTitle(e.target.value)} className="w-full px-4 py-3 bg-background border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <button onClick={handleMaterialUpdate} className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl transition hover:bg-primary/90">
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <DeleteModal 
          data={deleteConfirm} 
          onClose={() => setDeleteConfirm(null)} 
          onConfirm={confirmDelete} 
        />
      )}
    </div>
  );
};

// Course Modal component
const CourseModal = ({ modal, form, setForm, onClose, onSubmit }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4 animate-in zoom-in-95 duration-200">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">{modal.mode === 'add' ? 'Create New Course' : 'Edit Course'}</h3>
        <button onClick={onClose} className="text-text/40 hover:text-text transition"><X size={20}/></button>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1.5 text-text/80">Course Title</label>
          <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Software Engineering" className="w-full px-4 py-3 bg-background border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5 text-text/80">Course Code</label>
          <input type="text" value={form.code} onChange={e => setForm({...form, code: e.target.value})} placeholder="e.g. SE401" className="w-full px-4 py-3 bg-background border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5 text-text/80">Description</label>
          <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Brief overview of the subject..." rows="3" className="w-full px-4 py-3 bg-background border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
        </div>
      </div>
      <button onClick={onSubmit} className="w-full bg-primary text-primary-foreground font-bold py-3.5 rounded-xl transition hover:bg-primary/90 shadow-md">
        {modal.mode === 'add' ? 'Create Course' : 'Save Changes'}
      </button>
    </div>
  </div>
);

// Delete Confirmation component
const DeleteModal = ({ data, onClose, onConfirm }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-6 text-center animate-in zoom-in-95 duration-200">
      <div className="w-16 h-16 bg-warning/10 text-warning rounded-full flex items-center justify-center mx-auto">
        <AlertCircle size={32} />
      </div>
      <div>
        <h3 className="text-xl font-bold mb-2 text-text">Are you sure?</h3>
        <p className="text-text/60 text-sm">
          You are about to delete <span className="font-bold text-text">"{data.title}"</span>. This action cannot be undone.
        </p>
      </div>
      <div className="flex space-x-3">
        <button onClick={onClose} className="flex-1 px-4 py-3 bg-neutral-100 dark:bg-neutral-800 text-text/70 font-bold rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-700 transition">Cancel</button>
        <button onClick={onConfirm} className="flex-1 px-4 py-3 bg-warning text-warning-foreground font-bold rounded-xl hover:bg-warning/90 transition shadow-sm">Delete</button>
      </div>
    </div>
  </div>
);

// Full Quizzes Tab Section
const QuizSection = ({ courseId, navigate, user }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/quizzes/course/${courseId}`);
      setQuizzes(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [courseId]);

  const deleteQuiz = async (quizId, title) => {
    if(window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await api.delete(`/quizzes/${quizId}`);
        fetchQuizzes();
      } catch (e) {
        alert('Failed to delete quiz');
      }
    }
  };

  if (loading) return (
    <div className="flex justify-center py-8">
      <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );

  const officialQuizzes = quizzes.filter(q => q.is_official);
  const aiQuizzes = quizzes.filter(q => !q.is_official);

  return (
    <div className="space-y-4 sm:space-y-6 bg-background/50 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-3.5 sm:p-5 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base flex items-center gap-2">
            <CheckSquare size={18} className="text-accent" />
            <span>Course Quizzes & Assessments</span>
          </h3>
          <p className="text-xs text-text/50">Test your knowledge across official exams and AI-generated practice sets.</p>
        </div>
      </div>

      {quizzes.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl">
          <HelpCircle size={32} className="mx-auto text-text/20 mb-2" />
          <p className="text-sm font-semibold text-text/50">No quizzes available for this course yet</p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Official Quizzes */}
          {officialQuizzes.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-text/50">Official Course Quizzes</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {officialQuizzes.map(q => {
                  const cleanedDesc = q.description ? q.description.replace(/:\s*#\d+\s*-\s*#\d+/g, '').replace(/#\d+\s*-\s*#\d+/g, '').trim() : 'Practice quiz for this course';
                  return (
                    <div
                      key={q.id}
                      onClick={() => navigate(`/quiz/${q.id}`, { state: { from: '/courses', courseId } })}
                      className="bg-card border border-neutral-200 dark:border-neutral-800 hover:border-accent/50 p-4 rounded-xl shadow-sm transition-all flex flex-col justify-between space-y-3 group cursor-pointer hover:shadow-md hover:-translate-y-0.5"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-accent bg-accent/10 px-2 py-0.5 rounded-md">Official</span>
                          {q.best_score != null && (
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                              Best: {q.best_score}/{q.total_questions}
                            </span>
                          )}
                        </div>
                        <h5 className="font-bold text-sm text-text group-hover:text-accent transition-colors break-words leading-snug">{q.title}</h5>
                        <p className="text-xs text-text/50 break-words mt-1 leading-relaxed">{cleanedDesc}</p>
                      </div>

                      <div className="w-full bg-accent/10 group-hover:bg-accent text-accent group-hover:text-white font-bold py-2 px-3 rounded-lg text-xs transition-all flex items-center justify-center space-x-1.5">
                        <PlayCircle size={14} />
                        <span>Start Quiz</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* AI Practice Quizzes */}
          {aiQuizzes.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">AI Generated Practice Quizzes</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {aiQuizzes.map(q => {
                  const cleanedDesc = q.description ? q.description.replace(/:\s*#\d+\s*-\s*#\d+/g, '').replace(/#\d+\s*-\s*#\d+/g, '').trim() : '';
                  return (
                    <div
                      key={q.id}
                      onClick={() => navigate(`/quiz/${q.id}`, { state: { from: '/courses', courseId } })}
                      className="bg-card border border-neutral-200 dark:border-neutral-800 hover:border-emerald-500/50 p-4 rounded-xl shadow-sm transition-all flex flex-col justify-between space-y-3 group cursor-pointer hover:shadow-md hover:-translate-y-0.5"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Sparkles size={10} />
                            AI Practice
                          </span>
                          {(user?.role === 'admin' || user?.id == q.user_id) && (
                            <button
                              onClick={(e) => { e.stopPropagation(); deleteQuiz(q.id, q.title); }}
                              className="text-text/30 hover:text-red-500 transition p-1 rounded-md"
                              title="Delete Quiz"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                        <h5 className="font-bold text-sm text-text group-hover:text-emerald-600 transition-colors break-words leading-snug">{q.title}</h5>
                        {q.best_score != null ? (
                          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                            Best Score: {q.best_score}/{q.total_questions}
                          </p>
                        ) : (
                          <p className="text-xs text-text/40 mt-1">{cleanedDesc || 'Not attempted yet'}</p>
                        )}
                      </div>

                      <div className="w-full bg-emerald-500/10 group-hover:bg-emerald-500 text-emerald-600 group-hover:text-white font-bold py-2 px-3 rounded-lg text-xs transition-all flex items-center justify-center space-x-1.5">
                        <Sparkles size={14} />
                        <span>Start Practice</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};


export default Courses;
