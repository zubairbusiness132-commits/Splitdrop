import React, { useState } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import { Upload, RotateCw, RefreshCw, CheckSquare, Square, Download, FileText } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { FileInformationPanel } from './FileInformationPanel';
import { PdfProcessingProgress, ProcessingStage } from './PdfProcessingProgress';
import { renderPdfPageToDataUrl, extractPdfVersionFromBuffer } from '../../../lib/pdfUtils';

interface PageThumb {
  pageIndex: number;
  dataUrl: string;
  selected: boolean;
}

export const RotatePdfTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [pdfBuffer, setPdfBuffer] = useState<ArrayBuffer | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pdfVersion, setPdfVersion] = useState<string>('v1.7');

  const [rotationAngle, setRotationAngle] = useState<90 | 180 | 270>(90);
  const [targetScope, setTargetScope] = useState<'all' | 'selected'>('all');
  const [pages, setPages] = useState<PageThumb[]>([]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [stage, setStage] = useState<ProcessingStage>('Reading PDF');
  const [progress, setProgress] = useState(0);

  const handleFileAdded = async (uploadedFile: File) => {
    if (!uploadedFile.name.endsWith('.pdf') && uploadedFile.type !== 'application/pdf') {
      onShowToast('Please select a valid PDF file');
      return;
    }

    try {
      const buffer = await uploadedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = pdfDoc.getPageCount();
      const version = extractPdfVersionFromBuffer(buffer);

      setFile(uploadedFile);
      setPdfBuffer(buffer);
      setPageCount(count);
      setPdfVersion(version);

      // Render page thumbnails
      const thumbs: PageThumb[] = [];
      for (let i = 0; i < count; i++) {
        const url = await renderPdfPageToDataUrl(buffer, i, 0.4);
        thumbs.push({ pageIndex: i, dataUrl: url, selected: true });
      }
      setPages(thumbs);
      onShowToast(`Loaded PDF (${count} pages)`);
    } catch {
      onShowToast('Failed to load PDF document');
    }
  };

  const toggleSelectPage = (index: number) => {
    setPages(prev => prev.map((p, i) => i === index ? { ...p, selected: !p.selected } : p));
  };

  const selectAll = (val: boolean) => {
    setPages(prev => prev.map(p => ({ ...p, selected: val })));
  };

  const handleRotateAndDownload = async () => {
    if (!pdfBuffer || !file) return;

    setIsProcessing(true);
    setStage('Reading PDF');
    setProgress(20);

    try {
      await new Promise(r => setTimeout(r, 150));
      setStage('Analyzing');
      setProgress(40);

      const pdfDoc = await PDFDocument.load(pdfBuffer);
      setStage('Processing');

      const allPages = pdfDoc.getPages();
      let rotatedCount = 0;

      allPages.forEach((page, idx) => {
        const isSelected = pages[idx]?.selected ?? true;
        if (targetScope === 'all' || isSelected) {
          const currentRot = page.getRotation().angle || 0;
          page.setRotation(degrees((currentRot + rotationAngle) % 360));
          rotatedCount++;
        }
      });

      setStage('Preparing Download');
      setProgress(85);

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const baseName = file.name.replace(/\.pdf$/i, '');
      const a = document.createElement('a');
      a.href = url;
      a.download = `${baseName}_rotated_${rotationAngle}deg.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      setStage('Completed');
      setProgress(100);
      onShowToast(`Rotated ${rotatedCount} page(s) by ${rotationAngle}° and downloaded!`);
    } catch (err) {
      console.error('Rotate PDF error:', err);
      onShowToast('Failed to rotate PDF');
    } finally {
      setTimeout(() => setIsProcessing(false), 500);
    }
  };

  const resetAll = () => {
    setFile(null);
    setPdfBuffer(null);
    setPageCount(0);
    setPages([]);
    setIsProcessing(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
      <div className="text-center max-w-xl mx-auto mb-6">
        <span className="text-4xl mb-2 inline-block">🔄</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          {t('rotatePdfTitle', 'Rotate PDF Pages')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
          {t('rotatePdfSubtitle', 'Rotate PDF pages by 90°, 180°, or 270° clockwise. Apply to all pages or specific selections.')}
        </p>
      </div>

      {!file ? (
        <label className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-indigo-300/60 dark:border-indigo-900/40 rounded-2xl hover:border-indigo-500 cursor-pointer glass-card transition-all text-center">
          <Upload className="w-12 h-12 text-indigo-500 mb-3 animate-pulse" />
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            {t('selectPdfRotate', 'Select PDF file to rotate')}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('supportsSinglePdf', 'Choose any PDF document')}
          </span>
          <input
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileAdded(e.target.files[0])}
          />
        </label>
      ) : (
        <div className="space-y-6">
          <FileInformationPanel
            fileName={file.name}
            fileSize={file.size}
            pageCount={pageCount}
            pdfVersion={pdfVersion}
            status={isProcessing ? stage : 'Idle'}
            statusProgress={progress}
          />

          {/* Settings Panel */}
          <div className="p-5 rounded-2xl glass-card border border-slate-200/50 dark:border-slate-800/50 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Rotation Angle Options */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Rotation Angle
                </label>
                <div className="inline-flex p-1 bg-slate-200/60 dark:bg-slate-900 rounded-xl text-xs font-bold">
                  {([90, 180, 270] as const).map(angle => (
                    <button
                      key={angle}
                      onClick={() => setRotationAngle(angle)}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        rotationAngle === angle
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {angle}° Clockwise
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Scope Options */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Apply To
                </label>
                <div className="inline-flex p-1 bg-slate-200/60 dark:bg-slate-900 rounded-xl text-xs font-bold">
                  <button
                    onClick={() => setTargetScope('all')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      targetScope === 'all'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    All Pages
                  </button>
                  <button
                    onClick={() => setTargetScope('selected')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      targetScope === 'selected'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Selected Pages
                  </button>
                </div>
              </div>

              <button
                onClick={resetAll}
                className="text-xs text-rose-500 hover:underline font-semibold cursor-pointer flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>
          </div>

          {/* Interactive Page Thumbnails Selection */}
          {targetScope === 'selected' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-500">
                  Select Pages to Rotate ({pages.filter(p => p.selected).length}/{pages.length})
                </span>
                <div className="flex gap-2">
                  <button onClick={() => selectAll(true)} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-bold">Select All</button>
                  <button onClick={() => selectAll(false)} className="text-xs text-slate-500 hover:underline">Deselect All</button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {pages.map((p, idx) => (
                  <div
                    key={p.pageIndex}
                    onClick={() => toggleSelectPage(idx)}
                    className={`glass-card p-3 rounded-2xl flex flex-col items-center gap-2 cursor-pointer border transition-all ${
                      p.selected
                        ? 'border-indigo-600 bg-indigo-50/30 dark:bg-indigo-950/30'
                        : 'border-slate-200/60 dark:border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="relative w-full aspect-[3/4] bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center">
                      <img
                        src={p.dataUrl}
                        alt={`Page ${idx + 1}`}
                        className="object-contain max-h-full transition-transform duration-300"
                        style={{ transform: p.selected ? `rotate(${rotationAngle}deg)` : 'none' }}
                      />
                      <div className="absolute top-2 right-2">
                        {p.selected ? (
                          <CheckSquare className="w-5 h-5 text-indigo-600 fill-indigo-100 dark:fill-indigo-900" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Page #{idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isProcessing ? (
            <PdfProcessingProgress currentStage={stage} percent={progress} />
          ) : (
            <button
              onClick={handleRotateAndDownload}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCw className="w-4 h-4" />
              {t('rotateAndDownloadPdf', `Rotate ${rotationAngle}° & Download PDF`)}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
