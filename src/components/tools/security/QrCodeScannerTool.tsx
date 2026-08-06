import React, { useState, useRef, useEffect } from 'react';
import jsQR from 'jsqr';
import { Camera, Upload, Clipboard, Copy, ExternalLink, RefreshCw, Check, QrCode, Trash2 } from 'lucide-react';

interface QrCodeScannerToolProps {
  onShowToast: (message: string) => void;
}

export const QrCodeScannerTool: React.FC<QrCodeScannerToolProps> = ({ onShowToast }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'camera' | 'paste'>('upload');
  const [scannedResult, setScannedResult] = useState<string>('');
  const [history, setHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('splitdrop-qr-history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    localStorage.setItem('splitdrop-qr-history', JSON.stringify(history.slice(0, 20)));
  }, [history]);

  const addResultToHistory = (res: string) => {
    if (!res) return;
    setScannedResult(res);
    setHistory((prev) => [res, ...prev.filter((item) => item !== res)]);
    onShowToast('QR Code decoded successfully!');
  };

  // Process canvas image data for QR code
  const decodeCanvas = (ctx: CanvasRenderingContext2D, width: number, height: number): boolean => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert',
    });
    if (code && code.data) {
      addResultToHistory(code.data);
      return true;
    }
    return false;
  };

  // Handle image upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const found = decodeCanvas(ctx, img.width, img.height);
      if (!found) {
        onShowToast('No valid QR code detected in image.');
      }
    };
    img.src = URL.createObjectURL(file);
  };

  // Handle camera stream
  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.play();
        scanCameraFrame();
      }
    } catch {
      setIsCameraActive(false);
      onShowToast('Unable to access camera permission.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    setIsCameraActive(false);
  };

  const scanCameraFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const found = decodeCanvas(ctx, canvas.width, canvas.height);
        if (found) {
          stopCamera();
          return;
        }
      }
    }
    animFrameRef.current = requestAnimationFrame(scanCameraFrame);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Handle clipboard paste
  const handlePaste = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      for (const item of clipboardItems) {
        const imageType = item.types.find((type) => type.startsWith('image/'));
        if (imageType) {
          const blob = await item.getType(imageType);
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0);
              const found = decodeCanvas(ctx, img.width, img.height);
              if (!found) onShowToast('No QR code detected in pasted image.');
            }
          };
          img.src = URL.createObjectURL(blob);
          return;
        }
      }
      onShowToast('No image found on clipboard.');
    } catch {
      onShowToast('Unable to read clipboard image.');
    }
  };

  const isUrl = (str: string) => {
    try {
      const url = new URL(str);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    onShowToast('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>📷</span> QR Code Scanner
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Scan QR codes using live camera feed, file upload, or clipboard image with 100% local processing.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl gap-1 max-w-md">
        <button
          onClick={() => {
            stopCamera();
            setActiveTab('upload');
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'upload'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Upload className="w-3.5 h-3.5" /> Upload File
        </button>

        <button
          onClick={() => {
            setActiveTab('camera');
            startCamera();
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'camera'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Camera className="w-3.5 h-3.5" /> Camera Scan
        </button>

        <button
          onClick={() => {
            stopCamera();
            setActiveTab('paste');
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'paste'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Clipboard className="w-3.5 h-3.5" /> Paste Image
        </button>
      </div>

      {/* Input Panels */}
      {activeTab === 'upload' && (
        <div className="glass-card p-8 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-center space-y-3">
          <QrCode className="w-10 h-10 text-indigo-500 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Upload Image with QR Code</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Select a PNG, JPG, or WebP screenshot containing a QR code to decode instantly.
          </p>
          <label className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs cursor-pointer transition-colors shadow-md">
            Browse Files
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      )}

      {activeTab === 'camera' && (
        <div className="glass-card p-6 rounded-3xl space-y-4 text-center">
          <div className="relative max-w-md mx-auto aspect-video bg-black rounded-2xl overflow-hidden flex items-center justify-center">
            <video ref={videoRef} className="w-full h-full object-cover" />
            <canvas ref={canvasRef} className="hidden" />
            {!isCameraActive && (
              <p className="text-xs text-slate-400 absolute">Click Start Camera to begin live scanning.</p>
            )}
          </div>
          <div className="flex justify-center gap-3">
            {isCameraActive ? (
              <button
                onClick={stopCamera}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors"
              >
                Stop Camera
              </button>
            ) : (
              <button
                onClick={startCamera}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors"
              >
                Start Camera
              </button>
            )}
          </div>
        </div>
      )}

      {activeTab === 'paste' && (
        <div className="glass-card p-8 rounded-3xl text-center space-y-4">
          <Clipboard className="w-10 h-10 text-indigo-500 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Paste Image from Clipboard</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Copy an image to your clipboard and click the button below to parse QR code content.
          </p>
          <button
            onClick={handlePaste}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-md"
          >
            Read Clipboard Image
          </button>
        </div>
      )}

      {/* Scanned Result Banner */}
      {scannedResult && (
        <div className="glass-card p-6 rounded-3xl space-y-4 border-2 border-indigo-500/30">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Scanned QR Content</span>
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
              Decoded
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 font-mono text-sm break-all text-slate-900 dark:text-white">
            {scannedResult}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCopy(scannedResult)}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy Content'}
            </button>

            {isUrl(scannedResult) && (
              <a
                href={scannedResult}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <ExternalLink className="w-4 h-4" /> Open Link
              </a>
            )}
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="glass-card p-6 rounded-3xl space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Scanned QR History</h3>
            <button
              onClick={() => {
                setHistory([]);
                onShowToast('Scan history cleared.');
              }}
              className="text-xs text-rose-500 hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear History
            </button>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {history.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs font-mono text-slate-800 dark:text-slate-200"
              >
                <span className="truncate max-w-md">{item}</span>
                <button
                  onClick={() => handleCopy(item)}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors shrink-0"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
