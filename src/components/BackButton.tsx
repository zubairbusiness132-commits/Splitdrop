import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getLinkUrl } from '../lib/paths';

interface BackButtonProps {
  onNavigate: (path: string) => void;
  className?: string;
  label?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  onNavigate,
  className = '',
  label,
}) => {
  const { t } = useLanguage();
  const displayLabel = label || t('back', 'Back');

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Check if browser history exists and referrer belongs to same host
    if (window.history.length > 1 && document.referrer && document.referrer.includes(window.location.host)) {
      window.history.back();
    } else {
      // Fallback redirect safely to SplitDrop homepage
      onNavigate(getLinkUrl('/'));
    }
  };

  return (
    <button
      onClick={handleBack}
      type="button"
      aria-label={displayLabel}
      className={`inline-flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2 rounded-xl bg-white/80 dark:bg-slate-900/80 hover:bg-white/95 dark:hover:bg-slate-800/90 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 border border-white/60 dark:border-white/10 hover:border-indigo-300 dark:hover:border-indigo-800 shadow-sm backdrop-blur-xl transition-all duration-200 hover:-translate-x-0.5 active:scale-95 min-h-[44px] text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 group cursor-pointer shrink-0 ${className}`}
    >
      <ArrowLeft className="w-4 h-4 text-indigo-600 dark:text-indigo-400 group-hover:-translate-x-1 transition-transform shrink-0" />
      <span>{displayLabel}</span>
    </button>
  );
};
