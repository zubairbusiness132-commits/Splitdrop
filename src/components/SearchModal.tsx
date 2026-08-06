import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight, Tag, History, Star, Sparkles } from 'lucide-react';
import { getTranslatedTools } from '../data/toolsData';
import { useLanguage } from '../context/LanguageContext';
import { getLinkUrl } from '../lib/paths';
import { recordToolUsage, isFavorite } from '../lib/userStore';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (path: string) => void;
}

const RECENT_SEARCHES_KEY = 'splitdrop_recent_searches';

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectTool }) => {
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const { t, currentLang } = useLanguage();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (raw) setRecentSearches(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const translatedTools = getTranslatedTools(currentLang);

  const saveSearchQuery = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    try {
      const updated = [trimmed, ...recentSearches.filter((s) => s.toLowerCase() !== trimmed.toLowerCase())].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleToolClick = (tool: any) => {
    if (query) saveSearchQuery(query);
    recordToolUsage(tool.id);
    onSelectTool(getLinkUrl(tool.path));
    onClose();
  };

  const popularTags = ['PDF', 'Image', 'Resume', 'YouTube', 'AI', 'Security', 'Developer', 'Design'];

  const filteredTools = translatedTools.filter((tool) => {
    const q = query.toLowerCase();
    const matchesTagFilter = activeTag ? tool.tags?.some((t) => t.toLowerCase() === activeTag.toLowerCase()) : true;

    if (!matchesTagFilter) return false;
    if (!q) return true;

    const matchesTitle = tool.title.toLowerCase().includes(q);
    const matchesDesc = tool.description.toLowerCase().includes(q);
    const matchesCategory = tool.category.toLowerCase().includes(q);
    const matchesTags = tool.tags?.some((tag) => tag.toLowerCase().includes(q));
    const matchesFeatures = tool.features?.some((f) => f.toLowerCase().includes(q));

    return matchesTitle || matchesDesc || matchesCategory || matchesTags || matchesFeatures;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20 px-4 bg-slate-950/40 backdrop-blur-xl animate-fadeIn">
      <div className="w-full max-w-2xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xl border border-white/60 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Input header */}
        <div className="p-4 border-b border-slate-200/60 dark:border-slate-800/60 space-y-3">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('searchPlaceholder', 'Search 100+ tools by name, tag, category or feature...')}
              className="w-full text-sm font-semibold bg-transparent text-slate-900 dark:text-white outline-none placeholder:text-slate-400"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 cursor-pointer"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tag Quick Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
            <span className="text-slate-400 font-bold flex items-center gap-1 shrink-0">
              <Tag className="w-3 h-3" /> Filter:
            </span>
            <button
              onClick={() => setActiveTag(null)}
              className={`px-2.5 py-1 rounded-full font-bold transition-all cursor-pointer ${
                activeTag === null
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            {popularTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`px-2.5 py-1 rounded-full font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTag === tag
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Searches */}
        {!query && recentSearches.length > 0 && (
          <div className="px-4 py-2 bg-slate-50/60 dark:bg-slate-950/40 border-b border-slate-200/40 dark:border-slate-800/40 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-slate-400 font-bold flex items-center gap-1 shrink-0">
              <History className="w-3 h-3" /> Recent:
            </span>
            {recentSearches.map((s, i) => (
              <button
                key={i}
                onClick={() => setQuery(s)}
                className="px-2.5 py-0.5 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-semibold border border-slate-200/60 dark:border-slate-700/60 hover:text-indigo-600 cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {filteredTools.length > 0 ? (
            filteredTools.map((tool) => {
              const fav = isFavorite(tool.id);
              return (
                <button
                  key={tool.id}
                  onClick={() => handleToolClick(tool)}
                  className="w-full text-left p-3.5 rounded-2xl hover:bg-indigo-50/80 dark:hover:bg-indigo-950/50 transition-all flex items-center gap-3 group border border-transparent hover:border-indigo-200/50 dark:hover:border-indigo-800/50 cursor-pointer"
                >
                  <span className="text-2xl shrink-0 p-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/80">
                    {tool.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                        {tool.title}
                      </span>
                      {fav && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />}
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold shrink-0">
                        {tool.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {tool.description}
                    </p>
                    {tool.tags && (
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400">
                        <span>Tags:</span>
                        <span className="font-medium text-slate-500">{tool.tags.slice(0, 3).join(', ')}</span>
                      </div>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors shrink-0" />
                </button>
              );
            })
          ) : (
            <div className="p-12 text-center text-xs text-slate-400 space-y-2">
              <Sparkles className="w-6 h-6 mx-auto text-slate-300 dark:text-slate-600" />
              <p>No matching tools found for "{query}"</p>
              <p className="text-[11px]">Try searching for terms like "compress", "pdf", "resume", "youtube", "json", "qr", or "color".</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200/60 dark:border-slate-800/60 text-[11px] text-slate-400 flex items-center justify-between">
          <span>{filteredTools.length} tools indexed</span>
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono font-bold">Esc</kbd> to exit</span>
        </div>

      </div>
    </div>
  );
};
