import React, { useState } from 'react';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import { Upload, Droplets, RefreshCw, Sparkles, FileText, Type, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { FileInformationPanel } from './FileInformationPanel';
import { PdfProcessingProgress, ProcessingStage } from './PdfProcessingProgress';
import { extractPdfVersionFromBuffer } from '../../../lib/pdfUtils';

export const PdfWatermarkTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [pdfBuffer, setPdfBuffer] = useState<ArrayBuffer | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pdfVersion, setPdfVersion] = useState<string>('v1.7');

  // Watermark Settings
  const [type, setType] = useState<'text' | 'image'>('text');
  
  // Text options
  const [text, setText] = useState<string>('CONFIDENTIAL');
  const [fontSize, setFontSize] = useState<number>(48);
  const [textColor, setTextColor] = useState<string>('#6366f1');
  const [opacity, setOpacity] = useState<number>(0.3);
  const [rotation, setRotation] = useState<number>(45);
  const [position, setPosition] = useState<'Center' | 'Top-Left' | 'Top-Right' | 'Bottom-Left' | 'Bottom-Right'>('Center');

  // Image watermark option
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [stage, setStage] = useState<ProcessingStage>('Reading PDF');
  const [progress, setProgress] = useState(0);

  const handlePdfAdded = async (uploadedFile: File) => {
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

  const handleImageAdded = (uploadedImg: File) => {
    setImageFile(uploadedImg);
    setImagePreview(URL.revokeObjectURL ? URL.createObjectURL(uploadedImg) : null);
    onShowToast('Watermark image selected');
  };

  const hexToRgbRatio = (hex: string) => {
    let clean = hex.replace('#', '');
    if (clean.length === 3) clean = clean.split('').map(c => c + c).join('');
    const num = parseInt(clean, 16);
    return {
      r: ((num >> 16) & 255) / 255,
      g: ((num >> 8) & 255) / 255,
      b: (num & 255) / 255
    };
  };

  const applyWatermarkAndDownload = async () => {
    if (!pdfBuffer || !file) return;

    if (type === 'text' && !text.trim()) {
      onShowToast('Please enter watermark text');
      return;
    }

    if (type === 'image' && !imageFile) {
      onShowToast('Please select a watermark image');
      return;
    }

    setIsProcessing(true);
    setStage('Reading PDF');
    setProgress(20);

    try {
      await new Promise(r => setTimeout(r, 150));
      setStage('Analyzing');
      setProgress(35);

      const pdfDoc = await PDFDocument.load(pdfBuffer);
      const pages = pdfDoc.getPages();
      setStage('Processing');

      let embeddedImg: any = null;
      if (type === 'image' && imageFile) {
        const imgBuffer = await imageFile.arrayBuffer();
        if (imageFile.type === 'image/png' || imageFile.name.endsWith('.png')) {
          embeddedImg = await pdfDoc.embedPng(imgBuffer);
        } else {
          embeddedImg = await pdfDoc.embedJpg(imgBuffer);
        }
      }

      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const color = hexToRgbRatio(textColor);

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const { width, height } = page.getSize();
        const pct = Math.round(35 + ((i + 1) / pages.length) * 50);
        setProgress(pct);

        if (type === 'text') {
          const textWidth = font.widthOfTextAtSize(text, fontSize);
          const textHeight = font.heightAtSize(fontSize);

          let x = (width - textWidth) / 2;
          let y = (height - textHeight) / 2;

          if (position === 'Top-Left') { x = 40; y = height - textHeight - 40; }
          else if (position === 'Top-Right') { x = width - textWidth - 40; y = height - textHeight - 40; }
          else if (position === 'Bottom-Left') { x = 40; y = 40; }
          else if (position === 'Bottom-Right') { x = width - textWidth - 40; y = 40; }

          page.drawText(text, {
            x,
            y,
            size: fontSize,
            font,
            color: rgb(color.r, color.g, color.b),
            opacity,
            rotate: degrees(rotation)
          });
        } else if (embeddedImg) {
          const imgAspect = embeddedImg.width / embeddedImg.height;
          const targetW = width * 0.35;
          const targetH = targetW / imgAspect;

          let x = (width - targetW) / 2;
          let y = (height - targetH) / 2;

          if (position === 'Top-Left') { x = 40; y = height - targetH - 40; }
          else if (position === 'Top-Right') { x = width - targetW - 40; y = height - targetH - 40; }
          else if (position === 'Bottom-Left') { x = 40; y = 40; }
          else if (position === 'Bottom-Right') { x = width - targetW - 40; y = 40; }

          page.drawImage(embeddedImg, {
            x,
            y,
            width: targetW,
            height: targetH,
            opacity,
            rotate: degrees(rotation)
          });
        }
      }

      setStage('Preparing Download');
      setProgress(90);

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const baseName = file.name.replace(/\.pdf$/i, '');
      const a = document.createElement('a');
      a.href = url;
      a.download = `${baseName}_watermarked.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      setStage('Completed');
      setProgress(100);
      onShowToast('Watermarked PDF downloaded successfully!');
    } catch (err) {
      console.error('Watermark error:', err);
      onShowToast('Failed to apply watermark to PDF');
    } finally {
      setTimeout(() => setIsProcessing(false), 500);
    }
  };

  const resetAll = () => {
    setFile(null);
    setPdfBuffer(null);
    setPageCount(0);
    setImageFile(null);
    setImagePreview(null);
    setIsProcessing(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
      <div className="text-center max-w-xl mx-auto mb-6">
        <span className="text-4xl mb-2 inline-block">💧</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          {t('addWatermarkTitle', 'Add PDF Watermark')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
          {t('addWatermarkSubtitle', 'Add custom text or image watermarks with full control over opacity, position, rotation, and color.')}
        </p>
      </div>

      {!file ? (
        <label className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-indigo-300/60 dark:border-indigo-900/40 rounded-2xl hover:border-indigo-500 cursor-pointer glass-card transition-all text-center">
          <Upload className="w-12 h-12 text-indigo-500 mb-3 animate-pulse" />
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            {t('selectPdfWatermark', 'Select PDF file to watermark')}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('supportsSinglePdf', 'Choose any PDF document')}
          </span>
          <input
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handlePdfAdded(e.target.files[0])}
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

          {/* Watermark Controls */}
          <div className="p-5 rounded-2xl glass-card border border-slate-200/50 dark:border-slate-800/50 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Watermark Type
              </span>
              <div className="inline-flex p-1 bg-slate-200/60 dark:bg-slate-900 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setType('text')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer ${
                    type === 'text' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Type className="w-3.5 h-3.5" /> Text Watermark
                </button>
                <button
                  onClick={() => setType('image')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer ${
                    type === 'image' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" /> Image Logo
                </button>
              </div>
            </div>

            {type === 'text' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Watermark Text
                  </label>
                  <input
                    type="text"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder="e.g. CONFIDENTIAL"
                    className="w-full p-3 rounded-xl glass-input font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Font Size ({fontSize}px)
                  </label>
                  <input
                    type="range"
                    min="16"
                    max="100"
                    value={fontSize}
                    onChange={e => setFontSize(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={textColor}
                      onChange={e => setTextColor(e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border-0"
                    />
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{textColor}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400">
                  Upload Logo / Watermark Image
                </label>
                <label className="flex items-center justify-center p-6 border-2 border-dashed border-indigo-300/60 dark:border-indigo-900/40 rounded-xl cursor-pointer hover:border-indigo-500">
                  {imagePreview ? (
                    <div className="flex items-center gap-3">
                      <img src={imagePreview} alt="Watermark Preview" className="h-12 object-contain rounded-lg" />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{imageFile?.name}</span>
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">+ Select Watermark Image</span>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleImageAdded(e.target.files[0])}
                  />
                </label>
              </div>
            )}

            {/* Shared Opacity, Rotation, Position controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Opacity ({Math.round(opacity * 100)}%)
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={opacity}
                  onChange={e => setOpacity(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Rotation ({rotation}°)
                </label>
                <select
                  value={rotation}
                  onChange={e => setRotation(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl glass-input font-semibold"
                >
                  <option value={0}>0° (Horizontal)</option>
                  <option value={45}>45° Diagonal</option>
                  <option value={-45}>-45° Reverse Diagonal</option>
                  <option value={90}>90° Vertical</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Position
                </label>
                <select
                  value={position}
                  onChange={e => setPosition(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl glass-input font-semibold"
                >
                  <option value="Center">Center</option>
                  <option value="Top-Left">Top-Left</option>
                  <option value="Top-Right">Top-Right</option>
                  <option value="Bottom-Left">Bottom-Left</option>
                  <option value="Bottom-Right">Bottom-Right</option>
                </select>
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
                onClick={applyWatermarkAndDownload}
                className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                Apply Watermark & Download PDF
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
