import React, { useState, useEffect } from 'react';
import { PieChart, Plus, Trash2, DollarSign, Wallet } from 'lucide-react';

interface BudgetItem {
  id: string;
  category: string;
  budgeted: number;
  spent: number;
}

interface MonthlyBudgetPlannerToolProps {
  onShowToast: (message: string) => void;
}

export const MonthlyBudgetPlannerTool: React.FC<MonthlyBudgetPlannerToolProps> = ({ onShowToast }) => {
  const [items, setItems] = useState<BudgetItem[]>(() => {
    try {
      const saved = localStorage.getItem('splitdrop-budget-planner');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: '1', category: 'Housing & Rent', budgeted: 1500, spent: 1500 },
      { id: '2', category: 'Food & Groceries', budgeted: 600, spent: 420 },
      { id: '3', category: 'Entertainment', budgeted: 200, spent: 180 }
    ];
  });

  const [category, setCategory] = useState<string>('');
  const [budgeted, setBudgeted] = useState<string>('');
  const [spent, setSpent] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('splitdrop-budget-planner', JSON.stringify(items));
  }, [items]);

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    const bAmt = parseFloat(budgeted);
    const sAmt = parseFloat(spent) || 0;

    if (!category.trim() || isNaN(bAmt) || bAmt <= 0) {
      onShowToast('Enter valid category and budgeted amount.');
      return;
    }

    const newItem: BudgetItem = {
      id: Date.now().toString(),
      category: category.trim(),
      budgeted: bAmt,
      spent: sAmt
    };

    setItems([...items, newItem]);
    setCategory('');
    setBudgeted('');
    setSpent('');
    onShowToast('Budget category added.');
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    onShowToast('Category removed.');
  };

  const totalBudgeted = items.reduce((acc, i) => acc + i.budgeted, 0);
  const totalSpent = items.reduce((acc, i) => acc + i.spent, 0);
  const totalRemaining = totalBudgeted - totalSpent;
  const overallProgress = totalBudgeted ? Math.min(100, Math.round((totalSpent / totalBudgeted) * 100)) : 0;

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>📊</span> Monthly Budget Planner
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Plan category budgets, track spending against caps, and calculate remaining allowance locally.
        </p>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Budgeted</span>
          <p className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-1">${totalBudgeted.toFixed(2)}</p>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Spent</span>
          <p className="text-xl font-black text-amber-500 mt-1">${totalSpent.toFixed(2)}</p>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Remaining</span>
          <p className={`text-xl font-black mt-1 ${totalRemaining >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            ${totalRemaining.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="glass-card p-6 rounded-3xl space-y-2">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-slate-500">Overall Budget Utilized</span>
          <span className="text-indigo-600 dark:text-indigo-400">{overallProgress}%</span>
        </div>
        <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              overallProgress > 90 ? 'bg-rose-500' : overallProgress > 75 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Add Form */}
      <form onSubmit={addItem} className="glass-card p-6 rounded-3xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Category Name (e.g. Travel)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
          />

          <input
            type="number"
            step="0.01"
            placeholder="Budget Cap ($)"
            value={budgeted}
            onChange={(e) => setBudgeted(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
          />

          <input
            type="number"
            step="0.01"
            placeholder="Amount Spent ($)"
            value={spent}
            onChange={(e) => setSpent(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-md flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Category Budget
        </button>
      </form>

      {/* Items List */}
      <div className="space-y-3">
        {items.map((item) => {
          const pct = item.budgeted ? Math.min(100, Math.round((item.spent / item.budgeted) * 100)) : 0;
          return (
            <div key={item.id} className="glass-card p-4 rounded-2xl space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-900 dark:text-white">{item.category}</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-slate-600 dark:text-slate-300">
                    ${item.spent.toFixed(2)} / ${item.budgeted.toFixed(2)}
                  </span>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="p-1 text-rose-500 hover:bg-rose-500/10 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${pct > 100 ? 'bg-rose-500' : 'bg-indigo-600'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
