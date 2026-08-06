import React, { useState, useEffect, useRef } from 'react';
import { Download, Copy, Check, Code, Layers, FileArchive } from 'lucide-react';
import JSZip from 'jszip';
import { ImageUploadArea } from './ImageUploadArea';
import { ImageFileInfoPanel } from './ImageFileInfoPanel';
import { ImageProcessingProgress, ProcessingStage } from './ImageProcessingProgress';
import { getImageMetadata, ImageMetadata } from '../../../lib/imageUtils';
import { SEOHead } from '../../SEOHead';
import { Breadcrumb } from '../../Breadcrumb';
import { BackButton } from '../../BackButton';
import { getLinkUrl } from '../../../lib/paths';

interface FaviconGeneratorToolProps {
  onShowToast: (msg: string) => void;
  onNavigate?: (path: string) => void;
}

interface FaviconSizeSpec {
  size: number;
  filename: string;
  label: string;
}

const FAVICON_SIZES: FaviconSizeSpec[] = [
  { size: 16, filename: 'favicon-16x16.png', label: '16x16 (Browser Tab)' },
  { size: 32, filename: 'favicon-32x32.png', label: '32x32 (Desktop Shortcut)' },
  { size: 48, filename: 'favicon-48x48.png', label: '48x48 (Windows Site Tile)' },
  { size: 64, filename: 'favicon-64x64.png', label: '64x64 (High-DPI Tab)' },
  { size: 96, filename: 'favicon-96x96.png', label: '96x96 (Google TV / App)' },
  { size: 128, filename: 'favicon-128x128.png', label: '128x128 (Chrome Web Store)' },
  { size: 180, filename: 'apple-touch-icon.png', label: '180x180 (Apple Touch Icon)' },
  { size: 256, filename: 'icon-256x256.png', label: '256x256 (PWA Android Icon)' },
  { size: 512, filename: 'android-chrome-512x512.png', label: '512x512 (Splash Screen)' }
];

