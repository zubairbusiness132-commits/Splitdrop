import { ResumeData, RoleSampleTemplate } from '../types/resume';

export const TEMPLATE_STYLES = [
  { id: 'modern', name: 'Modern', desc: 'Indigo headers, clean lines, balanced layout', category: 'Popular' },
  { id: 'executive', name: 'Executive', desc: 'Bold navy banner with golden accents', category: 'Corporate' },
  { id: 'creative', name: 'Creative', desc: 'Soft pastel borders & rounded photo badge', category: 'Design' },
  { id: 'minimal', name: 'Minimal', desc: 'Ultra-sleek typography with refined rule dividers', category: 'Minimalist' },
  { id: 'elegant', name: 'Elegant', desc: 'Serif titles and centered traditional header', category: 'Classic' },
  { id: 'corporate', name: 'Corporate', desc: 'Deep steel blue headers & multi-column metrics', category: 'Corporate' },
  { id: 'ats-clean', name: 'ATS Clean', desc: 'High compatibility ATS single-column design', category: 'ATS Friendly' },
  { id: 'professional', name: 'Professional', desc: 'Dark top header with crisp high contrast text', category: 'Popular' },
  { id: 'classic', name: 'Classic', desc: 'Traditional serif format preferred by traditional firms', category: 'Classic' },
  { id: 'blue-accent', name: 'Blue Accent', desc: 'Ocean blue section highlights & skill pills', category: 'Popular' },
  { id: 'dark', name: 'Dark', desc: 'Modern slate dark aesthetic for tech & digital roles', category: 'Modern' },
  { id: 'two-column', name: 'Two Column', desc: 'Main timeline left, contact & skills right sidebar', category: 'Sidebar' },
  { id: 'one-column', name: 'One Column', desc: 'Linear top-to-bottom layout with divider rules', category: 'ATS Friendly' },
  { id: 'simple', name: 'Simple', desc: 'Clean single font layout focusing on content density', category: 'Minimalist' },
  { id: 'bold', name: 'Bold', desc: 'Thick section titles and impactful category badges', category: 'Modern' },
  { id: 'minimal-grey', name: 'Minimal Grey', desc: 'Soft neutral grey headers with subtle borders', category: 'Minimalist' },
  { id: 'sidebar', name: 'Sidebar', desc: 'Dedicated left dark sidebar for photo, skills, links', category: 'Sidebar' },
  { id: 'modern-black', name: 'Modern Black', desc: 'Deep obsidian header with sharp cyan highlights', category: 'Modern' },
  { id: 'academic', name: 'Academic', desc: 'Research & university publication style layout', category: 'Classic' },
  { id: 'developer', name: 'Developer Resume', desc: 'Tech layout with code-like badges & GitHub links', category: 'Tech' },
];

export const ACTION_VERBS = [
  'Architected', 'Accelerated', 'Automated', 'Built', 'Championed', 'Coordinated',
  'Created', 'Delivered', 'Designed', 'Developed', 'Engineered', 'Established',
  'Expanded', 'Formulated', 'Generated', 'Implemented', 'Improved', 'Increased',
  'Initiated', 'Innovated', 'Integrated', 'Launched', 'Led', 'Managed',
  'Modernized', 'Negotiated', 'Optimized', 'Orchestrated', 'Overhauled', 'Pioneered',
  'Redesigned', 'Reduced', 'Restructured', 'Scaled', 'Spearheaded', 'Streamlined',
  'Succeeded', 'Transformed', 'Upgraded'
];

export const ATS_CHECKLIST_ITEMS = [
  { id: 'contact', title: 'Full Name & Contact Info', tip: 'Ensure email, phone, and location are visible.' },
  { id: 'summary', title: 'Targeted Professional Summary', tip: '3-4 sentences highlighting key achievements and metrics.' },
  { id: 'keywords', title: 'Role-Specific Keywords', tip: 'Include standard job skills matching the targeted job posting.' },
  { id: 'bullet_verbs', title: 'Action Verbs in Bullet Points', tip: 'Start experience bullet points with strong action verbs.' },
  { id: 'dates', title: 'Standard Date Formats', tip: 'Use standard date formats e.g., "Jan 2023 - Present".' },
  { id: 'standard_headers', title: 'Clear Section Headings', tip: 'Use standard titles like Experience, Education, Skills.' },
  { id: 'quantifiable', title: 'Quantifiable Results', tip: 'Include numbers, percentages, and revenue impact.' }
];

