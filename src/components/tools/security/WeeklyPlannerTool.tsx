import React, { useState, useEffect } from 'react';
import { Calendar, CheckSquare, Plus, Trash2 } from 'lucide-react';

interface WeeklyPlannerToolProps {
  onShowToast: (message: string) => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const WeeklyPlannerTool: React.FC<WeeklyPlannerToolProps> = ({ onShowToast }) => {
  const [planner, setPlanner] = useState<Record<string, string[]>>(() => {
    try {
      const saved = localStorage.getItem('splitdrop-weekly-planner');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      Monday: ['Sprint planning meeting'],
      Tuesday: ['Security audit review'],
      Wednesday: ['Mid-week code deployment'],
      Thursday: ['Performance optimization'],
      Friday: ['Weekly roundup & documentation'],
      Saturday: ['Personal projects'],
      Sunday: ['Rest & planning for next week']
    };
  });

  const [inputDay, setInputDay] = useState<string>('Monday');
  const [inputTask, setInputTask] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('splitdrop-weekly-planner', JSON.stringify(planner));
  }, [planner]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputTask.trim()) return;

    setPlanner((prev) => ({
      ...prev,
      [inputDay]: [...(prev[inputDay] || []), inputTask.trim()]
    }));

    setInputTask('');
    onShowToast(`Task added to ${inputDay}!`);
  };

  const removeTask = (day: string, idx: number) => {
    setPlanner((prev) => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== idx)
    }));
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>🗓️</span> Weekly Goal & Task Planner
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Plan your week day by day with offline goals, checklists, and tasks.
        </p>
      </div>

      {/* Add Form */}
      <form onSubmit={addTask} className="glass-card p-4 rounded-2xl flex flex-wrap gap-3">
        <select
          value={inputDay}
          onChange={(e) => setInputDay(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800"
        >
          {DAYS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={inputTask}
          onChange={(e) => setInputTask(e.target.value)}
          placeholder="New goal or task for selected day..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 focus:outline-none"
        />

        <button
          type="submit"
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors flex items-center gap-1 shadow-md"
        >
          <Plus className="w-4 h-4" /> Add Task
        </button>
      </form>

      {/* Days Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {DAYS.map((day) => (
          <div key={day} className="glass-card p-4 rounded-2xl space-y-3">
            <h3 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-2">
              {day}
            </h3>

            <div className="space-y-1.5 min-h-[100px]">
              {(planner[day] || []).length === 0 ? (
                <p className="text-[11px] text-slate-400 italic">No tasks scheduled.</p>
              ) : (
                planner[day].map((task, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 flex justify-between items-center text-xs text-slate-800 dark:text-slate-200"
                  >
                    <span className="truncate pr-2 font-medium">{task}</span>
                    <button
                      onClick={() => removeTask(day, idx)}
                      className="p-1 text-rose-500 hover:bg-rose-500/10 rounded"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
