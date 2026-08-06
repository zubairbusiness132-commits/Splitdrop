import React, { useState, useEffect } from 'react';
import { Flame, Plus, Check, Trash2, Award } from 'lucide-react';

interface Habit {
  id: string;
  name: string;
  streak: number;
  completedToday: boolean;
  history: string[]; // dates YYYY-MM-DD
}

interface HabitTrackerToolProps {
  onShowToast: (message: string) => void;
}

export const HabitTrackerTool: React.FC<HabitTrackerToolProps> = ({ onShowToast }) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
      const saved = localStorage.getItem('splitdrop-habits');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: '1',
        name: 'Drink 2L Water',
        streak: 3,
        completedToday: false,
        history: []
      },
      {
        id: '2',
        name: '30 Mins Daily Reading',
        streak: 5,
        completedToday: true,
        history: [todayStr]
      }
    ];
  });

  const [inputHabit, setInputHabit] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('splitdrop-habits', JSON.stringify(habits));
  }, [habits]);

  const addHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputHabit.trim()) return;

    const newHabit: Habit = {
      id: Date.now().toString(),
      name: inputHabit.trim(),
      streak: 0,
      completedToday: false,
      history: []
    };

    setHabits([...habits, newHabit]);
    setInputHabit('');
    onShowToast('New habit added!');
  };

  const toggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        const isDone = !h.completedToday;
        const updatedStreak = isDone ? h.streak + 1 : Math.max(0, h.streak - 1);
        const updatedHistory = isDone
          ? [...new Set([...h.history, todayStr])]
          : h.history.filter((d) => d !== todayStr);

        return {
          ...h,
          completedToday: isDone,
          streak: updatedStreak,
          history: updatedHistory
        };
      })
    );
  };

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    onShowToast('Habit removed.');
  };

  const completedCount = habits.filter((h) => h.completedToday).length;
  const completionRate = habits.length ? Math.round((completedCount / habits.length) * 100) : 0;

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🔥</span> Daily Habit & Streak Tracker
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Build habits, track daily completion streaks, and monitor progress 100% offline.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-extrabold text-amber-500 bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/20">
          <Award className="w-4 h-4" /> Today: {completionRate}% Completed
        </div>
      </div>

      {/* Add Habit Form */}
      <form onSubmit={addHabit} className="glass-card p-4 rounded-2xl flex gap-2">
        <input
          type="text"
          value={inputHabit}
          onChange={(e) => setInputHabit(e.target.value)}
          placeholder="New habit name (e.g. Read 20 pages, Exercise)..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors flex items-center gap-1 shadow-md"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </form>

      {/* Habit Cards */}
      <div className="space-y-3">
        {habits.length === 0 ? (
          <div className="glass-card p-8 rounded-3xl text-center text-slate-400 text-xs">
            No habits added yet. Start by adding a daily habit above!
          </div>
        ) : (
          habits.map((habit) => (
            <div
              key={habit.id}
              className={`glass-card p-4 rounded-2xl flex items-center justify-between gap-4 transition-all ${
                habit.completedToday ? 'border-2 border-emerald-500/30 bg-emerald-500/5' : ''
              }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <button
                  onClick={() => toggleHabit(habit.id)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110 shrink-0 ${
                    habit.completedToday
                      ? 'bg-emerald-500 text-white'
                      : 'border-2 border-slate-300 dark:border-slate-700 text-transparent'
                  }`}
                >
                  <Check className="w-4 h-4" />
                </button>

                <div className="flex-1 min-w-0">
                  <h4 className={`text-xs font-bold text-slate-900 dark:text-white truncate ${habit.completedToday ? 'line-through text-slate-400' : ''}`}>
                    {habit.name}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-500 mt-0.5">
                    <Flame className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{habit.streak} Day Streak</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => deleteHabit(habit.id)}
                className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
