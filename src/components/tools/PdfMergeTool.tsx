import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Upload, FileText, ArrowUp, ArrowDown, Trash2, Layers } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface PdfItem {
  id: string;
  file: File;
  pageCount: number;
  arrayBuffer: ArrayBuffer;
}

interface PdfMergeToolProps {
  onShowToast: (msg: string) => void;
}

export const PdfMergeTool: React.FC<PdfMergeToolProps> = ({ onShowToast }) => {
  const { t } = useLanguage();
  const [items, setItems] = useState<PdfItem[]>([]);
  const [isMerging, setIsMerging] = useState(false);

  const handleFilesAdded = async (files: FileList | File[]) => {
    const pdfFiles = Array.from(files).filter(f => f.type === 'application/pdf' || f.name.endsWith('.pdf'));
    if (pdfFiles.length === 0) {
      onShowToast('Please select valid PDF documents');
      return;
    }

    const loadedItems: PdfItem[] = [];
    for (const file of pdfFiles) {
      try {
        const buffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        loadedItems.push({
          id: Math.random().toString(36).substring(2, 9),
          file,
          pageCount: pdfDoc.getPageCount(),
          arrayBuffer: buffer
        });
      } catch {
        onShowToast(`Failed to parse ${file.name}`);
      }
    }

    setItems(prev => [...prev, ...loadedItems]);
    if (loadedItems.length > 0) {
      onShowToast(`Loaded ${loadedItems.length} PDF file(s)`);
    }
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;
    const newItems = [...items];
    const [moved] = newItems.splice(index, 1);
    newItems.splice(targetIdx, 0, moved);
    setItems(newItems);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const mergePdfs = async () => {
    if (items.length < 2) {
      onShowToast('Add at least 2 PDF files to merge');
      return;
    }

    setIsMerging(true);
    try {
      const mergedPdf = await PDFDocument.create();

      for (const item of items) {
        const pdfToCopy = await PDFDocument.load(item.arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdfToCopy, pdfToCopy.getPageIndices());
        copiedPages.forEach(page => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'merged-document.pdf';
      a.click();
      URL.revokeObjectURL(url);
      onShowToast('Merged PDF downloaded successfully!');
    } catch {
      onShowToast('Error merging PDFs');
    } finally {
      setIsMerging(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const totalPages = items.reduce((acc, curr) => acc + curr.pageCount, 0);
  const totalSize = items.reduce((acc, curr) => acc + curr.file.size, 0);

  return (
    <div className="w-full max-w-4xl mx-auto my-6 glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
      <div className="text-center max-w-xl mx-auto mb-6">
        <span className="text-4xl mb-2 inline-block">🧩</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
          {t('pdfMergeTitle', 'PDF Merge Tool')}
        </h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">
          {t('pdfMergeSubtitle', 'Combine multiple PDF files into one clean document. Drag to reorder, view page counts, and download instantly.')}
        </p>
      </div>

      <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-indigo-300/60 dark:border-indigo-900/40 rounded-2xl hover:border-indigo-500 dark:hover:border-indigo-500 cursor-pointer glass-card transition-all text-center">
        <Upload className="w-10 h-10 text-indigo-500 mb-2" />
        <span className="text-sm font-bold text-gray-900 dark:text-white">
          {t('selectPdfCombine', 'Select PDF files to combine')}
        </span>
        <span className="text-xs text-gray-500 dark:text-slate-400 mt-1">
          {t('supportsMultiplePdfs', 'Supports multiple PDF documents')}
        </span>
        {items.length > 0 && (
          <div className="mt-3 px-3 py-1 bg-indigo-100/80 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-extrabold text-xs rounded-full inline-flex items-center gap-1.5 shadow-xs border border-indigo-200/50 dark:border-indigo-800/50">
            📊 {items.length} PDF(s) selected • Total Size: {formatSize(totalSize)} ({totalPages} pages)
          </div>
        )}
        <input
          type="file"
          multiple
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={(e) => e.target.files && handleFilesAdded(e.target.files)}
        />
      </label>

      {items.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-gray-500 uppercase">
              {items.length} Files Selected ({totalPages} Pages) • Total Size: <strong className="text-indigo-600 dark:text-indigo-400 font-extrabold">{formatSize(totalSize)}</strong>
            </span>
            <button onClick={() => setItems([])} className="text-xs text-rose-500 hover:underline cursor-pointer">
              {t('clearList', 'Clear List')}
            </button>
          </div>

          <div className="space-y-2">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3.5 rounded-2xl glass-card"
              >
                <div className="p-2.5 bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl shrink-0 shadow-xs">
                  <FileText className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate">
                    {item.file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                    {item.pageCount} {item.pageCount === 1 ? 'page' : 'pages'} • Size: <strong className="text-gray-700 dark:text-slate-300 font-semibold">{formatSize(item.file.size)}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveItem(index, 'up')}
                    disabled={index === 0}
                    className="p-1.5 text-gray-500 hover:bg-gray-200/50 dark:hover:bg-slate-700/50 rounded-lg disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveItem(index, 'down')}
                    disabled={index === items.length - 1}
                    className="p-1.5 text-gray-500 hover:bg-gray-200/50 dark:hover:bg-slate-700/50 rounded-lg disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={mergePdfs}
            disabled={isMerging || items.length < 2}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <Layers className="w-4 h-4" />
            {isMerging ? t('mergingPdfs', 'Merging PDF Documents...') : `${t('mergePdfsButton', 'Merge PDFs into One')}`}
          </button>
        </div>
      )}
    </div>
  );
};
