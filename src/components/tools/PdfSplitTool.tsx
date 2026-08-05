import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import { Upload, FileText, Scissors, Download, FileArchive } from 'lucide-react';

interface PdfSplitToolProps {
  onShowToast: (msg: string) => void;
}

export const PdfSplitTool: React.FC<PdfSplitToolProps> = ({ onShowToast }) => {
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
        // Split each page into single PDF
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
        // Extract selected page range into new single PDF
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
    <div className="w-full max-w-4xl mx-auto my-6 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
      <div className="text-center max-w-xl mx-auto mb-8">
        <span className="text-4xl mb-2 inline-block">✂️</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
          PDF Splitter & Page Extractor
        </h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">
          Split PDF documents into individual pages or extract specific page ranges instantly in your browser.
        </p>
      </div>

      {!pdfFile ? (
        <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-2xl hover:border-violet-500 dark:hover:border-violet-500 cursor-pointer bg-gray-50/50 dark:bg-slate-800/30 transition-all text-center mb-6">
          <Upload className="w-10 h-10 text-violet-500 mb-2" />
          <span className="text-sm font-bold text-gray-900 dark:text-white">
            Select PDF file to split
          </span>
          <span className="text-xs text-gray-500 dark:text-slate-400 mt-1">
            Choose a single PDF document
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
          {/* File Card */}
          <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/60">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-violet-50 dark:bg-violet-950/40 text-violet-600 rounded-xl">
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
              className="text-xs text-rose-500 hover:underline font-semibold"
            >
              Choose Different File
            </button>
          </div>

          {/* Split Mode Selector */}
          <div className="p-5 rounded-2xl bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-slate-300">
              Select Split Method
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSplitMode('all')}
                className={`p-3.5 rounded-xl border text-xs sm:text-sm font-bold transition-all ${
                  splitMode === 'all'
                    ? 'bg-violet-600 text-white border-violet-600 shadow-md'
                    : 'bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-300 border-gray-300 dark:border-slate-700'
                }`}
              >
                Split Every Single Page (ZIP)
              </button>
              <button
                onClick={() => setSplitMode('range')}
                className={`p-3.5 rounded-xl border text-xs sm:text-sm font-bold transition-all ${
                  splitMode === 'range'
                    ? 'bg-violet-600 text-white border-violet-600 shadow-md'
                    : 'bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-300 border-gray-300 dark:border-slate-700'
                }`}
              >
                Extract Custom Page Range
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
                  className="w-full p-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-bold text-gray-900 dark:text-white"
                />
              </div>
            )}

            <button
              onClick={handleSplit}
              disabled={isProcessing}
              className="w-full py-4 bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-violet-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {splitMode === 'all' ? <FileArchive className="w-4 h-4" /> : <Scissors className="w-4 h-4" />}
              {isProcessing
                ? 'Processing PDF...'
                : splitMode === 'all'
                ? 'Split All Pages & Download ZIP'
                : 'Extract Selected Pages'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
