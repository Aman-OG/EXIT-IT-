import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { FileText, BookOpen, Clock, Trash2, Search, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [deletingNoteId, setDeletingNoteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get('/notes');
        setNotes(res.data);
      } catch (err) {
        console.error('Failed to load notes', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const handleDelete = async (noteId) => {
    try {
      await api.delete(`/notes/${noteId}`);
      setNotes(prev => prev.filter(n => n.id !== noteId));
      setDeletingNoteId(null);
    } catch (err) {
      console.error('Failed to delete note', err);
      alert('Failed to delete note. Please try again.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/notes/${editingNote.material_id}`, {
        content: editingNote.content,
        title: editingNote.title || 'My Notes'
      });
      setNotes(prev => prev.map(n => n.id === editingNote.id ? { ...n, content: res.data.content, note_title: res.data.title } : n));
      setEditingNote(null);
    } catch (err) {
      alert('Failed to update note');
    }
  };

  const filteredNotes = notes.filter(note => 
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) || 
    note.material_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (note.note_title && note.note_title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Knowledge Base</h1>
          <p className="text-text/60">Access all the notes you've taken during your study sessions.</p>
        </div>
        <div className="relative w-full md:w-64">
           <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text/40" />
           <input 
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-card border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm transition"
           />
        </div>
      </div>

      {notes.length === 0 ? (
        <div className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-3xl p-20 text-center space-y-4">
           <FileText size={48} className="text-text/10 mx-auto" />
           <h2 className="text-xl font-bold">No Notes Yet</h2>
           <p className="text-text/40 max-w-sm mx-auto">Start reading PDFs and jot down your insights in the Study Viewer sidebar. They will appear here automatically!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map(note => (
            <div key={note.id} className="bg-card border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-primary transition-all duration-300 group flex flex-col h-[280px] relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
               <div className="flex items-start justify-between mb-4 relative z-10">
                  <button 
                    onClick={() => setEditingNote({ ...note, title: note.note_title || 'My Notes' })}
                    className="p-2 bg-primary/10 text-primary rounded-lg hover:scale-110 transition-transform"
                  >
                    <Edit3 size={18} />
                  </button>
                  <div className="text-right">
                     <p className="text-[10px] font-bold text-text/30 uppercase tracking-widest">{note.course_code}</p>
                     <p className="text-[10px] text-text/50">{new Date(note.updated_at).toLocaleDateString()}</p>
                  </div>
               </div>
               
               <div className="flex-1 cursor-pointer" onClick={() => navigate(`/study/${note.material_id}?mode=notes`)}>
                 <h3 className="font-bold text-sm mb-1 line-clamp-1 group-hover:text-primary transition-colors">{note.note_title || 'My Notes'}</h3>
                 <h4 className="text-xs font-bold text-text/50 mb-3 truncate">📍 {note.material_title}</h4>
                 
                 <div className="overflow-hidden relative h-[80px]">
                    <div 
                      className="text-sm text-text/70 line-clamp-4 leading-relaxed quill-content-preview"
                      dangerouslySetInnerHTML={{ __html: note.content }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-card to-transparent" />
                 </div>
               </div>

               <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between relative z-10">
                  <button 
                    onClick={() => navigate(`/study/${note.material_id}?mode=notes`)}
                    className="text-xs font-bold text-primary hover:text-primary/70 transition flex items-center space-x-1"
                  >
                    <span>View Material</span>
                    <BookOpen size={12} />
                  </button>
                  {deletingNoteId === note.id ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold text-warning">Delete?</span>
                      <button onClick={() => handleDelete(note.id)} className="text-[10px] font-black text-warning hover:text-red-500 px-2 py-1 rounded-lg bg-warning/10 hover:bg-warning/20 transition">Yes</button>
                      <button onClick={() => setDeletingNoteId(null)} className="text-[10px] font-black text-text/40 hover:text-text px-2 py-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">No</button>
                    </div>
                  ) : (
                    <button onClick={() => setDeletingNoteId(note.id)} className="text-text/30 hover:text-warning transition-colors p-1 rounded-lg hover:bg-warning/5">
                      <Trash2 size={16} />
                    </button>
                  )}
               </div>
            </div>
          ))}
         </div>
      )}

      {/* Edit Modal */}
      {editingNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in" onClick={(e) => e.stopPropagation()}>
          <div className="bg-card w-full max-w-lg border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-2xl flex flex-col scale-in-center">
            <h2 className="text-xl font-bold mb-4">Edit Note Properties</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-text/40 uppercase mb-2">Custom Note Title</label>
                <input 
                  type="text" 
                  value={editingNote.title} 
                  onChange={e => setEditingNote({...editingNote, title: e.target.value})}
                  className="w-full bg-background border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., Midterm Prep Notes"
                  required
                />
              </div>
              <div className="pt-4 flex items-center justify-end space-x-3">
                <button type="button" onClick={() => setEditingNote(null)} className="px-4 py-2 text-text/60 hover:text-text font-bold">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-primary text-white rounded-xl font-bold shadow-lg hover:scale-105 transition">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;
