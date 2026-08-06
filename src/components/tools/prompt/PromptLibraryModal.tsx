import React, { useState, useEffect } from 'react';
import { Search, X, Star, History, Sparkles, BookOpen, Copy, Check, ArrowRight } from 'lucide-react';
import { PROMPT_LIBRARY_TEMPLATES, PromptTemplate } from './promptTemplatesData';

interface PromptLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt: (promptText: string, title?: string) => void;
  onShowToast: (msg: string) => void;
}

export const PromptLibraryModal: React.FC<PromptLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectPrompt,
  onShowToast
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'history'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [favorites, setFavorites] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      try {
        setFavorites(JSON.parse(localStorage.getItem('splitdrop_prompt_favs') || '[]'));
        setHistory(JSON.parse(localStorage.getItem('splitdrop_prompt_history') || '[]'));
      } catch {}
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const categories = ['All', ...Array.from(new Set(PROMPT_LIBRARY_TEMPLATES.map(t => t.category)))];

  const getFilteredTemplates = () => {
    if (activeTab === 'favorites') {
      return favorites.filter(f =>
        f.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.prompt?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (activeTab === 'history') {
      return history.filter(h =>
        h.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.prompt?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return PROMPT_LIBRARY_TEMPLATES.filter(template => {
      const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
      const matchesSearch =
        template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  };

  const filteredItems = getFilteredTemplates();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="glass-card w-full max-w-4xl max-h-[85vh] rounded-3xl flex flex-col overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 font-bold">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Prompt Library Templates
              </h2>
              <p className="text-xs text-slate-500">
                Browse pre-built professional prompt templates or search your saved favorites.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Tabs */}
        <div className="p-6 border-b border-slate-200/80 dark:border-slate-800 space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search templates, tags, or keywords..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Main Tabs */}
            <div className="flex gap-1 p-1 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 text-xs font-bold">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeTab === 'all'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                All Library ({PROMPT_LIBRARY_TEMPLATES.length})
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
                  activeTab === 'favorites'
                    ? 'bg-white dark:bg-slate-900 text-amber-500 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-amber-500" /> Favorites ({favorites.length})
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
                  activeTab === 'history'
                    ? 'bg-white dark:bg-slate-900 text-emerald-500 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <History className="w-3.5 h-3.5" /> Recent ({history.length})
              </button>
            </div>
          </div>

          {/* Category Chips (Only in 'all' tab) */}
          {activeTab === 'all' && (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Templates List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-500">No prompt templates found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map((item: any, idx) => {
                const promptVal = item.prompt || item.promptText || '';
                const titleVal = item.title || 'Saved Prompt';
                return (
                  <div
                    key={item.id || idx}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 hover:border-indigo-500/50 transition-all space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                          {item.category || 'Prompt'}
                        </span>
                        {item.tags && (
                          <div className="flex gap-1">
                            {item.tags.map((t: string) => (
                              <span key={t} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-[10px] text-slate-500">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                        {titleVal}
                      </h3>

                      {item.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      )}

                      <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 text-xs font-mono text-slate-600 dark:text-slate-300 line-clamp-3">
                        {promptVal}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                      <button
                        onClick={() => {
                          onSelectPrompt(promptVal, titleVal);
                          onShowToast(`Loaded template: ${titleVal}`);
                          onClose();
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <span>Use This Template</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
