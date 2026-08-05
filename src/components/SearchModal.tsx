import React, { useState } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { getTranslatedTools } from '../data/toolsData';
import { useLanguage } from '../context/LanguageContext';
import { getLinkUrl } from '../lib/paths';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (path: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectTool }) => {
  const [query, setQuery] = useState('');
  const { t, currentLang } = useLanguage();

  if (!isOpen) return null;

  const translatedTools = getTranslatedTools(currentLang);

  const filteredTools = translatedTools.filter(tool =>
    tool.title.toLowerCase().includes(query.toLowerCase()) ||
    tool.description.toLowerCase().includes(query.toLowerCase()) ||
    tool.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/40 backdrop-blur-xl animate-fadeIn">
      <div className="w-full max-w-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/60 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        {/* Input header */}
        <div className="flex items-center gap-3 p-4 border-b border-slate-200/60 dark:border-slate-800/60">
          <Search className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('search', 'Search free tools (SplitDrop, Compressor, PDF, QR...)')}
            className="w-full text-sm font-semibold bg-transparent text-slate-900 dark:text-white outline-none placeholder:text-slate-400"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-1">
          {filteredTools.length > 0 ? (
            filteredTools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => {
                  onSelectTool(getLinkUrl(tool.path));
                  onClose();
                }}
                className="w-full text-left p-3.5 rounded-2xl hover:bg-indigo-50/80 dark:hover:bg-indigo-950/50 transition-all flex items-center gap-3 group border border-transparent hover:border-indigo-200/50 dark:hover:border-indigo-800/50 cursor-pointer"
              >
                <span className="text-2xl">{tool.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {tool.title}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100/80 dark:bg-slate-800/80 text-slate-500 font-semibold border border-slate-200/50 dark:border-slate-700/50">
                      {tool.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {tool.description}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
              </button>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">
              No matching tools found for "{query}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
