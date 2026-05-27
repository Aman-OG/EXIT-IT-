import { useState, useEffect, useContext } from 'react';
import { PlayCircle, Plus, Trash2, Sparkles, X, ExternalLink, Play, Loader2, Link, ChevronDown, ChevronUp } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

export default function VideoPanel({ materialId, materialTitle }) {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === 'admin';

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);
  const [expanded, setExpanded] = useState(false);

  // Admin: manual add
  const [showAddForm, setShowAddForm] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const [manualTitle, setManualTitle] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');

  // Admin: AI suggest
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, [materialId]);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/videos/material/${materialId}`);
      setVideos(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddManual = async () => {
    if (!manualUrl.trim()) return;
    setAddError('');
    setAddLoading(true);
    try {
      await api.post(`/videos/material/${materialId}`, {
        youtube_url: manualUrl,
        title: manualTitle || null,
      });
      setManualUrl('');
      setManualTitle('');
      setShowAddForm(false);
      fetchVideos();
    } catch (e) {
      setAddError(e.response?.data?.message || 'Invalid YouTube URL');
    } finally {
      setAddLoading(false);
    }
  };

  const handleDelete = async (videoId, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/videos/${videoId}`);
      setVideos(v => v.filter(x => x.id !== videoId));
      if (activeVideo?.id === videoId) setActiveVideo(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAISuggest = async () => {
    setSuggestLoading(true);
    setSuggestions([]);
    setShowSuggestions(true);
    setShowAddForm(false);
    try {
      const res = await api.post(`/videos/material/${materialId}/ai-suggest`);
      setSuggestions(res.data.videos || []);
    } catch (e) {
      setSuggestions([]);
    } finally {
      setSuggestLoading(false);
    }
  };

  const handleSaveSuggestion = async (video) => {
    setSavingId(video.youtube_id);
    try {
      await api.post(`/videos/material/${materialId}`, {
        youtube_url: video.youtube_url,
        title: video.title,
      });
      setSuggestions(s => s.filter(v => v.youtube_id !== video.youtube_id));
      fetchVideos();
    } catch (e) {
      console.error(e);
    } finally {
      setSavingId(null);
    }
  };

  if (loading) return null;
  if (!isAdmin && videos.length === 0) return null;

  return (
    <div className="mt-3">
      {/* Collapsible Header */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between px-3 py-2 bg-background rounded-xl border border-text/5 hover:border-red-500/20 transition group"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-500/10 rounded-lg flex items-center justify-center">
            <PlayCircle className="w-3.5 h-3.5 text-red-500" />
          </div>
          <span className="text-xs font-bold text-text/70 group-hover:text-text transition">
            Related Videos
          </span>
          {videos.length > 0 && (
            <span className="text-[10px] bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded-full font-bold">
              {videos.length}
            </span>
          )}
          {isAdmin && videos.length === 0 && (
            <span className="text-[10px] text-text/30">Add videos for this chapter</span>
          )}
        </div>
        {expanded ? (
          <ChevronUp className="w-3.5 h-3.5 text-text/30" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-text/30" />
        )}
      </button>

      {expanded && (
        <div className="mt-2 space-y-3 animate-in slide-in-from-top-2 duration-200">

          {/* Admin Actions */}
          {isAdmin && (
            <div className="flex gap-2">
              <button
                onClick={() => { setShowAddForm(v => !v); setShowSuggestions(false); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition flex-1 justify-center ${
                  showAddForm
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-text/10 text-text/70 hover:border-primary/30 hover:text-text'
                }`}
              >
                <Link className="w-3 h-3" />
                Add URL
              </button>
              <button
                onClick={handleAISuggest}
                disabled={suggestLoading}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition flex-1 justify-center ${
                  showSuggestions
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-text/10 text-text/70 hover:border-primary/30 hover:text-text'
                }`}
              >
                {suggestLoading
                  ? <Loader2 className="w-3 h-3 animate-spin" />
                  : <Sparkles className="w-3 h-3" />
                }
                {suggestLoading ? 'Searching...' : 'AI Suggest'}
              </button>
            </div>
          )}

          {/* Manual Add Form */}
          {isAdmin && showAddForm && (
            <div className="bg-card border border-primary/20 rounded-xl p-3 space-y-2 animate-in fade-in duration-150">
              <input
                type="text"
                value={manualUrl}
                onChange={e => { setManualUrl(e.target.value); setAddError(''); }}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-3 py-2 bg-background border border-text/10 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary text-text placeholder:text-text/30"
              />
              <input
                type="text"
                value={manualTitle}
                onChange={e => setManualTitle(e.target.value)}
                placeholder="Title (optional)"
                className="w-full px-3 py-2 bg-background border border-text/10 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary text-text placeholder:text-text/30"
              />
              {addError && <p className="text-xs text-red-500">{addError}</p>}
              <div className="flex gap-2">
                <button
                  onClick={handleAddManual}
                  disabled={!manualUrl.trim() || addLoading}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-bold hover:opacity-90 transition disabled:opacity-50"
                >
                  {addLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                  Add
                </button>
                <button
                  onClick={() => { setShowAddForm(false); setAddError(''); }}
                  className="px-3 py-2 bg-background border border-text/10 rounded-lg text-xs text-text/50 hover:text-text transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* AI Suggestions */}
          {showSuggestions && (
            <div className="bg-card border border-primary/10 rounded-xl overflow-hidden animate-in fade-in duration-150">
              <div className="flex items-center justify-between px-3 py-2 border-b border-text/5">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-bold text-text">AI Suggestions</span>
                </div>
                <button onClick={() => setShowSuggestions(false)} className="text-text/30 hover:text-text">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              {suggestLoading ? (
                <div className="flex flex-col items-center gap-2 py-6">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <p className="text-xs text-text/50">Finding relevant videos...</p>
                </div>
              ) : suggestions.length === 0 ? (
                <p className="text-xs text-text/40 text-center py-6">No suggestions found</p>
              ) : (
                <div className="divide-y divide-text/5 max-h-72 overflow-y-auto">
                  {suggestions.map(video => (
                    <div key={video.youtube_id} className="flex items-center gap-2 p-2 hover:bg-background/50 transition">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-16 h-11 object-cover rounded-lg flex-shrink-0 bg-background"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-text line-clamp-2 leading-tight">{video.title}</p>
                        <p className="text-[10px] text-text/40 mt-0.5 truncate">{video.channel}</p>
                      </div>
                      <button
                        onClick={() => handleSaveSuggestion(video)}
                        disabled={savingId === video.youtube_id}
                        className="flex-shrink-0 w-7 h-7 bg-primary/10 text-primary rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition disabled:opacity-50"
                        title="Add to chapter"
                      >
                        {savingId === video.youtube_id
                          ? <Loader2 className="w-3 h-3 animate-spin" />
                          : <Plus className="w-3 h-3" />
                        }
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Active Video Player */}
          {activeVideo && (
            <div className="rounded-xl overflow-hidden bg-black animate-in fade-in duration-200">
              <div className="relative pt-[56.25%]">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${activeVideo.youtube_id}?autoplay=1`}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="px-3 py-2 flex items-center justify-between bg-card">
                <p className="text-xs font-semibold text-text truncate">{activeVideo.title || 'YouTube Video'}</p>
                <button onClick={() => setActiveVideo(null)} className="text-text/40 hover:text-text ml-2 flex-shrink-0">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Videos List */}
          {videos.length === 0 && isAdmin ? (
            <p className="text-xs text-text/30 text-center py-3">No videos added yet</p>
          ) : (
            <div className="space-y-1.5">
              {videos.map(video => (
                <div
                  key={video.id}
                  onClick={() => setActiveVideo(activeVideo?.id === video.id ? null : video)}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer transition group ${
                    activeVideo?.id === video.id
                      ? 'bg-red-500/10 border border-red-500/20'
                      : 'bg-card hover:bg-red-500/5 border border-transparent hover:border-red-500/10'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition ${
                    activeVideo?.id === video.id ? 'bg-red-500 text-white' : 'bg-red-500/10 text-red-500'
                  }`}>
                    <Play className="w-4 h-4" fill="currentColor" />
                  </div>
                  <p className="flex-1 text-xs font-semibold text-text truncate">
                    {video.title || 'YouTube Video'}
                  </p>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                    <a
                      href={video.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="w-6 h-6 flex items-center justify-center text-text/30 hover:text-primary rounded transition"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    {isAdmin && (
                      <button
                        onClick={e => handleDelete(video.id, e)}
                        className="w-6 h-6 flex items-center justify-center text-text/30 hover:text-red-500 rounded transition"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
