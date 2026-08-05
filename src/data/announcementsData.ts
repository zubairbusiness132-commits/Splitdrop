export interface AnnouncementItem {
  id: string;
  icon?: string;
  text: string;
  badge?: string;
  badgeColor?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'violet' | 'blue';
  link?: string;
  isNew?: boolean;
}

export interface AnnouncementConfig {
  topTickerSpeedSeconds?: number;
  bottomTickerSpeedSeconds?: number;
  topMessages: AnnouncementItem[];
  bottomMessages: AnnouncementItem[];
  latestUpdates: AnnouncementItem[];
}

export const ANNOUNCEMENTS_CONFIG: AnnouncementConfig = {
  topTickerSpeedSeconds: 36,
  bottomTickerSpeedSeconds: 42,
  
  // Top Announcement Bar Ticker Items (Positioned above Navigation Bar)
  topMessages: [
    {
      id: 'top-1',
      icon: '🚀',
      badge: 'NEW',
      badgeColor: 'rose',
      text: 'Resume Builder is now available • 100% Free • No Sign-up • Browser Based • ATS Friendly • PDF Export • Works Offline',
      link: '/resume-builder',
      isNew: true,
    },
    {
      id: 'top-2',
      icon: '🔒',
      badge: 'PRIVACY FIRST',
      badgeColor: 'emerald',
      text: '100% Private • Files Never Leave Your Device • Zero Server Uploads • Fast Client Processing',
    },
    {
      id: 'top-3',
      icon: '⚡',
      badge: 'FREE TOOLS',
      badgeColor: 'indigo',
      text: 'Image Splitter • Batch Image Compressor • Image Format Converter • PDF Merge & Split • QR Generator',
      link: '/',
    },
    {
      id: 'top-4',
      icon: '✨',
      badge: 'COMING SOON',
      badgeColor: 'violet',
      text: 'AI Cover Letter Generator & Smart Document Tools Coming Soon',
    },
  ],

  // Bottom Announcement Bar Ticker Items (Positioned above Footer)
  bottomMessages: [
    {
      id: 'bot-1',
      icon: '⭐',
      text: 'Image Splitter',
      link: '/splitdrop',
    },
    {
      id: 'bot-2',
      icon: '🖼️',
      text: 'Image Combiner',
      link: '/splitdrop',
    },
    {
      id: 'bot-3',
      icon: '🗜️',
      text: 'Image Compressor',
      link: '/image-compressor',
    },
    {
      id: 'bot-4',
      icon: '🔄',
      text: 'Image Converter',
      link: '/image-converter',
    },
    {
      id: 'bot-5',
      icon: '🧩',
      text: 'PDF Merge',
      link: '/pdf-merge',
    },
    {
      id: 'bot-6',
      icon: '✂️',
      text: 'PDF Split',
      link: '/pdf-split',
    },
    {
      id: 'bot-7',
      icon: '💼',
      text: 'Resume Builder',
      link: '/resume-builder',
    },
    {
      id: 'bot-8',
      icon: '📱',
      text: 'QR Generator',
      link: '/qr-generator',
    },
    {
      id: 'bot-9',
      icon: '🌐',
      text: 'Browser-Based',
    },
    {
      id: 'bot-10',
      icon: '🔒',
      text: 'Privacy First',
    },
  ],

  // Latest Updates Stream (Dynamically configurable stream)
  latestUpdates: [
    {
      id: 'update-1',
      icon: '🆕',
      text: 'Resume Builder launched with Live ATS Templates & PDF Export',
      link: '/resume-builder',
      isNew: true,
    },
    {
      id: 'update-2',
      icon: '🌐',
      text: 'Multi-language support added across all tools',
    },
    {
      id: 'update-3',
      icon: '⚡',
      text: 'Faster client-side PDF processing engine',
    },
    {
      id: 'update-4',
      icon: '📄',
      text: 'New ATS templates & layout customization added',
      link: '/resume-builder',
    },
    {
      id: 'update-5',
      icon: '🔜',
      text: 'AI Cover Letter Generator coming soon',
    },
  ],
};
