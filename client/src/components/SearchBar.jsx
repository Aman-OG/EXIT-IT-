import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import api from '../api/axios';

const SearchBar = ({ onResultSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const searchMaterials = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const [materialsRes, quizzesRes, coursesRes] = await Promise.all([
          api.get(`/materials/search?q=${encodeURIComponent(query)}`).catch(() => ({ data: [] })),
          api.get(`/quizzes/search?q=${encodeURIComponent(query)}`).catch(() => ({ data: [] })),
          api.get(`/courses/search?q=${encodeURIComponent(query)}`).catch(() => ({ data: [] }))
        ]);

        const combined = [
          ...materialsRes.data.map(m => ({ ...m, type: 'material' })),
          ...quizzesRes.data.map(q => ({ ...q, type: 'quiz' })),
          ...coursesRes.data.map(c => ({ ...c, type: 'course' }))
        ];

        setResults(combined.slice(0, 8));
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchMaterials, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text/40" size={20} />
        <input
          type="text"
          placeholder="Search materials, quizzes, courses..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-10 pr-4 py-2.5 bg-background border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text/40 hover:text-text transition"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {isOpen && (query || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg z-50 overflow-hidden">
          {loading ? (
            <div className="p-4 text-center text-text/50">
              <div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
            </div>
          ) : results.length === 0 && query ? (
            <div className="p-4 text-center text-text/50">
              No results found for "{query}"
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {results.map((result) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => {
                    onResultSelect(result);
                    setIsOpen(false);
                    setQuery('');
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-primary/5 transition border-b border-neutral-100 dark:border-neutral-800 last:border-b-0 flex items-start space-x-3"
                >
                  <span className="text-xs font-bold uppercase tracking-widest text-primary/60 bg-primary/5 px-2 py-1 rounded flex-shrink-0 mt-1">
                    {result.type}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-text truncate">{result.title || result.name}</p>
                    {result.description && (
                      <p className="text-sm text-text/50 truncate">{result.description}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
