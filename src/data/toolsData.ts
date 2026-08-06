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
    category: '🖼️ Image Tools',
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
    category: '🖼️ Image Tools',
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
    category: '🖼️ Image Tools',
    badge: 'Free',
    features: ['Multi-format Support', 'Bulk Conversion', 'High Fidelity Output', 'Zero Server Uploads', 'One-Click Download']
  },
  {
    id: 'image-resizer',
    title: 'Image Resizer',
    navTitle: 'Image Resizer',
    description: 'Resize JPG, PNG, WebP, AVIF, and GIF images by exact dimensions, width, height, or percentage with locked aspect ratio.',
    icon: '📐',
    path: '/image-resizer.html',
    filename: 'image-resizer.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: ['Pixels & Percentage', 'Lock Aspect Ratio', 'JPG, PNG, WebP, AVIF', '100% Local Browser', 'Instant Export']
  },
  {
    id: 'crop-image',
    title: 'Crop Image',
    navTitle: 'Crop Image',
    description: 'Crop images freeform or with social media presets for Instagram, YouTube thumbnails, Facebook cover, A4, 16:9, and 1:1 ratios.',
    icon: '✂️',
    path: '/crop-image.html',
    filename: 'crop-image.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: ['Social Media Presets', 'Free Crop & Zoom', 'Rotate & Preview', 'High Resolution Output', 'Zero Uploads']
  },
  {
    id: 'rotate-image',
    title: 'Rotate Image',
    navTitle: 'Rotate Image',
    description: 'Rotate single or batch images by 90°, 180°, 270°, or any custom angle slider with bulk download support.',
    icon: '🔄',
    path: '/rotate-image.html',
    filename: 'rotate-image.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: ['90°, 180°, Custom Angle', 'Batch Support', 'Live Grid Preview', 'Fast Local Processing', 'Bulk Download']
  },
  {
    id: 'flip-image',
    title: 'Flip Image',
    navTitle: 'Flip Image',
    description: 'Flip photos horizontally or vertically to create mirror reflections instantly in your browser.',
    icon: '⇄',
    path: '/flip-image.html',
    filename: 'flip-image.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: ['Horizontal Flip', 'Vertical Flip', 'Full Mirror Effect', 'Live Preview', 'One-Click Download']
  },
  {
    id: 'image-watermark',
    title: 'Watermark Image',
    navTitle: 'Watermark Image',
    description: 'Add custom text or logo image watermarks to protect your photos with opacity, rotation, shadow, and tile repeat patterns.',
    icon: '💧',
    path: '/image-watermark.html',
    filename: 'image-watermark.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: ['Text & Image Logo', 'Tile Repeat Pattern', 'Custom Fonts & Colors', 'Opacity & Shadow', '100% Local']
  },
  {
    id: 'blur-image',
    title: 'Blur Image',
    navTitle: 'Blur Image',
    description: 'Blur sensitive information, faces, or full backgrounds with interactive brush painting, strength slider, and undo/redo stack.',
    icon: '🌫️',
    path: '/blur-image.html',
    filename: 'blur-image.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: ['Interactive Brush Blur', 'Background Blur', 'Strength Slider', 'Undo & Redo Stack', 'Instant Download']
  },
  {
    id: 'pixelate-image',
    title: 'Pixelate Image',
    navTitle: 'Pixelate Image',
    description: 'Censor photos or create retro pixel art effects with custom pixel block sizes, paint brush tool, and undo history.',
    icon: '👾',
    path: '/pixelate-image.html',
    filename: 'pixelate-image.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: ['Brush Censor Tool', 'Entire Image Pixelate', 'Pixel Size Slider', 'Undo & Redo', 'Instant Export']
  },
  {
    id: 'exif-remover',
    title: 'EXIF Remover',
    navTitle: 'EXIF Remover',
    description: 'Strip GPS location data, camera model, author info, and device metadata from photos for total privacy.',
    icon: '🛡️',
    path: '/exif-remover.html',
    filename: 'exif-remover.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: ['Strip GPS Location', 'Camera & Serial Info', 'Batch Support', 'Preserves Quality', '100% Private']
  },
  {
    id: 'image-color-picker',
    title: 'Color Picker',
    navTitle: 'Color Picker',
    description: 'Pick colors directly from any image to inspect HEX, RGB, HSL, HSV, and CMYK color codes with copy buttons & recent color palette.',
    icon: '🎨',
    path: '/color-picker.html',
    filename: 'color-picker.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: ['HEX, RGB, HSL, CMYK', 'EyeDropper Tool', 'Recent Color Palette', 'One-Click Copy', 'High Precision']
  },
  {
    id: 'image-info-viewer',
    title: 'Image Information Viewer',
    navTitle: 'Image Information',
    description: 'Inspect full technical specifications, EXIF tags, dimensions, color depth, transparency, print size, and generate full reports.',
    icon: '🔍',
    path: '/image-info-viewer.html',
    filename: 'image-info-viewer.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: ['Full Technical Specs', 'EXIF Metadata Tags', 'Print Size @ 300 DPI', 'Copy Report', '100% Client-Side']
  },
  {
    id: 'background-color-changer',
    title: 'Background Color Changer',
    navTitle: 'Background Color Changer',
    description: 'Replace transparent or solid image backgrounds with solid HEX/RGB colors, smooth gradients, or ambient blur.',
    icon: '🎨',
    path: '/background-color-changer.html',
    filename: 'background-color-changer.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: ['Transparent/Solid Keying', 'Solid HEX & RGB', 'Linear Gradient', 'Blurred BG', '100% Client-Side']
  },
  {
    id: 'rounded-corners',
    title: 'Rounded Corner Generator',
    navTitle: 'Rounded Corners',
    description: 'Round photo corners, create circular avatars, or adjust individual corner radii with live preview.',
    icon: '⭕',
    path: '/rounded-corners.html',
    filename: 'rounded-corners.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: ['Individual Corner Radius', 'Circle Avatar Mode', 'Transparent / Solid BG', 'Live Canvas Preview', 'Instant Download']
  },
  {
    id: 'image-border',
    title: 'Image Border Generator',
    navTitle: 'Image Border',
    description: 'Add solid, dashed, dotted, double, or rounded borders to photos with instant color & width controls.',
    icon: '🖼️',
    path: '/image-border.html',
    filename: 'image-border.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: ['Solid, Dashed, Dotted', 'Double & Rounded', 'Custom Border Width', 'HEX/RGB Color Picker', 'PNG/JPG/WebP']
  },
  {
    id: 'image-frame',
    title: 'Image Frame Generator',
    navTitle: 'Image Frame',
    description: 'Transform photos into Polaroid, Shadow, Frosted Glass, Instagram, or Art Gallery framed masterpieces.',
    icon: '📸',
    path: '/image-frame.html',
    filename: 'image-frame.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: ['Polaroid & Caption', 'Soft Drop Shadow', 'Frosted Glass Frame', 'Instagram Post Style', 'White & Black Gallery']
  },
  {
    id: 'image-collage',
    title: 'Image Collage Maker',
    navTitle: 'Collage Maker',
    description: 'Combine multiple photos into beautiful grid, masonry, vertical or horizontal layouts with custom spacing & corner rounding.',
    icon: '🧩',
    path: '/image-collage.html',
    filename: 'image-collage.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: ['2, 3, 4, 6, 9+ Photos', 'Grid & Masonry', 'Spacing & Radius Sliders', 'Background Color', 'PNG/JPG Export']
  },
  {
    id: 'favicon-generator',
    title: 'Favicon Generator',
    navTitle: 'Favicon Generator',
    description: 'Generate complete set of multi-size favicons (16px - 512px), favicon.ico, site.webmanifest, and HTML head code in a ZIP bundle.',
    icon: '⭐',
    path: '/favicon-generator.html',
    filename: 'favicon-generator.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: ['16x16 to 512x512', 'favicon.ico Included', 'site.webmanifest PWA', 'HTML Head Snippet', 'Download ZIP']
  },
  {
    id: 'svg-optimizer',
    title: 'SVG Optimizer',
    navTitle: 'SVG Optimizer',
    description: 'Clean SVG vector code, strip Inkscape/Illustrator metadata, comments, and empty groups to minimize file size.',
    icon: '⚡',
    path: '/svg-optimizer.html',
    filename: 'svg-optimizer.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: ['Remove Metadata & Comments', 'Remove Empty Groups', 'Round Path Decimals', 'Before/After Comparison', 'Instant Download']
  },
  {
    id: 'gif-maker',
    title: 'GIF Maker',
    navTitle: 'GIF Maker',
    description: 'Combine photo frames into animated GIFs with custom frame speed, sizing, loop, and bounce order controls.',
    icon: '🎬',
    path: '/gif-maker.html',
    filename: 'gif-maker.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: ['Multiple Frame Import', 'Custom Speed / Delay', 'Forward / Bounce Order', 'Interactive Player', 'Client-Side GIF']
  },
  {
    id: 'batch-image-converter',
    title: 'Batch Image Converter',
    navTitle: 'Batch Converter',
    description: 'Convert dozens of photos simultaneously into PNG, JPG, WebP, BMP, or AVIF with one-click bulk ZIP export.',
    icon: '⚡',
    path: '/batch-image-converter.html',
    filename: 'batch-image-converter.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: ['Bulk Multi-File Conversion', 'PNG, JPG, WebP, BMP, AVIF', 'Individual & ZIP Download', 'Quality Slider', 'Fast Local']
  },
  {
    id: 'compression-comparison',
    title: 'Compression Comparison',
    navTitle: 'Compression Comparison',
    description: 'Interactive split-screen slider comparison of original vs compressed photo pixels with 2x/4x magnification inspection.',
    icon: '🔍',
    path: '/compression-comparison.html',
    filename: 'compression-comparison.html',
    category: '🖼️ Image Tools',
    badge: 'New',
    features: ['Interactive Split Slider', 'Magnifier Lens', 'Bytes Saved & % Metrics', 'Visual Quality Rating', 'Instant Export']
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
    id: 'image-to-pdf',
    title: 'Image to PDF',
    navTitle: 'Image to PDF',
    description: 'Convert JPG, PNG, WebP, BMP, and GIF images to a clean PDF document. Drag and drop multiple images with paper size, margin, and layout options.',
    icon: '🖼️',
    path: '/image-to-pdf.html',
    filename: 'image-to-pdf.html',
    category: 'PDF Tools',
    badge: 'New',
    features: ['JPG, PNG, WebP, BMP, GIF', 'A4 & Letter Layouts', 'Custom Margins & Fit', 'Drag Reorder', '100% Local']
  },
  {
    id: 'pdf-to-images',
    title: 'PDF to Images',
    navTitle: 'PDF to Images',
    description: 'Extract every PDF page as high-resolution PNG, JPG, or WebP images instantly in your browser. Download pages individually or as a single ZIP package.',
    icon: '📷',
    path: '/pdf-to-images.html',
    filename: 'pdf-to-images.html',
    category: 'PDF Tools',
    badge: 'New',
    features: ['PNG, JPG & WebP Output', 'ZIP Batch Download', 'Page Thumbnail Preview', 'High Resolution', 'No Server Uploads']
  },
  {
    id: 'rotate-pdf',
    title: 'Rotate PDF',
    navTitle: 'Rotate PDF',
    description: 'Rotate PDF pages by 90°, 180°, or 270° clockwise. Apply rotation to all pages or specific selected pages with live visual preview.',
    icon: '🔄',
    path: '/rotate-pdf.html',
    filename: 'rotate-pdf.html',
    category: 'PDF Tools',
    badge: 'New',
    features: ['90°, 180°, 270° Rotation', 'All or Selected Pages', 'Live Visual Thumbnails', 'Fast Local Processing', 'Zero Server Uploads']
  },
  {
    id: 'delete-pdf-pages',
    title: 'Delete PDF Pages',
    navTitle: 'Delete Pages',
    description: 'Visually select and remove unwanted pages from your PDF document. Instant thumbnail grid preview and export of updated PDF file.',
    icon: '🗑️',
    path: '/delete-pdf-pages.html',
    filename: 'delete-pdf-pages.html',
    category: 'PDF Tools',
    badge: 'New',
    features: ['Visual Page Thumbnails', 'One-Click Page Removal', 'Instant Local Export', 'Private & Secure', 'No Upload Bottleneck']
  },
  {
    id: 'extract-pdf-pages',
    title: 'Extract PDF Pages',
    navTitle: 'Extract Pages',
    description: 'Select specific pages or enter custom page range strings to extract and create a brand new PDF document.',
    icon: '📦',
    path: '/extract-pdf-pages.html',
    filename: 'extract-pdf-pages.html',
    category: 'PDF Tools',
    badge: 'New',
    features: ['Custom Page Ranges', 'Visual Selection Grid', 'Instant PDF Generation', '100% Client-Side', 'Zero Data Limits']
  },
  {
    id: 'reorder-pdf-pages',
    title: 'Reorder PDF Pages',
    navTitle: 'Reorder Pages',
    description: 'Rearrange and change page sequence in your PDF document using drag and drop or simple arrow controls.',
    icon: '🔀',
    path: '/reorder-pdf-pages.html',
    filename: 'reorder-pdf-pages.html',
    category: 'PDF Tools',
    badge: 'New',
    features: ['Drag & Drop Reordering', 'Visual Page Grid', 'Instant Local Re-assembly', 'Preserves Quality', 'No Signup Needed']
  },
  {
    id: 'pdf-watermark',
    title: 'Add Watermark',
    navTitle: 'Add Watermark',
    description: 'Add custom text or image logo watermarks to your PDF pages with control over opacity, rotation, font size, position, and color.',
    icon: '💧',
    path: '/pdf-watermark.html',
    filename: 'pdf-watermark.html',
    category: 'PDF Tools',
    badge: 'New',
    features: ['Text & Image Logo Support', 'Custom Opacity & Angle', 'Flexible Positions', 'Live Color Picker', 'Batch Applied']
  },
  {
    id: 'protect-pdf',
    title: 'Protect PDF',
    navTitle: 'Protect PDF',
    description: 'Encrypt and password protect your confidential PDF documents in your browser with AES encryption support.',
    icon: '🔒',
    path: '/protect-pdf.html',
    filename: 'protect-pdf.html',
    category: 'PDF Tools',
    badge: 'New',
    features: ['Password Encryption', 'AES Standard Security', 'Local Browser Processing', 'No Server Storage', 'Instant Protection']
  },
  {
    id: 'unlock-pdf',
    title: 'Unlock PDF',
    navTitle: 'Unlock PDF',
    description: 'Remove password protection from your encrypted PDF documents after entering the correct password. 100% private in browser.',
    icon: '🔓',
    path: '/unlock-pdf.html',
    filename: 'unlock-pdf.html',
    category: 'PDF Tools',
    badge: 'New',
    features: ['Password Removal', 'Local Browser Decryption', 'Clear Helpful Guidance', 'Private & Secure', 'No Uploads']
  },
  {
    id: 'pdf-metadata',
    title: 'PDF Metadata Viewer',
    navTitle: 'PDF Metadata',
    description: 'Inspect and edit PDF document properties including Title, Author, Subject, Keywords, Creator, and Producer, or clear metadata for privacy.',
    icon: '📋',
    path: '/pdf-metadata.html',
    filename: 'pdf-metadata.html',
    category: 'PDF Tools',
    badge: 'New',
    features: ['Inspect Full Metadata', 'Edit Title & Author', 'Strip All Metadata', 'Page Size & Version Info', '100% Client-Side']
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
    description: 'Create beautiful ATS-friendly resumes completely in your browser. Live preview, customizable sections, instant PDF export.',
    icon: '📄',
    path: '/resume-builder.html',
    filename: 'resume-builder.html',
    category: '💼 Career Tools',
    badge: 'Core Tool',
    features: ['ATS Friendly', 'Live Preview', 'PDF Export', 'Custom Sections', '100% Client-Side']
  },
  {
    id: 'ats-resume-checker',
    title: 'ATS Resume Checker',
    navTitle: 'ATS Checker',
    description: 'Scan resume text locally to calculate ATS compatibility score, missing target keywords, contact details, and formatting warnings.',
    icon: '🎯',
    path: '/ats-resume-checker.html',
    filename: 'ats-resume-checker.html',
    category: '💼 Career Tools',
    badge: 'New',
    features: ['ATS Score (0-100)', 'Missing Keyword Scan', 'Contact Info Check', 'Readability Score', '100% Local Scanner']
  },
  {
    id: 'resume-score-analyzer',
    title: 'Resume Score Analyzer',
    navTitle: 'Score Analyzer',
    description: 'In-depth multi-dimensional breakdown evaluating Design, Content, ATS Readiness, Keyword Density, and Professionalism.',
    icon: '📊',
    path: '/resume-score-analyzer.html',
    filename: 'resume-score-analyzer.html',
    category: '💼 Career Tools',
    badge: 'New',
    features: ['Overall Metric Score', 'Design & Content Metrics', 'Professionalism Rating', 'Completion Checklist', 'Actionable Suggestions']
  },
  {
    id: 'cover-letter-builder',
    title: 'Cover Letter Builder',
    navTitle: 'Cover Letter Builder',
    description: 'Interactive cover letter builder with structured sections, professional preset styles, and multi-format PDF/HTML/JSON export.',
    icon: '✉️',
    path: '/cover-letter-builder.html',
    filename: 'cover-letter-builder.html',
    category: '💼 Career Tools',
    badge: 'New',
    features: ['Structured Sections', 'Live Preview', 'PDF / HTML / JSON Export', 'Greeting & Intro Presets', '100% Private']
  },
  {
    id: 'cover-letter-templates',
    title: 'Cover Letter Templates',
    navTitle: 'Cover Letter Templates',
    description: '15+ industry-tailored cover letter templates for Software Engineers, Designers, Doctors, Teachers, Freshers, Marketers & more.',
    icon: '📋',
    path: '/cover-letter-templates.html',
    filename: 'cover-letter-templates.html',
    category: '💼 Career Tools',
    badge: 'New',
    features: ['15+ Industry Presets', 'One-Click Load', 'Editable Text', 'Instant Customization', 'PDF & TXT Export']
  },
  {
    id: 'cv-builder',
    title: 'CV Builder',
    navTitle: 'CV Builder',
    description: 'Comprehensive Curriculum Vitae builder tailored for academic, medical, research, and senior executive applications.',
    icon: '🎓',
    path: '/cv-builder.html',
    filename: 'cv-builder.html',
    category: '💼 Career Tools',
    badge: 'New',
    features: ['Academic Research Format', 'Publications & Grants', 'Multiple CV Layouts', 'High Density Output', 'PDF Export']
  },
  {
    id: 'resume-keyword-optimizer',
    title: 'Resume Keyword Optimizer',
    navTitle: 'Keyword Optimizer',
    description: 'Paste target Job Description and compare against your resume text to highlight missing, repeated, weak, and strong power words.',
    icon: '🔍',
    path: '/resume-keyword-optimizer.html',
    filename: 'resume-keyword-optimizer.html',
    category: '💼 Career Tools',
    badge: 'New',
    features: ['Job Description Match', 'Missing & Weak Keywords', 'Frequency Analysis', 'Action Verb Suggestions', '100% Client-Side']
  },
  {
    id: 'resume-template-gallery',
    title: 'Resume Template Gallery',
    navTitle: 'Template Gallery',
    description: 'Browse and load 30+ professionally engineered resume templates across Minimal, Modern, Executive, Developer, Creative & Medical.',
    icon: '🖼️',
    path: '/resume-template-gallery.html',
    filename: 'resume-template-gallery.html',
    category: '💼 Career Tools',
    badge: '30+ Designs',
    features: ['30+ Unique Layouts', 'Categorized Presets', 'One-Click Load', 'Live Sample Previews', 'Free Customization']
  },
  {
    id: 'resume-version-manager',
    title: 'Resume Version Manager',
    navTitle: 'Version Manager',
    description: 'Store, rename, duplicate, manage, and back up multiple resume versions safely inside local browser storage.',
    icon: '📁',
    path: '/resume-version-manager.html',
    filename: 'resume-version-manager.html',
    category: '💼 Career Tools',
    badge: 'New',
    features: ['Multi-Resume Storage', 'Duplicate & Rename', 'Local Storage Backup', 'Export / Restore All', 'Zero Server Dependence']
  },
  {
    id: 'resume-import',
    title: 'Resume Import',
    navTitle: 'Resume Import',
    description: 'Import previously saved resume files in JSON, HTML, or TXT formats directly into active suite memory.',
    icon: '📥',
    path: '/resume-import.html',
    filename: 'resume-import.html',
    category: '💼 Career Tools',
    badge: 'New',
    features: ['JSON / HTML / TXT Import', 'Instant Data Validation', 'Restore Backup', 'Overwrite or Add', '100% Client-Side']
  },
  {
    id: 'resume-export',
    title: 'Resume Export',
    navTitle: 'Resume Export',
    description: 'Export active resume to PDF, clean HTML web page, raw JSON code, plain TXT file, or initiate direct print & web sharing.',
    icon: '📤',
    path: '/resume-export.html',
    filename: 'resume-export.html',
    category: '💼 Career Tools',
    badge: 'New',
    features: ['PDF, HTML, JSON, TXT', 'Print & Browser Share', 'Vector Crisp Quality', 'Filename Customization', 'Instant Download']
  },
  {
    id: 'resume-completeness',
    title: 'Resume Completeness Tracker',
    navTitle: 'Completeness',
    description: 'Check profile completeness percentage with interactive checklist and step-by-step recommendations for job readiness.',
    icon: '✅',
    path: '/resume-completeness.html',
    filename: 'resume-completeness.html',
    category: '💼 Career Tools',
    badge: 'New',
    features: ['Completion Percentage', 'Step-by-Step Checklist', 'Missing Section Alerts', 'Live Progress Bar', 'Improvement Guide']
  },
  {
    id: 'resume-section-manager',
    title: 'Resume Section Manager',
    navTitle: 'Section Manager',
    description: 'Reorder, show, hide, duplicate, or rename resume sections with drag-and-drop flexibility and undo/redo history stack.',
    icon: '🧱',
    path: '/resume-section-manager.html',
    filename: 'resume-section-manager.html',
    category: '💼 Career Tools',
    badge: 'New',
    features: ['Reorder & Drag/Drop', 'Show / Hide Sections', 'Duplicate Section', 'Undo / Redo Stack', 'Instant Sync']
  },
  {
    id: 'professional-skill-library',
    title: 'Professional Skill Library',
    navTitle: 'Skill Library',
    description: 'Searchable library of 500+ predefined professional skills across Programming, Design, Marketing, Finance, HR, Legal & Healthcare.',
    icon: '💡',
    path: '/professional-skill-library.html',
    filename: 'professional-skill-library.html',
    category: '💼 Career Tools',
    badge: '500+ Skills',
    features: ['10+ Industry Categories', 'Search & Filter', 'One-Click Add', 'Proficiency Ratings', 'Skill Descriptions']
  },
  {
    id: 'summary-generator',
    title: 'Professional Summary Generator',
    navTitle: 'Summary Generator',
    description: 'Generate high-impact executive summaries without AI using structured formula templates for every experience level.',
    icon: '✍️',
    path: '/summary-generator.html',
    filename: 'summary-generator.html',
    category: '💼 Career Tools',
    badge: 'New',
    features: ['100% Local Formulas', 'Impact, Tech & Formal Tones', 'Role Specific Presets', 'One-Click Insert', 'Editable Drafts']
  },
  {
    id: 'resume-color-themes',
    title: 'Resume Color Themes',
    navTitle: 'Color Themes',
    description: 'Apply professional high-contrast color themes (Corporate Navy, Emerald Green, Ocean Blue, Royal Purple, Obsidian) to your resume.',
    icon: '🎨',
    path: '/resume-color-themes.html',
    filename: 'resume-color-themes.html',
    category: '💼 Career Tools',
    badge: 'New',
    features: ['10+ Professional Palette Presets', 'HEX / RGB Custom Picker', 'WCAG Contrast Check', 'Printable Aesthetics', 'Live Preview']
  },
  {
    id: 'experience-calculator',
    title: 'Work Experience Calculator',
    navTitle: 'Experience Calc',
    description: 'Calculate total work experience in years, months, and days across multiple roles with employment gap & overlap analysis.',
    icon: '⏳',
    path: '/experience-calculator.html',
    filename: 'experience-calculator.html',
    category: '💼 Career Tools',
    badge: 'Calculator',
    features: ['Multi-Job Timeline', 'Gap Analysis', 'Years / Months / Days', 'Current Employment Support', 'Printable Report']
  },
  {
    id: 'notice-period-calculator',
    title: 'Notice Period Calculator',
    navTitle: 'Notice Period Calc',
    description: 'Determine exact last working day, remaining working days, holiday exclusions, and estimated notice buyout cost.',
    icon: '📅',
    path: '/notice-period-calculator.html',
    filename: 'notice-period-calculator.html',
    category: '💼 Career Tools',
    badge: 'Calculator',
    features: ['Exact End Date Calculation', 'Working Days Remaining', 'Notice Buyout Calculator', 'Public Holiday Exclusions', 'Instant Summary']
  },
  {
    id: 'salary-hike-calculator',
    title: 'Salary Hike Calculator',
    navTitle: 'Salary Hike Calc',
    description: 'Calculate absolute salary increase, percentage hike, monthly take-home difference, and tax impact between job offers.',
    icon: '📈',
    path: '/salary-hike-calculator.html',
    filename: 'salary-hike-calculator.html',
    category: '💼 Career Tools',
    badge: 'Calculator',
    features: ['Current vs New CTC', 'Percentage Hike Calculation', 'Monthly Difference', 'Tax Slabs Estimate', 'Offer Comparison']
  },
  {
    id: 'ctc-calculator',
    title: 'CTC to In-Hand Calculator',
    navTitle: 'CTC Calculator',
    description: 'Break down gross CTC into Basic, HRA, Allowances, PF, Gratuity, Professional Tax, and net monthly take-home salary.',
    icon: '💵',
    path: '/ctc-calculator.html',
    filename: 'ctc-calculator.html',
    category: '💼 Career Tools',
    badge: 'Calculator',
    features: ['Monthly Take-Home Breakdown', 'PF & Gratuity Calculation', 'Tax Deductions', 'Custom Allowances', 'Detailed Payslip Breakdown']
  },
  {
    id: 'working-days-calculator',
    title: 'Working Days Calculator',
    navTitle: 'Working Days Calc',
    description: 'Calculate exact working business days between two dates excluding weekends (5-day or 6-day week) and custom public holidays.',
    icon: '📆',
    path: '/working-days-calculator.html',
    filename: 'working-days-calculator.html',
    category: '💼 Career Tools',
    badge: 'Calculator',
    features: ['5-Day & 6-Day Week Options', 'Weekend Exclusions', 'Custom Holiday Entries', 'Hours & Minutes Equivalent', 'Fast Local Calc']
  },
  {
    id: 'youtube-title-generator',
    title: 'YouTube Title Generator',
    navTitle: 'Title Generator',
    description: 'Generate high-CTR, SEO-friendly video titles for Tutorial, Review, Gaming, Education, Tech, Finance, AI, Vlog, Shorts, News, Islamic, and Entertainment.',
    icon: '🎬',
    path: '/youtube-title-generator.html',
    filename: 'youtube-title-generator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['12 Category Options', 'High CTR Formulas', 'Keyword Optimization', 'Instant Copy', '100% Client-Side']
  },
  {
    id: 'youtube-description-generator',
    title: 'YouTube Description Generator',
    navTitle: 'Description Generator',
    description: 'Generate structured YouTube video descriptions with Intro, Main Content, Subscribe CTA, Social Links, and Hashtags. Download TXT or copy.',
    icon: '📝',
    path: '/youtube-description-generator.html',
    filename: 'youtube-description-generator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['Structured Layout', 'Subscribe & Social Links', 'Hashtags & Links', 'Copy & Download TXT', 'Instant Preview']
  },
  {
    id: 'youtube-tags-generator',
    title: 'YouTube Tags Generator',
    navTitle: 'Tags Generator',
    description: 'Generate Short Tags, Long-tail Tags, SEO Tags, and Related Tags with real-time character counter and one-click Copy All for YouTube Studio.',
    icon: '🏷️',
    path: '/youtube-tags-generator.html',
    filename: 'youtube-tags-generator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['Short & Long-Tail Tags', 'SEO Keyword Clusters', '500 Char Counter', 'Comma-Separated Copy', '100% Local']
  },
  {
    id: 'youtube-hashtag-generator',
    title: 'YouTube Hashtag Generator',
    navTitle: 'Hashtag Generator',
    description: 'Generate optimized YouTube hashtags categorized into High Volume, Medium Volume, Long Tail, and Trending styles with one-click copy.',
    icon: '#️⃣',
    path: '/youtube-hashtag-generator.html',
    filename: 'youtube-hashtag-generator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['High & Medium Volume', 'Long-Tail Hashtags', 'Trending Style', 'One-Click Copy', 'Local Generator']
  },
  {
    id: 'youtube-thumbnail-preview',
    title: 'YouTube Thumbnail Preview',
    navTitle: 'Thumbnail Preview',
    description: 'Preview uploaded video thumbnails in realistic YouTube mockups across Desktop, Mobile, Search Results, and Suggested Videos in Light/Dark mode.',
    icon: '🖼️',
    path: '/youtube-thumbnail-preview.html',
    filename: 'youtube-thumbnail-preview.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['Desktop & Mobile View', 'Search & Suggested Feed', 'Dark & Light Mode', 'Custom Title & Channel', '100% Client-Side']
  },
  {
    id: 'youtube-channel-name-generator',
    title: 'YouTube Channel Name Generator',
    navTitle: 'Channel Name Generator',
    description: 'Generate unique YouTube channel names and handle ideas by category with handle availability format checker, favorites list, and copy button.',
    icon: '📢',
    path: '/youtube-channel-name-generator.html',
    filename: 'youtube-channel-name-generator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['Categorized Suggestions', 'Handle Format Checker', 'Favorites List', 'One-Click Copy', 'Zero Server Dependence']
  },
  {
    id: 'youtube-video-idea-generator',
    title: 'YouTube Video Idea Generator',
    navTitle: 'Video Idea Generator',
    description: 'Generate creative video topic ideas across Tech, Gaming, Education, Finance, Cooking, Islamic, AI, Travel, Health, and Lifestyle categories.',
    icon: '💡',
    path: '/youtube-video-idea-generator.html',
    filename: 'youtube-video-idea-generator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['10 Niche Categories', 'Angles & Target Audience', 'Difficulty Rating', 'Copy & Save Ideas', '100% Client-Side']
  },
  {
    id: 'youtube-playlist-name-generator',
    title: 'YouTube Playlist Name Generator',
    navTitle: 'Playlist Name Generator',
    description: 'Generate catchy, organized, and searchable YouTube playlist names with instant copy and TXT/JSON download options.',
    icon: '🎶',
    path: '/youtube-playlist-name-generator.html',
    filename: 'youtube-playlist-name-generator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['Catchy Playlist Titles', 'Categorized Styles', 'Copy to Clipboard', 'Download TXT & JSON', 'Instant Local Gen']
  },
  {
    id: 'youtube-timestamp-generator',
    title: 'YouTube Timestamp Generator',
    navTitle: 'Timestamp Generator',
    description: 'Create, sort, and format YouTube video chapter timestamps (00:00 Intro, 00:45 Topic, etc.) with automatic sorting and YouTube Studio formatting.',
    icon: '⏱️',
    path: '/youtube-timestamp-generator.html',
    filename: 'youtube-timestamp-generator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['Chapter Timestamp Builder', 'Auto-Chronological Sort', '00:00 Intro Validation', 'Instant Copy', '100% Client-Side']
  },
  {
    id: 'youtube-description-formatter',
    title: 'YouTube Video Description Formatter',
    navTitle: 'Description Formatter',
    description: 'Auto-format raw YouTube descriptions with clean spacing, bullet points, capitalized section dividers, sanitized links, and live preview.',
    icon: '🪄',
    path: '/youtube-description-formatter.html',
    filename: 'youtube-description-formatter.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['Clean Spacing & Indents', 'Bullet & Divider Styles', 'Section Auto-Capitalize', 'Live Preview Box', 'Copy Formatted Text']
  },
  {
    id: 'thumbnail-text-generator',
    title: 'Thumbnail Text Generator',
    navTitle: 'Thumbnail Text',
    description: 'Generate short, attention-grabbing 1-4 word thumbnail text concepts (MUST WATCH, SECRET, VIRAL, SHOCKING, FREE) with visual preview.',
    icon: '🔤',
    path: '/thumbnail-text-generator.html',
    filename: 'thumbnail-text-generator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['1-4 Word Power Phrases', 'High CTR Categories', 'Visual Typography Preview', 'One-Click Copy', 'Instant Local Generator']
  },
  {
    id: 'viral-hook-generator',
    title: 'Viral Hook Generator',
    navTitle: 'Viral Hook Generator',
    description: 'Generate powerful first-line hooks for YouTube, Instagram, TikTok, Facebook, and LinkedIn videos and posts to maximize viewer retention.',
    icon: '🪝',
    path: '/viral-hook-generator.html',
    filename: 'viral-hook-generator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['5 Social Platforms', 'Curiosity & Urgency Hooks', 'Retention-Driven Formula', 'One-Click Copy', 'Zero Server Dependence']
  },
  {
    id: 'cta-generator',
    title: 'CTA Generator',
    navTitle: 'CTA Generator',
    description: 'Generate compelling Call-To-Action (CTA) phrases for Subscribe, Like, Comment, Share, and Website links across multiple communication tones.',
    icon: '📣',
    path: '/cta-generator.html',
    filename: 'cta-generator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['5 CTA Types', 'Multiple Tone Options', 'High-Converting Formulas', 'One-Click Copy', '100% Local']
  },
  {
    id: 'social-character-counter',
    title: 'Social Character Counter',
    navTitle: 'Social Character Counter',
    description: 'Live character, word, sentence, and reading time counter with built-in limit gauges for YouTube, Instagram, TikTok, Twitter/X, Facebook, and LinkedIn.',
    icon: '📊',
    path: '/social-character-counter.html',
    filename: 'social-character-counter.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['Characters & Words', 'Reading Time Estimate', 'Platform Limit Gauges', 'Text Formatting Cleaners', '100% Private']
  },
  {
    id: 'emoji-generator',
    title: 'Emoji Generator & Picker',
    navTitle: 'Emoji Generator',
    description: 'Browse, search, and copy emojis by category with recent emoji tracking, favorites list, and social media emoji combination generator.',
    icon: '😀',
    path: '/emoji-generator.html',
    filename: 'emoji-generator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['Categorized Emoji Library', 'Fast Keyword Search', 'Recent & Favorites Stack', 'Social Combo Presets', 'One-Click Copy']
  },
  {
    id: 'instagram-caption-generator',
    title: 'Instagram Caption Generator',
    navTitle: 'IG Caption Generator',
    description: 'Generate catchy captions with emojis and hashtags for Reels, Posts, Stories, Business, Travel, Food, Fashion, Fitness, Education, Motivation, and Personal Brand.',
    icon: '📸',
    path: '/instagram-caption-generator.html',
    filename: 'instagram-caption-generator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['11 Niche Categories', 'Multiple Variations', 'Emoji & Hashtag Integration', 'One-Click Copy', '100% Local']
  },
  {
    id: 'instagram-hashtag-generator',
    title: 'Instagram Hashtag Generator',
    navTitle: 'IG Hashtag Generator',
    description: 'Generate Popular, Niche, Long-tail, Local, and Reels hashtags with real-time character counter and one-click Copy All.',
    icon: '🏷️',
    path: '/instagram-hashtag-generator.html',
    filename: 'instagram-hashtag-generator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['Categorized Hashtag Sets', 'Popular, Niche & Local', 'Character & Count Metrics', 'Copy All Button', '100% Client-Side']
  },
  {
    id: 'instagram-bio-generator',
    title: 'Instagram Bio Generator',
    navTitle: 'IG Bio Generator',
    description: 'Generate professional, creative, and aesthetic bios for Business, Creator, Freelancer, Student, Influencer, Islamic, Tech, Gamer, Fitness, and Photographer profiles.',
    icon: '✨',
    path: '/instagram-bio-generator.html',
    filename: 'instagram-bio-generator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['10 Profile Categories', 'Multiple Aesthetic Styles', '150 Character Limit Check', 'One-Click Copy', '100% Client-Side']
  },
  {
    id: 'instagram-username-generator',
    title: 'Instagram Username Generator',
    navTitle: 'IG Username Generator',
    description: 'Generate available-style usernames categorized into Short, Professional, Creative, Minimal, and Random options.',
    icon: '👤',
    path: '/instagram-username-generator.html',
    filename: 'instagram-username-generator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['Short & Minimal Styles', 'Professional & Creative', 'Random Combination Mode', 'One-Click Copy', '100% Local']
  },
  {
    id: 'tiktok-caption-generator',
    title: 'TikTok Caption Generator',
    navTitle: 'TikTok Caption Generator',
    description: 'Generate viral, high-retention TikTok captions across Entertainment, Comedy, Education, Gaming, Lifestyle, and Technology niches.',
    icon: '🎵',
    path: '/tiktok-caption-generator.html',
    filename: 'tiktok-caption-generator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['6 Niche Categories', 'Hook & Call to Action', 'Trending Style Formats', 'One-Click Copy', '100% Local']
  },
  {
    id: 'tiktok-hashtag-generator',
    title: 'TikTok Hashtag Generator',
    navTitle: 'TikTok Hashtag Generator',
    description: 'Generate FYP-optimized TikTok hashtags with favorites saving and one-click copy.',
    icon: '#️⃣',
    path: '/tiktok-hashtag-generator.html',
    filename: 'tiktok-hashtag-generator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['FYP & Trending Clusters', 'Niche-Specific Tag Sets', 'Favorites Manager', 'One-Click Copy All', '100% Client-Side']
  },
  {
    id: 'facebook-caption-generator',
    title: 'Facebook Caption Generator',
    navTitle: 'FB Caption Generator',
    description: 'Generate engaging Facebook post captions for Business, Festival, Events, Travel, Technology, Marketing, and Personal posts.',
    icon: '📘',
    path: '/facebook-caption-generator.html',
    filename: 'facebook-caption-generator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['7 Niche Categories', 'Engaging Storytelling Tone', 'Call to Action Options', 'One-Click Copy', '100% Client-Side']
  },
  {
    id: 'facebook-hashtag-generator',
    title: 'Facebook Hashtag Generator',
    navTitle: 'FB Hashtag Generator',
    description: 'Generate trending-style Facebook hashtags to expand post reach and engagement.',
    icon: '📲',
    path: '/facebook-hashtag-generator.html',
    filename: 'facebook-hashtag-generator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['Trending Facebook Tags', 'Topic-Based Tag Clusters', 'One-Click Copy', 'Fast Local Processing', '100% Free']
  },
  {
    id: 'linkedin-headline-generator',
    title: 'LinkedIn Headline Generator',
    navTitle: 'LinkedIn Headline Generator',
    description: 'Generate high-converting professional headlines for Developer, Designer, Student, HR, Marketing, Sales, AI Engineer, Teacher, Doctor, and Business.',
    icon: '💼',
    path: '/linkedin-headline-generator.html',
    filename: 'linkedin-headline-generator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['10 Career Paths', 'Impact & Keyword Formats', 'Multi-Variation Output', 'One-Click Copy', '100% Client-Side']
  },
  {
    id: 'linkedin-summary-generator',
    title: 'LinkedIn Summary Generator',
    navTitle: 'LinkedIn Summary Generator',
    description: 'Generate polished, professional About summaries for LinkedIn. Edit directly, copy to clipboard, or download as TXT file.',
    icon: '📜',
    path: '/linkedin-summary-generator.html',
    filename: 'linkedin-summary-generator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['Structured Bio Sections', 'Live Text Editing', 'One-Click Copy', 'Download TXT File', '100% Client-Side']
  },
  {
    id: 'twitter-bio-generator',
    title: 'Twitter (X) Bio Generator',
    navTitle: 'Twitter / X Bio Generator',
    description: 'Generate punchy Twitter/X bios in Short, Professional, Funny, Minimal, and Business styles within character limits.',
    icon: '🐦',
    path: '/twitter-bio-generator.html',
    filename: 'twitter-bio-generator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['5 Style Options', '160 Character Limit Indicator', 'Hashtag & Tag Suggestions', 'One-Click Copy', '100% Client-Side']
  },
  {
    id: 'universal-hashtag-generator',
    title: 'Universal Hashtag Generator',
    navTitle: 'Universal Hashtag Generator',
    description: 'Generate platform-tailored hashtags for YouTube, Instagram, TikTok, Facebook, LinkedIn, Twitter (X), Pinterest, and Threads.',
    icon: '🌐',
    path: '/universal-hashtag-generator.html',
    filename: 'universal-hashtag-generator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['8 Platform Selector Options', 'Topic Keyword Generator', 'Copy All Functionality', 'Fast Local Processing', '100% Client-Side']
  },
  {
    id: 'fancy-text-generator',
    title: 'Fancy Text Generator',
    navTitle: 'Fancy Text Generator',
    description: 'Convert plain text into stylized Unicode fonts including Bold, Italic, Script, Bubble, Outline, Monospace, and Small Caps.',
    icon: '🔠',
    path: '/fancy-text-generator.html',
    filename: 'fancy-text-generator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['Bold, Italic & Script', 'Bubble, Outline & Monospace', 'Small Caps Style', 'Instant One-Click Copy', '100% Client-Side']
  },
  {
    id: 'unicode-font-generator',
    title: 'Unicode Font Generator',
    navTitle: 'Unicode Font Generator',
    description: 'Generate multiple Unicode text font styles with live preview, favorites saving, and one-click copy for bios and captions.',
    icon: '🔤',
    path: '/unicode-font-generator.html',
    filename: 'unicode-font-generator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['20+ Unicode Text Styles', 'Live Input Preview', 'Favorites Collection', 'One-Click Copy', '100% Client-Side']
  },
  {
    id: 'text-decorator',
    title: 'Text Decorator',
    navTitle: 'Text Decorator',
    description: 'Decorate text with Stars, Lines, Boxes, Symbols, Arrows, Circles, and minimal separators for social media bios and headers.',
    icon: '🎀',
    path: '/text-decorator.html',
    filename: 'text-decorator.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['Stars, Lines & Boxes', 'Arrows & Circles Decor', 'Minimal Separators', 'One-Click Copy', '100% Client-Side']
  },
  {
    id: 'emoji-combiner',
    title: 'Emoji Combiner',
    navTitle: 'Emoji Combiner',
    description: 'Combine and build creative emoji strings and sequences with recents stack, favorites saving, and instant copy.',
    icon: '🎨',
    path: '/emoji-combiner.html',
    filename: 'emoji-combiner.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['Emoji Combination Canvas', 'Recents & Favorites Manager', 'One-Click Clipboard Copy', 'Clean Interface', '100% Local']
  },
  {
    id: 'social-media-post-formatter',
    title: 'Social Media Post Formatter',
    navTitle: 'Post Formatter',
    description: 'Format posts for Instagram, Facebook, LinkedIn, Twitter, and Threads preserving line breaks, paragraph spacing, and bullet points.',
    icon: '📐',
    path: '/social-media-post-formatter.html',
    filename: 'social-media-post-formatter.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['Preserve Paragraph Spacing', 'Platform Mockup Previews', 'Invisible Space Inserter', 'One-Click Copy', '100% Local']
  },
  {
    id: 'social-bio-link-builder',
    title: 'Social Bio Link Builder',
    navTitle: 'Bio Link Builder',
    description: 'Build a personalized single-page bio link website with Name, Bio, Website, Instagram, YouTube, LinkedIn, GitHub, and Email, and export as static HTML.',
    icon: '🔗',
    path: '/social-bio-link-builder.html',
    filename: 'social-bio-link-builder.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: ['Live Mobile Mockup', 'All Social Media Links', 'Export Clean Static HTML', 'No Backend Required', '100% Free & Local']
  },
  {
    id: 'uuid-generator',
    title: 'UUID Generator',
    navTitle: 'UUID Generator',
    description: 'Generate bulk UUID v4 strings instantly in your browser with download TXT option.',
    icon: '🔑',
    path: '/uuid-generator.html',
    filename: 'uuid-generator.html',
    category: '👨‍💻 Developer Tools',
    badge: 'New',
    features: ['UUID v4 Standard', 'Bulk Generation (1-100)', 'Uppercase / Lowercase', 'Hyphen Toggle', 'Copy & TXT Download']
  },
  {
    id: 'hash-generator',
    title: 'Hash Generator',
    navTitle: 'Hash Generator',
    description: 'Generate cryptographic MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes locally in real-time.',
    icon: '🔒',
    path: '/hash-generator.html',
    filename: 'hash-generator.html',
    category: '👨‍💻 Developer Tools',
    badge: 'New',
    features: ['MD5, SHA-1, SHA-256, SHA-512', 'Real-time Calculation', 'Uppercase / Lowercase', '100% Private', 'Copy & Download']
  },
  {
    id: 'jwt-decoder',
    title: 'JWT Decoder',
    navTitle: 'JWT Decoder',
    description: 'Decode JSON Web Tokens locally. Inspect Header, Payload, Expiry, and Issued time without sending data to any server.',
    icon: '🔏',
    path: '/jwt-decoder.html',
    filename: 'jwt-decoder.html',
    category: '👨‍💻 Developer Tools',
    badge: 'New',
    features: ['Header & Payload Parsing', 'Token Expiry Check', '100% Client-Side', 'Never Sends Data to Server', 'Formatted JSON View']
  },
  {
    id: 'unix-timestamp-converter',
    title: 'Unix Timestamp Converter',
    navTitle: 'Timestamp Converter',
    description: 'Convert Unix epoch timestamps to human-readable dates and vice versa in UTC and local timezone.',
    icon: '⏰',
    path: '/unix-timestamp-converter.html',
    filename: 'unix-timestamp-converter.html',
    category: '👨‍💻 Developer Tools',
    badge: 'New',
    features: ['Seconds & Milliseconds', 'Date to Timestamp', 'UTC & Local Time', 'Current Time Counter', 'Relative Time Display']
  },
  {
    id: 'regex-tester',
    title: 'Regex Tester & Explainer',
    navTitle: 'Regex Tester',
    description: 'Test regular expressions against sample text with live highlights, capture groups, and plain English token breakdown.',
    icon: '🔍',
    path: '/regex-tester.html',
    filename: 'regex-tester.html',
    category: '👨‍💻 Developer Tools',
    badge: 'New',
    features: ['Live Highlight Matches', 'Regex Flags (g, i, m, s, u, y)', 'Match & Group Extraction', 'Token Explainer', 'Preset Patterns']
  },
  {
    id: 'json-formatter',
    title: 'JSON Formatter & Tree Viewer',
    navTitle: 'JSON Formatter',
    description: 'Beautify, minify, validate, and inspect collapsible JSON node tree structures.',
    icon: '💻',
    path: '/json-formatter.html',
    filename: 'json-formatter.html',
    category: '👨‍💻 Developer Tools',
    badge: 'New',
    features: ['Beautify & Indent', 'Minify / Compact', 'Collapsible Tree View', 'Syntax Error Detection', 'Copy & Download']
  },
  {
    id: 'json-validator',
    title: 'JSON Validator',
    navTitle: 'JSON Validator',
    description: 'Validate JSON syntax locally, pinpoint error line and column numbers, and format valid JSON.',
    icon: '✅',
    path: '/json-validator.html',
    filename: 'json-validator.html',
    category: '👨‍💻 Developer Tools',
    badge: 'New',
    features: ['Syntax Validation', 'Exact Line & Column Error', 'Fix Assistance', 'Copy & Clean', '100% Local']
  },
  {
    id: 'json-to-csv',
    title: 'JSON to CSV Converter',
    navTitle: 'JSON to CSV',
    description: 'Convert JSON arrays into CSV spreadsheets with live table preview and instant CSV export.',
    icon: '📊',
    path: '/json-to-csv.html',
    filename: 'json-to-csv.html',
    category: '👨‍💻 Developer Tools',
    badge: 'New',
    features: ['Array & Object Parsing', 'CSV Data Table Preview', 'Automated Header Extraction', 'Copy & Download CSV', '100% Client-Side']
  },
  {
    id: 'csv-to-json',
    title: 'CSV to JSON Converter',
    navTitle: 'CSV to JSON',
    description: 'Convert CSV spreadsheets or TSV files into clean formatted JSON objects and arrays.',
    icon: '🔄',
    path: '/csv-to-json.html',
    filename: 'csv-to-json.html',
    category: '👨‍💻 Developer Tools',
    badge: 'New',
    features: ['Custom Delimiters (, ; \\t |)', 'Auto Data Type Casting', 'Formatted JSON Output', 'Copy & Download JSON', '100% Client-Side']
  },
  {
    id: 'csv-viewer',
    title: 'CSV Viewer & Data Grid',
    navTitle: 'CSV Viewer',
    description: 'Inspect, search, sort by column, filter, and paginate large CSV datasets directly in your browser.',
    icon: '📋',
    path: '/csv-viewer.html',
    filename: 'csv-viewer.html',
    category: '👨‍💻 Developer Tools',
    badge: 'New',
    features: ['Interactive Data Grid', 'Search & Column Sort', 'Pagination Controls', 'Export Filtered CSV', 'No Server Limits']
  },
  {
    id: 'html-formatter',
    title: 'HTML Formatter & Preview',
    navTitle: 'HTML Formatter',
    description: 'Beautify, indent, minify, or preview rendered HTML document markups in real-time.',
    icon: '🌐',
    path: '/html-formatter.html',
    filename: 'html-formatter.html',
    category: '👨‍💻 Developer Tools',
    badge: 'New',
    features: ['Beautify & Indent', 'Minify HTML', 'Live Render Preview', 'File Upload & Export', '100% Local']
  },
  {
    id: 'css-formatter',
    title: 'CSS Formatter & Beautifier',
    navTitle: 'CSS Formatter',
    description: 'Format, indent, clean, and minify CSS style rules for maximum readability & performance.',
    icon: '🎨',
    path: '/css-formatter.html',
    filename: 'css-formatter.html',
    category: '👨‍💻 Developer Tools',
    badge: 'New',
    features: ['Beautify & Indent', 'Minify CSS', 'File Upload & Export', 'Copy & Download', '100% Local']
  },
  {
    id: 'javascript-formatter',
    title: 'JavaScript Formatter',
    navTitle: 'JS Formatter',
    description: 'Format, beautify, un-minify, or compact JavaScript & TypeScript code directly in your browser.',
    icon: '⚡',
    path: '/javascript-formatter.html',
    filename: 'javascript-formatter.html',
    category: '👨‍💻 Developer Tools',
    badge: 'New',
    features: ['Beautify & Indent', 'Minify JS', 'File Upload & Export', 'Copy & Download', '100% Local']
  },
  {
    id: 'xml-formatter',
    title: 'XML Formatter',
    navTitle: 'XML Formatter',
    description: 'Beautify and indent raw XML documents with custom spacing options.',
    icon: '📄',
    path: '/xml-formatter.html',
    filename: 'xml-formatter.html',
    category: '👨‍💻 Developer Tools',
    badge: 'New',
    features: ['XML Beautifier', 'Minify XML', 'Syntax Validation', 'Copy & Download', '100% Client-Side']
  },
  {
    id: 'xml-validator',
    title: 'XML Validator',
    navTitle: 'XML Validator',
    description: 'Validate XML syntax and detect unmatched opening or closing tags.',
    icon: '🛡️',
    path: '/xml-validator.html',
    filename: 'xml-validator.html',
    category: '👨‍💻 Developer Tools',
    badge: 'New',
    features: ['Syntax Checker', 'Unmatched Tag Detection', 'Line Error Reporting', 'Clean Output', '100% Private']
  },
  {
    id: 'url-parser',
    title: 'URL Component Parser',
    navTitle: 'URL Parser',
    description: 'Break down complex URL strings into protocol, host, port, path, fragment hash, and query parameter pairs.',
    icon: '🔗',
    path: '/url-parser.html',
    filename: 'url-parser.html',
    category: '👨‍💻 Developer Tools',
    badge: 'New',
    features: ['Protocol, Host & Port', 'Query Parameters Table', 'Fragment Hash Extraction', 'Copy Parameter Pairs', '100% Local']
  },
  {
    id: 'url-encoder-decoder',
    title: 'URL Encoder / Decoder',
    navTitle: 'URL Encoder',
    description: 'Encode special characters into web-safe URL formats or decode percent-encoded links back to plain text.',
    icon: '🌐',
    path: '/url-encoder-decoder.html',
    filename: 'url-encoder-decoder.html',
    category: '👨‍💻 Developer Tools',
    badge: 'New',
    features: ['Percent Encoding (%20)', 'Decode URL Strings', 'Copy & Download TXT', '100% Private', 'Instant Conversion']
  },
  {
    id: 'base64-encoder-decoder',
    title: 'Base64 Encoder / Decoder',
    navTitle: 'Base64 Tool',
    description: 'Encode text into Base64 format or decode Base64 strings back to UTF-8 text.',
    icon: '🔤',
    path: '/base64-encoder-decoder.html',
    filename: 'base64-encoder-decoder.html',
    category: '👨‍💻 Developer Tools',
    badge: 'New',
    features: ['UTF-8 Safe Encoding', 'Decode Base64', 'File Upload Support', 'Copy & Download', '100% Client-Side']
  },
  {
    id: 'html-escape-unescape',
    title: 'HTML Escape / Unescape',
    navTitle: 'HTML Escape',
    description: 'Convert HTML markup characters into safe entity codes (&lt;, &gt;, &amp;) or unescape entities back to markup.',
    icon: '🏷️',
    path: '/html-escape-unescape.html',
    filename: 'html-escape-unescape.html',
    category: '👨‍💻 Developer Tools',
    badge: 'New',
    features: ['Escape HTML Entities', 'Unescape HTML Entities', 'Quotes & Ampersands', 'Copy & Download', '100% Client-Side']
  },
  {
    id: 'http-header-viewer',
    title: 'HTTP Header Viewer',
    navTitle: 'Header Viewer',
    description: 'Parse HTTP headers, categorize security & caching rules, and audit security compliance.',
    icon: '🌐',
    path: '/http-header-viewer.html',
    filename: 'http-header-viewer.html',
    category: '👨‍💻 Developer Tools',
    badge: 'New',
    features: ['Status Line & Headers', 'Categorized Security Rules', 'Security Audit Rating', 'Search & Filter', 'Copy Pairs']
  },
  {
    id: 'api-request-builder',
    title: 'API Request Builder',
    navTitle: 'API Request Builder',
    description: 'Send HTTP requests (GET, POST, PUT, DELETE) and inspect status, headers, and response payloads directly in browser.',
    icon: '🚀',
    path: '/api-request-builder.html',
    filename: 'api-request-builder.html',
    category: '👨‍💻 Developer Tools',
    badge: 'New',
    features: ['GET, POST, PUT, DELETE', 'Header & Body Editor', 'Response Status & Time', 'Formatted JSON Body', '100% Browser Executed']
  },
  {
    id: 'color-converter',
    title: 'Color Converter & Contrast',
    navTitle: 'Color Converter',
    description: 'Convert colors between HEX, RGB, HSL, and CMYK with WCAG contrast ratio checks.',
    icon: '🎨',
    path: '/color-converter.html',
    filename: 'color-converter.html',
    category: '👨‍💻 Developer Tools',
    badge: 'New',
    features: ['HEX, RGB, HSL, CMYK', 'Visual Swatch Picker', 'WCAG AA/AAA Contrast Check', 'One-Click Copy', '100% Client-Side']
  },
  {
    id: 'qr-code-decoder',
    title: 'QR Code Decoder',
    navTitle: 'QR Decoder',
    description: 'Upload any image containing a QR code to extract its underlying text or web link completely client-side.',
    icon: '📱',
    path: '/qr-code-decoder.html',
    filename: 'qr-code-decoder.html',
    category: '👨‍💻 Developer Tools',
    badge: 'New',
    features: ['Image Drag & Drop', 'PNG, JPG, WEBP', 'jsQR Local Engine', 'Open URL Link', 'Copy Decoded Text']
  },
  {
    id: 'css-gradient-generator',
    title: 'CSS Gradient Generator',
    navTitle: 'Gradient Generator',
    description: 'Design custom linear, radial, or conic CSS gradients with live preview, unlimited color stops, angle adjustment & instant export.',
    icon: '🎨',
    path: '/css-gradient-generator.html',
    filename: 'css-gradient-generator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'New',
    features: ['Linear, Radial, Conic', 'Unlimited Color Stops', 'Angle Slider', 'Random & Reverse', 'Copy & Download CSS']
  },
  {
    id: 'box-shadow-generator',
    title: 'Box Shadow Generator',
    navTitle: 'Box Shadow Generator',
    description: 'Create layered, soft, inset, or multi-shadow CSS box shadows with real-time visual canvas customization.',
    icon: '📦',
    path: '/box-shadow-generator.html',
    filename: 'box-shadow-generator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'New',
    features: ['Multiple Shadow Layers', 'X & Y Offset Sliders', 'Blur & Spread Radius', 'Opacity & Inset', 'Copy CSS Code']
  },
  {
    id: 'border-radius-generator',
    title: 'Border Radius Generator',
    navTitle: 'Border Radius',
    description: 'Design custom rounded, asymmetrical, or elliptical box corners easily with live preview.',
    icon: '⭕',
    path: '/border-radius-generator.html',
    filename: 'border-radius-generator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'New',
    features: ['Individual Corners', 'Linked Corners Sync', 'Elliptical Radii', 'Live Shape Preview', 'Copy CSS Code']
  },
  {
    id: 'glassmorphism-generator',
    title: 'Glassmorphism Generator',
    navTitle: 'Glassmorphism',
    description: 'Generate frosted glass UI effects with blur, opacity, translucent borders & ambient glow.',
    icon: '✨',
    path: '/glassmorphism-generator.html',
    filename: 'glassmorphism-generator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'New',
    features: ['Backdrop Blur', 'Translucent Opacity', 'Border Highlight', 'Ambient Glow', 'Copy Glass CSS']
  },
  {
    id: 'neumorphism-generator',
    title: 'Neumorphism Generator',
    navTitle: 'Neumorphism',
    description: 'Generate soft UI extruded or inset neumorphic shadows, flat, concave, and convex shapes.',
    icon: '🔲',
    path: '/neumorphism-generator.html',
    filename: 'neumorphism-generator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'New',
    features: ['Flat, Concave, Convex, Pressed', 'Light Direction', 'Distance & Blur', 'Radius Adjustment', 'Copy CSS Code']
  },
  {
    id: 'css-clip-path-generator',
    title: 'CSS Clip Path Generator',
    navTitle: 'Clip Path Generator',
    description: 'Create custom geometric shapes, polygons, circles & stars using CSS clip-path.',
    icon: '✂️',
    path: '/css-clip-path-generator.html',
    filename: 'css-clip-path-generator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'New',
    features: ['Triangle, Hexagon, Star', 'Polygon & Circles', 'Live Visual Preview', 'Editable Code', 'Copy CSS Code']
  },
  {
    id: 'svg-shape-generator',
    title: 'SVG Shape Generator',
    navTitle: 'SVG Shape Generator',
    description: 'Generate vector circles, stars, polygons & organic smooth blobs with SVG download.',
    icon: '📐',
    path: '/svg-shape-generator.html',
    filename: 'svg-shape-generator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'New',
    features: ['Circles, Polygons & Blobs', 'Fill & Stroke Colors', 'Stroke Width', 'Download SVG File', 'Copy SVG Code']
  },
  {
    id: 'color-palette-generator',
    title: 'Color Palette Generator',
    navTitle: 'Color Palette',
    description: 'Generate harmonious monochromatic, triadic, complementary or random palettes with hex lock & JSON export.',
    icon: '🎨',
    path: '/color-palette-generator.html',
    filename: 'color-palette-generator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'New',
    features: ['Color Harmonies', 'Lock Swatches', 'One-Click HEX Copy', 'JSON Export', '100% Local']
  },
  {
    id: 'contrast-checker',
    title: 'Contrast Checker',
    navTitle: 'Contrast Checker',
    description: 'Check color contrast ratios against WCAG 2.1 AA & AAA accessibility guidelines with live text preview.',
    icon: '👁️',
    path: '/contrast-checker.html',
    filename: 'contrast-checker.html',
    category: '🎨 Design & Utility Tools',
    badge: 'New',
    features: ['Exact Ratio Calculation', 'WCAG AA & AAA Badges', 'Normal & Large Text', 'Foreground/Background Swap', 'Live Preview']
  },
  {
    id: 'random-color-generator',
    title: 'Random Color Generator',
    navTitle: 'Random Color',
    description: 'Generate random colors instantly in HEX, RGB, HSL, RGBA with spacebar control & favorites list.',
    icon: '🎲',
    path: '/random-color-generator.html',
    filename: 'random-color-generator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'New',
    features: ['Spacebar Shortcut', 'HEX, RGB, HSL, RGBA', 'Favorites Saved Locally', 'Recent History', 'One-Click Copy']
  },
  {
    id: 'qr-business-card-generator',
    title: 'QR Business Card Generator',
    navTitle: 'QR Business Card',
    description: 'Create a contact vCard QR code that instantly imports contact details on mobile smartphones.',
    icon: '📇',
    path: '/qr-business-card-generator.html',
    filename: 'qr-business-card-generator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'New',
    features: ['vCard Contact Format', 'Name, Phone, Email, Site', 'Live QR Preview', 'High Res PNG Download', '100% Client-Side']
  },
  {
    id: 'unit-converter',
    title: 'Unit Converter',
    navTitle: 'Unit Converter',
    description: 'Convert length, weight, area, volume, temperature, data storage, speed & time units instantly.',
    icon: '📏',
    path: '/unit-converter.html',
    filename: 'unit-converter.html',
    category: '🎨 Design & Utility Tools',
    badge: 'New',
    features: ['8 Major Categories', 'Instant Recalculation', 'All-Unit Breakdown Table', 'Unit Swap', 'Zero Latency']
  },
  {
    id: 'percentage-calculator',
    title: 'Percentage Calculator',
    navTitle: 'Percentage Calculator',
    description: 'Calculate percentage amounts, proportions, increases, decreases & differences with live formula modes.',
    icon: '%',
    path: '/percentage-calculator.html',
    filename: 'percentage-calculator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'New',
    features: ['What is X% of Y', 'X is what % of Y', '% Increase / Decrease', '% Difference', 'Instant Results']
  },
  {
    id: 'age-calculator',
    title: 'Age Calculator',
    navTitle: 'Age Calculator',
    description: 'Calculate exact age in years, months, days, total hours & next birthday countdown.',
    icon: '🎂',
    path: '/age-calculator.html',
    filename: 'age-calculator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'New',
    features: ['Years, Months, Days', 'Total Hours & Minutes', 'Next Birthday Timer', 'Day of Week', 'Target Date Comparison']
  },
  {
    id: 'emi-calculator',
    title: 'EMI Calculator',
    navTitle: 'EMI Calculator',
    description: 'Calculate Equated Monthly Installment (EMI), total interest & yearly amortization schedule.',
    icon: '🏦',
    path: '/emi-calculator.html',
    filename: 'emi-calculator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'New',
    features: ['Monthly EMI Amount', 'Total Interest Paid', 'Principal vs Interest Bar', 'Yearly Amortization Schedule', 'Interactive Sliders']
  },
  {
    id: 'discount-calculator',
    title: 'Discount Calculator',
    navTitle: 'Discount Calculator',
    description: 'Calculate final sale price, discount savings & total tax payable instantly.',
    icon: '🏷️',
    path: '/discount-calculator.html',
    filename: 'discount-calculator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'New',
    features: ['Original Price & Discount %', 'Sales Tax Rate', 'Total Savings Badge', 'Final Price Output', 'Preset Quick Buttons']
  },
  {
    id: 'currency-calculator',
    title: 'Currency Calculator',
    navTitle: 'Currency Calculator',
    description: 'Fast offline manual currency converter with customizable exchange rates for USD, EUR, GBP, INR & more.',
    icon: '💱',
    path: '/currency-calculator.html',
    filename: 'currency-calculator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'New',
    features: ['Offline Processing', 'Custom Rate Editing', 'Major World Currencies', 'Instant Calculation', 'Local Storage Persistence']
  },
  {
    id: 'tip-calculator',
    title: 'Tip Calculator',
    navTitle: 'Tip Calculator',
    description: 'Calculate tip amounts and split bill totals evenly among friends or group members.',
    icon: '🍽️',
    path: '/tip-calculator.html',
    filename: 'tip-calculator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'New',
    features: ['Bill & Tip %', 'Preset Tip Buttons', 'Split Bill Count', 'Per-Person Total & Tip', 'Instant Calculation']
  },
  {
    id: 'random-number-generator',
    title: 'Random Number Generator',
    navTitle: 'Random Number',
    description: 'Generate random numbers with customizable range, quantity, unique rules & sorting.',
    icon: '🔢',
    path: '/random-number-generator.html',
    filename: 'random-number-generator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'New',
    features: ['Min & Max Range', 'Multiple Quantity', 'Allow/Disallow Repeats', 'Asc/Desc Sorting', 'Copy Numbers']
  },
  {
    id: 'random-password-generator',
    title: 'Random Password Generator',
    navTitle: 'Password Generator',
    description: 'Generate strong, cryptographically secure random passwords instantly in your browser.',
    icon: '🔑',
    path: '/random-password-generator.html',
    filename: 'random-password-generator.html',
    category: '🎨 Design & Utility Tools',
    badge: 'New',
    features: ['Length 6 to 64 Chars', 'A-Z, a-z, 0-9, Symbols', 'Exclude Similar Chars', 'Strength Meter', 'One-Click Copy']
  },
  {
    id: 'chatgpt-prompt-builder',
    title: 'ChatGPT Prompt Builder',
    navTitle: 'ChatGPT Prompts',
    description: 'Build structured, professional prompts for ChatGPT writing, coding, marketing, business, education & productivity.',
    icon: '🤖',
    path: '/chatgpt-prompt-builder.html',
    filename: 'chatgpt-prompt-builder.html',
    category: '🤖 AI Prompt Builder Tools',
    badge: 'AI Tool',
    features: ['Role & Tone Customizer', 'Multi-Category Templates', 'Copy & Download Options', 'Browser-Only Privacy', 'Library Integration']
  },
  {
    id: 'gemini-prompt-builder',
    title: 'Gemini Prompt Builder',
    navTitle: 'Gemini Prompts',
    description: 'Construct optimized prompts for Google Gemini AI covering writing, research, analysis, image ideas & multimodal prompts.',
    icon: '✨',
    path: '/gemini-prompt-builder.html',
    filename: 'gemini-prompt-builder.html',
    category: '🤖 AI Prompt Builder Tools',
    badge: 'AI Tool',
    features: ['Google Gemini Tuned', 'Multimodal & Search Hooks', 'Structured Prompt Rules', 'Copy & Download', 'Favorites Store']
  },
  {
    id: 'claude-prompt-builder',
    title: 'Claude Prompt Builder',
    navTitle: 'Claude Prompts',
    description: 'Craft long-form prompts with XML tags, system personas, context framing & complex reasoning for Claude AI.',
    icon: '🧠',
    path: '/claude-prompt-builder.html',
    filename: 'claude-prompt-builder.html',
    category: '🤖 AI Prompt Builder Tools',
    badge: 'AI Tool',
    features: ['XML Tag Structuring', 'System Role Framing', 'Long-Context Optimization', 'Copy/Download/Print', 'Browser Offline']
  },
  {
    id: 'veo-prompt-builder',
    title: 'Veo Prompt Builder',
    navTitle: 'Veo Video Prompts',
    description: 'Generate realistic cinematic AI video prompts for Google Veo, Runway, Luma & Sora with camera motion & lighting.',
    icon: '🎬',
    path: '/veo-prompt-builder.html',
    filename: 'veo-prompt-builder.html',
    category: '🤖 AI Prompt Builder Tools',
    badge: 'AI Tool',
    features: ['Camera Movement Sliders', 'Lighting & Frame Rates', 'Cinematic Movement Cues', 'Runway/Luma/Sora Compatible', 'Export & Copy']
  },
  {
    id: 'midjourney-prompt-builder',
    title: 'Midjourney Prompt Builder',
    navTitle: 'Midjourney Prompts',
    description: 'Build Midjourney v6 prompts with aspect ratio --ar, stylize --s, chaos --c, quality --q, version --v & negative parameters.',
    icon: '🎨',
    path: '/midjourney-prompt-builder.html',
    filename: 'midjourney-prompt-builder.html',
    category: '🤖 AI Prompt Builder Tools',
    badge: 'AI Tool',
    features: ['V6 Command Parameters', 'Aspect Ratio Selector', 'Stylize & Chaos Sliders', 'Negative Prompting (--no)', 'Ready Templates']
  },
  {
    id: 'flux-prompt-builder',
    title: 'Flux Prompt Builder',
    navTitle: 'Flux Prompts',
    description: 'Create hyperrealistic Flux1.0 AI image generator prompts for portraits, anime, photorealism, typography & architecture.',
    icon: '⚡',
    path: '/flux-prompt-builder.html',
    filename: 'flux-prompt-builder.html',
    category: '🤖 AI Prompt Builder Tools',
    badge: 'AI Tool',
    features: ['Flux Schnell & Dev Presets', 'Typography In-Image Controls', 'Photorealism Detail Sliders', 'Copy/Download Formats', 'Library Modal']
  },
  {
    id: 'stable-diffusion-prompt-builder',
    title: 'Stable Diffusion Prompt Builder',
    navTitle: 'SDXL Prompts',
    description: 'Generate positive and negative prompts for SDXL, SD 1.5, Pony & Flux with samplers, CFG scale & step recommendations.',
    icon: '🖼️',
    path: '/stable-diffusion-prompt-builder.html',
    filename: 'stable-diffusion-prompt-builder.html',
    category: '🤖 AI Prompt Builder Tools',
    badge: 'AI Tool',
    features: ['Positive & Negative Prompts', 'Sampler & CFG Recommendations', 'Pony/SDXL/SD1.5 Presets', 'Export TXT & MD', 'Favorite Manager']
  },
  {
    id: 'logo-prompt-builder',
    title: 'Logo Prompt Builder',
    navTitle: 'Logo Prompts',
    description: 'Generate vector logo prompts across Tech, Business, Medical, Finance, Gaming, Luxury & Minimalist styles.',
    icon: '🏷️',
    path: '/logo-prompt-builder.html',
    filename: 'logo-prompt-builder.html',
    category: '🤖 AI Prompt Builder Tools',
    badge: 'AI Tool',
    features: ['Industry Categories', 'Logo Style Presets', 'Vector Graphic Rules', 'Color Palette Control', 'One-Click Copy']
  },
  {
    id: 'thumbnail-prompt-builder',
    title: 'Thumbnail Prompt Builder',
    navTitle: 'Thumbnail Prompts',
    description: 'Generate high-CTR thumbnail prompts for YouTube, TikTok, Instagram & Facebook with facial hooks & bold text.',
    icon: '📺',
    path: '/thumbnail-prompt-builder.html',
    filename: 'thumbnail-prompt-builder.html',
    category: '🤖 AI Prompt Builder Tools',
    badge: 'AI Tool',
    features: ['High-CTR Hooks', 'Facial Expression Controls', 'Overlay Text Formatting', 'Platform Aspect Ratios', 'Export & Share']
  },
  {
    id: 'product-photo-prompt-builder',
    title: 'Product Photography Prompt Builder',
    navTitle: 'Product Photo Prompts',
    description: 'Generate commercial studio photography prompts for Amazon, Flipkart, luxury brands & e-commerce.',
    icon: '📸',
    path: '/product-photo-prompt-builder.html',
    filename: 'product-photo-prompt-builder.html',
    category: '🤖 AI Prompt Builder Tools',
    badge: 'AI Tool',
    features: ['Studio Lighting Options', 'Podium & Backdrop Controls', 'Camera Lens Specs', 'Commercial E-Commerce Presets', 'Copy & Download']
  },
  {
    id: 'interior-design-prompt-builder',
    title: 'Interior Design Prompt Builder',
    navTitle: 'Interior Prompts',
    description: 'Generate AI prompts for interior architecture, luxury villas, cafes, bedrooms, kitchens & modern offices.',
    icon: '🛋️',
    path: '/interior-design-prompt-builder.html',
    filename: 'interior-design-prompt-builder.html',
    category: '🤖 AI Prompt Builder Tools',
    badge: 'AI Tool',
    features: ['ArchViz Style Presets', 'Room & Furniture Options', 'Material & Lighting Sliders', 'Camera Angles', 'Export Actions']
  },
  {
    id: 'story-prompt-builder',
    title: 'Story Prompt Builder',
    navTitle: 'Story Prompts',
    description: 'Generate narrative prompts across Horror, Sci-Fi, Fantasy, Adventure, Islamic Stories, Kids Stories & Mysteries.',
    icon: '📖',
    path: '/story-prompt-builder.html',
    filename: 'story-prompt-builder.html',
    category: '🤖 AI Prompt Builder Tools',
    badge: 'AI Tool',
    features: ['Genre Archetypes', 'Protagonist Flaw Builder', 'Inciting Incident Hooks', 'Twist & Moral Controls', 'Download TXT/MD']
  },
  {
    id: 'youtube-script-prompt-builder',
    title: 'YouTube Script Prompt Builder',
    navTitle: 'Script Prompts',
    description: 'Generate scriptwriting prompts for YouTube Shorts, Long Videos, Explainers, Podcasts & Tech channels.',
    icon: '📹',
    path: '/youtube-script-prompt-builder.html',
    filename: 'youtube-script-prompt-builder.html',
    category: '🤖 AI Prompt Builder Tools',
    badge: 'AI Tool',
    features: ['Viral Hook Formulas', 'Host Persona Options', 'B-Roll & Music Cues', 'CTA Formatting', 'Library Templates']
  },
  {
    id: 'resume-prompt-builder',
    title: 'Resume Prompt Builder',
    navTitle: 'Resume Prompts',
    description: 'Generate ATS-friendly AI resume writing & job tailoring prompts using accomplishment metrics.',
    icon: '📄',
    path: '/resume-prompt-builder.html',
    filename: 'resume-prompt-builder.html',
    category: '🤖 AI Prompt Builder Tools',
    badge: 'AI Tool',
    features: ['Google XYZ Formula', 'Action Verb Tuning', 'ATS Keyword Targeting', 'Section Specific Prompts', 'One-Click Export']
  },
  {
    id: 'cover-letter-prompt-builder',
    title: 'Cover Letter Prompt Builder',
    navTitle: 'Cover Letter Prompts',
    description: 'Craft persuasive, professional AI cover letter prompts tailored to target companies & hiring managers.',
    icon: '✉️',
    path: '/cover-letter-prompt-builder.html',
    filename: 'cover-letter-prompt-builder.html',
    category: '🤖 AI Prompt Builder Tools',
    badge: 'AI Tool',
    features: ['Company Alignment Hooks', 'Value Proposition Tuning', 'Executive Tone Options', '3-Paragraph Format', 'Export & Print']
  },
  {
    id: 'email-prompt-builder',
    title: 'Email Prompt Builder',
    navTitle: 'Email Prompts',
    description: 'Generate AI prompts for business emails, cold outreach, customer support, job offers & marketing.',
    icon: '📧',
    path: '/email-prompt-builder.html',
    filename: 'email-prompt-builder.html',
    category: '🤖 AI Prompt Builder Tools',
    badge: 'AI Tool',
    features: ['Cold Outreach Formulas', 'Subject Line Generators', 'Low-Friction CTAs', 'Word Count Constraints', 'Copy & Download']
  },
  {
    id: 'social-media-prompt-builder',
    title: 'Social Media Prompt Builder',
    navTitle: 'Social Media Prompts',
    description: 'Generate viral social post prompts for Instagram, LinkedIn, TikTok, Twitter/X, Facebook & Threads.',
    icon: '📱',
    path: '/social-media-prompt-builder.html',
    filename: 'social-media-prompt-builder.html',
    category: '🤖 AI Prompt Builder Tools',
    badge: 'AI Tool',
    features: ['Multi-Platform Presets', 'Carousel & Thread Outlines', 'Pattern Interrupt Hooks', 'Hashtags & CTAs', 'Export Actions']
  },
  {
    id: 'seo-prompt-builder',
    title: 'SEO Prompt Builder',
    navTitle: 'SEO Prompts',
    description: 'Build SEO content briefs for blogs, websites, keyword research, meta titles & internal linking.',
    icon: '🔍',
    path: '/seo-prompt-builder.html',
    filename: 'seo-prompt-builder.html',
    category: '🤖 AI Prompt Builder Tools',
    badge: 'AI Tool',
    features: ['E-E-A-T Compliance Rules', 'Meta Tag Optimization', 'Search Intent Targeting', 'FAQ Schema Guidelines', 'Download Markdown']
  },
  {
    id: 'coding-prompt-builder',
    title: 'Coding Prompt Builder',
    navTitle: 'Coding Prompts',
    description: 'Generate software engineering prompts for React, Python, JS, Flutter, SQL, debugging & clean architecture.',
    icon: '💻',
    path: '/coding-prompt-builder.html',
    filename: 'coding-prompt-builder.html',
    category: '🤖 AI Prompt Builder Tools',
    badge: 'AI Tool',
    features: ['Multi-Language Presets', 'Edge Case Guardrails', 'Strict Typing Rules', 'Architecture Constraints', 'Copy Code Prompt']
  },
  {
    id: 'universal-prompt-builder',
    title: 'Universal Prompt Builder',
    navTitle: 'Universal Prompts',
    description: 'Build custom structured master prompts with Role, Goal, Context, Constraints, Format, Tone & Examples.',
    icon: '🌐',
    path: '/universal-prompt-builder.html',
    filename: 'universal-prompt-builder.html',
    category: '🤖 AI Prompt Builder Tools',
    badge: 'AI Tool',
    features: ['Custom Section Architect', 'Role & Goal Builder', 'Output Format Tuning', 'Language & Examples', 'Export TXT/MD']
  }
];

