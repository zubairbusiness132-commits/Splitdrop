export type PaperSize = 'A4' | 'Letter';
export type PhotoShape = 'round' | 'square' | 'hidden';
export type LayoutType = 'one-column' | 'two-column' | 'sidebar';
export type ResumeLanguage = 'en' | 'es' | 'fr' | 'de' | 'hi' | 'ur' | 'ar' | 'zh';

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  linkedIn: string;
  gitHub: string;
  portfolio: string;
  photoUrl?: string;
  summary: string;
  objective: string;
}

export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  grade?: string;
  description?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle?: string;
  link?: string;
  technologies?: string;
  description: string;
}

export interface SkillItem {
  id: string;
  name: string;
  level?: number; // 1-5 or 1-100
  category?: string;
}

export interface LanguageItem {
  id: string;
  language: string;
  proficiency: string; // e.g., Native, Fluent, Intermediate
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  date?: string;
  description: string;
}

export interface AwardItem {
  id: string;
  title: string;
  organization: string;
  date: string;
}

export interface InternshipItem {
  id: string;
  role: string;
  company: string;
  date: string;
  description: string;
}

export interface ReferenceItem {
  id: string;
  name: string;
  title: string;
  company: string;
  contact: string;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  description: string;
}

export interface CustomSection {
  id: string;
  title: string;
  items: CustomSectionItem[];
}

export interface QRCodeConfig {
  enabled: boolean;
  type: 'portfolio' | 'linkedin' | 'website' | 'custom';
  url: string;
  label: string;
}

export interface ResumeStyling {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  fontSize: 'small' | 'medium' | 'large';
  lineHeight: 'tight' | 'normal' | 'relaxed';
  marginSize: 'compact' | 'normal' | 'spacious';
  paperSize: PaperSize;
  photoShape: PhotoShape;
  layout: LayoutType;
  templateStyle: string; // Theme name
  layoutPreset?: 'modern' | 'classic'; // 'modern' or 'classic' layout & font preset
}

export interface ResumeData {
  id: string;
  name: string; // Resume title e.g. "Software Engineer 2026"
  updatedAt: number;
  language: ResumeLanguage;
  personalInfo: PersonalInfo;
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  skills: SkillItem[];
  languages: LanguageItem[];
  certifications: CertificationItem[];
  achievements: AchievementItem[];
  awards: AwardItem[];
  internships: InternshipItem[];
  references: ReferenceItem[];
  hobbies: string[];
  customSections: CustomSection[];
  sectionOrder: string[]; // Section IDs in desired order
  styling: ResumeStyling;
  qrCode: QRCodeConfig;
}

export interface RoleSampleTemplate {
  id: string;
  roleTitle: string;
  category: string;
  data: Omit<ResumeData, 'id' | 'updatedAt'>;
}
