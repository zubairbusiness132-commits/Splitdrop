import React, { useState } from 'react';
import { Search, Moon, Sun, ChevronDown, Wrench } from 'lucide-react';
import { TOOLS_DATA } from '../data/toolsData';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenSearch: () => void;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  onOpenSearch,
  currentPath,
  onNavigate,
}) => {
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/');
          }}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm group-hover:scale-105 transition-transform">
            SD
          </div>
          <div>
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
              SplitDrop
            </span>
            <span className="hidden sm:inline-block text-[10px] font-extrabold uppercase ml-2 px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              Tools Suite
            </span>
          </div>
        </a>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-2 font-medium text-xs lg:text-sm text-slate-600 dark:text-slate-300">
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); onNavigate('/'); }}
            className={`px-3.5 py-2 rounded-xl transition-colors ${
              currentPath === '/' || currentPath === '/index.html'
                ? 'text-indigo-600 font-bold bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/50'
                : 'hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            SplitDrop
          </a>

          {/* Tools Dropdown */}
          <div className="relative">
            <button
              onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
              onBlur={() => setTimeout(() => setToolsDropdownOpen(false), 200)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Wrench className="w-4 h-4 text-indigo-600" /> Free Tools <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            {toolsDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none p-2 space-y-1 animate-fadeIn">
                {TOOLS_DATA.map((tool) => (
                  <a
                    key={tool.id}
                    href={tool.path}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(tool.path);
                      setToolsDropdownOpen(false);
                    }}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold transition-colors ${
                      currentPath === tool.path
                        ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-lg">{tool.icon}</span>
                    <span className="truncate">{tool.navTitle}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Quick Search */}
          <div className="relative hidden sm:block">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
              <Search className="w-3.5 h-3.5" />
            </span>
            <input
              type="text"
              readOnly
              onClick={onOpenSearch}
              placeholder="Search tools..."
              className="bg-slate-100 dark:bg-slate-800/80 border-none rounded-full py-1.5 pl-9 pr-4 text-xs w-48 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 cursor-pointer focus:ring-2 focus:ring-indigo-500 transition-all hover:bg-slate-200/80 dark:hover:bg-slate-800"
            />
          </div>

          <button
            onClick={onOpenSearch}
            className="sm:hidden p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Toggle theme"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
