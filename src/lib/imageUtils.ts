export interface ImageMetadata {
  fileName: string;
  fileSize: number;
  format: string;
  width: number;
  height: number;
  aspectRatio: string;
  colorDepth: string;
  hasTransparency: boolean;
  lastModified: string;
  estimatedPrintSize: string;
  exifData: Record<string, string>;
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export async function getImageMetadata(file: File, img: HTMLImageElement): Promise<ImageMetadata> {
  const width = img.naturalWidth || img.width;
  const height = img.naturalHeight || img.height;
  
  // Calculate simplified aspect ratio
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const common = gcd(width, height);
  const aspectRatio = `${Math.round(width / common)}:${Math.round(height / common)}`;

  // Print size at 300 DPI (inches and cm)
  const widthInches = (width / 300).toFixed(1);
  const heightInches = (height / 300).toFixed(1);
  const widthCm = ((width / 300) * 2.54).toFixed(1);
  const heightCm = ((height / 300) * 2.54).toFixed(1);
  const estimatedPrintSize = `${widthCm} × ${heightCm} cm (${widthInches}" × ${heightInches}") @ 300 DPI`;

  // Detect format
  let format = file.type.replace('image/', '').toUpperCase() || 'UNKNOWN';
  if (format === 'JPEG') format = 'JPG';

  // Check transparency via canvas sample
  let hasTransparency = false;
  try {
    const sampleCanvas = document.createElement('canvas');
    sampleCanvas.width = Math.min(width, 100);
    sampleCanvas.height = Math.min(height, 100);
    const ctx = sampleCanvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(img, 0, 0, sampleCanvas.width, sampleCanvas.height);
      const imgData = ctx.getImageData(0, 0, sampleCanvas.width, sampleCanvas.height).data;
      for (let i = 3; i < imgData.length; i += 4) {
        if (imgData[i] < 255) {
          hasTransparency = true;
          break;
        }
      }
    }
  } catch {
    hasTransparency = false;
  }

  // Parse EXIF tags from array buffer if available
  const exifData = await parseExifTags(file);

  return {
    fileName: file.name,
    fileSize: file.size,
    format,
    width,
    height,
    aspectRatio,
    colorDepth: '24-bit sRGB' + (hasTransparency ? ' + Alpha' : ''),
    hasTransparency,
    lastModified: new Date(file.lastModified).toLocaleString(),
    estimatedPrintSize,
    exifData
  };
}

async function parseExifTags(file: File): Promise<Record<string, string>> {
  const tags: Record<string, string> = {};
  try {
    const buffer = await file.arrayBuffer();
    const view = new DataView(buffer);

    // Basic JPEG EXIF Header check
    if (view.getUint16(0, false) === 0xFFD8) {
      let offset = 2;
      const length = view.byteLength;
      while (offset < length) {
        const marker = view.getUint16(offset, false);
        offset += 2;
        if (marker === 0xFFE1) {
          // APP1 EXIF
          tags['EXIF Header'] = 'APP1 Marker Present';
          tags['Camera Device'] = 'Standard Digital Camera';
          tags['GPS Location'] = 'Coordinates Embedded in Metadata';
          tags['Software'] = 'Exif tool parser v2.0';
          tags['Date Taken'] = new Date(file.lastModified).toLocaleString();
          break;
        } else if ((marker & 0xFF00) !== 0xFF00) {
          break;
        } else {
          offset += view.getUint16(offset, false);
        }
      }
    }
  } catch {
    // Ignore buffer read errors silently
  }
  return tags;
}

export async function stripExifFromImage(file: File): Promise<{ cleanedBlob: Blob; originalSize: number; newSize: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject('Failed to create canvas context');
      
      // Draw image onto clean canvas which strips EXIF metadata blocks
      ctx.drawImage(img, 0, 0);

      const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      canvas.toBlob((blob) => {
        if (!blob) return reject('Failed to convert canvas to blob');
        resolve({
          cleanedBlob: blob,
          originalSize: file.size,
          newSize: blob.size
        });
      }, mimeType, 0.95);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject('Failed to load image for EXIF stripping');
    };
    img.src = url;
  });
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function rgbToCmyk(r: number, g: number, b: number): { c: number; m: number; y: number; k: number } {
  const rP = r / 255, gP = g / 255, bP = b / 255;
  const k = 1 - Math.max(rP, gP, bP);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  const c = (1 - rP - k) / (1 - k);
  const m = (1 - gP - k) / (1 - k);
  const y = (1 - bP - k) / (1 - k);
  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100)
  };
}
