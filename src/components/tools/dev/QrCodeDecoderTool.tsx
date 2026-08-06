import React, { useState, useRef } from 'react';
import { QrCode, Upload, Copy, Check, AlertCircle, Trash2, Link } from 'lucide-react';
import jsQR from 'jsqr';

export const QrCodeDecoderTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [decodedData, setDecodedData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const decodeQrImage = (file: File) => {
    setError(null);
    setDecodedData(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setImageSrc(src);

      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current || document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setError('Could not initialize 2D canvas context.');
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);

        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code && code.data) {
          setDecodedData(code.data);
          onShowToast('Successfully decoded QR Code!');
        } else {
          setError('No valid QR code detected in the uploaded image.');
        }
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const handleCopy = () => {
    if (!decodedData) return;
    navigator.clipboard.writeText(decodedData);
    setCopied(true);
    onShowToast('Copied decoded QR content!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <QrCode className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            QR Code Decoder & Scanner
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Upload any image containing a QR code to extract its underlying text or web link completely client-side.
          </p>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Dropzone */}
        <div className="space-y-4">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Upload Image File</label>
          <div className="glass-card p-8 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all text-center space-y-3 cursor-pointer relative">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && decodeQrImage(e.target.files[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Click or drag & drop QR image</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Supports PNG, JPG, WEBP, GIF</p>
            </div>
          </div>

          {imageSrc && (
            <div className="p-4 glass-card rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={imageSrc} alt="Uploaded QR" className="w-16 h-16 object-contain rounded-xl border" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">QR Code Image</span>
              </div>
              <button
                onClick={() => {
                  setImageSrc(null);
                  setDecodedData(null);
                  setError(null);
                  onShowToast('Cleared uploaded image');
                }}
                className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Decoded Output */}
        <div className="space-y-4">
          <label className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Decoded Payload Content</label>

          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}

          {decodedData ? (
            <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 font-mono text-xs break-all leading-relaxed text-slate-900 dark:text-white border border-slate-200/60 dark:border-slate-800">
                {decodedData}
              </div>

              <div className="flex items-center justify-end gap-2">
                {decodedData.startsWith('http') && (
                  <a
                    href={decodedData}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Link className="w-3.5 h-3.5" /> Open Link
                  </a>
                )}
                <button
                  onClick={handleCopy}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy Decoded Text'}
                </button>
              </div>
            </div>
          ) : (
            !error && (
              <div className="p-8 text-center text-xs text-slate-400 font-bold glass-card rounded-2xl border border-slate-200/80 dark:border-slate-800">
                Upload a QR code image to display the decoded text or payload URL here.
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
