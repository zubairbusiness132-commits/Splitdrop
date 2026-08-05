import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import { Upload, FileText, Scissors, FileArchive } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface PdfSplitToolProps {
  onShowToast: (msg: string) => void;
}

export const PdfSplitTool: React.FC<PdfSplitToolProps> = ({ onShowToast }) => {
  const { t } = useLanguage();
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [splitMode, setSplitMode] = useState<'all' | 'range'>('all');
  const [rangeInput, setRangeInput] = useState<string>('1');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileAdded = async (file: File) => {
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      onShowToast('Please select a valid PDF file');
      return;
    }

    try {
      const buffer = await file.arrayBuffer();
      const loadedPdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
      setPdfFile(file);
      setPdfDoc(loadedPdf);
      setPageCount(loadedPdf.getPageCount());
      setRangeInput(`1-${Math.min(3, loadedPdf.getPageCount())}`);
      onShowToast(`Loaded PDF with ${loadedPdf.getPageCount()} pages`);
    } catch {
      onShowToast('Failed to parse PDF document');
    }
  };

  const parseRangeIndices = (input: string, maxPages: number): number[] => {
    const indices = new Set<number>();
    const parts = input.split(',').map(p => p.trim());

    for (const part of parts) {
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = Math.max(1, start); i <= Math.min(maxPages, end); i++) {
            indices.add(i - 1);
          }
        }
      } else {
        const p = parseInt(part, 10);
        if (!isNaN(p) && p >= 1 && p <= maxPages) {
          indices.add(p - 1);
        }
      }
    }
    return Array.from(indices).sort((a, b) => a - b);
  };

  const handleSplit = async () => {
    if (!pdfDoc || !pdfFile) return;
    setIsProcessing(true);

    try {
      const zip = new JSZip();
      const baseName = pdfFile.name.replace(/\.pdf$/i, '');

      if (splitMode === 'all') {
        for (let i = 0; i < pageCount; i++) {
          const newDoc = await PDFDocument.create();
          const [copiedPage] = await newDoc.copyPages(pdfDoc, [i]);
          newDoc.addPage(copiedPage);
          const pdfBytes = await newDoc.save();
          zip.file(`${baseName}-page-${i + 1}.pdf`, pdfBytes);
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${baseName}-split-pages.zip`;
        a.click();
        URL.revokeObjectURL(url);
        onShowToast('Downloaded split PDF pages as ZIP!');
      } else {
        const indices = parseRangeIndices(rangeInput, pageCount);
        if (indices.length === 0) {
          onShowToast('Invalid page range entered');
          setIsProcessing(false);
          return;
        }

        const newDoc = await PDFDocument.create();
        const copiedPages = await newDoc.copyPages(pdfDoc, indices);
        copiedPages.forEach(p => newDoc.addPage(p));
        const pdfBytes = await newDoc.save();

        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${baseName}-extracted.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        onShowToast('Extracted pages saved to PDF!');
      }
    } catch {
      onShowToast('Failed to split PDF');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
      <div className="text-center max-w-xl mx-auto mb-6">
        <span className="text-4xl mb-2 inline-block">✂️</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
          {t('pdfSplitTitle', 'PDF Splitter & Page Extractor')}
        </h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">
          {t('pdfSplitSubtitle', 'Split PDF documents into individual pages or extract specific page ranges instantly in your browser.')}
        </p>
      </div>

      {!pdfFile ? (
        <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-violet-300/60 dark:border-violet-900/40 rounded-2xl hover:border-violet-500 dark:hover:border-violet-500 cursor-pointer glass-card transition-all text-center">
          <Upload className="w-10 h-10 text-violet-500 mb-2" />
          <span className="text-sm font-bold text-gray-900 dark:text-white">
            {t('selectPdfSplit', 'Select PDF file to split')}
          </span>
          <span className="text-xs text-gray-500 dark:text-slate-400 mt-1">
            {t('chooseSinglePdf', 'Choose a single PDF document')}
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
          <div className="flex items-center justify-between p-4 rounded-2xl glass-card">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-violet-50/80 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 rounded-xl shrink-0 shadow-xs">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-gray-900 dark:text-white">
                  {pdfFile.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                  Total Pages: <strong className="text-violet-600 dark:text-violet-400 font-bold">{pageCount}</strong> • File Size: <strong className="text-gray-800 dark:text-slate-200 font-bold">{formatSize(pdfFile.size)}</strong>
                </p>
              </div>
            </div>
            <button
              onClick={() => { setPdfFile(null); setPdfDoc(null); }}
              className="text-xs text-rose-500 hover:underline font-semibold cursor-pointer"
            >
              Choose Different File
            </button>
          </div>

          <div className="p-5 rounded-2xl glass-card space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-slate-300">
              Select Split Method
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSplitMode('all')}
                className={`p-3.5 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  splitMode === 'all'
                    ? 'bg-violet-600 text-white border-violet-600 shadow-md'
                    : 'glass-btn text-gray-700 dark:text-slate-300'
                }`}
              >
                {t('splitEveryPage', 'Split Every Single Page (ZIP)')}
              </button>
              <button
                onClick={() => setSplitMode('range')}
                className={`p-3.5 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  splitMode === 'range'
                    ? 'bg-violet-600 text-white border-violet-600 shadow-md'
                    : 'glass-btn text-gray-700 dark:text-slate-300'
                }`}
              >
                {t('extractCustomRange', 'Extract Custom Page Range')}
              </button>
            </div>

            {splitMode === 'range' && (
              <div className="pt-2">
                <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1">
                  Page Range (e.g. "1-3, 5, 7-10")
                </label>
                <input
                  type="text"
                  value={rangeInput}
                  onChange={(e) => setRangeInput(e.target.value)}
                  placeholder="e.g. 1-3, 5"
                  className="w-full p-3 rounded-xl glass-input text-sm font-bold text-gray-900 dark:text-white"
                />
              </div>
            )}

            <button
              onClick={handleSplit}
              disabled={isProcessing}
              className="w-full py-4 bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-violet-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2 cursor-pointer"
            >
              {splitMode === 'all' ? <FileArchive className="w-4 h-4" /> : <Scissors className="w-4 h-4" />}
              {isProcessing
                ? t('processingPdf', 'Processing PDF...')
                : splitMode === 'all'
                ? t('splitAllZip', 'Split All Pages & Download ZIP')
                : t('extractSelected', 'Extract Selected Pages')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
