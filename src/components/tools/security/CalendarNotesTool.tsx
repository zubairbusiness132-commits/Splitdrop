import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Save, Trash2 } from 'lucide-react';

interface CalendarNotesToolProps {
  onShowToast: (message: string) => void;
}

export const CalendarNotesTool: React.FC<CalendarNotesToolProps> = ({ onShowToast }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('splitdrop-calendar-notes');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      [new Date().toISOString().split('T')[0]]: 'Check out SplitDrop new security suite tools!'
    };
  });

  const [activeNoteText, setActiveNoteText] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('splitdrop-calendar-notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    setActiveNoteText(notes[selectedDate] || '');
  }, [selectedDate, notes]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const saveNoteForSelectedDate = () => {
    if (!activeNoteText.trim()) {
      const updated = { ...notes };
      delete updated[selectedDate];
      setNotes(updated);
      onShowToast('Note cleared for date.');
      return;
    }

    setNotes({ ...notes, [selectedDate]: activeNoteText.trim() });
    onShowToast(`Note saved for ${selectedDate}!`);
  };

  const renderDays = () => {
    const days = [];
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<div key={`empty-${i}`} className="h-10" />);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateString = `${year}-${(month + 1).toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
      const isSelected = dateString === selectedDate;
      const hasNote = Boolean(notes[dateString]);

      days.push(
        <button
          key={d}
          onClick={() => setSelectedDate(dateString)}
          className={`h-10 rounded-xl flex flex-col items-center justify-center font-bold text-xs transition-all relative ${
            isSelected
              ? 'bg-indigo-600 text-white shadow-md'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
          }`}
        >
          <span>{d}</span>
          {hasNote && (
            <span
              className={`w-1.5 h-1.5 rounded-full absolute bottom-1 ${
                isSelected ? 'bg-white' : 'bg-indigo-500'
              }`}
            />
          )}
        </button>
      );
    }
    return days;
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>📅</span> Offline Calendar Notes & Event Logger
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Select dates on the interactive calendar to record private local reminders and event notes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Calendar Box */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {monthNames[month]} {year}
            </h3>
            <div className="flex gap-1">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors text-slate-700 dark:text-slate-200"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors text-slate-700 dark:text-slate-200"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400">
            <span>Su</span>
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
          </div>

          <div className="grid grid-cols-7 gap-1">{renderDays()}</div>
        </div>

        {/* Note Box */}
        <div className="glass-card p-6 rounded-3xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                Notes for {selectedDate}
              </span>
            </div>

            <textarea
              rows={6}
              value={activeNoteText}
              onChange={(e) => setActiveNoteText(e.target.value)}
              placeholder={`Write event or notes for ${selectedDate}...`}
              className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <button
            onClick={saveNoteForSelectedDate}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-md flex items-center justify-center gap-1.5"
          >
            <Save className="w-4 h-4" /> Save Note for Date
          </button>
        </div>
      </div>
    </div>
  );
};
