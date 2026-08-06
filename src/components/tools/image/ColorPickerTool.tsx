import React, { useState, useRef } from 'react';
import { Pipette, Copy, Check, RefreshCw } from 'lucide-react';
import { ImageUploadArea } from './ImageUploadArea';
import { ImageFileInfoPanel } from './ImageFileInfoPanel';
import { getImageMetadata, rgbToHex, rgbToHsl, rgbToCmyk, ImageMetadata } from '../../../lib/imageUtils';
import { SEOHead } from '../../SEOHead';
import { Breadcrumb } from '../../Breadcrumb';
import { BackButton } from '../../BackButton';
import { getLinkUrl } from '../../../lib/paths';

interface ColorPickerToolProps {
  onShowToast: (msg: string) => void;
  onNavigate?: (path: string) => void;
}

interface ColorSample {
  hex: string;
  rgb: string;
  hsl: string;
  hsv: string;
  cmyk: string;
}

export const ColorPickerTool: React.FC<ColorPickerToolProps> = ({ onShowToast, onNavigate }) => {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);

  const [currentColor, setCurrentColor] = useState<ColorSample>({
    hex: '#4F46E5',
    rgb: 'rgb(79, 70, 229)',
    hsl: 'hsl(243, 75%, 59%)',
    hsv: 'hsv(243, 69%, 90%)',
    cmyk: 'cmyk(66%, 69%, 0%, 10%)'
  });

  const [recentColors, setRecentColors] = useState<ColorSample[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const imageRef = useRef<HTMLImageElement>(null);

  const handleImageSelected = async (files: File[]) => {
    if (!files.length) return;
    const selectedFile = files[0];
    setFile(selectedFile);

    const img = new Image();
    const url = URL.createObjectURL(selectedFile);
    img.onload = async () => {
      setImageObj(img);
      const meta = await getImageMetadata(selectedFile, img);
      setMetadata(meta);
    };
    img.src = url;
  };

  const samplePixelColor = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!imageRef.current) return;
    const img = imageRef.current;
    const rect = img.getBoundingClientRect();

    const scaleX = (img.naturalWidth || img.width) / rect.width;
    const scaleY = (img.naturalHeight || img.height) / rect.height;

    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(img, 0, 0);
    const p = ctx.getImageData(x, y, 1, 1).data;
    const r = p[0], g = p[1], b = p[2];

    const hex = rgbToHex(r, g, b);
    const hslObj = rgbToHsl(r, g, b);
    const cmykObj = rgbToCmyk(r, g, b);

    // Approximate HSV
    const max = Math.max(r, g, b) / 255;
    const min = Math.min(r, g, b) / 255;
    const v = Math.round(max * 100);
    const s = max === 0 ? 0 : Math.round(((max - min) / max) * 100);

    const sample: ColorSample = {
      hex,
      rgb: `rgb(${r}, ${g}, ${b})`,
      hsl: `hsl(${hslObj.h}, ${hslObj.s}%, ${hslObj.l}%)`,
      hsv: `hsv(${hslObj.h}, ${s}%, ${v}%)`,
      cmyk: `cmyk(${cmykObj.c}%, ${cmykObj.m}%, ${cmykObj.y}%, ${cmykObj.k}%)`
    };

    setCurrentColor(sample);
    setRecentColors((prev) => [sample, ...prev.filter((c) => c.hex !== sample.hex).slice(0, 11)]);
  };

  const handleEyeDropper = async () => {
    if ('EyeDropper' in window) {
      try {
        const eyeDropper = new (window as any).EyeDropper();
        const result = await eyeDropper.open();
        if (result.sRGBHex) {
          const hex = result.sRGBHex.toUpperCase();
          const r = parseInt(hex.slice(1, 3), 16);
          const g = parseInt(hex.slice(3, 5), 16);
          const b = parseInt(hex.slice(5, 7), 16);

          const hslObj = rgbToHsl(r, g, b);
          const cmykObj = rgbToCmyk(r, g, b);

          const sample: ColorSample = {
            hex,
            rgb: `rgb(${r}, ${g}, ${b})`,
            hsl: `hsl(${hslObj.h}, ${hslObj.s}%, ${hslObj.l}%)`,
            hsv: `hsv(${hslObj.h}, 70%, 90%)`,
            cmyk: `cmyk(${cmykObj.c}%, ${cmykObj.m}%, ${cmykObj.y}%, ${cmykObj.k}%)`
          };
          setCurrentColor(sample);
          setRecentColors((prev) => [sample, ...prev.filter((c) => c.hex !== sample.hex).slice(0, 11)]);
        }
      } catch {
        // EyeDropper cancelled or unsupported
      }
    } else {
      alert('Click anywhere directly on the image to pick a pixel color!');
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    onShowToast(`Copied ${key}: ${text}`);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <div className="space-y-6">
      <SEOHead
        title="Image Color Picker — Pick HEX, RGB, HSL, CMYK Online — SplitDrop"
        description="Free online image color picker. Click any pixel on image to get HEX, RGB, HSL, HSV, CMYK color codes with instant copy & recent color palette."
        canonicalPath="/color-picker.html"
      />

      <div className="flex items-center justify-between gap-4">
        <BackButton onNavigate={onNavigate} />
        <Breadcrumb
          items={[
            { label: 'Home', path: getLinkUrl('/') },
            { label: 'Image Tools' },
            { label: 'Color Picker' }
          ]}
          onNavigate={onNavigate}
        />
      </div>

      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          🎨 Image Color Picker
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Click anywhere on an image to inspect exact HEX, RGB, HSL, HSV & CMYK color values.
        </p>
      </div>

      {!file ? (
        <ImageUploadArea onImageSelected={handleImageSelected} />
      ) : (
        <div className="space-y-6">
          {metadata && (
            <ImageFileInfoPanel
              fileName={metadata.fileName}
              originalSize={metadata.fileSize}
              format={metadata.format}
              width={metadata.width}
              height={metadata.height}
              hasTransparency={metadata.hasTransparency}
            />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Image Canvas View */}
            <div className="lg:col-span-2 p-6 rounded-3xl glass-panel space-y-4 text-center">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Click image to sample pixel color</span>
                {'EyeDropper' in window && (
                  <button
                    type="button"
                    onClick={handleEyeDropper}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/20"
                  >
                    <Pipette className="w-3.5 h-3.5" /> EyeDropper Tool
                  </button>
                )}
              </div>

              <div className="max-h-96 overflow-auto rounded-2xl bg-slate-950 p-2 flex items-center justify-center border border-slate-800 cursor-crosshair">
                <img
                  ref={imageRef}
                  src={imageObj?.src}
                  alt="Sample"
                  onClick={samplePixelColor}
                  className="max-h-80 object-contain rounded-xl"
                />
              </div>
            </div>

            {/* Color Values & Recent Palette */}
            <div className="space-y-6">
              {/* Active Color Card */}
              <div className="p-6 rounded-3xl glass-card space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl border-2 border-white/80 dark:border-slate-700 shadow-lg"
                    style={{ backgroundColor: currentColor.hex }}
                  />
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">Selected Color</span>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">{currentColor.hex}</h3>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-200/50 dark:border-slate-800/50 text-xs">
                  {[
                    { label: 'HEX', val: currentColor.hex },
                    { label: 'RGB', val: currentColor.rgb },
                    { label: 'HSL', val: currentColor.hsl },
                    { label: 'HSV', val: currentColor.hsv },
                    { label: 'CMYK', val: currentColor.cmyk }
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-2 rounded-xl bg-slate-100/60 dark:bg-slate-900/60">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase mr-2">{item.label}:</span>
                        <span className="font-extrabold text-slate-800 dark:text-slate-200">{item.val}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(item.val, item.label)}
                        className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
                      >
                        {copiedKey === item.label ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Colors Grid */}
              {recentColors.length > 0 && (
                <div className="p-5 rounded-3xl glass-card space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Recent Colors</h4>
                  <div className="grid grid-cols-6 gap-2">
                    {recentColors.map((c, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setCurrentColor(c)}
                        className="w-full h-8 rounded-xl border border-white/60 dark:border-slate-700 shadow-xs hover:scale-110 transition-transform cursor-pointer"
                        style={{ backgroundColor: c.hex }}
                        title={c.hex}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
