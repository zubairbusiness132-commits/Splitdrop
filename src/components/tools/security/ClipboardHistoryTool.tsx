import React, { useState, useEffect } from 'react';
import { Clipboard, Copy, Search, Trash2, Plus, Check } from 'lucide-react';

interface ClipboardItem {
  id: string;
  text: string;
  copiedAt: string;
}

interface ClipboardHistoryToolProps {
  onShowToast: (message: string) => void;
}

export const ClipboardHistoryTool: React.FC<ClipboardHistoryToolProps> = ({ onShowToast }) => {
  const [history, setHistory] = useState<ClipboardItem[]>(() => {
    try {
      const saved = localStorage.getItem('splitdrop-clipboard-history');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: '1',
        text: 'Welcome to Clipboard History Manager! Any copied snippet can be stored locally.',
        copiedAt: new Date().toISOString()
      }
    ];
  });

  const [inputSnippet, setInputSnippet] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('splitdrop-clipboard-history', JSON.stringify(history));
  }, [history]);

  const addSnippet = (text: string) => {
    if (!text.trim()) return;
    const newItem: ClipboardItem = {
      id: Date.now().toString(),
      text: text.trim(),
      copiedAt: new Date().toISOString()
    };
    setHistory([newItem, ...history.filter(i => i.text !== text.trim())]);
    setInputSnippet('');
    onShowToast('Snippet saved to local history!');
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        addSnippet(text);
      } else {
        onShowToast('Clipboard is empty.');
      }
    } catch {
      onShowToast('Clipboard access permission required.');
    }
  };

  const handleCopyItem = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    onShowToast('Copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const deleteItem = (id: string) => {
    setHistory(prev => prev.filter(i => i.id !== id));
    onShowToast('Snippet removed.');
  };

  const clearAll = () => {
    setHistory([]);
    onShowToast('Clipboard history cleared.');
  };

  const filteredHistory = history.filter(i =>
    i.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>📋</span> Local Clipboard History Manager
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Store and search recent clipboard snippets locally with zero cloud synchronization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePasteClipboard}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-md"
          >
            <Clipboard className="w-3.5 h-3.5" /> Read Clipboard
          </button>

          {history.length > 0 && (
            <button
              onClick={clearAll}
              className="px-3.5 py-2 rounded-xl bg-rose-600/10 text-rose-600 dark:text-rose-400 font-semibold text-xs hover:bg-rose-600/20 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
          )}
        </div>
      </div>

      {/* Manual Input / Search */}
      <div className="glass-card p-6 rounded-3xl space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputSnippet}
            onChange={(e) => setInputSnippet(e.target.value)}
            placeholder="Type or paste custom snippet to store..."
            className="flex-1 px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={() => addSnippet(inputSnippet)}
            className="px-4 py-3 rounded-2xl bg-slate-200 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors shrink-0"
          >
            Save Snippet
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clipboard history..."
            className="w-full py-2.5 pl-9 pr-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>
      </div>

      {/* History Items */}
      <div className="space-y-3">
        {filteredHistory.length === 0 ? (
          <div className="glass-card p-8 rounded-3xl text-center text-slate-400 text-xs">
            No clipboard snippets stored.
          </div>
        ) : (
          filteredHistory.map((item) => (
            <div key={item.id} className="glass-card p-4 rounded-2xl flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-mono text-xs text-slate-900 dark:text-white break-all line-clamp-2">
                  {item.text}
                </p>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Saved: {new Date(item.copiedAt).toLocaleTimeString()}
                </span>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleCopyItem(item.id, item.text)}
                  className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                  title="Copy snippet"
                >
                  {copiedId === item.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => deleteItem(item.id)}
                  className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
                  title="Delete snippet"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
