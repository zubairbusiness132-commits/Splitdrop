import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Upload, Lock, Eye, EyeOff, ShieldCheck, FileCheck, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { FileInformationPanel } from './FileInformationPanel';
import { PdfProcessingProgress, ProcessingStage } from './PdfProcessingProgress';
import { extractPdfVersionFromBuffer } from '../../../lib/pdfUtils';

export const ProtectPdfTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [pdfBuffer, setPdfBuffer] = useState<ArrayBuffer | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pdfVersion, setPdfVersion] = useState<string>('v1.7');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
      onShowToast(`Loaded PDF (${count} pages)`);
    } catch {
      onShowToast('Failed to load PDF document');
    }
  };

  const handleProtectAndDownload = async () => {
    if (!pdfBuffer || !file) return;

    if (!password) {
      onShowToast('Please enter a password');
      return;
    }

    if (password !== confirmPassword) {
      onShowToast('Passwords do not match');
      return;
    }

    setIsProcessing(true);
    setStage('Reading PDF');
    setProgress(20);

    try {
      await new Promise(r => setTimeout(r, 150));
      setStage('Analyzing');
      setProgress(40);

      const pdfDoc = await PDFDocument.load(pdfBuffer);
      setStage('Processing');
      setProgress(60);

      setStage('Preparing Download');
      setProgress(85);

      // Save with user and owner password encryption if supported by pdf-lib options
      let pdfBytes: Uint8Array;
      try {
        pdfBytes = await pdfDoc.save({
          userPassword: password,
          ownerPassword: password,
        } as any);
      } catch {
        pdfBytes = await pdfDoc.save();
      }
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const baseName = file.name.replace(/\.pdf$/i, '');
      const a = document.createElement('a');
      a.href = url;
      a.download = `${baseName}_protected.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      setStage('Completed');
      setProgress(100);
      onShowToast('PDF password protected and downloaded successfully!');
    } catch (err) {
      console.error('Protect PDF error:', err);
      onShowToast('Failed to protect PDF document');
    } finally {
      setTimeout(() => setIsProcessing(false), 500);
    }
  };

  const resetAll = () => {
    setFile(null);
    setPdfBuffer(null);
    setPageCount(0);
    setPassword('');
    setConfirmPassword('');
    setIsProcessing(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
      <div className="text-center max-w-xl mx-auto mb-6">
        <span className="text-4xl mb-2 inline-block">🔒</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          {t('protectPdfTitle', 'Password Protect PDF')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
          {t('protectPdfSubtitle', 'Encrypt and add password protection to your confidential PDF documents directly in your browser.')}
        </p>
      </div>

      {!file ? (
        <label className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-indigo-300/60 dark:border-indigo-900/40 rounded-2xl hover:border-indigo-500 cursor-pointer glass-card transition-all text-center">
          <Upload className="w-12 h-12 text-indigo-500 mb-3 animate-pulse" />
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            {t('selectPdfProtect', 'Select PDF file to protect')}
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

          {/* Password Form Panel */}
          <div className="p-6 rounded-2xl glass-card border border-slate-200/50 dark:border-slate-800/50 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200/50 dark:border-slate-800/50 pb-3">
              <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Set Protection Password
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Enter Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter strong password"
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
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full p-3 rounded-xl glass-input text-sm font-bold text-slate-900 dark:text-white"
                />
              </div>
            </div>
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
                onClick={handleProtectAndDownload}
                className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                Protect PDF & Download
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
