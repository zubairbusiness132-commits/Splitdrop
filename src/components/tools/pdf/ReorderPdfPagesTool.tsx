import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Upload, ArrowLeft, ArrowRight, RefreshCw, FileCheck, Shuffle } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { FileInformationPanel } from './FileInformationPanel';
import { PdfProcessingProgress, ProcessingStage } from './PdfProcessingProgress';
import { renderPdfPageToDataUrl, extractPdfVersionFromBuffer } from '../../../lib/pdfUtils';

interface ReorderPageItem {
  id: string;
  originalIndex: number;
  dataUrl: string;
}

export const ReorderPdfPagesTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [pdfBuffer, setPdfBuffer] = useState<ArrayBuffer | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pdfVersion, setPdfVersion] = useState<string>('v1.7');

  const [pages, setPages] = useState<ReorderPageItem[]>([]);
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

      const items: ReorderPageItem[] = [];
      for (let i = 0; i < count; i++) {
        const url = await renderPdfPageToDataUrl(buffer, i, 0.4);
        items.push({
          id: `page_${i}_${Math.random().toString(36).substring(2, 7)}`,
          originalIndex: i,
          dataUrl: url
        });
      }
      setPages(items);
      onShowToast(`Loaded PDF (${count} pages)`);
    } catch {
      onShowToast('Failed to load PDF document');
    }
  };

  const movePage = (index: number, dir: 'left' | 'right') => {
    const target = dir === 'left' ? index - 1 : index + 1;
    if (target < 0 || target >= pages.length) return;
    const copy = [...pages];
    const [moved] = copy.splice(index, 1);
    copy.splice(target, 0, moved);
    setPages(copy);
  };

  const handleExportReordered = async () => {
    if (!pdfBuffer || !file) return;

    setIsProcessing(true);
    setStage('Reading PDF');
    setProgress(20);

    try {
      await new Promise(r => setTimeout(r, 150));
      setStage('Analyzing');
      setProgress(40);

      const srcDoc = await PDFDocument.load(pdfBuffer);
      const newDoc = await PDFDocument.create();

      setStage('Processing');
      const newIndices = pages.map(p => p.originalIndex);
      const copiedPages = await newDoc.copyPages(srcDoc, newIndices);
      copiedPages.forEach(p => newDoc.addPage(p));

      setStage('Preparing Download');
      setProgress(85);

      const pdfBytes = await newDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const baseName = file.name.replace(/\.pdf$/i, '');
      const a = document.createElement('a');
      a.href = url;
      a.download = `${baseName}_reordered.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      setStage('Completed');
      setProgress(100);
      onShowToast('Reordered PDF downloaded successfully!');
    } catch (err) {
      console.error('Reorder pages error:', err);
      onShowToast('Failed to reorder PDF pages');
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
        <span className="text-4xl mb-2 inline-block">🔀</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          {t('reorderPdfPagesTitle', 'Reorder PDF Pages')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
          {t('reorderPdfPagesSubtitle', 'Rearrange and change the order of pages in your PDF document effortlessly.')}
        </p>
      </div>

      {!file ? (
        <label className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-indigo-300/60 dark:border-indigo-900/40 rounded-2xl hover:border-indigo-500 cursor-pointer glass-card transition-all text-center">
          <Upload className="w-12 h-12 text-indigo-500 mb-3 animate-pulse" />
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            {t('selectPdfToReorder', 'Select PDF file to reorder pages')}
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

          <div className="flex items-center justify-between p-4 rounded-2xl glass-card border border-slate-200/50 dark:border-slate-800/50">
            <span className="text-xs font-bold uppercase text-slate-500">
              Drag or use arrows to change page position
            </span>
            <button
              onClick={resetAll}
              className="text-xs text-rose-500 hover:underline font-semibold cursor-pointer flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset Order
            </button>
          </div>

          {/* Grid of Pages */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {pages.map((p, idx) => (
              <div
                key={p.id}
                className="glass-card p-3 rounded-2xl flex flex-col items-center gap-2 border border-slate-200/60 dark:border-slate-800 hover:border-indigo-500 transition-all"
              >
                <div className="relative w-full aspect-[3/4] bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center">
                  <img src={p.dataUrl} alt={`Page ${idx + 1}`} className="object-contain max-h-full" />
                  <div className="absolute top-2 left-2 bg-indigo-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-md shadow-xs">
                    New #{idx + 1}
                  </div>
                </div>

                <div className="w-full flex items-center justify-between pt-1">
                  <span className="text-[11px] font-bold text-slate-500">
                    Orig #{p.originalIndex + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => movePage(idx, 'left')}
                      disabled={idx === 0}
                      className="p-1 bg-slate-200/60 dark:bg-slate-800 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => movePage(idx, 'right')}
                      disabled={idx === pages.length - 1}
                      className="p-1 bg-slate-200/60 dark:bg-slate-800 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {isProcessing ? (
            <PdfProcessingProgress currentStage={stage} percent={progress} />
          ) : (
            <button
              onClick={handleExportReordered}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileCheck className="w-4 h-4" />
              {t('exportReorderedPdf', 'Save & Download Reordered PDF')}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
