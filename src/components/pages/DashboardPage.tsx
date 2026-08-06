import React, { useState, useEffect } from 'react';
import { getTranslatedTools } from '../../data/toolsData';
import { useLanguage } from '../../context/LanguageContext';
import { getFavorites, toggleFavorite, getRecentTools, getToolStats, getSavedUserDataSummary, RecentToolItem } from '../../lib/userStore';
import { getLinkUrl } from '../../lib/paths';
import { ToolMeta, ToolId } from '../../types';
import { Star, Clock, FileText, Download, Activity, ArrowRight, Trash2, LayoutDashboard, Sparkles, FolderCheck } from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (path: string) => void;
  onShowToast: (msg: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, onShowToast }) => {
  const { currentLang, t } = useLanguage();
  const allTools = getTranslatedTools(currentLang);

  const [favIds, setFavIds] = useState<ToolId[]>(() => getFavorites());
  const [recentList, setRecentList] = useState<RecentToolItem[]>(() => getRecentTools());
  const [toolStats, setToolStats] = useState(() => getToolStats());
  const [userSummary, setUserSummary] = useState(() => getSavedUserDataSummary());

  useEffect(() => {
    const handleFavUpdate = () => setFavIds(getFavorites());
    const handleRecentUpdate = () => setRecentList(getRecentTools());
    const handleStatsUpdate = () => setToolStats(getToolStats());

    window.addEventListener('splitdrop_favorites_updated', handleFavUpdate);
    window.addEventListener('splitdrop_recent_updated', handleRecentUpdate);
    window.addEventListener('splitdrop_download_recorded', handleStatsUpdate);

    return () => {
      window.removeEventListener('splitdrop_favorites_updated', handleFavUpdate);
      window.removeEventListener('splitdrop_recent_updated', handleRecentUpdate);
      window.removeEventListener('splitdrop_download_recorded', handleStatsUpdate);
    };
  }, []);

  const handleRemoveFavorite = (id: ToolId, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(id);
    onShowToast(t('removedFavorite', 'Removed from favorites'));
  };

  const favoriteTools = allTools.filter((tool) => favIds.includes(tool.id));
  const recentToolMetas = recentList
    .map((item) => ({
      tool: allTools.find((t) => t.id === item.id),
      timestamp: item.timestamp,
    }))
    .filter((item): item is { tool: ToolMeta; timestamp: number } => item.tool !== undefined);

  // Stats calculation
  const totalUses = Object.values(toolStats).reduce((acc, curr) => acc + (curr.useCount || 0), 0);
  const totalDownloads = Object.values(toolStats).reduce((acc, curr) => acc + (curr.downloadCount || 0), 0);

  // Format relative time helper
  const formatTimeAgo = (time: number) => {
    const diffMin = Math.floor((Date.now() - time) / 60000);
    if (diffMin < 1) return t('justNow', 'Just now');
    if (diffMin < 60) return `${diffMin}m ${t('ago', 'ago')}`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ${t('ago', 'ago')}`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ${t('ago', 'ago')}`;
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border border-white/60 dark:border-white/10 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center font-bold">
            <LayoutDashboard className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              {t('userDashboard', 'User Productivity Dashboard')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
              {t('localDashboardDesc', '100% private local browser storage. Manage your favorite tools, history & saved assets.')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 text-xs font-bold text-indigo-700 dark:text-indigo-300">
          <Sparkles className="w-4 h-4" />
          <span>{t('offlineFirstMode', 'Offline-First Storage')}</span>
        </div>
      </div>

      {/* Usage Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
            <Star className="w-5 h-5 fill-amber-500" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t('favoritesCount', 'Favorites')}</span>
            <div className="text-xl font-black text-slate-900 dark:text-white">{favoriteTools.length}</div>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t('totalToolUses', 'Tool Executions')}</span>
            <div className="text-xl font-black text-slate-900 dark:text-white">{totalUses}</div>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t('totalDownloads', 'Total Downloads')}</span>
            <div className="text-xl font-black text-slate-900 dark:text-white">{totalDownloads}</div>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
            <FolderCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t('savedAssets', 'Saved Documents')}</span>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {userSummary.resumesCount + userSummary.notesCount + userSummary.habitCount + userSummary.expenseCount}
            </div>
          </div>
        </div>
      </div>

      {/* 1. Favorite Tools */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span>{t('favoriteTools', 'Favorite Tools')}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold">
              {favoriteTools.length}
            </span>
          </h2>
        </div>

        {favoriteTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteTools.map((tool) => (
              <div
                key={tool.id}
                onClick={() => onNavigate(getLinkUrl(tool.path))}
                className="glass-card p-5 rounded-2xl cursor-pointer hover:border-indigo-500/40 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">{tool.icon}</span>
                    <button
                      onClick={(e) => handleRemoveFavorite(tool.id, e)}
                      className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-500/10 transition-colors"
                      title={t('removeFavorite', 'Remove Favorite')}
                    >
                      <Star className="w-4 h-4 fill-amber-500" />
                    </button>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                    {tool.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400 font-bold">
                  <span>{tool.category}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-8 rounded-2xl text-center text-slate-500 dark:text-slate-400 space-y-2">
            <Star className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="text-xs font-semibold">{t('noFavoritesYet', 'No favorite tools saved yet.')}</p>
            <p className="text-[11px] text-slate-400">{t('favoriteTip', 'Click the ⭐ icon on any tool card or press Ctrl+D inside a tool to bookmark it here!')}</p>
          </div>
        )}
      </section>

      {/* 2. Recently Used / Continue Working */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>{t('recentlyUsedTools', 'Recently Used Tools (Continue Working)')}</span>
          </h2>
        </div>

        {recentToolMetas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentToolMetas.slice(0, 6).map(({ tool, timestamp }) => (
              <div
                key={tool.id}
                onClick={() => onNavigate(getLinkUrl(tool.path))}
                className="glass-card p-5 rounded-2xl cursor-pointer hover:border-indigo-500/40 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">{tool.icon}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {formatTimeAgo(timestamp)}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                    {tool.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400 font-bold">
                  <span>{t('continueWorking', 'Continue Working')}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-8 rounded-2xl text-center text-slate-500 dark:text-slate-400 space-y-2">
            <Clock className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="text-xs font-semibold">{t('noRecentTools', 'No recent tool activity recorded yet.')}</p>
          </div>
        )}
      </section>

      {/* 3. Local Saved Assets Summary */}
      <section className="space-y-4">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-500" />
          <span>{t('savedLocalData', 'Saved Resumes & Local Documents')}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            onClick={() => onNavigate(getLinkUrl('/resume-builder.html'))}
            className="glass-card p-5 rounded-2xl cursor-pointer hover:border-indigo-500/40 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">📄</span>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {t('savedResumes', 'Saved Resume Document')}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {userSummary.resumesCount > 0 ? t('resumeSavedInBrowser', 'Resume state active in localStorage') : t('noResumeSaved', 'No resume created yet')}
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform" />
          </div>

          <div
            onClick={() => onNavigate(getLinkUrl('/secure-notes.html'))}
            className="glass-card p-5 rounded-2xl cursor-pointer hover:border-indigo-500/40 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">📝</span>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {t('savedNotes', 'Encrypted Secure Notes')}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {userSummary.notesCount} {t('notesSaved', 'encrypted note(s) stored locally')}
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </section>

    </div>
  );
};
