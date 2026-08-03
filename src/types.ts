export type ToolId = 
  | 'splitdrop' 
  | 'image-compressor' 
  | 'image-converter' 
  | 'pdf-merge' 
  | 'pdf-split' 
  | 'qr-generator';

export interface ToolMeta {
  id: ToolId;
  title: string;
  navTitle: string;
  description: string;
  icon: string;
  path: string;
  filename: string;
  category: 'Image Tools' | 'PDF Tools' | 'Generators';
  badge?: string;
  features: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
}
