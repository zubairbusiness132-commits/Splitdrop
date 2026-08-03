import { ToolMeta, FAQItem } from '../types';

export const TOOLS_DATA: ToolMeta[] = [
  {
    id: 'splitdrop',
    title: 'SplitDrop — Image Splitter & Merger',
    navTitle: 'SplitDrop',
    description: 'Free online image splitter and merger. Split images cleanly along any line or combine two photos seamlessly with instant browser processing & zero uploads.',
    icon: '✂️',
    path: '/',
    filename: 'index.html',
    category: 'Image Tools',
    badge: 'Hero Tool',
    features: ['Vertical & Horizontal Split', 'Dual Image Combine', 'Auto-trim Padding', 'Drag-to-Adjust Seam', '100% Client-side']
  },
  {
    id: 'image-compressor',
    title: 'Image Compressor',
    navTitle: 'Image Compressor',
    description: 'Compress PNG, JPG, and WebP images up to 90% without loss of quality. Free batch image compressor with live preview & instant ZIP download in your browser.',
    icon: '🗜️',
    path: '/image-compressor.html',
    filename: 'image-compressor.html',
    category: 'Image Tools',
    badge: 'Free',
    features: ['PNG, JPG, WebP', 'Batch Compression', 'Before/After Comparison', 'Custom Quality %', 'ZIP Download']
  },
  {
    id: 'image-converter',
    title: 'Image Converter',
    navTitle: 'Image Converter',
    description: 'Convert PNG, JPG, WebP, GIF, and BMP image formats instantly in high resolution. Free bulk online image converter with 100% private browser processing.',
    icon: '🔄',
    path: '/image-converter.html',
    filename: 'image-converter.html',
    category: 'Image Tools',
    badge: 'Free',
    features: ['Multi-format Support', 'Bulk Conversion', 'High Fidelity Output', 'Zero Server Uploads', 'One-Click Download']
  },
  {
    id: 'pdf-merge',
    title: 'PDF Merge',
    navTitle: 'PDF Merge',
    description: 'Merge PDF files online for free. Combine multiple PDFs into one document with drag-and-drop page reordering, instant preview, and zero server uploads.',
    icon: '🧩',
    path: '/pdf-merge.html',
    filename: 'pdf-merge.html',
    category: 'PDF Tools',
    badge: 'Free',
    features: ['Combine Unlimited PDFs', 'Drag-and-Drop Reorder', 'Fast Local Processing', 'Secure & Private', 'No File Size Limit']
  },
  {
    id: 'pdf-split',
    title: 'PDF Split',
    navTitle: 'PDF Split',
    description: 'Split PDF files into individual pages or extract custom page ranges online for free. Fast, secure PDF splitter with page thumbnail previews & ZIP download.',
    icon: '✂️',
    path: '/pdf-split.html',
    filename: 'pdf-split.html',
    category: 'PDF Tools',
    badge: 'Free',
    features: ['Extract Custom Ranges', 'Split All Pages', 'Page Thumbnail Preview', 'ZIP Download Support', '100% Offline Capable']
  },
  {
    id: 'qr-generator',
    title: 'QR Code Generator',
    navTitle: 'QR Generator',
    description: 'Generate custom QR codes for URLs, WiFi networks, text, and vCards for free. High-resolution vector PNG/SVG QR code generator with brand color options.',
    icon: '📱',
    path: '/qr-generator.html',
    filename: 'qr-generator.html',
    category: 'Generators',
    badge: 'Free',
    features: ['URL & WiFi Templates', 'Custom Brand Colors', 'PNG & SVG Formats', 'Instant Clipboard Copy', 'Vector Crisp Quality']
  }
];

export const HOMEPAGE_FAQS: FAQItem[] = [
  {
    question: "What is SplitDrop and how does image splitting work?",
    answer: "SplitDrop is a powerful browser-based image utility that lets you split an image cleanly along a vertical or horizontal line or combine two images into a seamless composite. You can drag the cut line in real time to adjust the proportions."
  },
  {
    question: "Are my files uploaded to any server?",
    answer: "No! All processing happens 100% inside your browser using HTML5 Canvas and WebAssembly technologies. Your files never leave your device, ensuring maximum speed and privacy."
  },
  {
    question: "Is SplitDrop and all free tools completely free to use?",
    answer: "Yes, SplitDrop and all tools (Image Compressor, Image Converter, PDF Merge, PDF Split, and QR Generator) are 100% free with no watermarks or hidden fees."
  },
  {
    question: "Can I use these tools on mobile devices?",
    answer: "Absolutely! All tools feature responsive touch-optimized controls designed to work seamlessly on iPhones, Android smartphones, iPads, and desktop computers."
  },
  {
    question: "What image formats are supported?",
    answer: "SplitDrop supports all major Web image formats including PNG, JPG, JPEG, WebP, GIF, and BMP."
  }
];