export const EMPTY_RESUME_DATA: Omit<ResumeData, 'id' | 'updatedAt'> = {
  name: 'My Professional Resume',
  language: 'en',
  personalInfo: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    linkedIn: '',
    gitHub: '',
    portfolio: '',
    photoUrl: '',
    summary: '',
    objective: ''
  },
  experience: [],
  education: [],
  projects: [],
  skills: [],
  languages: [],
  certifications: [],
  achievements: [],
  awards: [],
  internships: [],
  references: [],
  hobbies: [],
  customSections: [],
  sectionOrder: [
    'summary',
    'experience',
    'education',
    'skills',
    'projects',
    'languages',
    'certifications'
  ],
  styling: {
    primaryColor: '#4F46E5',
    secondaryColor: '#1E293B',
    fontFamily: 'Inter, sans-serif',
    fontSize: 'medium',
    lineHeight: 'normal',
    marginSize: 'normal',
    paperSize: 'A4',
    photoShape: 'hidden',
    layout: 'one-column',
    templateStyle: 'modern'
  },
  qrCode: {
    enabled: true,
    type: 'portfolio',
    url: '',
    label: 'Scan Profile'
  }
};

export const DEFAULT_RESUME_DATA: Omit<ResumeData, 'id' | 'updatedAt'> = {
  name: 'Sample Resume (Alex Morgan)',
  language: 'en',
  personalInfo: {
    fullName: 'Alex Morgan',
    jobTitle: 'Senior Software Engineer',
    email: 'alex.morgan@example.com',
    phone: '+1 (555) 234-5678',
    address: 'San Francisco, CA',
    website: 'https://alexmorgan.dev',
    linkedIn: 'https://linkedin.com/in/alexmorgan',
    gitHub: 'https://github.com/alexmorgan',
    portfolio: 'https://alexmorgan.dev/portfolio',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    summary: 'Results-driven Senior Software Engineer with 6+ years of experience designing scalable web applications, cloud microservices, and high-throughput APIs. Reduced latency by 40% and scaled user base to 2M+ daily active users.',
    objective: 'Seeking a Lead Frontend Engineer position to leverage expertise in React, TypeScript, and micro-frontends to deliver exceptional web products.'
  },
  experience: [
    {
      id: 'exp-1',
      title: 'Senior Software Engineer',
      company: 'TechCorp Solutions',
      location: 'San Francisco, CA',
      startDate: 'Jan 2022',
      endDate: 'Present',
      current: true,
      description: '• Architected core React/TypeScript application serving 2,000,000+ monthly active users with 99.99% uptime.\n• Spearheaded performance optimizations reducing initial bundle payload by 45% and core web vitals by 350ms.\n• Mentored 8 junior and mid-level engineers, enforcing strict CI/CD linting and unit test coverage above 90%.'
    },
    {
      id: 'exp-2',
      title: 'Software Engineer',
      company: 'Innovate Labs',
      location: 'Austin, TX',
      startDate: 'Mar 2019',
      endDate: 'Dec 2021',
      current: false,
      description: '• Developed high-throughput RESTful & GraphQL APIs in Node.js and PostgreSQL, processing 10M+ daily requests.\n• Re-architected legacy monolithic frontend into modern Vite React application, speeding up build time by 6x.\n• Partnered with UI/UX designers to implement a full accessible design system across 15 internal tools.'
    }
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'B.S. in Computer Science',
      institution: 'University of California, Berkeley',
      location: 'Berkeley, CA',
      startDate: 'Sep 2015',
      endDate: 'May 2019',
      grade: '3.8 / 4.0 GPA',
      description: 'Relevant Coursework: Data Structures, Algorithms, Distributed Systems, Software Engineering, Database Systems.'
    }
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'Cloud Canvas Studio',
      subtitle: 'Real-time Collaborative Whiteboard',
      link: 'https://github.com/alexmorgan/cloud-canvas',
      technologies: 'React, TypeScript, WebSockets, Canvas API, Tailwind CSS',
      description: 'Built a real-time vector whiteboard engine supporting sub-20ms multi-user cursor sync and SVG/PNG export.'
    }
  ],
  skills: [
    { id: 's-1', name: 'React / Next.js', level: 5, category: 'Frontend' },
    { id: 's-2', name: 'TypeScript / JavaScript', level: 5, category: 'Languages' },
    { id: 's-3', name: 'Node.js / Express', level: 4, category: 'Backend' },
    { id: 's-4', name: 'Tailwind CSS / UI Design', level: 5, category: 'Frontend' },
    { id: 's-5', name: 'PostgreSQL / GraphQL', level: 4, category: 'Database' },
    { id: 's-6', name: 'Docker / CI/CD / AWS', level: 4, category: 'DevOps' }
  ],
  languages: [
    { id: 'l-1', language: 'English', proficiency: 'Native / Fluent' },
    { id: 'l-2', language: 'Spanish', proficiency: 'Professional Working' }
  ],
  certifications: [
    {
      id: 'c-1',
      title: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services',
      date: '2023',
      url: 'https://aws.amazon.com'
    }
  ],
  achievements: [
    {
      id: 'ach-1',
      title: '1st Place Winner - Global Tech Hackathon 2023',
      date: 'Nov 2023',
      description: 'Awarded first place among 150+ teams for building an AI-powered code accessibility validator.'
    }
  ],
  awards: [
    {
      id: 'aw-1',
      title: 'Engineering Leadership Excellence Award',
      organization: 'TechCorp Solutions',
      date: '2023'
    }
  ],
  internships: [
    {
      id: 'in-1',
      role: 'Frontend Engineering Intern',
      company: 'WebSphere Inc.',
      date: 'Jun 2018 - Aug 2018',
      description: 'Designed interactive analytics chart dashboards using D3.js and React.'
    }
  ],
  references: [
    {
      id: 'ref-1',
      name: 'Sarah Jenkins',
      title: 'VP of Engineering',
      company: 'TechCorp Solutions',
      contact: 'sarah.j@techcorp.example.com'
    }
  ],
  hobbies: ['Open Source Contributing', 'Technical Writing', 'Chess', 'Marathon Running'],
  customSections: [],
  sectionOrder: [
    'personal',
    'summary',
    'experience',
    'education',
    'projects',
    'skills',
    'languages',
    'certifications',
    'achievements',
    'awards',
    'internships',
    'references',
    'hobbies'
  ],
  styling: {
    primaryColor: '#4F46E5', // Indigo
    secondaryColor: '#1E293B', // Slate dark
    fontFamily: 'Inter, sans-serif',
    fontSize: 'medium',
    lineHeight: 'normal',
    marginSize: 'normal',
    paperSize: 'A4',
    photoShape: 'round',
    layout: 'one-column',
    templateStyle: 'modern'
  },
  qrCode: {
    enabled: true,
    type: 'portfolio',
    url: 'https://alexmorgan.dev',
    label: 'Scan for Portfolio'
  }
};

