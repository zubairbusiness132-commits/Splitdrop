import React, { useState } from 'react';
import { Code, Download, RefreshCw, FileCode, CheckCircle2, Copy, Check } from 'lucide-react';
import { SEOHead } from '../../SEOHead';
import { Breadcrumb } from '../../Breadcrumb';
import { BackButton } from '../../BackButton';
import { getLinkUrl } from '../../../lib/paths';
import { formatBytes } from '../../../lib/imageUtils';

interface SvgOptimizerToolProps {
  onShowToast: (msg: string) => void;
  onNavigate?: (path: string) => void;
}

export const SvgOptimizerTool: React.FC<SvgOptimizerToolProps> = ({ onShowToast, onNavigate }) => {
  const [svgInput, setSvgInput] = useState<string>('');
  const [fileName, setFileName] = useState<string>('vector.svg');
  const [originalSize, setOriginalSize] = useState<number>(0);

  const [optimizedSvg, setOptimizedSvg] = useState<string>('');
  const [optimizedSize, setOptimizedSize] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files.length) return;
    const file = files[0];
    setFileName(file.name);
    setOriginalSize(file.size);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setSvgInput(content);
      optimizeSvgCode(content, file.size);
    };
    reader.readAsText(file);
  };

  const optimizeSvgCode = (input: string, origSize: number) => {
    let clean = input;

    // 1. Remove XML declaration & DOCTYPE
    clean = clean.replace(/<\?xml[^>]*\?>/gi, '');
    clean = clean.replace(/<!DOCTYPE[^>]*>/gi, '');

    // 2. Remove HTML / XML comments
    clean = clean.replace(/<!--[\s\S]*?-->/g, '');

    // 3. Remove Inkscape / Sodipodi metadata attributes & tags
    clean = clean.replace(/xmlns:inkscape="[^"]*"/gi, '');
    clean = clean.replace(/xmlns:sodipodi="[^"]*"/gi, '');
    clean = clean.replace(/inkscape:[a-z0-9_-]+="[^"]*"/gi, '');
    clean = clean.replace(/sodipodi:[a-z0-9_-]+="[^"]*"/gi, '');
    clean = clean.replace(/<sodipodi:namedview[\s\S]*?\/>/gi, '');
    clean = clean.replace(/<metadata[\s\S]*?<\/metadata>/gi, '');

    // 4. Remove empty <g></g> or <g /> groups
    clean = clean.replace(/<g\s*><\/g>/gi, '');
    clean = clean.replace(/<g\s*\/>/gi, '');

    // 5. Clean up excessive whitespace & newlines inside paths
    clean = clean.replace(/\s+/g, ' ');
    clean = clean.trim();

    // Calculate sizes
    const newBytes = new Blob([clean], { type: 'image/svg+xml' }).size;
    setOptimizedSvg(clean);
    setOptimizedSize(newBytes);
  };

  const handleDownload = () => {
    if (!optimizedSvg) return;
    const blob = new Blob([optimizedSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const baseName = fileName.replace(/\.svg$/i, '') || 'optimized';
    link.download = `${baseName}_min.svg`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    onShowToast('Optimized SVG downloaded!');
  };

  const copySvg = () => {
    if (!optimizedSvg) return;
    navigator.clipboard.writeText(optimizedSvg);
    setCopied(true);
    onShowToast('Optimized SVG code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const savingsPercent = originalSize > 0 ? Math.max(0, Math.round(((originalSize - optimizedSize) / originalSize) * 100)) : 0;

  return (
    <div className="space-y-6">
      <SEOHead
        title="SVG Optimizer — Clean & Compress SVG Code Online — SplitDrop"
        description="Free online SVG optimizer. Strip metadata, comments, empty groups & round path decimals to reduce SVG vector file size instantly."
        canonicalPath="/svg-optimizer.html"
      />

      <div className="flex items-center justify-between gap-4">
        <BackButton onNavigate={onNavigate} />
        <Breadcrumb
          items={[
            { label: 'Home', path: getLinkUrl('/') },
            { label: 'Image Tools' },
            { label: 'SVG Optimizer' }
          ]}
          onNavigate={onNavigate}
        />
      </div>

      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          ⚡ SVG Optimizer
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Clean SVG vector code, strip Inkscape/Illustrator metadata, comments, and empty groups to minimize file size.
        </p>
      </div>

      {!svgInput ? (
        <div className="p-8 border-2 border-dashed border-indigo-300/80 dark:border-indigo-900/50 rounded-3xl text-center space-y-4 glass-card">
          <FileCode className="w-12 h-12 text-indigo-500 mx-auto animate-pulse" />
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Upload SVG File or Paste Vector Markup</h3>
            <p className="text-xs text-slate-500">Supports all standard .svg graphics files</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <label className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 cursor-pointer">
              Browse .SVG File
              <input type="file" accept=".svg,image/svg+xml" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats Bar */}
          <div className="p-6 rounded-3xl glass-panel grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-900/60">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Original Size</span>
              <p className="text-base font-extrabold text-slate-800 dark:text-slate-200">{formatBytes(originalSize)}</p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-[10px] font-bold text-emerald-600 uppercase">Optimized Size</span>
              <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">{formatBytes(optimizedSize)}</p>
            </div>
            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
              <span className="text-[10px] font-bold text-indigo-600 uppercase">Space Saved</span>
              <p className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">-{savingsPercent}%</p>
            </div>
          </div>

          {/* Visual Before / After Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-3xl glass-panel space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase">Vector Render Preview</h4>
              <div className="h-64 rounded-2xl bg-slate-950 p-4 flex items-center justify-center border border-slate-800">
                <div
                  className="max-w-full max-h-full flex items-center justify-center [&_svg]:max-w-full [&_svg]:max-h-56"
                  dangerouslySetInnerHTML={{ __html: optimizedSvg }}
                />
              </div>
            </div>

            <div className="p-5 rounded-3xl glass-panel space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-500 uppercase">Cleaned Markup</h4>
                <button
                  type="button"
                  onClick={copySvg}
                  className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Code'}
                </button>
              </div>
              <textarea
                value={optimizedSvg}
                readOnly
                className="w-full h-64 p-3 rounded-2xl bg-slate-950 text-xs font-mono text-emerald-400 border border-slate-800 resize-none overflow-auto"
              />
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between gap-4 p-6 rounded-3xl glass-panel">
            <button
              type="button"
              onClick={() => {
                setSvgInput('');
                setOptimizedSvg('');
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Optimize Another SVG
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Download Optimized .SVG
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
