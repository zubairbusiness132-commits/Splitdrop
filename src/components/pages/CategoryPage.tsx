import React, { useState } from 'react';
import { getTranslatedTools } from '../../data/toolsData';
import { useLanguage } from '../../context/LanguageContext';
import { getLinkUrl } from '../../lib/paths';
import { toggleFavorite, isFavorite } from '../../lib/userStore';
import { ArrowRight, CheckCircle2, Star, Filter, Sparkles } from 'lucide-react';

interface CategoryPageProps {
  categorySlug?: string;
  onNavigate: (path: string) => void;
  onShowToast: (msg: string) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  categorySlug,
  onNavigate,
  onShowToast,
}) => {
  const { currentLang, t } = useLanguage();
  const allTools = getTranslatedTools(currentLang);

  const categories = [
    { slug: 'all', name: t('allCategories', 'All Tools'), icon: '⚡' },
    { slug: 'pdf-tools', name: t('pdfToolsCategory', '📄 PDF Tools'), icon: '📄' },
    { slug: 'image-tools', name: t('imageToolsCategory', '🖼️ Image Tools'), icon: '🖼️' },
    { slug: 'creator-tools', name: t('creatorToolsCategory', '🎬 Creator & Social Tools'), icon: '🎬' },
    { slug: 'career-tools', name: t('careerToolsCategory', '💼 Career & Resume Tools'), icon: '💼' },
    { slug: 'developer-tools', name: t('devToolsCategory', '👨‍💻 Developer Tools'), icon: '👨‍💻' },
    { slug: 'design-tools', name: t('designToolsCategory', '🎨 Design & Utility Tools'), icon: '🎨' },
    { slug: 'prompt-tools', name: t('promptToolsCategory', '🤖 AI Prompt Builder Tools'), icon: '🤖' },
    { slug: 'security-tools', name: t('securityCategory', '🔒 Security, Privacy & Productivity'), icon: '🔒' },
  ];

  const [activeCategory, setActiveCategory] = useState<string>(categorySlug || 'all');
  const [selectedTag, setSelectedTag] = useState<string>('All');

  // Filter tools by active category
  const filteredTools = allTools.filter((tool) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'pdf-tools') return tool.category.includes('PDF');
    if (activeCategory === 'image-tools') return tool.category.includes('Image');
    if (activeCategory === 'creator-tools') return tool.category.includes('Creator');
    if (activeCategory === 'career-tools') return tool.category.includes('Career');
    if (activeCategory === 'developer-tools') return tool.category.includes('Developer');
    if (activeCategory === 'design-tools') return tool.category.includes('Design');
    if (activeCategory === 'prompt-tools') return tool.category.includes('Prompt') || tool.category.includes('AI');
    if (activeCategory === 'security-tools') return tool.category.includes('Security') || tool.category.includes('Productivity');
    return true;
  });

  // Extract all tags from filtered tools
  const allTags = Array.from(
    new Set(filteredTools.flatMap((tool) => tool.tags || []))
  );

  const finalTools = filteredTools.filter((tool) => {
    if (selectedTag === 'All') return true;
    return tool.tags && tool.tags.includes(selectedTag);
  });

  const handleToggleFav = (id: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const added = toggleFavorite(id);
    onShowToast(added ? t('addedFavorite', 'Added to favorites!') : t('removedFavorite', 'Removed from favorites'));
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      
      {/* Category Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl text-center max-w-3xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 font-bold text-xs border border-indigo-200/60 dark:border-indigo-800/60">
          <Sparkles className="w-3.5 h-3.5" /> SplitDrop Multi-Tool Platform
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          {t('toolCategories', 'Tool Categories & Directory')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          {t('categoriesSubtitle', 'Browse hundreds of browser-based utilities organized by domain with zero installation and 100% private offline processing.')}
        </p>
      </div>

      {/* Category Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.slug;
          return (
            <button
              key={cat.slug}
              onClick={() => {
                setActiveCategory(cat.slug);
                setSelectedTag('All');
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 scale-105'
                  : 'glass-card text-slate-700 dark:text-slate-300 hover:border-indigo-500/40'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Tags Filter Pill List */}
      {allTags.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none text-xs">
          <span className="text-slate-400 font-bold flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Tags:
          </span>
          <button
            onClick={() => setSelectedTag('All')}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
              selectedTag === 'All'
                ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 font-bold'
                : 'bg-slate-100/80 dark:bg-slate-800/80 text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All ({filteredTools.length})
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all whitespace-nowrap ${
                selectedTag === tag
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-slate-100/80 dark:bg-slate-800/80 text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Tool Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {finalTools.map((tool) => {
          const fav = isFavorite(tool.id);
          return (
            <div
              key={tool.id}
              onClick={() => onNavigate(getLinkUrl(tool.path))}
              className="glass-card flex flex-col justify-between p-6 rounded-3xl group cursor-pointer hover:border-indigo-500/30 transition-all relative"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl p-3 rounded-2xl bg-indigo-50/80 dark:bg-slate-800/80 inline-block group-hover:scale-110 transition-transform">
                    {tool.icon}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => handleToggleFav(tool.id, e)}
                      className={`p-2 rounded-xl transition-all ${
                        fav
                          ? 'bg-amber-500/10 text-amber-500'
                          : 'text-slate-300 dark:text-slate-600 hover:text-amber-500'
                      }`}
                      title={fav ? 'Remove Favorite' : 'Add to Favorite'}
                    >
                      <Star className={`w-4 h-4 ${fav ? 'fill-amber-500' : ''}`} />
                    </button>
                    {tool.badge && (
                      <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-indigo-600/10 dark:bg-indigo-400/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
                        {tool.badge}
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {tool.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {tool.description}
                </p>

                <ul className="mt-4 space-y-1.5 border-t border-slate-100 dark:border-slate-800/60 pt-3">
                  {tool.features.slice(0, 3).map((f, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate(getLinkUrl(tool.path));
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 group/btn shadow-md hover:shadow-indigo-500/20"
                >
                  <span>{t('openTool', 'Open')} {tool.navTitle}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
