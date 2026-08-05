import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { Breadcrumb } from './components/Breadcrumb';
import { BackButton } from './components/BackButton';
import { SEOHead } from './components/SEOHead';
import { AdSlot } from './components/AdSlot';
import { AnnouncementBanner } from './components/AnnouncementBanner';
import { SplitDropHero } from './components/tools/SplitDropHero';
import { ImageCompressorTool } from './components/tools/ImageCompressorTool';
import { ImageConverterTool } from './components/tools/ImageConverterTool';
import { PdfMergeTool } from './components/tools/PdfMergeTool';
import { PdfSplitTool } from './components/tools/PdfSplitTool';
import { QrGeneratorTool } from './components/tools/QrGeneratorTool';
import { ResumeBuilderTool } from './components/tools/ResumeBuilderTool';

// Legal & Informational Pages
import { PrivacyPolicyPage } from './components/pages/PrivacyPolicyPage';
import { TermsPage } from './components/pages/TermsPage';
import { DisclaimerPage } from './components/pages/DisclaimerPage';
import { ContactPage } from './components/pages/ContactPage';
import { AboutPage } from './components/pages/AboutPage';

import { TOOLS_DATA, HOMEPAGE_FAQS, getTranslatedTools, getTranslatedFaqs } from './data/toolsData';
import { detectBrowserLanguage, LanguageCode, getTranslation } from './lib/i18n';
import { LanguageProvider } from './context/LanguageContext';
import { normalizePath, getLinkUrl } from './lib/paths';
import { ArrowRight, ChevronDown, CheckCircle2, Shield, Zap, Sparkles } from 'lucide-react';

