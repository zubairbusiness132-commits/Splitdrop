import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Upload, Scissors, CheckSquare, Square, RefreshCw, FileText } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { FileInformationPanel } from './FileInformationPanel';
import { PdfProcessingProgress, ProcessingStage } from './PdfProcessingProgress';
import { renderPdfPageToDataUrl, extractPdfVersionFromBuffer } from '../../../lib/pdfUtils';

interface PageItem {
  pageIndex: number;
  dataUrl: string;
  selected: boolean;
}

export const ExtractPdfPagesTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [pdfBuffer, setPdfBuffer] = useState<ArrayBuffer | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pdfVersion, setPdfVersion] = useState<string>('v1.7');

  const [rangeInput, setRangeInput] = useState<string>('1');
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
      setRangeInput(`1-${Math.min(3, count)}`);

      const items: PageItem[] = [];
      for (let i = 0; i < count; i++) {
        const url = await renderPdfPageToDataUrl(buffer, i, 0.4);
        items.push({ pageIndex: i, dataUrl: url, selected: i < Math.min(3, count) });
      }
      setPages(items);
      onShowToast(`Loaded PDF (${count} pages)`);
    } catch {
      onShowToast('Failed to load PDF document');
    }
  };

  const togglePageSelection = (index: number) => {
    setPages(prev => {
      const updated = prev.map((p, i) => i === index ? { ...p, selected: !p.selected } : p);
      // Sync range input text
      const selectedIndices = updated.filter(p => p.selected).map(p => p.pageIndex + 1);
      setRangeInput(selectedIndices.join(', '));
      return updated;
    });
  };

  const handleRangeInputChange = (val: string) => {
    setRangeInput(val);
    // Parse range and update selection states
    const parts = val.split(',').map(p => p.trim());
    const selectedSet = new Set<number>();

    for (const part of parts) {
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = Math.max(1, start); i <= Math.min(pageCount, end); i++) {
            selectedSet.add(i - 1);
          }
        }
      } else {
        const p = parseInt(part, 10);
        if (!isNaN(p) && p >= 1 && p <= pageCount) {
          selectedSet.add(p - 1);
        }
      }
    }

    setPages(prev => prev.map(p => ({ ...p, selected: selectedSet.has(p.pageIndex) })));
  };

  const selectAll = (val: boolean) => {
    setPages(prev => prev.map(p => ({ ...p, selected: val })));
    if (val) {
      setRangeInput(`1-${pageCount}`);
    } else {
      setRangeInput('');
    }
  };

  const handleExtract = async () => {
    if (!pdfBuffer || !file) return;

    const selectedPages = pages.filter(p => p.selected);
    if (selectedPages.length === 0) {
      onShowToast('Please select at least one page to extract.');
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
      const extractIndices = selectedPages.map(p => p.pageIndex);
      const copiedPages = await newDoc.copyPages(srcDoc, extractIndices);
      copiedPages.forEach(p => newDoc.addPage(p));

      setStage('Preparing Download');
      setProgress(85);

      const pdfBytes = await newDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const baseName = file.name.replace(/\.pdf$/i, '');
      const a = document.createElement('a');
      a.href = url;
      a.download = `${baseName}_extracted_${selectedPages.length}pages.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      setStage('Completed');
      setProgress(100);
      onShowToast(`Extracted ${selectedPages.length} page(s) successfully!`);
    } catch (err) {
      console.error('Extract pages error:', err);
      onShowToast('Failed to extract pages from PDF');
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

  const selectedCount = pages.filter(p => p.selected).length;

  return (
    <div className="w-full max-w-4xl mx-auto my-6 glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
      <div className="text-center max-w-xl mx-auto mb-6">
        <span className="text-4xl mb-2 inline-block">📦</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          {t('extractPdfPagesTitle', 'Extract PDF Pages')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
          {t('extractPdfPagesSubtitle', 'Select specific pages or enter custom page ranges to create a new PDF document.')}
        </p>
      </div>

      {!file ? (
        <label className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-indigo-300/60 dark:border-indigo-900/40 rounded-2xl hover:border-indigo-500 cursor-pointer glass-card transition-all text-center">
          <Upload className="w-12 h-12 text-indigo-500 mb-3 animate-pulse" />
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            {t('selectPdfToExtractPages', 'Select PDF file to extract pages')}
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

          {/* Page Range Input & Selection Helpers */}
          <div className="p-5 rounded-2xl glass-card border border-slate-200/50 dark:border-slate-800/50 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                Page Range String (e.g. "1-3, 5, 7-10")
              </label>
              <div className="flex items-center gap-3">
                <button onClick={() => selectAll(true)} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-bold">Select All</button>
                <button onClick={() => selectAll(false)} className="text-xs text-slate-500 hover:underline font-semibold">Deselect All</button>
                <button onClick={resetAll} className="text-xs text-rose-500 hover:underline font-semibold cursor-pointer">Reset</button>
              </div>
            </div>

            <input
              type="text"
              value={rangeInput}
              onChange={(e) => handleRangeInputChange(e.target.value)}
              placeholder="e.g. 1-3, 5"
              className="w-full p-3 rounded-xl glass-input text-sm font-bold text-slate-900 dark:text-white"
            />
          </div>

          {/* Thumbnail Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {pages.map((p, idx) => (
              <div
                key={p.pageIndex}
                onClick={() => togglePageSelection(idx)}
                className={`glass-card p-3 rounded-2xl flex flex-col items-center gap-2 cursor-pointer border transition-all ${
                  p.selected
                    ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/40'
                    : 'border-slate-200/60 dark:border-slate-800 opacity-60'
                }`}
              >
                <div className="relative w-full aspect-[3/4] bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center">
                  <img src={p.dataUrl} alt={`Page ${idx + 1}`} className="object-contain max-h-full" />
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

          {isProcessing ? (
            <PdfProcessingProgress currentStage={stage} percent={progress} />
          ) : (
            <button
              onClick={handleExtract}
              disabled={selectedCount === 0}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Scissors className="w-4 h-4" />
              {selectedCount === 0 ? 'Select Pages to Extract' : `Extract ${selectedCount} Page(s) to New PDF`}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
