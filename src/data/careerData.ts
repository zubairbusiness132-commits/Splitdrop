import { ResumeData } from '../types/resume';

export interface CoverLetterData {
  id: string;
  name: string;
  templateId: string;
  updatedAt: number;
  personalInfo: {
    fullName: string;
    jobTitle: string;
    email: string;
    phone: string;
    address: string;
    linkedIn?: string;
  };
  recipientInfo: {
    hiringManagerName: string;
    companyName: string;
    companyAddress: string;
    jobTitleApplied: string;
    date: string;
  };
  sections: {
    greeting: string;
    introduction: string;
    experience: string;
    skills: string;
    achievements: string;
    closing: string;
  };
}

export interface SkillCategoryData {
  category: string;
  skills: { name: string; level: number; description: string }[];
}

export interface SummaryTemplatePreset {
  id: string;
  role: string;
  category: string;
  options: {
    title: string;
    text: string;
    style: 'formal' | 'impact' | 'creative' | 'technical';
  }[];
}

export interface CareerColorTheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  bg: string;
  text: string;
  tag: string;
}

export const CAREER_COLOR_THEMES: CareerColorTheme[] = [
  { id: 'corporate-navy', name: 'Corporate Navy', primary: '#1E3A8A', secondary: '#3B82F6', bg: '#F8FAFC', text: '#0F172A', tag: 'Corporate' },
  { id: 'emerald-growth', name: 'Emerald Green', primary: '#065F46', secondary: '#10B981', bg: '#F0FDF4', text: '#064E3B', tag: 'Modern' },
  { id: 'ocean-blue', name: 'Ocean Blue', primary: '#0284C7', secondary: '#38BDF8', bg: '#F0F9FF', text: '#0C4A6E', tag: 'Popular' },
  { id: 'royal-purple', name: 'Royal Purple', primary: '#581C87', secondary: '#A855F7', bg: '#FAF5FF', text: '#3B0764', tag: 'Creative' },
  { id: 'minimal-slate', name: 'Minimal Slate', primary: '#334155', secondary: '#64748B', bg: '#F8FAFC', text: '#0F172A', tag: 'Minimal' },
  { id: 'obsidian-black', name: 'Obsidian Black', primary: '#000000', secondary: '#404040', bg: '#FAFAFA', text: '#171717', tag: 'Classic' },
  { id: 'ruby-executive', name: 'Ruby Executive', primary: '#881337', secondary: '#E11D48', bg: '#FFF1F2', text: '#4C0519', tag: 'Executive' },
  { id: 'sunset-amber', name: 'Sunset Amber', primary: '#78350F', secondary: '#F59E0B', bg: '#FFFBEB', text: '#451A03', tag: 'Creative' },
  { id: 'teal-innovator', name: 'Teal Innovator', primary: '#115E59', secondary: '#14B8A6', bg: '#F0FDFA', text: '#042F2E', tag: 'Tech' },
  { id: 'rose-gold', name: 'Rose Gold', primary: '#9F1239', secondary: '#FB7185', bg: '#FFF1F2', text: '#4C0519', tag: 'Design' }
];