export const FaviconGeneratorTool: React.FC<FaviconGeneratorToolProps> = ({ onShowToast, onNavigate }) => {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);

  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [copiedHtml, setCopiedHtml] = useState<boolean>(false);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [stage, setStage] = useState<ProcessingStage>('Reading Image');
  const [progress, setProgress] = useState<number>(0);

  const handleImageSelected = async (files: File[]) => {
    if (!files.length) return;
    const selectedFile = files[0];
    setFile(selectedFile);
    setIsProcessing(true);
    setStage('Reading Image');
    setProgress(20);

    const img = new Image();
    const url = URL.createObjectURL(selectedFile);
    img.onload = async () => {
      setImageObj(img);
      setStage('Analyzing');
      setProgress(50);

      const meta = await getImageMetadata(selectedFile, img);
      setMetadata(meta);

      setStage('Generating Previews');
      setProgress(75);

      // Render all size canvases
      const previewsMap: Record<string, string> = {};
      for (const spec of FAVICON_SIZES) {
        const canvas = document.createElement('canvas');
        canvas.width = spec.size;
        canvas.height = spec.size;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, spec.size, spec.size);
          previewsMap[spec.filename] = canvas.toDataURL('image/png');
        }
      }

      setPreviews(previewsMap);
      setStage('Completed');
      setProgress(100);
      setTimeout(() => setIsProcessing(false), 300);
    };
    img.src = url;
  };

  const htmlHeadSnippet = `<!-- Favicon Suite Generated with SplitDrop -->
<link className="icon" type="image/x-icon" href="/favicon.ico" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />`;

  const copyHtmlSnippet = () => {
    navigator.clipboard.writeText(htmlHeadSnippet);
    setCopiedHtml(true);
    onShowToast('HTML <head> tags copied to clipboard!');
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  const handleDownloadZip = async () => {
    if (!file || !imageObj) return;
    setIsProcessing(true);
    setStage('Preparing Download');
    setProgress(50);

    const zip = new JSZip();

    // 1. Add PNG favicons
    for (const spec of FAVICON_SIZES) {
      const dataUrl = previews[spec.filename];
      if (dataUrl) {
        const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
        zip.file(spec.filename, base64Data, { base64: true });
      }
    }

    // 2. Add favicon.ico (using 32x32 canvas PNG binary)
    const icoCanvas = document.createElement('canvas');
    icoCanvas.width = 32;
    icoCanvas.height = 32;
    const icoCtx = icoCanvas.getContext('2d');
    if (icoCtx) {
      icoCtx.drawImage(imageObj, 0, 0, 32, 32);
      const icoDataUrl = icoCanvas.toDataURL('image/png').replace(/^data:image\/png;base64,/, '');
      zip.file('favicon.ico', icoDataUrl, { base64: true });
    }

    // 3. Add site.webmanifest
    const manifestContent = JSON.stringify({
      name: "My App",
      short_name: "App",
      icons: [
        { src: "/icon-256x256.png", sizes: "256x256", type: "image/png" },
        { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" }
      ],
      theme_color: "#ffffff",
      background_color: "#ffffff",
      display: "standalone"
    }, null, 2);

    zip.file('site.webmanifest', manifestContent);

    // Generate ZIP blob
    setStage('Compressing ZIP');
    setProgress(85);

    const blob = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'favicons_bundle.zip';
    link.click();

    setStage('Completed');
    setProgress(100);
    setTimeout(() => setIsProcessing(false), 300);
    onShowToast('Favicon ZIP package downloaded!');
  };

  return (
    <div className="space-y-6">
      <SEOHead
        title="Favicon Generator — Multi-Size PNG & ICO Package — SplitDrop"
        description="Free online favicon generator. Convert any logo to 16x16, 32x32, 48x48, 180x180, 512x512, favicon.ico & site.webmanifest in a single ZIP download."
        canonicalPath="/favicon-generator.html"
      />

      <div className="flex items-center justify-between gap-4">
        <BackButton onNavigate={onNavigate} />
        <Breadcrumb
          items={[
            { label: 'Home', path: getLinkUrl('/') },
            { label: 'Image Tools' },
            { label: 'Favicon Generator' }
          ]}
          onNavigate={onNavigate}
        />
      </div>

      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          ⭐ Favicon Generator
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Generate complete set of multi-size favicons (16px - 512px), `favicon.ico`, PWA web manifest, and HTML code.
        </p>
      </div>

      {!file ? (
        <ImageUploadArea onImageSelected={handleImageSelected} />
      ) : (
        <div className="space-y-6">
          {metadata && (
            <ImageFileInfoPanel
              fileName={metadata.fileName}
              originalSize={metadata.fileSize}
              format={metadata.format}
              width={metadata.width}
              height={metadata.height}
              hasTransparency={metadata.hasTransparency}
            />
          )}

          {isProcessing && <ImageProcessingProgress stage={stage} progress={progress} />}

          {/* Favicons Grid Preview */}
          <div className="p-6 rounded-3xl glass-panel space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/50 dark:border-slate-800/50 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">Generated Favicon Set</h3>
                <p className="text-xs text-slate-500">Includes 9 resolution variants + favicon.ico + web manifest</p>
              </div>

              <button
                type="button"
                onClick={handleDownloadZip}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer"
              >
                <FileArchive className="w-4 h-4" /> Download All as ZIP
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {FAVICON_SIZES.map((spec) => (
                <div key={spec.filename} className="p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 flex flex-col items-center space-y-3 text-center">
                  <div className="w-16 h-16 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center p-1 border border-slate-300 dark:border-slate-700">
                    {previews[spec.filename] && (
                      <img src={previews[spec.filename]} alt={spec.label} className="max-w-full max-h-full object-contain" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">{spec.filename}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{spec.label}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* HTML Code Snippet Box */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Code className="w-4 h-4 text-indigo-400" /> HTML &lt;head&gt; Integration Code
                </span>
                <button
                  type="button"
                  onClick={copyHtmlSnippet}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  {copiedHtml ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedHtml ? 'Copied Snippet' : 'Copy HTML'}
                </button>
              </div>

              <pre className="text-xs font-mono text-emerald-400 overflow-x-auto p-3 bg-slate-900/80 rounded-xl leading-relaxed">
                {htmlHeadSnippet}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
