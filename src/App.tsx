import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { Breadcrumb } from './components/Breadcrumb';
import { SEOHead } from './components/SEOHead';
import { AdSlot } from './components/AdSlot';
import { SplitDropHero } from './components/tools/SplitDropHero';
import { ImageCompressorTool } from './components/tools/ImageCompressorTool';
import { ImageConverterTool } from './components/tools/ImageConverterTool';
import { PdfMergeTool } from './components/tools/PdfMergeTool';
import { PdfSplitTool } from './components/tools/PdfSplitTool';
import { QrGeneratorTool } from './components/tools/QrGeneratorTool';
import { TOOLS_DATA, HOMEPAGE_FAQS } from './data/toolsData';
import { ArrowRight, ChevronDown, CheckCircle2, Shield, Zap, Sparkles } from 'lucide-react';

export default function App() {
  // Path routing state
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const p = window.location.pathname;
    return p === '' ? '/' : p;
  });

  // Dark Mode state with safe storage & matchMedia
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('splitdrop-theme');
      if (saved) return saved === 'dark';
    } catch {
      // Storage restricted
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

  // Handle popstate for back/forward browser buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 2500);
  };

  // Find tool metadata for current page if viewing a tool page
  const activeTool = TOOLS_DATA.find(
    (t) => t.path === currentPath || (currentPath.endsWith(t.filename) && t.filename !== 'index.html')
  );

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F1F5F9] text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors selection:bg-indigo-600 selection:text-white">
      
      {/* Toast Banner */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs sm:text-sm shadow-2xl flex items-center gap-2 animate-bounce">
          <span>✓</span> {toastMsg}
        </div>
      )}

      {/* Header */}
      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenSearch={() => setSearchOpen(true)}
        currentPath={currentPath}
        onNavigate={navigateTo}
      />

      {/* Main Page Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-8">
        
        {/* ========================================================
            HOMEPAGE VIEW (SPLITDROP IS HERO PRODUCT)
            ======================================================== */}
        {(!activeTool || activeTool.id === 'splitdrop') && (
          <>
            <SEOHead
              title="SplitDrop — Split & Merge Images Online Free"
              description="Free online image splitter and merger. Split images cleanly along any line or combine two photos seamlessly with instant browser processing & zero uploads."
              canonicalPath="/"
              faqs={HOMEPAGE_FAQS}
            />

            {/* Hero Welcome Banner */}
            <div className="text-center max-w-2xl mx-auto my-4 sm:my-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold text-xs mb-3 border border-indigo-200 dark:border-indigo-800/80">
                <Sparkles className="w-3.5 h-3.5" /> Hero Product & Original Tool
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                Split & Combine Images Seamlessly
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-3 leading-relaxed font-normal">
                Cut an image clean down any line or join two images into a composite. Drag the line on canvas in real-time with zero server uploads.
              </p>
            </div>

            {/* HERO TOOL: COMPLETE ORIGINAL SPLITDROP APPLICATION (FROSTED GLASS CONTAINER) */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden max-w-3xl mx-auto">
              <SplitDropHero onShowToast={triggerToast} />
            </div>

            {/* AD PLACEMENT 1: Banner immediately below SplitDrop */}
            <AdSlot type="banner" label="Advertisement" />

            {/* MORE FREE TOOLS SECTION */}
            <section className="my-12">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                    Free Multi-Tool Suite
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                    More Free Online Tools
                  </h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 sm:mt-0 font-medium">
                  Fast, browser-based, zero installation required
                </p>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {TOOLS_DATA.filter(t => t.id !== 'splitdrop').map((tool) => (
                  <div
                    key={tool.id}
                    className="flex flex-col justify-between p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-slate-200/40 dark:shadow-none group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-3xl p-3 rounded-2xl bg-indigo-50/80 dark:bg-slate-800/80 inline-block group-hover:scale-110 transition-transform">
                          {tool.icon}
                        </span>
                        <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {tool.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
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
                        onClick={() => navigateTo(tool.path)}
                        className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 group/btn shadow-sm"
                      >
                        <span>Open {tool.navTitle}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* AD PLACEMENT 2: Native Ad below More Free Tools */}
            <AdSlot type="native" label="Sponsored Content" />

            {/* FEATURES SECTION */}
            <section className="my-12 p-8 sm:p-12 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
              <div className="max-w-3xl">
                <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                  Built for Speed & Privacy
                </span>
                <h2 className="text-2xl sm:text-4xl font-black mt-2 leading-tight">
                  Why Creators & Professionals Choose SplitDrop
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                  Traditional web tools upload your private pictures and PDFs to distant cloud servers. SplitDrop runs 100% inside your local browser using modern HTML5 Canvas, PDF-lib, and Web Assembly.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <Shield className="w-7 h-7 text-indigo-600 dark:text-indigo-400 mb-3" />
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Zero Server Uploads</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Your confidential files never leave your device memory. Total security.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <Zap className="w-7 h-7 text-amber-500 mb-3" />
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Sub-Second Processing</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    No upload wait times or server queue bottlenecks. Instant results.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <Sparkles className="w-7 h-7 text-emerald-500 mb-3" />
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Free Forever</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    No watermarks, daily submission limits, or required accounts.
                  </p>
                </div>
              </div>
            </section>

            {/* HOMEPAGE FAQ SECTION */}
            <section className="my-12 max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  Frequently Asked Questions
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
                  Everything you need to know about SplitDrop and our free online tools.
                </p>
              </div>

              <div className="space-y-3">
                {HOMEPAGE_FAQS.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md overflow-hidden transition-all"
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

            {/* AD PLACEMENT 3: Banner before footer */}
            <AdSlot type="banner" label="Advertisement" />
          </>
        )}

        {/* ========================================================
            DEDICATED TOOL PAGES
            ======================================================== */}
        {activeTool && activeTool.id !== 'splitdrop' && (
          <div className="max-w-5xl mx-auto space-y-6">
            <SEOHead
              title={`${activeTool.title} — SplitDrop`}
              description={activeTool.description}
              canonicalPath={activeTool.path}
              toolMeta={activeTool}
              breadcrumbs={[
                { label: 'Home', path: '/' },
                { label: 'Tools', path: '/' },
                { label: activeTool.navTitle }
              ]}
            />

            {/* Breadcrumb */}
            <Breadcrumb
              items={[
                { label: 'Home', path: '/' },
                { label: 'Tools', path: '/' },
                { label: activeTool.navTitle }
              ]}
              onNavigate={navigateTo}
            />

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

            {/* TOOL PAGE AD 1: Banner below title */}
            <AdSlot type="banner" label="Advertisement" />

            {/* THE TOOL COMPONENT INTERFACE WRAPPED IN FROSTED GLASS */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
              {activeTool.id === 'image-compressor' && <ImageCompressorTool onShowToast={triggerToast} />}
              {activeTool.id === 'image-converter' && <ImageConverterTool onShowToast={triggerToast} />}
              {activeTool.id === 'pdf-merge' && <PdfMergeTool onShowToast={triggerToast} />}
              {activeTool.id === 'pdf-split' && <PdfSplitTool onShowToast={triggerToast} />}
              {activeTool.id === 'qr-generator' && <QrGeneratorTool onShowToast={triggerToast} />}
            </div>

            {/* TOOL PAGE AD 2: Native below result/output */}
            <AdSlot type="native" label="Sponsored Links" />

            {/* INSTRUCTIONS / HOW TO USE */}
            <section className="my-8 p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                How to Use {activeTool.navTitle}
              </h3>
              <ol className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                <li className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                  <strong className="text-indigo-600 dark:text-indigo-400 font-bold text-base block mb-1">1. Upload Files</strong>
                  Drag and drop or select your files from your device.
                </li>
                <li className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                  <strong className="text-indigo-600 dark:text-indigo-400 font-bold text-base block mb-1">2. Configure Options</strong>
                  Adjust parameters like quality, ranges, or target formats.
                </li>
                <li className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                  <strong className="text-indigo-600 dark:text-indigo-400 font-bold text-base block mb-1">3. Download Result</strong>
                  Save your processed files directly to your machine or download as ZIP.
                </li>
              </ol>
            </section>

            {/* RELATED TOOLS */}
            <section className="my-8">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Related Free Tools
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {TOOLS_DATA.filter(t => t.id !== activeTool.id).slice(0, 3).map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => navigateTo(tool.path)}
                    className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 hover:border-indigo-400 text-left transition-all group"
                  >
                    <span className="text-2xl mb-2 inline-block">{tool.icon}</span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                      {tool.navTitle}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                      {tool.description}
                    </p>
                  </button>
                ))}
              </div>
            </section>

            {/* TOOL PAGE AD 3: Banner before footer */}
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

      {/* Footer */}
      <Footer onNavigate={navigateTo} />
    </div>
  );
}
