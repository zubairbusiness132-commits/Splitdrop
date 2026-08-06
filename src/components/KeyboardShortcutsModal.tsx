import React, { useEffect } from 'react';
import { X, Keyboard } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Ctrl + K  /  ⌘ + K', desc: t('shortcutSearch', 'Open global search modal') },
    { key: 'Ctrl + D  /  ⌘ + D', desc: t('shortcutFavorite', 'Bookmark / Favorite active tool') },
    { key: 'Ctrl + /  /  ⌘ + /', desc: t('shortcutHelp', 'Toggle Keyboard Shortcuts modal') },
    { key: 'Esc', desc: t('shortcutEsc', 'Close active dialog or overlay') },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xl animate-fadeIn">
      <div className="w-full max-w-md bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xl border border-white/60 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              {t('keyboardShortcuts', 'Keyboard Shortcuts')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          {shortcuts.map((item, idx) => (
            <div key={idx} className="glass-card p-3 rounded-2xl flex items-center justify-between gap-3 text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">{item.desc}</span>
              <kbd className="px-2.5 py-1 rounded-lg bg-slate-200/80 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono text-[11px] font-bold shadow-xs shrink-0">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-center text-slate-400 font-medium">
          {t('shortcutTip', 'Press Esc anytime to close this modal.')}
        </p>
      </div>
    </div>
  );
};