export const SAMPLE_RESUME_DATA = DEFAULT_RESUME_DATA;

export const SAMPLE_ROLE_TEMPLATES: RoleSampleTemplate[] = [
  {
    id: 'software-engineer',
    roleTitle: 'Software Engineer',
    category: 'Technology',
    data: { ...DEFAULT_RESUME_DATA }
  },
  {
    id: 'graphic-designer',
    roleTitle: 'Graphic Designer',
    category: 'Design & Creative',
    data: {
      ...DEFAULT_RESUME_DATA,
      name: 'Graphic Designer Sample',
      personalInfo: {
        ...DEFAULT_RESUME_DATA.personalInfo,
        fullName: 'Elena Rostova',
        jobTitle: 'Senior Graphic Designer & Brand Strategist',
        summary: 'Creative Graphic Designer with 7+ years of experience transforming brand identities, typography, and visual assets across digital & print media. Generated over $1.2M in client campaign revenue.',
        objective: 'Seeking a Creative Director role to lead brand visual strategy and innovative design systems.'
      },
      skills: [
        { id: 's1', name: 'Adobe Photoshop / Illustrator', level: 5, category: 'Design Tools' },
        { id: 's2', name: 'Figma / Brand Guidelines', level: 5, category: 'UI/Visual' },
        { id: 's3', name: 'Typography & Motion Graphics', level: 4, category: 'Creative' },
        { id: 's4', name: 'InDesign & Print Production', level: 5, category: 'Print' }
      ],
      styling: {
        ...DEFAULT_RESUME_DATA.styling,
        primaryColor: '#EC4899',
        templateStyle: 'creative'
      }
    }
  },
  {
    id: 'ui-ux-designer',
    roleTitle: 'UI UX Designer',
    category: 'Design & Creative',
    data: {
      ...DEFAULT_RESUME_DATA,
      name: 'UI UX Designer Sample',
      personalInfo: {
        ...DEFAULT_RESUME_DATA.personalInfo,
        fullName: 'Marcus Vance',
        jobTitle: 'Product UI/UX Designer',
        summary: 'User-centered Product Designer specialized in user research, wireframing, high-fidelity prototyping, and design systems. Boosted checkout conversion rates by 28%.',
        objective: 'Looking for a Lead Product Designer position at a high-growth SaaS startup.'
      },
      styling: {
        ...DEFAULT_RESUME_DATA.styling,
        primaryColor: '#0EA5E9',
        templateStyle: 'modern'
      }
    }
  },
  {
    id: 'teacher',
    roleTitle: 'Teacher',
    category: 'Education',
    data: {
      ...DEFAULT_RESUME_DATA,
      name: 'Teacher Sample',
      personalInfo: {
        ...DEFAULT_RESUME_DATA.personalInfo,
        fullName: 'Rachel Green, M.Ed.',
        jobTitle: 'High School Mathematics Educator',
        summary: 'Passionate Mathematics Educator with 8 years of classroom experience. Increased student standardized test scores by 22% through interactive STEM problem-solving models.',
      },
      styling: {
        ...DEFAULT_RESUME_DATA.styling,
        primaryColor: '#059669',
        templateStyle: 'classic'
      }
    }
  },
  {
    id: 'doctor',
    roleTitle: 'Doctor',
    category: 'Healthcare',
    data: {
      ...DEFAULT_RESUME_DATA,
      name: 'Medical Doctor Sample',
      personalInfo: {
        ...DEFAULT_RESUME_DATA.personalInfo,
        fullName: 'Dr. Jonathan Miller, M.D.',
        jobTitle: 'Attending Physician - Internal Medicine',
        summary: 'Board-certified Internal Medicine Physician with 9+ years delivering acute patient care, diagnostic precision, and clinical team leadership in university medical centers.',
      },
      styling: {
        ...DEFAULT_RESUME_DATA.styling,
        primaryColor: '#0284C7',
        templateStyle: 'academic'
      }
    }
  },
  {
    id: 'lawyer',
    roleTitle: 'Lawyer',
    category: 'Legal',
    data: {
      ...DEFAULT_RESUME_DATA,
      name: 'Corporate Attorney Sample',
      personalInfo: {
        ...DEFAULT_RESUME_DATA.personalInfo,
        fullName: 'Victoria Sterling, J.D.',
        jobTitle: 'Corporate & M&A Associate Attorney',
        summary: 'Strategic Attorney with 6+ years managing cross-border M&A transactions, commercial contracts, corporate governance, and regulatory compliance valued above $500M.',
      },
      styling: {
        ...DEFAULT_RESUME_DATA.styling,
        primaryColor: '#334155',
        templateStyle: 'executive'
      }
    }
  },
  {
    id: 'marketing-manager',
    roleTitle: 'Marketing Manager',
    category: 'Marketing',
    data: {
      ...DEFAULT_RESUME_DATA,
      name: 'Marketing Manager Sample',
      personalInfo: {
        ...DEFAULT_RESUME_DATA.personalInfo,
        fullName: 'David Hayes',
        jobTitle: 'Senior Growth Marketing Manager',
        summary: 'Data-driven Growth Marketer managing $3M+ annual advertising budgets across Paid Social, Search, and Lifecycle email campaigns. Generated 140% YoY ROI expansion.',
      },
      styling: {
        ...DEFAULT_RESUME_DATA.styling,
        primaryColor: '#2563EB',
        templateStyle: 'corporate'
      }
    }
  },
  {
    id: 'digital-marketer',
    roleTitle: 'Digital Marketer',
    category: 'Marketing',
    data: {
      ...DEFAULT_RESUME_DATA,
      name: 'Digital Marketer Sample',
      personalInfo: {
        ...DEFAULT_RESUME_DATA.personalInfo,
        fullName: 'Samantha Cox',
        jobTitle: 'SEO & Performance Marketing Specialist',
        summary: 'Specialist in SEO content optimization, Google Ads PPC campaigns, and analytics funnel tracking. Grew organic traffic by 300K monthly visits in 12 months.',
      },
      styling: {
        ...DEFAULT_RESUME_DATA.styling,
        primaryColor: '#D97706',
        templateStyle: 'blue-accent'
      }
    }
  },
  {
    id: 'sales-executive',
    roleTitle: 'Sales Executive',
    category: 'Sales',
    data: {
      ...DEFAULT_RESUME_DATA,
      name: 'Sales Executive Sample',
      personalInfo: {
        ...DEFAULT_RESUME_DATA.personalInfo,
        fullName: 'Robert Thorne',
        jobTitle: 'Enterprise Account Executive',
        summary: 'High-performing Enterprise Sales Leader exceeding annual quota by 140% average across SaaS B2B accounts. Closed over $8.5M in ARR over 5 years.',
      },
      styling: {
        ...DEFAULT_RESUME_DATA.styling,
        primaryColor: '#16A34A',
        templateStyle: 'bold'
      }
    }
  },
  {
    id: 'customer-support',
    roleTitle: 'Customer Support',
    category: 'Support',
    data: {
      ...DEFAULT_RESUME_DATA,
      name: 'Customer Support Lead Sample',
      personalInfo: {
        ...DEFAULT_RESUME_DATA.personalInfo,
        fullName: 'Emily Watson',
        jobTitle: 'Customer Success & Support Manager',
        summary: 'Empathetic Customer Success Lead maintaining 98% CSAT across 50,000+ support tickets. Scaled team documentation and reduced resolution time by 35%.',
      },
      styling: {
        ...DEFAULT_RESUME_DATA.styling,
        primaryColor: '#0891B2',
        templateStyle: 'simple'
      }
    }
  },
  {
    id: 'civil-engineer',
    roleTitle: 'Civil Engineer',
    category: 'Engineering',
    data: {
      ...DEFAULT_RESUME_DATA,
      name: 'Civil Engineer Sample',
      personalInfo: {
        ...DEFAULT_RESUME_DATA.personalInfo,
        fullName: 'Michael Chang, P.E.',
        jobTitle: 'Senior Infrastructure Civil Engineer',
        summary: 'Licensed Professional Engineer (PE) leading structural design and municipal bridge construction projects. Managed civil projects with budgets exceeding $45M.',
      },
      styling: {
        ...DEFAULT_RESUME_DATA.styling,
        primaryColor: '#475569',
        templateStyle: 'professional'
      }
    }
  },
  {
    id: 'mechanical-engineer',
    roleTitle: 'Mechanical Engineer',
    category: 'Engineering',
    data: {
      ...DEFAULT_RESUME_DATA,
      name: 'Mechanical Engineer Sample',
      personalInfo: {
        ...DEFAULT_RESUME_DATA.personalInfo,
        fullName: 'Benjamin Ross',
        jobTitle: 'Senior Mechanical Hardware Engineer',
        summary: 'Hardware engineer with expertise in CAD modeling (SolidWorks), finite element analysis (FEA), and thermal simulation for aerospace components.',
      },
      styling: {
        ...DEFAULT_RESUME_DATA.styling,
        primaryColor: '#DC2626',
        templateStyle: 'two-column'
      }
    }
  },
  {
    id: 'electrical-engineer',
    roleTitle: 'Electrical Engineer',
    category: 'Engineering',
    data: {
      ...DEFAULT_RESUME_DATA,
      name: 'Electrical Engineer Sample',
      personalInfo: {
        ...DEFAULT_RESUME_DATA.personalInfo,
        fullName: 'Laura Croft',
        jobTitle: 'Embedded Systems Electrical Engineer',
        summary: 'PCB layout & embedded systems specialist designing low-power microcontroller boards and wireless IoT sensors for automotive applications.',
      },
      styling: {
        ...DEFAULT_RESUME_DATA.styling,
        primaryColor: '#7C3AED',
        templateStyle: 'sidebar'
      }
    }
  },
  {
    id: 'student-resume',
    roleTitle: 'Student Resume',
    category: 'Students & Freshers',
    data: {
      ...DEFAULT_RESUME_DATA,
      name: 'Computer Science Student Resume',
      personalInfo: {
        ...DEFAULT_RESUME_DATA.personalInfo,
        fullName: 'Ethan Hunt',
        jobTitle: 'Computer Science Undergraduate',
        summary: 'High-achieving Computer Science Senior (GPA 3.9/4.0) seeking an entry-level software developer position. Winner of 2 university hackathons with strong Java & Python skills.',
      },
      styling: {
        ...DEFAULT_RESUME_DATA.styling,
        primaryColor: '#2563EB',
        templateStyle: 'ats-clean'
      }
    }
  },
  {
    id: 'fresher-resume',
    roleTitle: 'Fresher Resume',
    category: 'Students & Freshers',
    data: {
      ...DEFAULT_RESUME_DATA,
      name: 'Graduate Fresher Resume',
      personalInfo: {
        ...DEFAULT_RESUME_DATA.personalInfo,
        fullName: 'Priya Sharma',
        jobTitle: 'Graduate Business Analyst',
        summary: 'Recent Honors Business Administration graduate with hands-on internship experience in data visualization, Excel financial modeling, and SQL database queries.',
      },
      styling: {
        ...DEFAULT_RESUME_DATA.styling,
        primaryColor: '#4F46E5',
        templateStyle: 'minimal-grey'
      }
    }
  },
  {
    id: 'intern-resume',
    roleTitle: 'Intern Resume',
    category: 'Students & Freshers',
    data: {
      ...DEFAULT_RESUME_DATA,
      name: 'Summer Intern Resume',
      personalInfo: {
        ...DEFAULT_RESUME_DATA.personalInfo,
        fullName: 'Lucas Bennett',
        jobTitle: 'Marketing & Content Intern',
        summary: 'Enthusiastic Communications major seeking a Summer Marketing Internship. Experience managing social media accounts with over 25k followers and writing tech articles.',
      },
      styling: {
        ...DEFAULT_RESUME_DATA.styling,
        primaryColor: '#059669',
        templateStyle: 'one-column'
      }
    }
  },
  {
    id: 'project-manager',
    roleTitle: 'Project Manager',
    category: 'Management',
    data: {
      ...DEFAULT_RESUME_DATA,
      name: 'Technical Project Manager Sample',
      personalInfo: {
        ...DEFAULT_RESUME_DATA.personalInfo,
        fullName: 'Diana Prince, PMP',
        jobTitle: 'Senior Agile Project Manager',
        summary: 'PMP-certified Senior Project Manager with 8+ years leading cross-functional software teams, Agile Scrum sprints, and enterprise IT deployments delivering on-time and under budget.',
      },
      styling: {
        ...DEFAULT_RESUME_DATA.styling,
        primaryColor: '#1E293B',
        templateStyle: 'executive'
      }
    }
  },
  {
    id: 'hr-resume',
    roleTitle: 'HR Resume',
    category: 'Human Resources',
    data: {
      ...DEFAULT_RESUME_DATA,
      name: 'HR Specialist Sample',
      personalInfo: {
        ...DEFAULT_RESUME_DATA.personalInfo,
        fullName: 'Jessica Taylor',
        jobTitle: 'Human Resources & Talent Acquisition Manager',
        summary: 'Strategic HR Partner managing talent acquisition, employee onboarding, benefits administration, and company culture for 400+ employee organization.',
      },
      styling: {
        ...DEFAULT_RESUME_DATA.styling,
        primaryColor: '#9333EA',
        templateStyle: 'modern'
      }
    }
  },
  {
    id: 'business-analyst',
    roleTitle: 'Business Analyst',
    category: 'Analytics',
    data: {
      ...DEFAULT_RESUME_DATA,
      name: 'Business Analyst Sample',
      personalInfo: {
        ...DEFAULT_RESUME_DATA.personalInfo,
        fullName: 'Kevin Patel',
        jobTitle: 'Senior Business Intelligence Analyst',
        summary: 'Analytical Business Analyst specializing in requirements gathering, process modeling, SQL reporting, and Tableau dashboard builds. Uncovered $1.5M in cost efficiencies.',
      },
      styling: {
        ...DEFAULT_RESUME_DATA.styling,
        primaryColor: '#0369A1',
        templateStyle: 'ats-clean'
      }
    }
  },
  {
    id: 'accountant',
    roleTitle: 'Accountant',
    category: 'Finance',
    data: {
      ...DEFAULT_RESUME_DATA,
      name: 'CPA Accountant Sample',
      personalInfo: {
        ...DEFAULT_RESUME_DATA.personalInfo,
        fullName: 'Thomas Wright, CPA',
        jobTitle: 'Senior Corporate Accountant',
        summary: 'Certified Public Accountant (CPA) with 7 years managing general ledgers, tax auditing, GAAP compliance, and financial statement audits for Big 4 clients.',
      },
      styling: {
        ...DEFAULT_RESUME_DATA.styling,
        primaryColor: '#0F766E',
        templateStyle: 'classic'
      }
    }
  },
  {
    id: 'content-writer',
    roleTitle: 'Content Writer',
    category: 'Creative',
    data: {
      ...DEFAULT_RESUME_DATA,
      name: 'Content Copywriter Sample',
      personalInfo: {
        ...DEFAULT_RESUME_DATA.personalInfo,
        fullName: 'Chloe Dupont',
        jobTitle: 'Senior Content Strategist & Copywriter',
        summary: 'Versatile Copywriter crafting high-converting landing page copy, long-form SEO articles, and brand storytelling for B2B SaaS brands. 50M+ total words published.',
      },
      styling: {
        ...DEFAULT_RESUME_DATA.styling,
        primaryColor: '#BE185D',
        templateStyle: 'creative'
      }
    }
  },
  {
    id: 'video-editor',
    roleTitle: 'Video Editor',
    category: 'Media',
    data: {
      ...DEFAULT_RESUME_DATA,
      name: 'Video Editor Sample',
      personalInfo: {
        ...DEFAULT_RESUME_DATA.personalInfo,
        fullName: 'Jordan Lee',
        jobTitle: 'Senior Video Editor & Motion Artist',
        summary: 'Creative Video Editor experienced in Premiere Pro, After Effects, and DaVinci Resolve. Edited commercials and YouTube campaigns generating 100M+ organic views.',
      },
      styling: {
        ...DEFAULT_RESUME_DATA.styling,
        primaryColor: '#E11D48',
        templateStyle: 'dark'
      }
    }
  },
  {
    id: 'social-media-manager',
    roleTitle: 'Social Media Manager',
    category: 'Marketing',
    data: {
      ...DEFAULT_RESUME_DATA,
      name: 'Social Media Manager Sample',
      personalInfo: {
        ...DEFAULT_RESUME_DATA.personalInfo,
        fullName: 'Hannah Abbott',
        jobTitle: 'Head of Social Media & Community',
        summary: 'Social Media Strategist growing brand channels across TikTok, Instagram, and LinkedIn to 1.5M total engaged followers. Viral video campaign creator.',
      },
      styling: {
        ...DEFAULT_RESUME_DATA.styling,
        primaryColor: '#EC4899',
        templateStyle: 'modern'
      }
    }
  },
  {
    id: 'data-analyst',
    roleTitle: 'Data Analyst',
    category: 'Data Science',
    data: {
      ...DEFAULT_RESUME_DATA,
      name: 'Data Analyst Sample',
      personalInfo: {
        ...DEFAULT_RESUME_DATA.personalInfo,
        fullName: 'Rohan Gupta',
        jobTitle: 'Senior Data & Insights Analyst',
        summary: 'Data Analyst skilled in SQL, Python (Pandas/NumPy), PowerBI, and A/B testing statistical modeling. Translated raw customer telemetry into actionable retention strategies.',
      },
      styling: {
        ...DEFAULT_RESUME_DATA.styling,
        primaryColor: '#0284C7',
        templateStyle: 'ats-clean'
      }
    }
  },
  {
    id: 'data-scientist',
    roleTitle: 'Data Scientist',
    category: 'Data Science',
    data: {
      ...DEFAULT_RESUME_DATA,
      name: 'Data Scientist Sample',
      personalInfo: {
        ...DEFAULT_RESUME_DATA.personalInfo,
        fullName: 'Dr. Evelyn Carter',
        jobTitle: 'Lead Machine Learning Data Scientist',
        summary: 'Ph.D. Data Scientist developing machine learning recommendation algorithms, natural language processing models, and predictive analytics pipelines in PyTorch & Scikit-Learn.',
      },
      styling: {
        ...DEFAULT_RESUME_DATA.styling,
        primaryColor: '#6366F1',
        templateStyle: 'developer'
      }
    }
  },
  {
    id: 'ai-engineer',
    roleTitle: 'AI Engineer',
    category: 'Technology',
    data: {
      ...DEFAULT_RESUME_DATA,
      name: 'AI Engineer Sample',
      personalInfo: {
        ...DEFAULT_RESUME_DATA.personalInfo,
        fullName: 'Viktor Vance',
        jobTitle: 'Senior AI / LLM Application Engineer',
        summary: 'AI Engineer building agentic workflows, RAG knowledge graph retrieval systems, fine-tuning open source LLMs (Llama/Mistral), and deploying low-latency AI inference endpoints on Kubernetes.',
      },
      styling: {
        ...DEFAULT_RESUME_DATA.styling,
        primaryColor: '#10B981',
        templateStyle: 'modern-black'
      }
    }
  },
  {
    id: 'devops-engineer',
    roleTitle: 'DevOps Engineer',
    category: 'Technology',
    data: {
      ...DEFAULT_RESUME_DATA,
      name: 'DevOps & Cloud Engineer Sample',
      personalInfo: {
        ...DEFAULT_RESUME_DATA.personalInfo,
        fullName: 'Gareth Vance',
        jobTitle: 'Senior Site Reliability & DevOps Engineer',
        summary: 'DevOps Architect automating cloud infrastructure with Terraform, Kubernetes, Ansible, AWS, and GitHub Actions CI/CD pipelines ensuring 99.999% high availability.',
      },
      styling: {
        ...DEFAULT_RESUME_DATA.styling,
        primaryColor: '#F59E0B',
        templateStyle: 'developer'
      }
    }
  }
];

