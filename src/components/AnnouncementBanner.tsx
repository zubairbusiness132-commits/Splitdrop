import React from 'react';
import { ANNOUNCEMENTS_CONFIG, AnnouncementItem } from '../data/announcementsData';

interface AnnouncementBannerProps {
  position: 'top' | 'bottom';
  onNavigate?: (path: string) => void;
  customMessages?: AnnouncementItem[];
  speedSeconds?: number;
}

export const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({
  position,
  onNavigate,
  customMessages,
  speedSeconds,
}) => {
  const messages = customMessages || (position === 'top' ? ANNOUNCEMENTS_CONFIG.topMessages : ANNOUNCEMENTS_CONFIG.bottomMessages);
  const animSpeed = speedSeconds || (position === 'top' ? ANNOUNCEMENTS_CONFIG.topTickerSpeedSeconds : ANNOUNCEMENTS_CONFIG.bottomTickerSpeedSeconds) || 38;

  const getBadgeStyle = (color?: string) => {
    switch (color) {
      case 'rose':
        return 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-400/40 dark:border-rose-800/60';
      case 'emerald':
        return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-400/40 dark:border-emerald-800/60';
      case 'indigo':
        return 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-400/40 dark:border-indigo-800/60';
      case 'violet':
        return 'bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-400/40 dark:border-violet-800/60';
      case 'amber':
        return 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-400/40 dark:border-amber-800/60';
      case 'blue':
      default:
        return 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-400/40 dark:border-blue-800/60';
    }
  };

  // Render a single sequence of messages
  const renderMessageSequence = (keyPrefix: string) => (
    <div key={keyPrefix} className="flex items-center gap-8 pr-8 shrink-0">
      {messages.map((item, idx) => {
        const isClickable = Boolean(item.link && onNavigate);

        return (
          <div
            key={`${keyPrefix}-${item.id}-${idx}`}
            onClick={() => {
              if (item.link && onNavigate) {
                onNavigate(item.link);
              }
            }}
            className={`inline-flex items-center gap-2 whitespace-nowrap text-xs font-semibold tracking-wide transition-colors ${
              isClickable
                ? 'cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-300'
                : 'text-slate-800 dark:text-slate-200'
            }`}
          >
            {/* Icon / Emoji */}
            {item.icon && <span className="text-sm select-none">{item.icon}</span>}

            {/* Badge */}
            {item.badge && (
              <span
                className={`px-1.5 py-0.5 text-[10px] font-extrabold rounded-md border tracking-wider uppercase select-none ${getBadgeStyle(
                  item.badgeColor
                )}`}
              >
                {item.badge}
              </span>
            )}

            {/* Message Text */}
            <span>{item.text}</span>

            {/* Bullet Separator between items */}
            <span className="text-slate-400 dark:text-slate-600 text-xs ml-4 select-none">•</span>
          </div>
        );
      })}
    </div>
  );

  const isTop = position === 'top';

  return (
    <div
      role="region"
      aria-label={isTop ? 'Announcement Ticker' : 'Latest Updates Ticker'}
      className={`no-print relative w-full h-9 sm:h-10 overflow-hidden flex items-center select-none ${
        isTop
          ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 text-slate-900 dark:text-white shadow-2xs'
          : 'bg-white/75 dark:bg-slate-900/75 backdrop-blur-md border-t border-b border-slate-200/80 dark:border-slate-800/80 text-slate-900 dark:text-white my-6 max-w-7xl mx-auto rounded-2xl shadow-2xs'
      }`}
    >
      {/* Left/Right Edge Fade Masks for smooth gradient blending */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-r from-slate-100 dark:from-slate-950 to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-slate-100 dark:from-slate-950 to-transparent z-10" />

      {/* Label Badge (Fixed on Left on Tablet/Desktop for crisp SaaS branding) */}
      <div className="shrink-0 z-20 pl-3 pr-2 hidden sm:flex items-center">
        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-600 text-white shadow-2xs flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {isTop ? 'LATEST' : 'UPDATES'}
        </span>
      </div>

      {/* Infinite Scrolling Marquee Track Container */}
      <div className="ticker-container flex-1 overflow-hidden relative flex items-center h-full">
        <div
          className={isTop ? 'animate-ticker-marquee' : 'animate-ticker-marquee-reverse'}
          style={{ animationDuration: `${animSpeed}s` }}
        >
          {/* Track Copy 1 */}
          {renderMessageSequence('track-1')}
          {/* Duplicate Track Copy 2 for seamless loop without jump/gap */}
          {renderMessageSequence('track-2')}
        </div>
      </div>
    </div>
  );
};
