import React, { useState, useEffect } from 'react';
import { FileText, Plus, Trash2, Download, Upload, Pin, Search, Save, Check } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
  updatedAt: string;
}

interface SecureNotesToolProps {
  onShowToast: (message: string) => void;
}

export const SecureNotesTool: React.FC<SecureNotesToolProps> = ({ onShowToast }) => {
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const saved = localStorage.getItem('splitdrop-secure-notes');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: '1',
        title: 'Welcome Note',
        content: 'This secure notebook stores everything locally in your browser storage. No cloud servers are involved!',
        pinned: true,
        updatedAt: new Date().toISOString()
      }
    ];
  });

  const [activeNoteId, setActiveNoteId] = useState<string>('1');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('splitdrop-secure-notes', JSON.stringify(notes));
  }, [notes]);

  const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0];

  const handleCreateNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      pinned: false,
      updatedAt: new Date().toISOString()
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
    onShowToast('New note created.');
  };

  const handleUpdateActiveNote = (field: 'title' | 'content', value: string) => {
    if (!activeNote) return;
    setNotes((prev) =>
      prev.map((n) =>
        n.id === activeNote.id
          ? { ...n, [field]: value, updatedAt: new Date().toISOString() }
          : n
      )
    );
  };

  const togglePin = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
    );
  };

  const handleDelete = (id: string) => {
    if (notes.length <= 1) {
      onShowToast('Cannot delete the last remaining note.');
      return;
    }
    const remaining = notes.filter((n) => n.id !== id);
    setNotes(remaining);
    setActiveNoteId(remaining[0].id);
    onShowToast('Note deleted.');
  };

  const exportTxt = () => {
    if (!activeNote) return;
    const blob = new Blob([`${activeNote.title}\n\n${activeNote.content}`], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeNote.title.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'note'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Note exported as TXT file.');
  };

  const handleImportTxt = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const imported: Note = {
        id: Date.now().toString(),
        title: file.name.replace(/\.txt$/i, ''),
        content: text || '',
        pinned: false,
        updatedAt: new Date().toISOString()
      };
      setNotes([imported, ...notes]);
      setActiveNoteId(imported.id);
      onShowToast(`Imported ${file.name}`);
    };
    reader.readAsText(file);
  };

  const filteredNotes = notes
    .filter((n) => n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.content.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>📝</span> Offline Secure Notes
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Private, auto-saved local notepad with TXT file import and export capabilities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5" /> Import TXT
            <input type="file" accept=".txt" onChange={handleImportTxt} className="hidden" />
          </label>

          <button
            onClick={exportTxt}
            className="px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Export TXT
          </button>

          <button
            onClick={handleCreateNote}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" /> New Note
          </button>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar Notes List */}
        <div className="glass-card p-4 rounded-3xl space-y-3 md:col-span-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 pl-9 pr-3 rounded-xl bg-slate-100 dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {filteredNotes.map((note) => {
              const isActive = note.id === activeNoteId;
              return (
                <div
                  key={note.id}
                  onClick={() => setActiveNoteId(note.id)}
                  className={`p-3 rounded-2xl cursor-pointer transition-all border ${
                    isActive
                      ? 'bg-indigo-600/10 border-indigo-500/40 text-indigo-600 dark:text-indigo-400'
                      : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/50 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="text-xs font-bold truncate flex-1">{note.title || 'Untitled Note'}</h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePin(note.id);
                      }}
                      className={`p-1 rounded transition-colors ${note.pinned ? 'text-indigo-500' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                    {note.content || 'Empty note...'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Note Editor */}
        <div className="glass-card p-6 rounded-3xl space-y-4 md:col-span-2 flex flex-col justify-between min-h-[400px]">
          {activeNote ? (
            <div className="space-y-4 flex-1 flex flex-col">
              <div className="flex justify-between items-center gap-2">
                <input
                  type="text"
                  value={activeNote.title}
                  onChange={(e) => handleUpdateActiveNote('title', e.target.value)}
                  placeholder="Note Title..."
                  className="w-full text-lg font-bold bg-transparent text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2 focus:outline-none focus:border-indigo-500"
                />

                <button
                  onClick={() => handleDelete(activeNote.id)}
                  className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors shrink-0"
                  title="Delete Note"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <textarea
                value={activeNote.content}
                onChange={(e) => handleUpdateActiveNote('content', e.target.value)}
                placeholder="Start writing private notes..."
                className="w-full flex-1 p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-sans leading-relaxed min-h-[280px]"
              />

              <div className="flex justify-between items-center text-[10px] text-slate-400">
                <span>Auto-saved to LocalStorage</span>
                <span>Updated: {new Date(activeNote.updatedAt).toLocaleTimeString()}</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <p className="text-xs">Select or create a note to edit.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