export const SKILL_LIBRARY: SkillCategoryData[] = [
  {
    category: 'Programming & Tech',
    skills: [
      { name: 'JavaScript / TypeScript', level: 90, description: 'ES6+, async programming, type safety, Node.js & React' },
      { name: 'React.js / Next.js', level: 92, description: 'Component architecture, Hooks, Context, SSR, Redux' },
      { name: 'Node.js & Express', level: 88, description: 'REST APIs, GraphQL, microservices, authentication' },
      { name: 'Python & Django/FastAPI', level: 85, description: 'Backend development, data processing, automation, ML' },
      { name: 'SQL & Database Design', level: 86, description: 'PostgreSQL, MySQL, query optimization, ORM tools' },
      { name: 'MongoDB / NoSQL', level: 82, description: 'Document stores, aggregations, schema design' },
      { name: 'Docker & Kubernetes', level: 80, description: 'Containerization, orchestration, CI/CD pipelines' },
      { name: 'AWS / Cloud Infrastructure', level: 78, description: 'EC2, S3, Lambda, CloudFront, IAM security' },
      { name: 'Git & Version Control', level: 95, description: 'Branching strategies, PR reviews, merge resolution' },
      { name: 'Java / Spring Boot', level: 80, description: 'Enterprise Java, OOP design patterns, security' },
      { name: 'C# / .NET Core', level: 78, description: 'Cross-platform backend services, Web API' },
      { name: 'System Architecture', level: 84, description: 'Scalability, microservices, caching, load balancing' }
    ]
  },
  {
    category: 'Design & UX',
    skills: [
      { name: 'Figma & UI Design', level: 92, description: 'Design systems, auto-layout, wireframes, component libraries' },
      { name: 'User Research & Testing', level: 88, description: 'Usability testing, interviews, persona creation' },
      { name: 'Adobe Creative Suite', level: 85, description: 'Photoshop, Illustrator, InDesign, Premiere Pro' },
      { name: 'Design Systems', level: 90, description: 'Tokens, accessibility standards (WCAG 2.1), pattern libraries' },
      { name: 'Wireframing & Prototyping', level: 88, description: 'Interactive prototypes, user flows, micro-interactions' },
      { name: 'Design Thinking', level: 86, description: 'Problem definition, ideation, iterative rapid testing' },
      { name: 'Information Architecture', level: 84, description: 'Sitemaps, navigation hierarchies, content structuring' }
    ]
  },
  {
    category: 'Marketing & Content',
    skills: [
      { name: 'SEO & Content Optimization', level: 88, description: 'On-page SEO, technical audits, keyword research' },
      { name: 'Google Analytics 4 & Tag Manager', level: 85, description: 'Custom events, funnels, attribution modelling' },
      { name: 'Copywriting & Content Strategy', level: 90, description: 'Engaging headlines, landing page copy, email campaigns' },
      { name: 'Social Media Strategy', level: 86, description: 'Growth tactics, community engagement, brand voice' },
      { name: 'Performance Marketing (PPC)', level: 82, description: 'Google Ads, Meta Ads, campaign ROI tracking' },
      { name: 'Email Marketing & Automation', level: 84, description: 'Klaviyo, Mailchimp, drip campaigns, segmentation' }
    ]
  },
  {
    category: 'Finance & Accounting',
    skills: [
      { name: 'Financial Modeling & Forecasting', level: 90, description: 'DCF valuation, 3-statement modeling, scenario planning' },
      { name: 'QuickBooks & Xero', level: 88, description: 'General ledger, accounts payable/receivable, reconciliations' },
      { name: 'Budgeting & Variance Analysis', level: 86, description: 'CAPEX/OPEX tracking, cost reduction strategies' },
      { name: 'Tax Compliance & Reporting', level: 84, description: 'Corporate tax preparation, audit readiness, VAT/GST' },
      { name: 'Advanced Excel & Financial Macros', level: 95, description: 'Pivot tables, VLOOKUP/XLOOKUP, VBA automation' }
    ]
  },
  {
    category: 'Education & Academic',
    skills: [
      { name: 'Curriculum & Lesson Planning', level: 92, description: 'Outcome-based learning, differentiated instruction' },
      { name: 'Classroom Management', level: 90, description: 'Student engagement, positive behavior reinforcement' },
      { name: 'e-Learning & LMS (Canvas/Moodle)', level: 88, description: 'Course creation, online grading, interactive quizzes' },
      { name: 'Educational Assessment', level: 85, description: 'Formative & summative evaluation, rubrics' }
    ]
  },
  {
    category: 'Healthcare & Medical',
    skills: [
      { name: 'Patient Assessment & Care Planning', level: 94, description: 'Triage, vital signs tracking, care coordination' },
      { name: 'Electronic Health Records (EHR)', level: 90, description: 'Epic, Cerner, medical documentation accuracy' },
      { name: 'Pharmacology & Medication Safety', level: 88, description: 'Dosage calculations, drug interaction screening' },
      { name: 'Clinical Procedures & CPR', level: 92, description: 'BLS/ACLS certified, aseptic technique, wound care' }
    ]
  },
  {
    category: 'Human Resources & Recruiting',
    skills: [
      { name: 'Full-Cycle Recruiting', level: 90, description: 'Sourcing, screening, interviewing, offer negotiation' },
      { name: 'Employee Engagement & Retention', level: 88, description: 'Feedback surveys, culture initiatives, conflict resolution' },
      { name: 'HRIS Systems (Workday/BambooHR)', level: 86, description: 'Onboarding automation, performance reviews, compliance' },
      { name: 'Labor Laws & Policy Compliance', level: 85, description: 'FLSA, FMLA, workplace safety, handbook creation' }
    ]
  },
  {
    category: 'Business & Project Management',
    skills: [
      { name: 'Agile & Scrum Methodologies', level: 92, description: 'Sprint planning, backlog grooming, daily standups' },
      { name: 'Stakeholder Management', level: 90, description: 'Executive alignment, status reporting, expectations management' },
      { name: 'Strategic Planning & KPIs', level: 88, description: 'OKR setting, roadmap execution, competitive analysis' },
      { name: 'Risk Assessment & Mitigation', level: 85, description: 'Contingency planning, dependency mapping' },
      { name: 'Jira & Confluence Administration', level: 88, description: 'Workflow customization, dashboard creation' }
    ]
  },
  {
    category: 'Sales & Business Development',
    skills: [
      { name: 'B2B Sales & Pipeline Management', level: 90, description: 'Prospecting, qualification, closing strategic accounts' },
      { name: 'Salesforce & HubSpot CRM', level: 88, description: 'Lead tracking, deal staging, sales forecasting' },
      { name: 'Solution Selling & Pitching', level: 92, description: 'Value proposition presentation, objection handling' },
      { name: 'Contract Negotiation', level: 86, description: 'Terms agreement, pricing structure, MSA reviews' }
    ]
  },
  {
    category: 'Legal & Compliance',
    skills: [
      { name: 'Contract Drafting & Review', level: 90, description: 'NDAs, MSAs, SLAs, commercial terms review' },
      { name: 'Regulatory Compliance & GDPR', level: 88, description: 'Data privacy standards, audit preparation' },
      { name: 'Legal Research (LexisNexis/Westlaw)', level: 92, description: 'Statutory interpretation, case law analysis' },
      { name: 'Intellectual Property Rights', level: 84, description: 'Trademarks, copyright management, patent filings' }
    ]
  }
];