export function getTranslatedTools(lang: LanguageCode): ToolMeta[] {
  return TOOLS_DATA.map(tool => {
    let t: ToolMeta = { ...tool };
    switch (tool.id) {
      case 'splitdrop':
        t = {
          ...tool,
          title: getTranslation(lang, 'splitAndCombine', tool.title),
          navTitle: 'SplitDrop',
          description: getTranslation(lang, 'heroSubtitle', tool.description),
          category: getTranslation(lang, 'imageTools', tool.category)
        };
        break;
      case 'image-compressor':
        t = {
          ...tool,
          title: getTranslation(lang, 'imageCompressorTitle', 'Image Compressor'),
          navTitle: getTranslation(lang, 'imageCompressorNav', 'Image Compressor'),
          description: getTranslation(lang, 'compressorSubtitle', tool.description),
          category: getTranslation(lang, 'imageTools', tool.category)
        };
        break;
      case 'image-converter':
      case 'image-resizer':
      case 'crop-image':
      case 'rotate-image':
      case 'flip-image':
      case 'image-watermark':
      case 'blur-image':
      case 'pixelate-image':
      case 'exif-remover':
      case 'image-color-picker':
      case 'image-info-viewer':
        t = {
          ...tool,
          category: getTranslation(lang, 'imageToolsCategory', '🖼️ Image Tools')
        };
        break;
      case 'pdf-merge':
        t = {
          ...tool,
          title: getTranslation(lang, 'pdfMergeTitle', tool.title),
          navTitle: getTranslation(lang, 'pdfMergeTitle', tool.navTitle),
          description: getTranslation(lang, 'pdfMergeSubtitle', tool.description),
          category: getTranslation(lang, 'pdfToolsCategory', '📄 PDF Tools')
        };
        break;
      case 'pdf-split':
        t = {
          ...tool,
          title: getTranslation(lang, 'pdfSplitTitle', tool.title),
          navTitle: getTranslation(lang, 'pdfSplitTitle', tool.navTitle),
          description: getTranslation(lang, 'pdfSplitSubtitle', tool.description),
          category: getTranslation(lang, 'pdfToolsCategory', '📄 PDF Tools')
        };
        break;
      case 'image-to-pdf':
      case 'pdf-to-images':
      case 'rotate-pdf':
      case 'delete-pdf-pages':
      case 'extract-pdf-pages':
      case 'reorder-pdf-pages':
      case 'pdf-watermark':
      case 'protect-pdf':
      case 'unlock-pdf':
      case 'pdf-metadata':
        t = {
          ...tool,
          category: getTranslation(lang, 'pdfToolsCategory', '📄 PDF Tools')
        };
        break;
      case 'qr-generator':
        t = {
          ...tool,
          title: getTranslation(lang, 'qrTitle', tool.title),
          navTitle: getTranslation(lang, 'qrTitle', tool.navTitle),
          description: getTranslation(lang, 'qrSubtitle', tool.description),
          category: getTranslation(lang, 'pdfAndUtilities', tool.category)
        };
        break;
      case 'resume-builder':
      case 'ats-resume-checker':
      case 'resume-score-analyzer':
      case 'cover-letter-builder':
      case 'cover-letter-templates':
      case 'cv-builder':
      case 'resume-keyword-optimizer':
      case 'resume-template-gallery':
      case 'resume-version-manager':
      case 'resume-import':
      case 'resume-export':
      case 'resume-completeness':
      case 'resume-section-manager':
      case 'professional-skill-library':
      case 'summary-generator':
      case 'resume-color-themes':
      case 'experience-calculator':
      case 'notice-period-calculator':
      case 'salary-hike-calculator':
      case 'ctc-calculator':
      case 'working-days-calculator':
        t = {
          ...tool,
          category: getTranslation(lang, 'careerToolsCategory', '💼 Career Tools')
        };
        break;
      case 'youtube-title-generator':
      case 'youtube-description-generator':
      case 'youtube-tags-generator':
      case 'youtube-hashtag-generator':
      case 'youtube-thumbnail-preview':
      case 'youtube-channel-name-generator':
      case 'youtube-video-idea-generator':
      case 'youtube-playlist-name-generator':
      case 'youtube-timestamp-generator':
      case 'youtube-description-formatter':
      case 'thumbnail-text-generator':
      case 'viral-hook-generator':
      case 'cta-generator':
      case 'social-character-counter':
      case 'emoji-generator':
      case 'instagram-caption-generator':
      case 'instagram-hashtag-generator':
      case 'instagram-bio-generator':
      case 'instagram-username-generator':
      case 'tiktok-caption-generator':
      case 'tiktok-hashtag-generator':
      case 'facebook-caption-generator':
      case 'facebook-hashtag-generator':
      case 'linkedin-headline-generator':
      case 'linkedin-summary-generator':
      case 'twitter-bio-generator':
      case 'universal-hashtag-generator':
      case 'fancy-text-generator':
      case 'unicode-font-generator':
      case 'text-decorator':
      case 'emoji-combiner':
      case 'social-media-post-formatter':
      case 'social-bio-link-builder':
        t = {
          ...tool,
          category: getTranslation(lang, 'creatorToolsCategory', '📱 Creator & Social Media Tools')
        };
        break;
      case 'uuid-generator':
      case 'hash-generator':
      case 'jwt-decoder':
      case 'unix-timestamp-converter':
      case 'regex-tester':
      case 'json-formatter':
      case 'json-validator':
      case 'json-to-csv':
      case 'csv-to-json':
      case 'csv-viewer':
      case 'html-formatter':
      case 'css-formatter':
      case 'javascript-formatter':
      case 'xml-formatter':
      case 'xml-validator':
      case 'url-parser':
      case 'url-encoder-decoder':
      case 'base64-encoder-decoder':
      case 'html-escape-unescape':
      case 'http-header-viewer':
      case 'api-request-builder':
      case 'color-converter':
      case 'qr-code-decoder':
        t = {
          ...tool,
          category: getTranslation(lang, 'devToolsCategory', '👨‍💻 Developer Tools')
        };
        break;
      case 'css-gradient-generator':
      case 'box-shadow-generator':
      case 'border-radius-generator':
      case 'glassmorphism-generator':
      case 'neumorphism-generator':
      case 'css-clip-path-generator':
      case 'svg-shape-generator':
      case 'color-palette-generator':
      case 'contrast-checker':
      case 'random-color-generator':
      case 'qr-business-card-generator':
      case 'unit-converter':
      case 'percentage-calculator':
      case 'age-calculator':
      case 'emi-calculator':
      case 'discount-calculator':
      case 'currency-calculator':
      case 'tip-calculator':
      case 'random-number-generator':
      case 'random-password-generator':
        t = {
          ...tool,
          category: getTranslation(lang, 'designToolsCategory', '🎨 Design & Utility Tools')
        };
        break;
      case 'chatgpt-prompt-builder':
      case 'gemini-prompt-builder':
      case 'claude-prompt-builder':
      case 'veo-prompt-builder':
      case 'midjourney-prompt-builder':
      case 'flux-prompt-builder':
      case 'stable-diffusion-prompt-builder':
      case 'logo-prompt-builder':
      case 'thumbnail-prompt-builder':
      case 'product-photo-prompt-builder':
      case 'interior-design-prompt-builder':
      case 'story-prompt-builder':
      case 'youtube-script-prompt-builder':
      case 'resume-prompt-builder':
      case 'cover-letter-prompt-builder':
      case 'email-prompt-builder':
      case 'social-media-prompt-builder':
      case 'seo-prompt-builder':
      case 'coding-prompt-builder':
      case 'universal-prompt-builder':
        t = {
          ...tool,
          category: getTranslation(lang, 'promptToolsCategory', '🤖 AI Prompt Builder Tools')
        };
        break;
      case 'password-generator':
      case 'password-strength-checker':
      case 'qr-code-scanner':
      case 'barcode-scanner':
      case 'text-encrypt-decrypt':
      case 'sha-checksum-generator':
      case 'passphrase-generator':
      case 'secure-notes':
      case 'todo-list':
      case 'clipboard-history':
      case 'pomodoro-timer':
      case 'stopwatch':
      case 'countdown-timer':
      case 'habit-tracker':
      case 'expense-tracker':
      case 'monthly-budget-planner':
      case 'daily-planner':
      case 'weekly-planner':
      case 'calendar-notes':
      case 'file-checksum-verifier':
        t = {
          ...tool,
          category: getTranslation(lang, 'securityCategory', '🔒 Security, Privacy & Productivity')
        };
        break;
      default:
        break;
    }

    const { tags, trending, featured, editorsPick } = getToolTagsAndFlags(t.id, t.category);

    return {
      ...t,
      tags: t.tags || tags,
      trending: t.trending ?? trending,
      featured: t.featured ?? featured,
      editorsPick: t.editorsPick ?? editorsPick
    };
  });
}

