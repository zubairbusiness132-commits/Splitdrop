import React from 'react';
import { BreadcrumbItem } from '../types';

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate?: (path: string) => void;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, onNavigate }) => {
  return (
    <nav className="mb-6 flex items-center text-xs sm:text-sm text-gray-500 dark:text-slate-400 font-medium">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            {index > 0 && <span className="mx-2 text-gray-400 dark:text-slate-600">/</span>}
            {isLast || !item.path ? (
              <span className="text-gray-900 dark:text-white font-semibold">{item.label}</span>
            ) : (
              <a
                href={item.path}
                onClick={(e) => {
                  if (onNavigate && item.path) {
                    e.preventDefault();
                    onNavigate(item.path);
                  }
                }}
                className="hover:text-rose-500 transition-colors"
              >
                {item.label}
              </a>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