export const COVER_LETTER_TEMPLATES_LIST = [
  { id: 'software-engineer', name: 'Software Engineer', category: 'Technology', role: 'Software Engineer' },
  { id: 'designer', name: 'UI/UX & Product Designer', category: 'Design', role: 'Product Designer' },
  { id: 'teacher', name: 'High School / Elementary Teacher', category: 'Education', role: 'Teacher' },
  { id: 'doctor', name: 'Medical Doctor / Physician', category: 'Healthcare', role: 'Physician' },
  { id: 'student', name: 'College Student / Intern', category: 'Student', role: 'Student Intern' },
  { id: 'fresher', name: 'Fresh Graduate / Entry Level', category: 'Student', role: 'Entry-Level Associate' },
  { id: 'hr', name: 'HR Manager / Specialist', category: 'HR', role: 'HR Specialist' },
  { id: 'marketing', name: 'Digital Marketing Specialist', category: 'Marketing', role: 'Marketing Specialist' },
  { id: 'sales', name: 'Sales & Account Manager', category: 'Sales', role: 'Account Executive' },
  { id: 'developer', name: 'Full Stack Web Developer', category: 'Technology', role: 'Full Stack Developer' },
  { id: 'ai-engineer', name: 'AI & Machine Learning Specialist', category: 'Technology', role: 'AI Engineer' },
  { id: 'accountant', name: 'Senior Accountant / Auditor', category: 'Finance', role: 'Senior Accountant' },
  { id: 'lawyer', name: 'Corporate Legal Associate', category: 'Legal', role: 'Legal Counsel' },
  { id: 'content-writer', name: 'Content Writer & Strategist', category: 'Marketing', role: 'Content Writer' },
  { id: 'video-editor', name: 'Creative Video Editor', category: 'Media', role: 'Video Editor' }
];

