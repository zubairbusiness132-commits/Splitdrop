import React, { useState, useRef, useEffect } from 'react';
import jsQR from 'jsqr';
import { Camera, Upload, Copy, Search, ScanBarcode, Trash2, Check } from 'lucide-react';

interface BarcodeScannerToolProps {
  onShowToast: (message: string) => void;
}

export const BarcodeScannerTool: React.FC<BarcodeScannerToolProps> = ({ onShowToast }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'camera'>('upload');
  const [scannedResult, setScannedResult] = useState<{ value: string; format: string } | null>(null);
  const [history, setHistory] = useState<{ value: string; format: string }[]>(() => {
    try {
      const saved = localStorage.getItem('splitdrop-barcode-history');
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
    localStorage.setItem('splitdrop-barcode-history', JSON.stringify(history.slice(0, 20)));
  }, [history]);

  const addResult = (value: string, format: string) => {
    if (!value) return;
    const res = { value, format };
    setScannedResult(res);
    setHistory((prev) => [res, ...prev.filter((i) => i.value !== value)]);
    onShowToast(`Decoded ${format}: ${value}`);
  };

  // Decode barcode using native BarcodeDetector API if available, or fallbacks
  const decodeImageOrCanvas = async (canvas: HTMLCanvasElement): Promise<boolean> => {
    // 1. Try Native BarcodeDetector API (supported in Chrome/Android Edge/Opera)
    if ('BarcodeDetector' in window) {
      try {
        // @ts-ignore
        const detector = new window.BarcodeDetector({
          formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39', 'qr_code', 'pdf417']
        });
        const barcodes = await detector.detect(canvas);
        if (barcodes && barcodes.length > 0) {
          const b = barcodes[0];
          addResult(b.rawValue, b.format ? b.format.toUpperCase() : 'BARCODE');
          return true;
        }
      } catch {
        // fallback
      }
    }

    // 2. Try QR fallback with jsQR
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const qr = jsQR(imgData.data, imgData.width, imgData.height);
      if (qr && qr.data) {
        addResult(qr.data, 'QR_CODE');
        return true;
      }
    }

    return false;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    img.onload = async () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const success = await decodeImageOrCanvas(canvas);
        if (!success) {
          onShowToast('Could not detect barcode format in uploaded image. Ensure bright lighting.');
        }
      }
    };
    img.src = URL.createObjectURL(file);
  };

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
      onShowToast('Unable to access camera.');
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

  const scanCameraFrame = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const found = await decodeImageOrCanvas(canvas);
        if (found) {
          stopCamera();
          return;
        }
      }
    }
    animFrameRef.current = requestAnimationFrame(scanCameraFrame);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    onShowToast('Barcode copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>📊</span> Multi-Format Barcode Scanner
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Scan EAN, UPC, Code128, Code39, PDF417, and QR barcodes from camera or image files locally.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl gap-1 max-w-xs">
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
          <Upload className="w-3.5 h-3.5" /> Upload Image
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
          <Camera className="w-3.5 h-3.5" /> Live Camera
        </button>
      </div>

      {/* Supported formats pills */}
      <div className="flex flex-wrap gap-1.5 text-[10px] font-bold uppercase text-slate-500">
        {['EAN-13', 'EAN-8', 'UPC-A', 'UPC-E', 'Code128', 'Code39', 'QR Code', 'PDF417'].map((fmt) => (
          <span key={fmt} className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800">
            {fmt}
          </span>
        ))}
      </div>

      {activeTab === 'upload' && (
        <div className="glass-card p-8 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-center space-y-3">
          <ScanBarcode className="w-10 h-10 text-indigo-500 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Upload Barcode Image</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Upload product labels, shipping barcodes, or receipt codes to extract numerical data.
          </p>
          <label className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs cursor-pointer transition-colors shadow-md">
            Select Barcode Image
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
              <p className="text-xs text-slate-400 absolute">Click Start Camera to begin scanning.</p>
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

      {/* Result Display */}
      {scannedResult && (
        <div className="glass-card p-6 rounded-3xl space-y-4 border-2 border-indigo-500/30">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Scanned Result</span>
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-extrabold uppercase border border-indigo-500/20">
              {scannedResult.format}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 font-mono text-base font-bold tracking-wider text-slate-900 dark:text-white">
            {scannedResult.value}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCopy(scannedResult.value)}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy Barcode'}
            </button>

            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(scannedResult.value)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Search className="w-4 h-4" /> Search Product Web
            </a>
          </div>
        </div>
      )}

      {/* Scan History */}
      {history.length > 0 && (
        <div className="glass-card p-6 rounded-3xl space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Scanned Barcode History</h3>
            <button
              onClick={() => {
                setHistory([]);
                onShowToast('Barcode history cleared.');
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
                <div>
                  <span className="font-bold mr-2 text-indigo-500">[{item.format}]</span>
                  <span>{item.value}</span>
                </div>
                <button
                  onClick={() => handleCopy(item.value)}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors"
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
