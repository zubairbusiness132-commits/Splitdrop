import React, { useState } from 'react';
import JSZip from 'jszip';
import { Upload, Download, Image as ImageIcon, Eye, RefreshCw, FileArchive } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { FileInformationPanel } from './FileInformationPanel';
import { PdfProcessingProgress, ProcessingStage } from './PdfProcessingProgress';
import { renderPdfPageToDataUrl, formatBytes, extractPdfVersionFromBuffer } from '../../../lib/pdfUtils';
import { PDFDocument } from 'pdf-lib';

interface ExtractedImage {
  pageIndex: number;
  dataUrl: string;
}

export const PdfToImagesTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pdfVersion, setPdfVersion] = useState<string>('v1.7');

  const [outputFormat, setOutputFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [extractedImages, setExtractedImages] = useState<ExtractedImage[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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
      setPdfData(buffer);
      setPageCount(count);
      setPdfVersion(version);
      setExtractedImages([]);
      onShowToast(`Loaded PDF (${count} pages)`);
    } catch {
      onShowToast('Failed to parse PDF document');
    }
  };

  const processExtractImages = async () => {
    if (!pdfData || !file) return;

    setIsProcessing(true);
    setStage('Reading PDF');
    setProgress(15);

    try {
      await new Promise(r => setTimeout(r, 150));
      setStage('Analyzing');
      setProgress(30);

      setStage('Processing');
      const results: ExtractedImage[] = [];
      const mime = outputFormat === 'png' ? 'image/png' : outputFormat === 'jpeg' ? 'image/jpeg' : 'image/webp';

      for (let i = 0; i < pageCount; i++) {
        const pct = Math.round(30 + ((i + 1) / pageCount) * 55);
        setProgress(pct);

        const dataUrl = await renderPdfPageToDataUrl(pdfData, i, 1.8, mime);
        results.push({ pageIndex: i, dataUrl });
      }

      setStage('Preparing Download');
      setProgress(95);
      setExtractedImages(results);

      setStage('Completed');
      setProgress(100);
      onShowToast(`Successfully converted ${pageCount} pages to ${outputFormat.toUpperCase()}!`);
    } catch (err) {
      console.error('PDF to Images error:', err);
      onShowToast('Failed to convert PDF pages to images');
    } finally {
      setTimeout(() => setIsProcessing(false), 500);
    }
  };

  const downloadSingleImage = (img: ExtractedImage) => {
    const ext = outputFormat === 'jpeg' ? 'jpg' : outputFormat;
    const baseName = file?.name.replace(/\.pdf$/i, '') || 'page';
    const a = document.createElement('a');
    a.href = img.dataUrl;
    a.download = `${baseName}_page_${img.pageIndex + 1}.${ext}`;
    a.click();
    onShowToast(`Downloaded Page #${img.pageIndex + 1}`);
  };

  const downloadZip = async () => {
    if (extractedImages.length === 0) return;

    const zip = new JSZip();
    const ext = outputFormat === 'jpeg' ? 'jpg' : outputFormat;
    const baseName = file?.name.replace(/\.pdf$/i, '') || 'extracted_images';

    extractedImages.forEach((img) => {
      const base64Data = img.dataUrl.split(',')[1];
      zip.file(`${baseName}_page_${img.pageIndex + 1}.${ext}`, base64Data, { base64: true });
    });

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${baseName}_images.zip`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('ZIP file downloaded successfully!');
  };

  const resetAll = () => {
    setFile(null);
    setPdfData(null);
    setPageCount(0);
    setExtractedImages([]);
    setPreviewImage(null);
    setIsProcessing(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-6">
        <span className="text-4xl mb-2 inline-block">📷</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          {t('pdfToImagesTitle', 'PDF to Images Converter')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
          {t('pdfToImagesSubtitle', 'Extract every PDF page as high-resolution PNG, JPG, or WebP images instantly in your browser.')}
        </p>
      </div>

      {!file ? (
        <label className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-indigo-300/60 dark:border-indigo-900/40 rounded-2xl hover:border-indigo-500 cursor-pointer glass-card transition-all text-center">
          <Upload className="w-12 h-12 text-indigo-500 mb-3 animate-pulse" />
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            {t('selectPdfToExtract', 'Select PDF file to convert to images')}
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
            status={isProcessing ? stage : extractedImages.length > 0 ? 'Completed' : 'Idle'}
            statusProgress={progress}
          />

          {/* Controls Panel */}
          <div className="p-5 rounded-2xl glass-card border border-slate-200/50 dark:border-slate-800/50 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  {t('outputImageFormat', 'Output Image Format')}
                </label>
                <div className="inline-flex p-1 bg-slate-200/60 dark:bg-slate-900 rounded-xl text-xs font-bold">
                  {(['png', 'jpeg', 'webp'] as const).map(fmt => (
                    <button
                      key={fmt}
                      onClick={() => setOutputFormat(fmt)}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        outputFormat === fmt
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {fmt.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={resetAll}
                className="text-xs text-rose-500 hover:underline font-semibold cursor-pointer flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                {t('chooseAnotherFile', 'Choose Another File')}
              </button>
            </div>

            {extractedImages.length === 0 && !isProcessing && (
              <button
                onClick={processExtractImages}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ImageIcon className="w-4 h-4" />
                {t('convertPdfPagesToImages', 'Extract All Pages as Images')}
              </button>
            )}
          </div>

          {isProcessing && <PdfProcessingProgress currentStage={stage} percent={progress} />}

          {/* Results Grid */}
          {extractedImages.length > 0 && !isProcessing && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl glass-card">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Extracted {extractedImages.length} Page Image(s) ({outputFormat.toUpperCase()})
                </span>
                <button
                  onClick={downloadZip}
                  className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <FileArchive className="w-4 h-4" />
                  {t('downloadAllZip', 'Download All as ZIP')}
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {extractedImages.map((img) => (
                  <div
                    key={img.pageIndex}
                    className="glass-card p-3 rounded-2xl flex flex-col items-center justify-between gap-3 group relative hover:border-indigo-500 transition-all"
                  >
                    <div className="relative w-full aspect-[3/4] bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center">
                      <img src={img.dataUrl} alt={`Page ${img.pageIndex + 1}`} className="object-contain max-h-full" />
                      <button
                        onClick={() => setPreviewImage(img.dataUrl)}
                        className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                      >
                        <Eye className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="w-full flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Page #{img.pageIndex + 1}
                      </span>
                      <button
                        onClick={() => downloadSingleImage(img)}
                        className="p-1.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer"
                        title="Download image"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal Preview */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-3xl max-h-[90vh] bg-white dark:bg-slate-900 p-2 rounded-2xl overflow-hidden shadow-2xl">
            <img src={previewImage} alt="Enlarged Preview" className="max-h-[85vh] object-contain rounded-xl" />
          </div>
        </div>
      )}
    </div>
  );
};
