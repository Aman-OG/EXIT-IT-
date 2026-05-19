import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { BookOpen, FileText, Upload, X, FolderOpen, Plus, Pencil, Trash2, CheckCircle2, AlertCircle, HelpCircle, Sparkles, ChevronDown, Download, GripVertical } from 'lucide-react';
import { CourseSkeleton } from '../components/Skeleton';

const Courses = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [materials, setMaterials] = useState({});
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Your Courses</h1>
          <p className="text-text/70">Select a course to study materials and prepare for your exams.</p>
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
          {courses.map((course, idx) => (
            <div key={course.id} className="rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-sm transition-all">
              {/* Course Header */}
              <div
                onClick={() => toggleCourse(course.id)}
                className={`w-full text-left p-6 bg-gradient-to-r ${courseColors[idx % courseColors.length]} flex items-center justify-between group hover:shadow-md transition-all cursor-pointer`}
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className={`p-3 rounded-xl bg-card/80 shadow-sm ${iconColors[idx % iconColors.length]}`}>
                    <BookOpen size={24} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0 mr-4">
                    <div className="flex items-center space-x-3 mb-1">
                      <h2 className="text-xl font-bold truncate">{course.title}</h2>
                      <button 
                        onClick={(e) => { e.stopPropagation(); window.open(`http://localhost:5005/api/materials/download-course/${course.id}`, '_blank'); }} 
                        className="p-1.5 text-text/40 hover:text-primary transition rounded-lg hover:bg-primary/10 opacity-0 group-hover:opacity-100"
                        title="Download Course (ZIP)"
                      >
                        <Download size={14} />
                      </button>
                      {user?.role === 'admin' && (
                         <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={(e) => { e.stopPropagation(); setCourseForm({title: course.title, code: course.code, description: course.description}); setCourseModal({mode: 'edit', data: course}); }} className="p-1.5 text-text/40 hover:text-primary transition rounded-lg hover:bg-primary/10">
                               <Pencil size={14} />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); setDeleteConfirm({ type: 'course', id: course.id, title: course.title }); }} className="p-1.5 text-text/40 hover:text-warning transition rounded-lg hover:bg-warning/10">
                               <Trash2 size={14} />
                            </button>
                         </div>
                      )}
                    </div>
                    <p className="text-sm text-text/60 font-medium truncate">{course.code} • {course.description || 'University Course'}</p>
                    
                    {/* Progress Bar */}
                    <div className="mt-3 max-w-xs">
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider mb-1.5">
                           <span className="text-text/40">Progress</span>
                           <span className="text-primary">{Math.round((course.completed_materials / (course.total_materials || 1)) * 100)}%</span>
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
                <div className={`text-text/40 transition-transform ${expandedCourse === course.id ? 'rotate-180' : ''}`}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>
                </div>
              </div>

              {/* Expanded Materials List */}
              {expandedCourse === course.id && (
                <div className={`p-6 border-t border-neutral-200 dark:border-neutral-800 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200 bg-gradient-to-r ${courseColors[idx % courseColors.length]}`}>
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

                  {/* Student View Quizzes */}
                  <div className="flex flex-wrap gap-3 mb-6">
                     <QuizButtonList courseId={course.id} navigate={navigate} user={user} />
                  </div>

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
                                 href={`http://localhost:5005${mat.file_url}`} 
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
                            
                            <h3 className="font-bold text-sm mb-1 line-clamp-2 min-h-[2.5rem] flex items-center justify-center group-hover:text-primary transition-colors leading-tight">
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
                </div>
              )}
            </div>
          ))}
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

const QuizButtonList = ({ courseId, navigate, user }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [isExpanded, setIsExpanded] = useState(true);

  const fetchQuizzes = async () => {
    try {
      const res = await api.get(`/quizzes/course/${courseId}`);
      setQuizzes(res.data);
    } catch (e) {}
  };

  useEffect(() => {
    fetchQuizzes();
  }, [courseId]);

  if (quizzes.length === 0) return null;
  
  const officialQuizzes = quizzes.filter(q => q.is_official);
  const aiQuizzes = quizzes.filter(q => !q.is_official);

  const deleteQuiz = async (quizId) => {
    if(window.confirm('Are you sure you want to delete this AI practice quiz?')) {
      try {
        await api.delete(`/quizzes/${quizId}`);
        fetchQuizzes();
      } catch (e) {
        alert('Failed to delete quiz');
      }
    }
  };

  return (
    <div className="flex flex-col w-full bg-background/50 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left focus:outline-none group"
      >
        <span className="text-xs font-black uppercase tracking-widest text-text/50 group-hover:text-primary transition-colors">📑 Course Assessments ({quizzes.length})</span>
        <ChevronDown size={16} className={`text-text/40 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      {isExpanded && (
        <div className="flex flex-col space-y-5 pt-4 animate-in fade-in slide-in-from-top-2">
          {officialQuizzes.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-black text-text/50 uppercase tracking-widest pl-1">Official Course Quizzes</h4>
              <div className="flex flex-wrap gap-2">
                {officialQuizzes.map(q => (
                  <button 
                    key={q.id}
                    onClick={() => navigate(`/quiz/${q.id}`)}
                    className="flex items-center space-x-2 px-4 py-2.5 bg-accent/10 text-accent rounded-xl font-bold text-xs hover:bg-accent/20 transition border border-accent/20 shadow-sm relative group overflow-hidden"
                  >
                    <HelpCircle size={14} />
                    <span>{q.title}</span>
                    {q.best_score != null && (
                      <span className="ml-2 text-[9px] font-black uppercase tracking-tighter bg-accent text-white px-1.5 py-0.5 rounded opacity-90 group-hover:opacity-100 transition">
                        ✓ {q.best_score}/{q.total_questions}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {aiQuizzes.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest pl-1">Your AI Practice Quizzes</h4>
              <div className="flex flex-wrap gap-2">
                {aiQuizzes.map(q => (
                  <div key={q.id} className="relative group/quiz flex items-center">
                    <button 
                      onClick={() => navigate(`/quiz/${q.id}`)}
                      className="flex items-center space-x-2 pr-9 pl-4 py-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl font-bold text-xs hover:bg-emerald-500/20 transition border border-emerald-500/20 shadow-sm relative overflow-hidden"
                    >
                      <Sparkles size={14} />
                      <span>{q.title}</span>
                      {q.best_score != null && (
                        <span className="ml-2 text-[9px] font-black uppercase tracking-tighter bg-emerald-500 text-white px-1.5 py-0.5 rounded opacity-90 group-hover:opacity-100 transition">
                          {"✓ " + q.best_score + "/" + q.total_questions}
                        </span>
                      )}
                    </button>
                    {(user?.role === 'admin' || user?.id == q.user_id) && (
                      <button 
                        onClick={() => deleteQuiz(q.id)} 
                        className="absolute right-2 p-1.5 text-warning hover:text-red-500 transition-colors opacity-0 group-hover/quiz:opacity-100"
                        title="Delete Quiz"
                      >
                        <Trash2 size={13} strokeWidth={2.5} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Courses;
