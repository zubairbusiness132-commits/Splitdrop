import React, { useState, useEffect, useRef, useCallback } from 'react';
import QRCode from 'qrcode';
import { Download, Copy, Check, QrCode, Wifi, User, Link as LinkIcon } from 'lucide-react';

interface QrGeneratorToolProps {
  onShowToast: (msg: string) => void;
}

export const QrGeneratorTool: React.FC<QrGeneratorToolProps> = ({ onShowToast }) => {
  const [qrType, setQrType] = useState<'url' | 'wifi' | 'vcard'>('url');
  
  // URL / Text State
  const [textValue, setTextValue] = useState('https://splitdrop.com');

  // WiFi State
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPass, setWifiPass] = useState('');
  const [wifiEnc, setWifiEnc] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');

  // VCard State
  const [vFirstName, setVFirstName] = useState('');
  const [vLastName, setVLastName] = useState('');
  const [vPhone, setVPhone] = useState('');
  const [vEmail, setVEmail] = useState('');

  // Styles
  const [fgColor, setFgColor] = useState('#0f172a');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [qrSize, setQrSize] = useState<number>(300);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);

  const getConstructedText = useCallback(() => {
    if (qrType === 'url') return textValue || 'https://splitdrop.com';
    if (qrType === 'wifi') {
      return `WIFI:S:${wifiSsid};T:${wifiEnc};P:${wifiPass};;`;
    }
    if (qrType === 'vcard') {
      return `BEGIN:VCARD\nVERSION:3.0\nN:${vLastName};${vFirstName};;;\nFN:${vFirstName} ${vLastName}\nTEL:${vPhone}\nEMAIL:${vEmail}\nEND:VCARD`;
    }
    return 'https://splitdrop.com';
  }, [qrType, textValue, wifiSsid, wifiPass, wifiEnc, vFirstName, vLastName, vPhone, vEmail]);

  const generateQrCode = useCallback(async () => {
    if (!canvasRef.current) return;
    const content = getConstructedText();
    try {
      await QRCode.toCanvas(canvasRef.current, content, {
        width: qrSize,
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor
        }
      });
    } catch {
      // Failed to generate
    }
  }, [getConstructedText, qrSize, fgColor, bgColor]);

  useEffect(() => {
    generateQrCode();
  }, [generateQrCode]);

  const downloadPng = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qr-code.png';
    a.click();
    onShowToast('Downloaded QR Code PNG!');
  };

  const copyToClipboard = async () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob(async (blob) => {
      if (!blob) return;
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setCopied(true);
        onShowToast('Copied QR Code to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      } catch {
        downloadPng();
      }
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
      <div className="text-center max-w-xl mx-auto mb-8">
        <span className="text-4xl mb-2 inline-block">📱</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
          Free QR Code Generator
        </h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">
          Create customized high-resolution QR codes for websites, WiFi networks, and digital contact business cards.
        </p>
      </div>

      {/* QR Type Tabs */}
      <div className="grid grid-cols-3 p-1 mb-6 bg-gray-100 dark:bg-slate-800 rounded-2xl font-bold text-xs sm:text-sm">
        <button
          onClick={() => setQrType('url')}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all ${
            qrType === 'url'
              ? 'bg-emerald-500 text-white shadow-md'
              : 'text-gray-600 dark:text-slate-400 hover:text-gray-900'
          }`}
        >
          <LinkIcon className="w-4 h-4" /> URL / Text
        </button>
        <button
          onClick={() => setQrType('wifi')}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all ${
            qrType === 'wifi'
              ? 'bg-emerald-500 text-white shadow-md'
              : 'text-gray-600 dark:text-slate-400 hover:text-gray-900'
          }`}
        >
          <Wifi className="w-4 h-4" /> WiFi
        </button>
        <button
          onClick={() => setQrType('vcard')}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all ${
            qrType === 'vcard'
              ? 'bg-emerald-500 text-white shadow-md'
              : 'text-gray-600 dark:text-slate-400 hover:text-gray-900'
          }`}
        >
          <User className="w-4 h-4" /> Contact
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Inputs */}
        <div className="space-y-4">
          {qrType === 'url' && (
            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 dark:text-slate-400 mb-1">
                Website URL or Text
              </label>
              <textarea
                rows={3}
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                placeholder="https://example.com"
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold text-gray-900 dark:text-white"
              />
            </div>
          )}

          {qrType === 'wifi' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 dark:text-slate-400 mb-1">
                  Network SSID Name
                </label>
                <input
                  type="text"
                  value={wifiSsid}
                  onChange={(e) => setWifiSsid(e.target.value)}
                  placeholder="Home_WiFi_5G"
                  className="w-full p-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 dark:text-slate-400 mb-1">
                  Password
                </label>
                <input
                  type="text"
                  value={wifiPass}
                  onChange={(e) => setWifiPass(e.target.value)}
                  placeholder="Network password"
                  className="w-full p-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold text-gray-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {qrType === 'vcard' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 dark:text-slate-400 mb-1">First Name</label>
                <input
                  type="text"
                  value={vFirstName}
                  onChange={(e) => setVFirstName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 dark:text-slate-400 mb-1">Last Name</label>
                <input
                  type="text"
                  value={vLastName}
                  onChange={(e) => setVLastName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 dark:text-slate-400 mb-1">Phone</label>
                <input
                  type="text"
                  value={vPhone}
                  onChange={(e) => setVPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 dark:text-slate-400 mb-1">Email</label>
                <input
                  type="text"
                  value={vEmail}
                  onChange={(e) => setVEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold text-gray-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* Color Customization */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-800 space-y-3">
            <span className="block text-xs font-bold uppercase text-gray-700 dark:text-slate-300">
              Customize Colors
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-gray-500 mb-1">Foreground</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-9 h-9 rounded-lg border-0 cursor-pointer"
                  />
                  <span className="text-xs font-mono font-bold text-gray-700 dark:text-slate-300">{fgColor}</span>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-500 mb-1">Background</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-9 h-9 rounded-lg border-0 cursor-pointer"
                  />
                  <span className="text-xs font-mono font-bold text-gray-700 dark:text-slate-300">{bgColor}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Live Preview */}
        <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 text-center space-y-5">
          <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500 dark:text-slate-400">
            Live Preview
          </span>

          <div className="p-4 bg-white rounded-2xl shadow-md inline-block">
            <canvas ref={canvasRef} className="max-w-full h-auto rounded-lg" />
          </div>

          <div className="grid grid-cols-2 gap-3 w-full">
            <button
              onClick={downloadPng}
              className="py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> Download PNG
            </button>
            <button
              onClick={copyToClipboard}
              className="py-3 px-4 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