export const SUMMARY_SUGGESTIONS: Record<string, string[]> = {
  software: [
    'Results-driven Software Engineer with 5+ years of experience designing scalable web applications, REST APIs, and microservices. Reduced latency by 40% and scaled user base to 2M+ active users.',
    'Full-Stack Developer passionate about clean code, unit testing, and modern frontend frameworks like React and TypeScript. Proven track record delivering complex SaaS platforms on deadline.',
    'Backend Engineer specializing in Node.js, Python, PostgreSQL, and AWS cloud architecture. Built high-throughput microservices handling 10M+ daily events with 99.99% uptime.'
  ],
  design: [
    'Creative Product UI/UX Designer with 6+ years transforming user research into beautiful, accessible web and mobile interfaces. Increased user retention by 32% through modern design systems.',
    'Senior Graphic Designer skilled in brand visual identity, typography, Figma, and Adobe Creative Suite. Delivered 100+ successful marketing campaigns for global brands.',
    'Visual & Motion Designer crafting engaging brand assets, interactive prototypes, and UI animations that double user engagement.'
  ],
  marketing: [
    'Data-driven Growth Marketing Manager managing $2M+ annual budgets across Paid Social, SEO, and Email. Increased organic traffic by 250% YoY and boosted customer LTV by 40%.',
    'Performance Marketer experienced in Google Ads, Meta Ads, funnel conversion optimization, and marketing automation tools. Generated $5M+ in measurable ROI.',
    'Content Marketing Manager with a track record of driving brand authority through SEO blog posts, video scripts, and viral social media campaigns.'
  ],
  general: [
    'Dedicated and detail-oriented professional with a strong background in problem-solving, cross-functional collaboration, and project execution. Proven capability to achieve high performance targets.',
    'Adaptable team player with strong leadership skills and a track record of delivering impactful results in fast-paced workplace environments.'
  ]
};
