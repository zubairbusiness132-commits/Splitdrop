import { ToolMeta, FAQItem } from '../types';
import { LanguageCode, getTranslation } from '../lib/i18n';

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
  },
  {
    id: 'resume-builder',
    title: 'Resume Builder',
    navTitle: 'Resume Builder',
    description: 'Create beautiful ATS-friendly resumes completely in your browser. No signup, no server, no uploads.',
    icon: '📄',
    path: '/resume-builder.html',
    filename: 'resume-builder.html',
    category: 'Career Tools',
    badge: 'New',
    features: ['ATS Friendly', '50+ Templates', 'PDF Export', 'Live Preview', '100% Offline Capable']
  }
];

export function getTranslatedTools(lang: LanguageCode): ToolMeta[] {
  return TOOLS_DATA.map(tool => {
    switch (tool.id) {
      case 'splitdrop':
        return {
          ...tool,
          title: getTranslation(lang, 'splitAndCombine', tool.title),
          navTitle: 'SplitDrop',
          description: getTranslation(lang, 'heroSubtitle', tool.description),
          category: getTranslation(lang, 'imageTools', tool.category)
        };
      case 'image-compressor':
        return {
          ...tool,
          title: getTranslation(lang, 'imageCompressorTitle', 'Image Compressor'),
          navTitle: getTranslation(lang, 'imageCompressorNav', 'Image Compressor'),
          description: getTranslation(lang, 'compressorSubtitle', tool.description),
          category: getTranslation(lang, 'imageTools', tool.category)
        };
      case 'image-converter':
        return {
          ...tool,
          title: getTranslation(lang, 'imageConverterTitle', 'Image Converter'),
          navTitle: getTranslation(lang, 'imageConverterNav', 'Image Converter'),
          description: getTranslation(lang, 'converterSubtitle', tool.description),
          category: getTranslation(lang, 'imageTools', tool.category)
        };
      case 'pdf-merge':
        return {
          ...tool,
          title: getTranslation(lang, 'pdfMergeTitle', tool.title),
          navTitle: getTranslation(lang, 'pdfMergeTitle', tool.navTitle),
          description: getTranslation(lang, 'pdfMergeSubtitle', tool.description),
          category: getTranslation(lang, 'pdfAndUtilities', tool.category)
        };
      case 'pdf-split':
        return {
          ...tool,
          title: getTranslation(lang, 'pdfSplitTitle', tool.title),
          navTitle: getTranslation(lang, 'pdfSplitTitle', tool.navTitle),
          description: getTranslation(lang, 'pdfSplitSubtitle', tool.description),
          category: getTranslation(lang, 'pdfAndUtilities', tool.category)
        };
      case 'qr-generator':
        return {
          ...tool,
          title: getTranslation(lang, 'qrTitle', tool.title),
          navTitle: getTranslation(lang, 'qrTitle', tool.navTitle),
          description: getTranslation(lang, 'qrSubtitle', tool.description),
          category: getTranslation(lang, 'pdfAndUtilities', tool.category)
        };
      case 'resume-builder':
        return {
          ...tool,
          title: getTranslation(lang, 'resumeBuilderTitle', tool.title),
          navTitle: getTranslation(lang, 'resumeBuilderTitle', tool.navTitle),
          description: getTranslation(lang, 'resumeSubtitle', tool.description),
          category: getTranslation(lang, 'pdfAndUtilities', tool.category)
        };
      default:
        return tool;
    }
  });
}

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

export function getTranslatedFaqs(lang: LanguageCode): FAQItem[] {
  return [
    {
      question: getTranslation(lang, 'faqsTitle', HOMEPAGE_FAQS[0].question),
      answer: getTranslation(lang, 'heroSubtitle', HOMEPAGE_FAQS[0].answer)
    },
    {
      question: getTranslation(lang, 'zeroServerUploads', HOMEPAGE_FAQS[1].question),
      answer: getTranslation(lang, 'zeroServerUploadsDesc', HOMEPAGE_FAQS[1].answer)
    },
    {
      question: getTranslation(lang, 'freeForever', HOMEPAGE_FAQS[2].question),
      answer: getTranslation(lang, 'freeForeverDesc', HOMEPAGE_FAQS[2].answer)
    },
    {
      question: getTranslation(lang, 'fastBrowserBased', HOMEPAGE_FAQS[3].question),
      answer: getTranslation(lang, 'instantSpeedDesc', HOMEPAGE_FAQS[3].answer)
    },
    {
      question: getTranslation(lang, 'supportsFormats', HOMEPAGE_FAQS[4].question),
      answer: getTranslation(lang, 'supportsFormats', HOMEPAGE_FAQS[4].answer)
    }
  ];
}