export function getDefaultCoverLetter(templateId: string = 'software-engineer'): CoverLetterData {
  const matched = COVER_LETTER_TEMPLATES_LIST.find(t => t.id === templateId) || COVER_LETTER_TEMPLATES_LIST[0];
  
  return {
    id: `cover_letter_${Date.now()}`,
    name: `${matched.name} Cover Letter`,
    templateId,
    updatedAt: Date.now(),
    personalInfo: {
      fullName: 'Alex Morgan',
      jobTitle: matched.role,
      email: 'alex.morgan@example.com',
      phone: '+1 (555) 234-5678',
      address: 'San Francisco, CA',
      linkedIn: 'linkedin.com/in/alexmorgan'
    },
    recipientInfo: {
      hiringManagerName: 'Hiring Committee',
      companyName: 'Acme Technologies Inc.',
      companyAddress: '100 Innovation Way, Suite 400, San Francisco, CA',
      jobTitleApplied: matched.role,
      date: new Date().toISOString().split('T')[0]
    },
    sections: {
      greeting: 'Dear Hiring Committee,',
      introduction: `I am writing to express my strong interest in the ${matched.role} position at Acme Technologies. With over 4 years of hands-on experience driving impactful results in fast-paced environments, I am eager to contribute my technical and collaborative skills to your innovative team.`,
      experience: `In my previous role, I successfully spearheaded cross-functional projects that boosted operational efficiency by 35% and scaled user adoption significantly. I thrive when solving complex problems and delivering high-quality, resilient deliverables that directly support core business objectives.`,
      skills: `My core technical strengths include proficiency in modern industry standard tools, agile workflows, and data-driven decision making. I pride myself on maintaining open communication across teams and mentoring junior colleagues.`,
      achievements: `Key highlights of my recent tenure include receiving the Excellence in Innovation Award for delivering a core project 2 weeks ahead of schedule with zero major defects, as well as optimizing system performance by 40%.`,
      closing: `Thank you for considering my application. I would welcome the opportunity to discuss how my background, passion, and proven track record align with Acme Technologies' goals. I look forward to hearing from you soon.\n\nSincerely,\nAlex Morgan`
    }
  };
}

