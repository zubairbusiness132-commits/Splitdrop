import React, { useState, useEffect } from 'react';
import { Sun, Sunset, Moon, Plus, Check, Trash2 } from 'lucide-react';

interface PlannerTask {
  id: string;
  text: string;
  completed: boolean;
}

interface DailyPlannerData {
  morning: PlannerTask[];
  afternoon: PlannerTask[];
  evening: PlannerTask[];
  notes: string;
}

interface DailyPlannerToolProps {
  onShowToast: (message: string) => void;
}

export const DailyPlannerTool: React.FC<DailyPlannerToolProps> = ({ onShowToast }) => {
  const [planner, setPlanner] = useState<DailyPlannerData>(() => {
    try {
      const saved = localStorage.getItem('splitdrop-daily-planner');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      morning: [{ id: '1', text: 'Morning workout & team standup', completed: true }],
      afternoon: [{ id: '2', text: 'Deep work coding session', completed: false }],
      evening: [{ id: '3', text: 'Review daily progress & relax', completed: false }],
      notes: 'Focus on high-priority security suite features today.'
    };
  });

  const [inputMorning, setInputMorning] = useState<string>('');
  const [inputAfternoon, setInputAfternoon] = useState<string>('');
  const [inputEvening, setInputEvening] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('splitdrop-daily-planner', JSON.stringify(planner));
  }, [planner]);

  const addTask = (section: 'morning' | 'afternoon' | 'evening', text: string) => {
    if (!text.trim()) return;
    const task: PlannerTask = { id: Date.now().toString(), text: text.trim(), completed: false };
    setPlanner((prev) => ({
      ...prev,
      [section]: [...prev[section], task]
    }));
    onShowToast('Task added to daily schedule.');
  };

  const toggleTask = (section: 'morning' | 'afternoon' | 'evening', id: string) => {
    setPlanner((prev) => ({
      ...prev,
      [section]: prev[section].map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    }));
  };

  const deleteTask = (section: 'morning' | 'afternoon' | 'evening', id: string) => {
    setPlanner((prev) => ({
      ...prev,
      [section]: prev[section].filter((t) => t.id !== id)
    }));
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>📅</span> Daily Planner (Morning / Afternoon / Evening)
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Structure your day into morning, afternoon, and evening focus blocks locally.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Morning Block */}
        <div className="glass-card p-5 rounded-3xl space-y-4">
          <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wider">
            <Sun className="w-4 h-4" /> Morning
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={inputMorning}
              onChange={(e) => setInputMorning(e.target.value)}
              placeholder="Add morning task..."
              className="flex-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
            />
            <button
              onClick={() => {
                addTask('morning', inputMorning);
                setInputMorning('');
              }}
              className="p-2 rounded-xl bg-amber-500 text-white font-bold"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {planner.morning.map((t) => (
              <div key={t.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs">
                <span
                  onClick={() => toggleTask('morning', t.id)}
                  className={`cursor-pointer font-medium ${t.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}
                >
                  {t.text}
                </span>
                <button onClick={() => deleteTask('morning', t.id)} className="text-rose-500 p-1">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Afternoon Block */}
        <div className="glass-card p-5 rounded-3xl space-y-4">
          <div className="flex items-center gap-2 text-indigo-500 font-bold text-xs uppercase tracking-wider">
            <Sunset className="w-4 h-4" /> Afternoon
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={inputAfternoon}
              onChange={(e) => setInputAfternoon(e.target.value)}
              placeholder="Add afternoon task..."
              className="flex-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
            />
            <button
              onClick={() => {
                addTask('afternoon', inputAfternoon);
                setInputAfternoon('');
              }}
              className="p-2 rounded-xl bg-indigo-600 text-white font-bold"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {planner.afternoon.map((t) => (
              <div key={t.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs">
                <span
                  onClick={() => toggleTask('afternoon', t.id)}
                  className={`cursor-pointer font-medium ${t.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}
                >
                  {t.text}
                </span>
                <button onClick={() => deleteTask('afternoon', t.id)} className="text-rose-500 p-1">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Evening Block */}
        <div className="glass-card p-5 rounded-3xl space-y-4">
          <div className="flex items-center gap-2 text-violet-500 font-bold text-xs uppercase tracking-wider">
            <Moon className="w-4 h-4" /> Evening
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={inputEvening}
              onChange={(e) => setInputEvening(e.target.value)}
              placeholder="Add evening task..."
              className="flex-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
            />
            <button
              onClick={() => {
                addTask('evening', inputEvening);
                setInputEvening('');
              }}
              className="p-2 rounded-xl bg-violet-600 text-white font-bold"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {planner.evening.map((t) => (
              <div key={t.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs">
                <span
                  onClick={() => toggleTask('evening', t.id)}
                  className={`cursor-pointer font-medium ${t.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}
                >
                  {t.text}
                </span>
                <button onClick={() => deleteTask('evening', t.id)} className="text-rose-500 p-1">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Daily Notes */}
      <div className="glass-card p-6 rounded-3xl space-y-3">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
          Daily Notes & High Priority Items
        </label>
        <textarea
          rows={3}
          value={planner.notes}
          onChange={(e) => setPlanner({ ...planner, notes: e.target.value })}
          placeholder="Jot down notes or reflections for today..."
          className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none resize-none"
        />
      </div>
    </div>
  );
};
