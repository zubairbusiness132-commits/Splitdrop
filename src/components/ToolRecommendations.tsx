import React from 'react';
import { ToolMeta } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { getLinkUrl } from '../lib/paths';
import { ArrowRight, Sparkles, Layers, Zap } from 'lucide-react';

interface ToolRecommendationsProps {
  currentTool: ToolMeta;
  allTools: ToolMeta[];
  onNavigate: (path: string) => void;
}

export const ToolRecommendations: React.FC<ToolRecommendationsProps> = ({
  currentTool,
  allTools,
  onNavigate,
}) => {
  const { t } = useLanguage();

  const otherTools = allTools.filter((t) => t.id !== currentTool.id);

  // Related Tools (Same Category)
  const categoryTools = otherTools.filter((t) => t.category === currentTool.category);

  // Frequently Used Together (Matching Tags)
  const tagTools = otherTools.filter(
    (t) =>
      t.category !== currentTool.category &&
      t.tags &&
      currentTool.tags &&
      t.tags.some((tag) => currentTool.tags?.includes(tag))
  );

  // You May Also Like (Popular / Trending / Random)
  const trendingTools = otherTools.filter((t) => t.trending || t.featured || t.editorsPick);

  const relatedList = (categoryTools.length > 0 ? categoryTools : otherTools).slice(0, 3);
  const togetherList = (tagTools.length > 0 ? tagTools : trendingTools).slice(0, 3);
  const recommendedList = (trendingTools.length > 0 ? trendingTools : otherTools).slice(0, 3);

  return (
    <div className="space-y-8 my-10 border-t border-slate-200/80 dark:border-slate-800 pt-8">
      
      {/* 1. Related Tools (Category) */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
            {t('relatedTools', 'Related Tools')}
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {relatedList.map((tool) => (
            <div
              key={tool.id}
              onClick={() => onNavigate(getLinkUrl(tool.path))}
              className="glass-card p-4 rounded-2xl cursor-pointer hover:border-indigo-500/40 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{tool.icon}</span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {tool.navTitle}
                  </h4>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {tool.description}
                </p>
              </div>
              <div className="mt-3 pt-2 flex items-center justify-between text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">
                <span>{tool.category}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Frequently Used Together */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
            {t('frequentlyUsedTogether', 'Frequently Used Together')}
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {togetherList.map((tool) => (
            <div
              key={tool.id}
              onClick={() => onNavigate(getLinkUrl(tool.path))}
              className="glass-card p-4 rounded-2xl cursor-pointer hover:border-indigo-500/40 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{tool.icon}</span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {tool.navTitle}
                  </h4>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {tool.description}
                </p>
              </div>
              <div className="mt-3 pt-2 flex items-center justify-between text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">
                <span className="truncate">{tool.tags ? tool.tags.slice(0, 2).join(' • ') : tool.category}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. You May Also Like */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-emerald-500" />
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
            {t('youMayAlsoLike', 'You May Also Like')}
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {recommendedList.map((tool) => (
            <div
              key={tool.id}
              onClick={() => onNavigate(getLinkUrl(tool.path))}
              className="glass-card p-4 rounded-2xl cursor-pointer hover:border-indigo-500/40 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{tool.icon}</span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {tool.navTitle}
                  </h4>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {tool.description}
                </p>
              </div>
              <div className="mt-3 pt-2 flex items-center justify-between text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">
                <span>{tool.badge || 'Trending'}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
