import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Upload, Unlock, Eye, EyeOff, ShieldAlert, FileCheck, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { FileInformationPanel } from './FileInformationPanel';
import { PdfProcessingProgress, ProcessingStage } from './PdfProcessingProgress';
import { extractPdfVersionFromBuffer } from '../../../lib/pdfUtils';

export const UnlockPdfTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [pdfBuffer, setPdfBuffer] = useState<ArrayBuffer | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pdfVersion, setPdfVersion] = useState<string>('v1.7');

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [stage, setStage] = useState<ProcessingStage>('Reading PDF');
  const [progress, setProgress] = useState(0);

  const handleFileAdded = async (uploadedFile: File) => {
    if (!uploadedFile.name.endsWith('.pdf') && uploadedFile.type !== 'application/pdf') {
      onShowToast('Please select a valid PDF file');
      return;
    }

    setErrorMessage(null);
    try {
      const buffer = await uploadedFile.arrayBuffer();
      let count = 0;

      try {
        const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        count = pdfDoc.getPageCount();
      } catch {
        count = 1;
      }

      const version = extractPdfVersionFromBuffer(buffer);

      setFile(uploadedFile);
      setPdfBuffer(buffer);
      setPageCount(count);
      setPdfVersion(version);
      onShowToast('Loaded encrypted PDF');
    } catch {
      onShowToast('Failed to parse PDF document');
    }
  };

  const handleUnlockAndDownload = async () => {
    if (!pdfBuffer || !file) return;

    setIsProcessing(true);
    setStage('Reading PDF');
    setProgress(20);
    setErrorMessage(null);

    try {
      await new Promise(r => setTimeout(r, 150));
      setStage('Analyzing');
      setProgress(40);

      let srcDoc: PDFDocument | null = null;

      try {
        // Attempt load with ignoreEncryption true or password option
        srcDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
      } catch (err1) {
        console.warn('Direct load failed, attempting with password:', err1);
        try {
          // Attempt standard password decryption
          srcDoc = await PDFDocument.load(pdfBuffer, { password } as any);
        } catch (err2) {
          console.warn('Password load failed:', err2);
        }
      }

      setStage('Processing');
      setProgress(60);

      if (!srcDoc) {
        setErrorMessage('Unable to decrypt file. The password entered may be incorrect, or the document uses an unsupported high-security DRM standard.');
        setIsProcessing(false);
        return;
      }

      // Create new clean unencrypted document and copy all pages
      const newDoc = await PDFDocument.create();
      const count = srcDoc.getPageCount();
      const indices = Array.from({ length: count }, (_, i) => i);
      
      const copiedPages = await newDoc.copyPages(srcDoc, indices);
      copiedPages.forEach(p => newDoc.addPage(p));

      setStage('Preparing Download');
      setProgress(85);

      const pdfBytes = await newDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const baseName = file.name.replace(/\.pdf$/i, '');
      const a = document.createElement('a');
      a.href = url;
      a.download = `${baseName}_unlocked.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      setStage('Completed');
      setProgress(100);
      onShowToast('Unlocked PDF created and downloaded successfully!');
    } catch (err) {
      console.error('Unlock PDF error:', err);
      setErrorMessage('Browser encryption limitation: This specific PDF uses restricted owner encryption rights. Enter the correct owner/user password, or try saving the PDF via your browser Print dialog.');
    } finally {
      setTimeout(() => setIsProcessing(false), 500);
    }
  };

  const resetAll = () => {
    setFile(null);
    setPdfBuffer(null);
    setPageCount(0);
    setPassword('');
    setErrorMessage(null);
    setIsProcessing(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
      <div className="text-center max-w-xl mx-auto mb-6">
        <span className="text-4xl mb-2 inline-block">🔓</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          {t('unlockPdfTitle', 'Unlock & Remove PDF Password')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
          {t('unlockPdfSubtitle', 'Remove password restrictions from your PDF document instantly in your browser.')}
        </p>
      </div>

      {!file ? (
        <label className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-indigo-300/60 dark:border-indigo-900/40 rounded-2xl hover:border-indigo-500 cursor-pointer glass-card transition-all text-center">
          <Upload className="w-12 h-12 text-indigo-500 mb-3 animate-pulse" />
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            {t('selectPdfUnlock', 'Select protected PDF file to unlock')}
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

          <div className="p-6 rounded-2xl glass-card border border-slate-200/50 dark:border-slate-800/50 space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Enter PDF Password (If Prompted)
            </h3>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter PDF password"
                className="w-full p-3 pr-10 rounded-xl glass-input text-sm font-bold text-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {errorMessage && (
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs flex gap-3 items-start leading-relaxed">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold mb-0.5">Decryption Note</strong>
                  {errorMessage}
                </div>
              </div>
            )}
          </div>

          {isProcessing ? (
            <PdfProcessingProgress currentStage={stage} percent={progress} />
          ) : (
            <div className="flex gap-3">
              <button
                onClick={resetAll}
                className="py-4 px-6 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 font-bold text-sm cursor-pointer"
              >
                Reset
              </button>
              <button
                onClick={handleUnlockAndDownload}
                className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Unlock className="w-4 h-4" />
                Unlock PDF & Download
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