export const SUMMARY_PRESETS: SummaryTemplatePreset[] = [
  {
    id: 'software-engineer',
    role: 'Software Engineer',
    category: 'Technology',
    options: [
      {
        title: 'Impact & Results Focused',
        text: 'Results-driven Software Engineer with 5+ years of experience building high-throughput web applications and microservices. Expert in TypeScript, React, and cloud architectures. Proven track record of reducing system latency by 40% and leading agile teams of 6 developers.',
        style: 'impact'
      },
      {
        title: 'Technical & Architecture Focused',
        text: 'Versatile Software Engineer specializing in resilient full-stack systems, clean code principles, and automated CI/CD pipelines. Skilled in modern JavaScript frameworks, relational databases, and serverless infrastructure.',
        style: 'technical'
      },
      {
        title: 'Executive Leadership Style',
        text: 'Senior Software Engineer and Technical Lead with expertise in architecting scalable enterprise solutions. Adept at bridging technical specifications with key business objectives, mentoring developers, and maintaining high engineering velocity.',
        style: 'formal'
      }
    ]
  },
  {
    id: 'product-designer',
    role: 'UI/UX & Product Designer',
    category: 'Design',
    options: [
      {
        title: 'User Centric & Systems',
        text: 'Product Designer with 4+ years of experience crafting intuitive, accessible user experiences for Web and Mobile platforms. Skilled in Figma, comprehensive design systems, and rapid interactive prototyping that elevated conversion rates by 25%.',
        style: 'creative'
      },
      {
        title: 'Data & UX Research Driven',
        text: 'Empathetic UX Designer with a background in quantitative research, usability testing, and conversion rate optimization. Experienced in converting complex workflows into simple, elegant interface patterns.',
        style: 'impact'
      }
    ]
  },
  {
    id: 'marketing-manager',
    role: 'Marketing Manager',
    category: 'Marketing',
    options: [
      {
        title: 'Growth & ROI Focused',
        text: 'Strategic Marketing Manager with 6+ years of experience driving organic and paid growth campaigns. Track record of scaling monthly active leads by 180% and managing $500K annual media budgets with high ROI.',
        style: 'impact'
      },
      {
        title: 'Brand & Content Strategy',
        text: 'Creative Brand Strategist with deep expertise in multi-channel storytelling, SEO content, social media execution, and influencer partnerships that elevate brand equity.',
        style: 'creative'
      }
    ]
  }
];

export const TEMPLATE_GALLERY_ITEMS = [
  { id: 'modern', title: 'Modern Clean', category: 'Modern', icon: '🎨', badge: 'Popular', desc: 'Indigo accents with crisp typography and clean section dividers.' },
  { id: 'executive', title: 'Executive Elite', category: 'Executive', icon: '💼', badge: 'Corporate', desc: 'Navy blue header with subtle gold accent rules for senior positions.' },
  { id: 'creative', title: 'Creative Studio', category: 'Creative', icon: '✨', badge: 'Design', desc: 'Soft pastel pill badges and rounded photo frame layout.' },
  { id: 'minimal', title: 'Minimalist Line', category: 'Minimal', icon: '📄', badge: 'Clean', desc: 'Ultra-clean single column focusing on content density and clarity.' },
  { id: 'classic', title: 'Classic Traditional', category: 'Classic', icon: '🏛️', badge: 'Formal', desc: 'Traditional serif headers preferred by law, finance, and academia.' },
  { id: 'developer', title: 'Developer Tech', category: 'Developer', icon: '💻', badge: 'Tech', desc: 'Monospace tags, GitHub highlights, and tech stack badges.' },
  { id: 'student', title: 'Academic / Student', category: 'Student', icon: '🎓', badge: 'Entry Level', desc: 'Prioritizes education, GPA, research projects, and extracurriculars.' },
  { id: 'designer', title: 'Design Portfolio Style', category: 'Designer', icon: '🖌️', badge: 'Visual', desc: 'Two-column layout highlighting portfolio links and visual skills.' },
  { id: 'medical', title: 'Medical & Clinical', category: 'Medical', icon: '🩺', badge: 'Healthcare', desc: 'Clear clinical certifications, licensure, and patient care timeline.' },
  { id: 'education', title: 'Educator & Teacher', category: 'Education', icon: '📚', badge: 'Academic', desc: 'Highlights teaching philosophy, certifications, and classroom outcomes.' },
  { id: 'business', title: 'Corporate Business', category: 'Business', icon: '📊', badge: 'Management', desc: 'Metrics-first layout emphasizing revenue impact and KPI achievements.' },
  { id: 'ats-clean', title: 'ATS Guaranteed Clean', category: 'Minimal', icon: '🎯', badge: 'ATS Safe', desc: '100% single column parseable format matching ATS scanner bots.' }
];
