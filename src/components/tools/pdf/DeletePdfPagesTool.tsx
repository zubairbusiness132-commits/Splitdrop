import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Upload, Trash2, CheckSquare, Square, RefreshCw, FileText } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { FileInformationPanel } from './FileInformationPanel';
import { PdfProcessingProgress, ProcessingStage } from './PdfProcessingProgress';
import { renderPdfPageToDataUrl, extractPdfVersionFromBuffer } from '../../../lib/pdfUtils';

interface PageItem {
  pageIndex: number;
  dataUrl: string;
  markedForDeletion: boolean;
}

export const DeletePdfPagesTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [pdfBuffer, setPdfBuffer] = useState<ArrayBuffer | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pdfVersion, setPdfVersion] = useState<string>('v1.7');

  const [pages, setPages] = useState<PageItem[]>([]);
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

      const items: PageItem[] = [];
      for (let i = 0; i < count; i++) {
        const url = await renderPdfPageToDataUrl(buffer, i, 0.4);
        items.push({ pageIndex: i, dataUrl: url, markedForDeletion: false });
      }
      setPages(items);
      onShowToast(`Loaded PDF (${count} pages)`);
    } catch {
      onShowToast('Failed to load PDF document');
    }
  };

  const toggleMarkPage = (index: number) => {
    setPages(prev => prev.map((p, i) => i === index ? { ...p, markedForDeletion: !p.markedForDeletion } : p));
  };

  const handleDeleteAndExport = async () => {
    if (!pdfBuffer || !file) return;

    const remainingPages = pages.filter(p => !p.markedForDeletion);
    if (remainingPages.length === 0) {
      onShowToast('You cannot delete all pages in the PDF.');
      return;
    }

    const deletedCount = pages.length - remainingPages.length;
    if (deletedCount === 0) {
      onShowToast('Please select at least one page to delete.');
      return;
    }

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
      const keepIndices = remainingPages.map(p => p.pageIndex);
      const copiedPages = await newDoc.copyPages(srcDoc, keepIndices);
      copiedPages.forEach(p => newDoc.addPage(p));

      setStage('Preparing Download');
      setProgress(85);

      const pdfBytes = await newDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const baseName = file.name.replace(/\.pdf$/i, '');
      const a = document.createElement('a');
      a.href = url;
      a.download = `${baseName}_deleted_${deletedCount}pages.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      setStage('Completed');
      setProgress(100);
      onShowToast(`Deleted ${deletedCount} page(s) and downloaded new PDF!`);
    } catch (err) {
      console.error('Delete pages error:', err);
      onShowToast('Failed to delete pages from PDF');
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

  const deletedCount = pages.filter(p => p.markedForDeletion).length;

  return (
    <div className="w-full max-w-4xl mx-auto my-6 glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
      <div className="text-center max-w-xl mx-auto mb-6">
        <span className="text-4xl mb-2 inline-block">🗑️</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          {t('deletePdfPagesTitle', 'Delete PDF Pages')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
          {t('deletePdfPagesSubtitle', 'Visually select and delete unwanted pages from your PDF document instantly in your browser.')}
        </p>
      </div>

      {!file ? (
        <label className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-indigo-300/60 dark:border-indigo-900/40 rounded-2xl hover:border-indigo-500 cursor-pointer glass-card transition-all text-center">
          <Upload className="w-12 h-12 text-indigo-500 mb-3 animate-pulse" />
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            {t('selectPdfToDelete', 'Select PDF file to remove pages')}
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

          {/* Grid Header Controls */}
          <div className="flex items-center justify-between p-4 rounded-2xl glass-card border border-slate-200/50 dark:border-slate-800/50">
            <div>
              <span className="text-xs font-bold uppercase text-slate-500">
                Click pages to mark for deletion
              </span>
              <p className="text-xs font-extrabold text-rose-500 mt-0.5">
                {deletedCount} page(s) marked for deletion ({pageCount - deletedCount} remaining)
              </p>
            </div>
            <button
              onClick={resetAll}
              className="text-xs text-rose-500 hover:underline font-semibold cursor-pointer flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset File
            </button>
          </div>

          {/* Thumbnail Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {pages.map((p, idx) => (
              <div
                key={p.pageIndex}
                onClick={() => toggleMarkPage(idx)}
                className={`glass-card p-3 rounded-2xl flex flex-col items-center gap-2 cursor-pointer border transition-all relative ${
                  p.markedForDeletion
                    ? 'border-rose-500 bg-rose-50/40 dark:bg-rose-950/40 ring-2 ring-rose-500/30'
                    : 'border-slate-200/60 dark:border-slate-800 hover:border-indigo-500'
                }`}
              >
                <div className="relative w-full aspect-[3/4] bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center">
                  <img src={p.dataUrl} alt={`Page ${idx + 1}`} className={`object-contain max-h-full ${p.markedForDeletion ? 'opacity-40 grayscale' : ''}`} />
                  {p.markedForDeletion && (
                    <div className="absolute inset-0 bg-rose-500/20 flex items-center justify-center">
                      <Trash2 className="w-8 h-8 text-rose-600 dark:text-rose-400 animate-bounce" />
                    </div>
                  )}
                </div>
                <span className={`text-xs font-bold ${p.markedForDeletion ? 'text-rose-600 dark:text-rose-400 line-through' : 'text-slate-700 dark:text-slate-300'}`}>
                  Page #{idx + 1}
                </span>
              </div>
            ))}
          </div>

          {isProcessing ? (
            <PdfProcessingProgress currentStage={stage} percent={progress} />
          ) : (
            <button
              onClick={handleDeleteAndExport}
              disabled={deletedCount === 0}
              className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-rose-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              {deletedCount === 0 ? 'Select Pages to Delete' : `Delete ${deletedCount} Selected Page(s) & Download`}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