export default function App() {
  // Path routing state
  const [currentPath, setCurrentPath] = useState<string>(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const redirectParam = searchParams.get('p');
      if (redirectParam) {
        const cleanPath = '/' + redirectParam.replace(/^\//, '');
        const fullUrl = getLinkUrl(cleanPath);
        window.history.replaceState({}, '', fullUrl);
        return normalizePath(cleanPath);
      }
    } catch {
      // Ignore URL parsing fallback
    }

    return normalizePath(window.location.pathname);
  });

  // Language state
  const [currentLang, setCurrentLang] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem('splitdrop-lang');
      if (saved) return saved as LanguageCode;
    } catch {
      // ignore
    }
    return detectBrowserLanguage();
  });

  // Dark Mode state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('splitdrop-theme');
      if (saved) return saved === 'dark';
    } catch {
      // ignore
    }
    try {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // Search modal state
  const [searchOpen, setSearchOpen] = useState(false);

  // Toast state
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // FAQ open states
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Apply dark mode class
  useEffect(() => {
    try {
      if (darkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('splitdrop-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('splitdrop-theme', 'light');
      }
    } catch {
      // Storage restricted
    }
  }, [darkMode]);

  // Apply RTL direction for Arabic & Urdu
  useEffect(() => {
    try {
      localStorage.setItem('splitdrop-lang', currentLang);
      if (currentLang === 'ar' || currentLang === 'ur') {
        document.documentElement.dir = 'rtl';
      } else {
        document.documentElement.dir = 'ltr';
      }
    } catch {
      // ignore
    }
  }, [currentLang]);

  // Handle popstate
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(normalizePath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    const norm = normalizePath(path);
    const fullUrl = getLinkUrl(norm);
    window.history.pushState({}, '', fullUrl);
    setCurrentPath(norm);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 2500);
  };

  const translatedTools = getTranslatedTools(currentLang);
  const translatedFaqs = getTranslatedFaqs(currentLang);

  // Find tool metadata for current page
  const activeTool = translatedTools.find((t) => {
    if (t.path === currentPath) return true;
    if (t.filename !== 'index.html' && currentPath.endsWith(t.filename)) return true;
    if (t.filename !== 'index.html' && currentPath.endsWith(t.id)) return true;
    if (t.filename !== 'index.html' && currentPath.endsWith(`/${t.id}`)) return true;
    return false;
  });

  // Static Legal/Info Page checks
  const isPrivacyPage = currentPath.includes('privacy');
  const isTermsPage = currentPath.includes('terms');
  const isDisclaimerPage = currentPath.includes('disclaimer');
  const isContactPage = currentPath.includes('contact');
  const isAboutPage = currentPath.includes('about');

  const isStaticPage = isPrivacyPage || isTermsPage || isDisclaimerPage || isContactPage || isAboutPage;

  return (
    <LanguageProvider currentLang={currentLang} onChangeLang={setCurrentLang}>
      <div className="relative min-h-screen flex flex-col font-sans bg-slate-100/90 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors selection:bg-indigo-600 selection:text-white overflow-x-hidden">
        
        {/* Subtle Ambient Background Glass Glowing Orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10" aria-hidden="true">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-500/15 dark:bg-indigo-600/15 blur-3xl animate-glass-orb-1" />
          <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-purple-500/15 dark:bg-purple-600/15 blur-3xl animate-glass-orb-2" />
          <div className="absolute -bottom-32 left-1/3 w-96 h-96 rounded-full bg-blue-500/10 dark:bg-blue-600/10 blur-3xl animate-glass-orb-1" />
        </div>

        {/* Glass Toast Banner */}
        {toastMsg && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-white/60 dark:border-white/10 text-slate-900 dark:text-white font-bold text-xs sm:text-sm shadow-2xl shadow-indigo-500/10 flex items-center gap-2 animate-bounce">
            <span className="text-emerald-500 font-black">✓</span> {toastMsg}
          </div>
        )}

        {/* Sticky Header Container with Top Announcement Bar */}
        <div className="sticky top-0 z-50 w-full">
          <AnnouncementBanner position="top" onNavigate={navigateTo} />
          <Header
            darkMode={darkMode}
            onToggleDarkMode={() => setDarkMode(!darkMode)}
            onOpenSearch={() => setSearchOpen(true)}
            currentPath={currentPath}
            onNavigate={navigateTo}
            currentLang={currentLang}
            onChangeLang={setCurrentLang}
          />
        </div>

        {/* Main Page Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-8">
          
          {/* ========================================================
              STATIC INFORMATIONAL / LEGAL PAGES
              ======================================================== */}
          {isStaticPage && (
            <div className="max-w-5xl mx-auto space-y-6">
              
              {/* Sticky Navigation Bar with Back Button & Breadcrumbs */}
              <div className="sticky top-28 z-40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl py-3 px-4 sm:px-6 -mx-4 sm:-mx-6 border-b border-white/50 dark:border-white/10 shadow-sm flex flex-wrap items-center justify-between gap-3 rounded-2xl mb-4">
                <BackButton onNavigate={navigateTo} />
                <Breadcrumb
                  items={[
                    { label: 'Home', path: getLinkUrl('/') },
                    { label: isPrivacyPage ? getTranslation(currentLang, 'privacy', 'Privacy Policy') : isTermsPage ? getTranslation(currentLang, 'terms', 'Terms') : isDisclaimerPage ? getTranslation(currentLang, 'disclaimer', 'Disclaimer') : isContactPage ? getTranslation(currentLang, 'contact', 'Contact') : getTranslation(currentLang, 'about', 'About') }
                  ]}
                  onNavigate={navigateTo}
                />
              </div>

              {isPrivacyPage && <PrivacyPolicyPage onNavigate={navigateTo} />}
              {isTermsPage && <TermsPage onNavigate={navigateTo} />}
              {isDisclaimerPage && <DisclaimerPage onNavigate={navigateTo} />}
              {isContactPage && <ContactPage onShowToast={triggerToast} />}
              {isAboutPage && <AboutPage onNavigate={navigateTo} />}
            </div>
          )}

          {/* ========================================================
              HOMEPAGE VIEW
              ======================================================== */}
          {!isStaticPage && (!activeTool || activeTool.id === 'splitdrop') && (
            <>
              <SEOHead
                title="SplitDrop — Split & Merge Images Online Free"
                description="Free online image splitter and merger. Split images cleanly along any line or combine two photos seamlessly with instant browser processing & zero uploads."
                canonicalPath="/"
                faqs={HOMEPAGE_FAQS}
              />

              {/* Hero Welcome Banner */}
              <div className="text-center max-w-2xl mx-auto my-4 sm:my-6 relative">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-indigo-950/60 backdrop-blur-md text-indigo-600 dark:text-indigo-300 font-bold text-xs mb-3 border border-indigo-200/80 dark:border-indigo-800/80 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5" /> SplitDrop Original Tool
                </span>
                <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                  {getTranslation(currentLang, 'splitAndCombine', 'Split & Combine Images Seamlessly')}
                </h1>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-3 leading-relaxed font-normal">
                  {getTranslation(currentLang, 'heroSubtitle', 'Cut an image clean down any line or join two images into a composite. Drag the line on canvas in real-time with zero server uploads.')}
                </p>
              </div>

              {/* HERO TOOL */}
              <div className="glass-panel rounded-3xl overflow-hidden max-w-3xl mx-auto">
                <SplitDropHero onShowToast={triggerToast} />
              </div>

              {/* AD PLACEMENT 1 */}
              <AdSlot type="banner" label="Advertisement" />

              {/* MORE FREE TOOLS SECTION */}
              <section className="my-12">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-slate-200/80 dark:border-slate-800">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                      {getTranslation(currentLang, 'freeTools', 'Free Multi-Tool Suite')}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                      {getTranslation(currentLang, 'moreFreeTools', 'More Free Online Tools')}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 sm:mt-0 font-medium">
                    {getTranslation(currentLang, 'fastBrowserBased', 'Fast, browser-based, zero installation required')}
                  </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {translatedTools.filter(t => t.id !== 'splitdrop').map((tool) => (
                    <div
                      key={tool.id}
                      className="glass-card flex flex-col justify-between p-6 rounded-3xl group cursor-pointer"
                      onClick={() => navigateTo(getLinkUrl(tool.path))}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-3xl p-3 rounded-2xl bg-indigo-50/80 dark:bg-slate-800/80 inline-block group-hover:scale-110 transition-transform">
                            {tool.icon}
                          </span>
                          <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50">
                            {tool.category}
                          </span>
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
                            navigateTo(getLinkUrl(tool.path));
                          }}
                          className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 group/btn shadow-md hover:shadow-indigo-500/20"
                        >
                          <span>{getTranslation(currentLang, 'openTool', 'Open')} {tool.navTitle}</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* AD PLACEMENT 2 */}
              <AdSlot type="native" label="Sponsored Content" />

              {/* FEATURES SECTION */}
              <section className="glass-panel my-12 p-8 sm:p-12 rounded-3xl text-slate-900 dark:text-white">
                <div className="max-w-3xl">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                    {getTranslation(currentLang, 'builtForSpeedAndPrivacy', 'Built for Speed & Privacy')}
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-black mt-2 leading-tight">
                    {getTranslation(currentLang, 'whyCreatorsChoose', 'Why Creators & Professionals Choose SplitDrop')}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                    Traditional web tools upload your private pictures and PDFs to distant cloud servers. SplitDrop runs 100% inside your local browser using modern HTML5 Canvas, PDF-lib, and Web Assembly.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
                  <div className="glass-card p-5 rounded-2xl">
                    <Shield className="w-7 h-7 text-indigo-600 dark:text-indigo-400 mb-3" />
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{getTranslation(currentLang, 'zeroServerUploads', 'Zero Server Uploads')}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {getTranslation(currentLang, 'zeroServerUploadsDesc', 'Your confidential files never leave your device memory. Total security.')}
                    </p>
                  </div>

                  <div className="glass-card p-5 rounded-2xl">
                    <Zap className="w-7 h-7 text-amber-500 mb-3" />
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{getTranslation(currentLang, 'instantSpeed', 'Sub-Second Processing')}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {getTranslation(currentLang, 'instantSpeedDesc', 'No upload wait times or server queue bottlenecks. Instant results.')}
                    </p>
                  </div>

                  <div className="glass-card p-5 rounded-2xl">
                    <Sparkles className="w-7 h-7 text-emerald-500 mb-3" />
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{getTranslation(currentLang, 'freeForever', 'Free Forever')}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {getTranslation(currentLang, 'freeForeverDesc', 'No watermarks, daily submission limits, or required accounts.')}
                    </p>
                  </div>
                </div>
              </section>

              {/* HOMEPAGE FAQ SECTION */}
              <section className="my-12 max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                    {getTranslation(currentLang, 'faqsTitle', 'Frequently Asked Questions')}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
                    {getTranslation(currentLang, 'faqSubtitle', 'Everything you need to know about SplitDrop and our free online tools.')}
                  </p>
                </div>

                <div className="space-y-3">
                  {translatedFaqs.map((faq, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div
                        key={idx}
                        className="glass-card rounded-2xl overflow-hidden transition-all"
                      >
                        <button
                          onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                          className="w-full p-5 text-left flex items-center justify-between gap-4 text-xs sm:text-sm font-bold text-slate-900 dark:text-white hover:text-indigo-600 transition-colors"
                        >
                          <span>{faq.question}</span>
                          <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-indigo-600' : ''}`} />
                        </button>

                        {isOpen && (
                          <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/60 leading-relaxed">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* AD PLACEMENT 3 */}
              <AdSlot type="banner" label="Advertisement" />
            </>
          )}

          {/* ========================================================
              DEDICATED TOOL PAGES
              ======================================================== */}
          {!isStaticPage && activeTool && activeTool.id !== 'splitdrop' && (
            <div className="max-w-5xl mx-auto space-y-6">
              <SEOHead
                title={`${activeTool.title} — SplitDrop`}
                description={activeTool.description}
                canonicalPath={activeTool.path}
                toolMeta={activeTool}
                breadcrumbs={[
                  { label: 'Home', path: getLinkUrl('/') },
                  { label: activeTool.navTitle }
                ]}
              />

              {/* Sticky Navigation Bar with Professional Back Button & Breadcrumbs */}
              <div className="sticky top-16 z-40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl py-3 px-4 sm:px-6 -mx-4 sm:-mx-6 border-b border-white/50 dark:border-white/10 shadow-sm flex flex-wrap items-center justify-between gap-3 rounded-2xl mb-2">
                <BackButton onNavigate={navigateTo} />
                <Breadcrumb
                  items={[
                    { label: 'Home', path: getLinkUrl('/') },
                    { label: activeTool.navTitle }
                  ]}
                  onNavigate={navigateTo}
                />
              </div>

              {/* Tool Title Banner */}
              <div className="text-center max-w-2xl mx-auto mb-4">
                <span className="text-4xl mb-2 inline-block">{activeTool.icon}</span>
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                  {activeTool.title}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {activeTool.description}
                </p>
              </div>

              {/* TOOL PAGE AD 1 */}
              <AdSlot type="banner" label="Advertisement" />

              {/* THE TOOL COMPONENT INTERFACE WRAPPED IN FROSTED GLASS */}
              <div className="glass-panel rounded-3xl overflow-hidden">
                {activeTool.id === 'image-compressor' && <ImageCompressorTool onShowToast={triggerToast} />}
                {activeTool.id === 'image-converter' && <ImageConverterTool onShowToast={triggerToast} />}
                {activeTool.id === 'pdf-merge' && <PdfMergeTool onShowToast={triggerToast} />}
                {activeTool.id === 'pdf-split' && <PdfSplitTool onShowToast={triggerToast} />}
                {activeTool.id === 'qr-generator' && <QrGeneratorTool onShowToast={triggerToast} />}
                {activeTool.id === 'resume-builder' && <ResumeBuilderTool onShowToast={triggerToast} />}
              </div>

              {/* TOOL PAGE AD 2 */}
              <AdSlot type="native" label="Sponsored Links" />

              {/* INSTRUCTIONS / HOW TO USE */}
              <section className="glass-panel my-8 p-6 sm:p-8 rounded-3xl">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                  {getTranslation(currentLang, 'howToUse', 'How to Use')} {activeTool.navTitle}
                </h3>
                <ol className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  <li className="glass-card p-4 rounded-2xl">
                    <strong className="text-indigo-600 dark:text-indigo-400 font-bold text-base block mb-1">1. {getTranslation(currentLang, 'uploadFiles', 'Upload Files')}</strong>
                    Drag and drop or select your files from your device.
                  </li>
                  <li className="glass-card p-4 rounded-2xl">
                    <strong className="text-indigo-600 dark:text-indigo-400 font-bold text-base block mb-1">2. {getTranslation(currentLang, 'configureOptions', 'Configure Options')}</strong>
                    Adjust parameters like quality, ranges, or target formats.
                  </li>
                  <li className="glass-card p-4 rounded-2xl">
                    <strong className="text-indigo-600 dark:text-indigo-400 font-bold text-base block mb-1">3. {getTranslation(currentLang, 'downloadResult', 'Download Result')}</strong>
                    Save your processed files directly to your machine or download as ZIP.
                  </li>
                </ol>
              </section>

              {/* RELATED TOOLS */}
              <section className="my-8">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                  {getTranslation(currentLang, 'relatedFreeTools', 'Related Free Tools')}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {translatedTools.filter(t => t.id !== activeTool.id).slice(0, 3).map(tool => (
                    <button
                      key={tool.id}
                      onClick={() => navigateTo(getLinkUrl(tool.path))}
                      className="glass-card p-4 rounded-2xl text-left cursor-pointer group"
                    >
                      <span className="text-2xl mb-2 inline-block">{tool.icon}</span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {tool.navTitle}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                        {tool.description}
                      </p>
                    </button>
                  ))}
                </div>
              </section>

              {/* TOOL PAGE AD 3 */}
              <AdSlot type="banner" label="Advertisement" />
            </div>
          )}
        </main>

        {/* Search Modal */}
        <SearchModal
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
          onSelectTool={navigateTo}
        />

        {/* Bottom Announcement Bar */}
        <AnnouncementBanner position="bottom" onNavigate={navigateTo} />

        {/* Footer */}
        <Footer onNavigate={navigateTo} />
      </div>
    </LanguageProvider>
  );
}
