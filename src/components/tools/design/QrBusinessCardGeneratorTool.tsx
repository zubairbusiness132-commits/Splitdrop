import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Download, QrCode } from 'lucide-react';

interface QrBusinessCardGeneratorToolProps {
  onShowToast: (message: string) => void;
}

export const QrBusinessCardGeneratorTool: React.FC<QrBusinessCardGeneratorToolProps> = ({ onShowToast }) => {
  const [fullName, setFullName] = useState<string>('Alex Morgan');
  const [phone, setPhone] = useState<string>('+1 (555) 234-5678');
  const [email, setEmail] = useState<string>('alex@example.com');
  const [website, setWebsite] = useState<string>('https://example.com');
  const [company, setCompany] = useState<string>('Tech Corp');
  const [title, setTitle] = useState<string>('Lead Designer');
  const [address, setAddress] = useState<string>('San Francisco, CA');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const getVCardString = () => {
    return `BEGIN:VCARD
VERSION:3.0
N:${fullName.split(' ').reverse().join(';')};;;
FN:${fullName}
ORG:${company}
TITLE:${title}
TEL;TYPE=CELL:${phone}
EMAIL:${email}
URL:${website}
ADR:;;${address};;;;
END:VCARD`;
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    const vcard = getVCardString();
    QRCode.toCanvas(canvasRef.current, vcard, {
      width: 260,
      margin: 2,
      color: {
        dark: '#1e293b',
        light: '#ffffff'
      }
    }, (err) => {
      if (err) console.error(err);
    });
  }, [fullName, phone, email, website, company, title, address]);

  const downloadQrCode = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `${fullName.toLowerCase().replace(/\s+/g, '-')}-vcard-qr.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
    onShowToast('QR Business Card downloaded!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>📇</span> QR Business Card Generator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Create a contact vCard QR code that instantly imports contact details on mobile phones.
          </p>
        </div>

        <button
          onClick={downloadQrCode}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-md"
        >
          <Download className="w-4 h-4" /> Download QR Code (PNG)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
            Contact Details (vCard)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Name</label>
              <input
                type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Job Title</label>
              <input
                type="text" value={title} onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Company</label>
              <input
                type="text" value={company} onChange={e => setCompany(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Phone Number</label>
              <input
                type="text" value={phone} onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Website URL</label>
              <input
                type="text" value={website} onChange={e => setWebsite(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-1 pt-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Address / Location</label>
            <input
              type="text" value={address} onChange={e => setAddress(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Live Card & QR Preview */}
        <div className="flex flex-col items-center justify-center glass-card p-6 rounded-3xl space-y-6">
          <div className="p-4 bg-white rounded-2xl shadow-xl border border-slate-200">
            <canvas ref={canvasRef} className="rounded-xl" />
          </div>

          <div className="text-center space-y-1">
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">{fullName}</h4>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{title} {company ? `at ${company}` : ''}</p>
            <p className="text-[11px] text-slate-500">{phone} • {email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
