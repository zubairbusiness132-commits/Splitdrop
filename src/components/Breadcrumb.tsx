import React from 'react';
import { BreadcrumbItem } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate?: (path: string) => void;
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, onNavigate, className = '' }) => {
  const { t } = useLanguage();

  return (
    <nav aria-label="Breadcrumb" className={`flex items-center flex-wrap gap-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium ${className}`}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const displayLabel = item.label === 'Home' ? t('home', 'Home') : item.label;

        return (
          <React.Fragment key={index}>
            {index > 0 && <span className="text-slate-400 dark:text-slate-600 select-none">/</span>}
            {isLast || !item.path ? (
              <span className="text-slate-900 dark:text-white font-extrabold truncate max-w-[180px] sm:max-w-none" aria-current="page">
                {displayLabel}
              </span>
            ) : (
              <a
                href={item.path}
                onClick={(e) => {
                  if (onNavigate && item.path) {
                    e.preventDefault();
                    onNavigate(item.path);
                  }
                }}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none focus:underline"
              >
                {displayLabel}
              </a>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