function getToolTagsAndFlags(id: string, category: string): { tags: string[]; trending?: boolean; featured?: boolean; editorsPick?: boolean } {
  const isTrendingList = ['splitdrop', 'image-compressor', 'pdf-merge', 'resume-builder', 'youtube-title-generator', 'chatgpt-prompt-builder', 'json-formatter', 'css-gradient-generator', 'random-password-generator', 'qr-generator'];
  const isFeaturedList = ['splitdrop', 'image-converter', 'pdf-split', 'ats-resume-checker', 'instagram-caption-generator', 'gemini-prompt-builder', 'jwt-decoder', 'color-palette-generator', 'image-to-pdf'];
  const isEditorsPickList = ['splitdrop', 'crop-image', 'cover-letter-builder', 'midjourney-prompt-builder', 'unit-converter', 'qr-code-decoder', 'todo-list'];

  let tags: string[] = ['Free', 'Online', 'Tool'];
  if (category.includes('Image')) {
    tags.push('Image', 'Photo', 'Graphic', 'Converter', 'Compressor', 'Canvas', 'Design');
  } else if (category.includes('PDF')) {
    tags.push('PDF', 'Document', 'Merge', 'Split', 'Office', 'Converter', 'PDF Tools');
  } else if (category.includes('Creator')) {
    tags.push('YouTube', 'Instagram', 'TikTok', 'Creator', 'SEO', 'Social Media', 'Caption');
  } else if (category.includes('Career')) {
    tags.push('Resume', 'Career', 'CV', 'Job', 'Interview', 'ATS', 'Cover Letter');
  } else if (category.includes('Developer')) {
    tags.push('Developer', 'Coding', 'JSON', 'Formatter', 'API', 'Base64', 'Hash');
  } else if (category.includes('Design')) {
    tags.push('Design', 'CSS', 'Color', 'Palette', 'Calculator', 'UI', 'Generator');
  } else if (category.includes('Prompt')) {
    tags.push('AI', 'Prompt', 'ChatGPT', 'Midjourney', 'Gemini', 'Claude', 'Generator');
  } else {
    tags.push('Security', 'Privacy', 'Password', 'QR', 'Productivity', 'Tools');
  }

  if (id.includes('pdf')) tags.push('PDF');
  if (id.includes('image') || id.includes('photo')) tags.push('Image');
  if (id.includes('resume') || id.includes('cv')) tags.push('Resume');
  if (id.includes('youtube')) tags.push('YouTube');
  if (id.includes('prompt')) tags.push('AI');
  if (id.includes('qr')) tags.push('QR');
  if (id.includes('json')) tags.push('JSON');
  if (id.includes('password')) tags.push('Security');

  return {
    tags: Array.from(new Set(tags)),
    trending: isTrendingList.includes(id),
    featured: isFeaturedList.includes(id),
    editorsPick: isEditorsPickList.includes(id)
  };
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
