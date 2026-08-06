import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Plus, Trash2, Tag, Calendar, AlertCircle } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  createdAt: string;
}

interface TodoListToolProps {
  onShowToast: (message: string) => void;
}

export const TodoListTool: React.FC<TodoListToolProps> = ({ onShowToast }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('splitdrop-todo-tasks');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: '1',
        title: 'Complete SplitDrop Security suite testing',
        completed: false,
        priority: 'high',
        category: 'Work',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Review backup passwords and encryption keys',
        completed: true,
        priority: 'medium',
        category: 'Security',
        createdAt: new Date().toISOString()
      }
    ];
  });

  const [inputTitle, setInputTitle] = useState<string>('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [category, setCategory] = useState<string>('General');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    localStorage.setItem('splitdrop-todo-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputTitle.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: inputTitle.trim(),
      completed: false,
      priority,
      category,
      createdAt: new Date().toISOString()
    };

    setTasks([newTask, ...tasks]);
    setInputTitle('');
    onShowToast('Task added!');
  };

  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    onShowToast('Task removed.');
  };

  const clearCompleted = () => {
    setTasks(prev => prev.filter(t => !t.completed));
    onShowToast('Completed tasks cleared.');
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const getPriorityBadge = (p: 'low' | 'medium' | 'high') => {
    if (p === 'high') return <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold text-[10px]">High</span>;
    if (p === 'medium') return <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-[10px]">Medium</span>;
    return <span className="px-2 py-0.5 rounded-md bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-[10px]">Low</span>;
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>✅</span> Offline To-Do & Task Manager
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Organize tasks with priorities and categories saved locally on your device.
          </p>
        </div>

        {tasks.some(t => t.completed) && (
          <button
            onClick={clearCompleted}
            className="px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
          >
            Clear Completed
          </button>
        )}
      </div>

      {/* Task Creation Form */}
      <form onSubmit={addTask} className="glass-card p-4 sm:p-6 rounded-3xl space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputTitle}
            onChange={(e) => setInputTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-md flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Task
          </button>
        </div>

        <div className="flex flex-wrap gap-4 text-xs font-medium">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-bold">Priority:</span>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-bold">Category:</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs"
            >
              <option value="General">General</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Security">Security</option>
            </select>
          </div>
        </div>
      </form>

      {/* Filter Tabs */}
      <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl gap-1 max-w-xs">
        {(['all', 'active', 'completed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold capitalize transition-all ${
              filter === tab
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="glass-card p-8 rounded-3xl text-center text-slate-400 text-xs">
            No tasks found in this section.
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`glass-card p-4 rounded-2xl flex items-center justify-between gap-4 transition-all ${
                task.completed ? 'opacity-60 bg-slate-50/50 dark:bg-slate-900/40' : ''
              }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <button
                  onClick={() => toggleTask(task.id)}
                  className="p-1 text-indigo-600 dark:text-indigo-400 hover:scale-110 transition-transform shrink-0"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <span
                    className={`text-xs font-bold block truncate text-slate-900 dark:text-white ${
                      task.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''
                    }`}
                  >
                    {task.title}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    {getPriorityBadge(task.priority)}
                    <span className="text-[10px] text-slate-400 font-medium">#{task.category}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => deleteTask(task.id)}
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
