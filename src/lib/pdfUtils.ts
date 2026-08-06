import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker source
if (typeof window !== 'undefined') {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  } catch {
    // ignore setup error
  }
}

export interface PdfMetaInfo {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
  creator?: string;
  producer?: string;
  creationDate?: Date;
  modificationDate?: Date;
  pageCount: number;
  pdfVersion?: string;
  fileSize: number;
  pageSizeStr?: string;
}

/**
 * Renders a 0-indexed PDF page to an HTML Canvas
 */
export async function renderPdfPageToCanvas(
  pdfData: ArrayBuffer,
  pageIndex: number, // 0-indexed
  scale = 0.5,
  canvasTarget?: HTMLCanvasElement
): Promise<HTMLCanvasElement> {
  const targetCanvas = canvasTarget || document.createElement('canvas');
  
  try {
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(pdfData.slice(0)) });
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(pageIndex + 1);

    const viewport = page.getViewport({ scale });
    targetCanvas.width = viewport.width;
    targetCanvas.height = viewport.height;

    const ctx = targetCanvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context unavailable');

    await page.render({
      canvasContext: ctx,
      viewport,
      canvas: targetCanvas
    }).promise;

    return targetCanvas;
  } catch (err) {
    console.warn(`[PDF Render Warning] Failed page ${pageIndex + 1} render:`, err);
    // Draw robust fallback thumbnail canvas
    targetCanvas.width = 160 * scale;
    targetCanvas.height = 220 * scale;
    const ctx = targetCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, targetCanvas.width, targetCanvas.height);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.strokeRect(4, 4, targetCanvas.width - 8, targetCanvas.height - 8);
      
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`Page ${pageIndex + 1}`, targetCanvas.width / 2, targetCanvas.height / 2);
    }
    return targetCanvas;
  }
}

/**
 * Converts a PDF page to data URL (PNG/JPEG/WebP)
 */
export async function renderPdfPageToDataUrl(
  pdfData: ArrayBuffer,
  pageIndex: number,
  scale = 1.5,
  mimeType: 'image/png' | 'image/jpeg' | 'image/webp' = 'image/png'
): Promise<string> {
  const canvas = await renderPdfPageToCanvas(pdfData, pageIndex, scale);
  return canvas.toDataURL(mimeType, 0.92);
}

/**
 * Format raw bytes into human readable size
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Extract PDF Header Version string
 */
export function extractPdfVersionFromBuffer(buffer: ArrayBuffer): string {
  try {
    const bytes = new Uint8Array(buffer.slice(0, 32));
    const headerStr = String.fromCharCode(...bytes);
    const match = headerStr.match(/%PDF-(\d+\.\d+)/);
    if (match) {
      return `v${match[1]}`;
    }
  } catch {
    // fallback
  }
  return 'v1.7';
}
