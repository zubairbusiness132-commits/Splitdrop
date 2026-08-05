import React, { useState } from 'react';
import { Search, Moon, Sun, ChevronDown, Wrench, Globe } from 'lucide-react';
import { getTranslatedTools } from '../data/toolsData';
import { SUPPORTED_LANGUAGES, LanguageCode } from '../lib/i18n';
import { useLanguage } from '../context/LanguageContext';
import { getLinkUrl } from '../lib/paths';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenSearch: () => void;
  currentPath: string;
  onNavigate: (path: string) => void;
  currentLang: LanguageCode;
  onChangeLang: (lang: LanguageCode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  onOpenSearch,
  currentPath,
  onNavigate,
  currentLang,
  onChangeLang,
}) => {
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const { t } = useLanguage();

  const translatedTools = getTranslatedTools(currentLang);
  const activeLangObj = SUPPORTED_LANGUAGES.find(l => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="w-full backdrop-blur-xl bg-white/75 dark:bg-slate-900/75 border-b border-white/60 dark:border-white/10 shadow-sm shadow-slate-900/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        
        {/* Brand Logo */}
        <a
          href={getLinkUrl('/')}
          onClick={(e) => {
            e.preventDefault();
            onNavigate(getLinkUrl('/'));
          }}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            SD
          </div>
          <div>
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              SplitDrop
            </span>
            <span className="hidden sm:inline-block text-[10px] font-extrabold uppercase ml-2 px-2 py-0.5 rounded-full bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 shadow-xs">
              Tools Suite
            </span>
          </div>
        </a>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-2 font-medium text-xs lg:text-sm text-slate-600 dark:text-slate-300">
          <a
            href={getLinkUrl('/')}
            onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/')); }}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              currentPath === '/' || currentPath === '/index.html'
                ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-200/50 dark:border-indigo-800/50 shadow-xs'
                : 'hover:text-indigo-600 hover:bg-white/60 dark:hover:bg-slate-800/60'
            }`}
          >
            SplitDrop
          </a>

          {/* Tools Dropdown */}
          <div className="relative">
            <button
              onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
              onBlur={() => setTimeout(() => setToolsDropdownOpen(false), 200)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all cursor-pointer"
            >
              <Wrench className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> {t('freeTools', 'Free Tools')} <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            {toolsDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xl border border-white/60 dark:border-white/10 rounded-2xl shadow-2xl p-2 space-y-1 animate-fadeIn z-50">
                {translatedTools.map((tool) => (
                  <a
                    key={tool.id}
                    href={getLinkUrl(tool.path)}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(getLinkUrl(tool.path));
                      setToolsDropdownOpen(false);
                    }}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold transition-all ${
                      currentPath === tool.path
                        ? 'bg-indigo-50/90 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-100 dark:border-indigo-900/50'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-800/60'
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
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Search */}
          <div className="relative hidden sm:block">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
              <Search className="w-3.5 h-3.5" />
            </span>
            <input
              type="text"
              readOnly
              onClick={onOpenSearch}
              placeholder={t('search', 'Search tools...')}
              className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/50 dark:border-white/10 rounded-full py-1.5 pl-9 pr-4 text-xs w-36 lg:w-48 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 cursor-pointer focus:ring-2 focus:ring-indigo-500/50 transition-all hover:bg-white/90 dark:hover:bg-slate-800/90 shadow-xs"
            />
          </div>

          <button
            onClick={onOpenSearch}
            className="sm:hidden p-2 rounded-full hover:bg-white/60 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-300"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Multi-Language Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              onBlur={() => setTimeout(() => setLangDropdownOpen(false), 200)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border border-white/50 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-white/90 dark:hover:bg-slate-700/90 transition-all shadow-xs"
              title={t('selectLanguage', 'Select Language')}
            >
              <span>{activeLangObj.flag}</span>
              <span className="uppercase text-[11px] hidden xs:inline-block">{activeLangObj.code}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {langDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xl border border-white/60 dark:border-white/10 rounded-2xl shadow-2xl p-1.5 space-y-0.5 max-h-80 overflow-y-auto z-50">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase border-b border-slate-100 dark:border-slate-800 flex items-center gap-1">
                  <Globe className="w-3 h-3" /> {t('selectLanguage', 'Select Language')}
                </div>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onChangeLang(lang.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all ${
                      currentLang === lang.code
                        ? 'bg-indigo-50/90 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.nativeName}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase">{lang.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-full hover:bg-white/60 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-300 transition-all"
            title={darkMode ? t('themeLight', 'Light Mode') : t('themeDark', 'Dark Mode')}
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
