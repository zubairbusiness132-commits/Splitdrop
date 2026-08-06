import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Upload, FileText, Save, Eraser, RefreshCw, Calendar, User, Tag, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { FileInformationPanel } from './FileInformationPanel';
import { PdfProcessingProgress, ProcessingStage } from './PdfProcessingProgress';
import { formatBytes, extractPdfVersionFromBuffer } from '../../../lib/pdfUtils';

export const PdfMetadataTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [pdfBuffer, setPdfBuffer] = useState<ArrayBuffer | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pdfVersion, setPdfVersion] = useState<string>('v1.7');

  // Metadata Fields
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [subject, setSubject] = useState('');
  const [keywords, setKeywords] = useState('');
  const [creator, setCreator] = useState('');
  const [producer, setProducer] = useState('');
  const [creationDate, setCreationDate] = useState<string>('');
  const [modificationDate, setModificationDate] = useState<string>('');
  const [pageSize, setPageSize] = useState<string>('');

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

      const firstPage = pdfDoc.getPage(0);
      const { width, height } = firstPage.getSize();
      const sizeStr = `${Math.round(width * 0.352778)} x ${Math.round(height * 0.352778)} mm (${Math.round(width)} x ${Math.round(height)} pt)`;

      setFile(uploadedFile);
      setPdfBuffer(buffer);
      setPageCount(count);
      setPdfVersion(version);
      setPageSize(sizeStr);

      setTitle(pdfDoc.getTitle() || '');
      setAuthor(pdfDoc.getAuthor() || '');
      setSubject(pdfDoc.getSubject() || '');
      const kw = pdfDoc.getKeywords();
      setKeywords(Array.isArray(kw) ? kw.join(', ') : (typeof kw === 'string' ? kw : ''));
      setCreator(pdfDoc.getCreator() || '');
      setProducer(pdfDoc.getProducer() || '');

      const cDate = pdfDoc.getCreationDate();
      setCreationDate(cDate ? cDate.toLocaleString() : new Date(uploadedFile.lastModified).toLocaleString());

      const mDate = pdfDoc.getModificationDate();
      setModificationDate(mDate ? mDate.toLocaleString() : new Date().toLocaleString());

      onShowToast(`Loaded metadata for ${uploadedFile.name}`);
    } catch {
      onShowToast('Failed to parse PDF metadata');
    }
  };

  const clearAllMetadata = () => {
    setTitle('');
    setAuthor('');
    setSubject('');
    setKeywords('');
    setCreator('');
    setProducer('');
    onShowToast('All metadata fields cleared');
  };

  const handleSaveMetadata = async () => {
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
      setProgress(65);

      pdfDoc.setTitle(title);
      pdfDoc.setAuthor(author);
      pdfDoc.setSubject(subject);
      pdfDoc.setKeywords(keywords.split(',').map(k => k.trim()).filter(Boolean));
      pdfDoc.setCreator(creator);
      pdfDoc.setProducer(producer);
      pdfDoc.setModificationDate(new Date());

      setStage('Preparing Download');
      setProgress(85);

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const baseName = file.name.replace(/\.pdf$/i, '');
      const a = document.createElement('a');
      a.href = url;
      a.download = `${baseName}_metadata_updated.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      setStage('Completed');
      setProgress(100);
      onShowToast('Updated PDF metadata saved and downloaded!');
    } catch (err) {
      console.error('Metadata update error:', err);
      onShowToast('Failed to save updated PDF metadata');
    } finally {
      setTimeout(() => setIsProcessing(false), 500);
    }
  };

  const resetAll = () => {
    setFile(null);
    setPdfBuffer(null);
    setPageCount(0);
    setTitle('');
    setAuthor('');
    setSubject('');
    setKeywords('');
    setCreator('');
    setProducer('');
    setIsProcessing(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
      <div className="text-center max-w-xl mx-auto mb-6">
        <span className="text-4xl mb-2 inline-block">📋</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          {t('pdfMetadataTitle', 'PDF Metadata Viewer & Editor')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
          {t('pdfMetadataSubtitle', 'View, edit, or strip PDF document properties including Title, Author, Keywords, and Creator.')}
        </p>
      </div>

      {!file ? (
        <label className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-indigo-300/60 dark:border-indigo-900/40 rounded-2xl hover:border-indigo-500 cursor-pointer glass-card transition-all text-center">
          <Upload className="w-12 h-12 text-indigo-500 mb-3 animate-pulse" />
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            {t('selectPdfMetadata', 'Select PDF file to inspect metadata')}
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

          {/* System Properties Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl glass-card">
              <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-indigo-500" /> Page Dimensions
              </span>
              <p className="font-extrabold text-slate-800 dark:text-slate-200 mt-0.5 truncate">{pageSize || 'A4 Standard'}</p>
            </div>
            <div className="p-3 rounded-xl glass-card">
              <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-500" /> Creation Date
              </span>
              <p className="font-extrabold text-slate-800 dark:text-slate-200 mt-0.5 truncate">{creationDate}</p>
            </div>
            <div className="p-3 rounded-xl glass-card">
              <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> Modified Date
              </span>
              <p className="font-extrabold text-slate-800 dark:text-slate-200 mt-0.5 truncate">{modificationDate}</p>
            </div>
          </div>

          {/* Editable Metadata Form */}
          <div className="p-6 rounded-2xl glass-card border border-slate-200/50 dark:border-slate-800/50 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50 pb-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Document Metadata Properties
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearAllMetadata}
                  className="text-xs text-rose-500 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Eraser className="w-3.5 h-3.5" /> Strip All Metadata
                </button>
                <button
                  onClick={resetAll}
                  className="text-xs text-slate-500 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Reset File
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Annual Financial Report"
                  className="w-full p-3 rounded-xl glass-input font-semibold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Author / Creator Name
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={e => setAuthor(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full p-3 rounded-xl glass-input font-semibold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Subject / Summary
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="e.g. Q4 Performance Analysis"
                  className="w-full p-3 rounded-xl glass-input font-semibold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Keywords (comma separated)
                </label>
                <input
                  type="text"
                  value={keywords}
                  onChange={e => setKeywords(e.target.value)}
                  placeholder="e.g. report, finance, 2026"
                  className="w-full p-3 rounded-xl glass-input font-semibold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Creator Application
                </label>
                <input
                  type="text"
                  value={creator}
                  onChange={e => setCreator(e.target.value)}
                  placeholder="e.g. SplitDrop PDF Suite"
                  className="w-full p-3 rounded-xl glass-input font-semibold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                  PDF Producer
                </label>
                <input
                  type="text"
                  value={producer}
                  onChange={e => setProducer(e.target.value)}
                  placeholder="e.g. SplitDrop Web Engine"
                  className="w-full p-3 rounded-xl glass-input font-semibold text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {isProcessing ? (
            <PdfProcessingProgress currentStage={stage} percent={progress} />
          ) : (
            <button
              onClick={handleSaveMetadata}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Save Metadata & Download PDF
            </button>
          )}
        </div>
      )}
    </div>
  );
};
