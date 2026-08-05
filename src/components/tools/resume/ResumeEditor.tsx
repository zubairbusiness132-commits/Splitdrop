import React, { useState } from 'react';
import { 
  ResumeData, 
  ExperienceItem, 
  EducationItem, 
  ProjectItem, 
  SkillItem, 
  LanguageItem, 
  CertificationItem, 
  AchievementItem, 
  AwardItem, 
  InternshipItem, 
  ReferenceItem, 
  CustomSection,
  PaperSize,
  PhotoShape,
  ResumeLanguage 
} from '../../../types/resume';
import { TEMPLATE_STYLES, SAMPLE_ROLE_TEMPLATES, ACTION_VERBS, SUMMARY_SUGGESTIONS, ATS_CHECKLIST_ITEMS } from '../../../data/resumeTemplatesData';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  FolderGit2, 
  Wrench, 
  Palette, 
  Sparkles, 
  ListOrdered, 
  Plus, 
  Trash2, 
  Copy, 
  ChevronUp, 
  ChevronDown, 
  Upload, 
  Languages, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  FileText, 
  QrCode,
  Globe,
  Layout,
  Check
} from 'lucide-react';

interface ResumeEditorProps {
  data: ResumeData;
  onChange: (newData: ResumeData) => void;
  savedResumes: ResumeData[];
  onSelectResume: (id: string) => void;
  onCreateNewResume: () => void;
  onDuplicateResume: (id: string) => void;
  onDeleteResume: (id: string) => void;
  onImportJson: (jsonStr: string) => void;
  onExportJson: () => void;
  onShowToast: (msg: string) => void;
}

export const ResumeEditor: React.FC<ResumeEditorProps> = ({
  data,
  onChange,
  savedResumes,
  onSelectResume,
  onCreateNewResume,
  onDuplicateResume,
  onDeleteResume,
  onImportJson,
  onExportJson,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<'personal' | 'experience' | 'skills' | 'sections' | 'order' | 'style' | 'templates' | 'smart' | 'storage'>('personal');

  // Helper updater
  const updatePersonalInfo = (field: string, value: string) => {
    onChange({
      ...data,
      personalInfo: {
        ...data.personalInfo,
        [field]: value
      }
    });
  };

  const updateStyling = (field: string, value: any) => {
    onChange({
      ...data,
      styling: {
        ...data.styling,
        [field]: value
      }
    });
  };

  // Photo upload handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        updatePersonalInfo('photoUrl', reader.result as string);
        onShowToast('Profile photo updated!');
      };
      reader.readAsDataURL(file);
    }
  };

  // Completeness score calculation
  const calculateCompleteness = () => {
    let score = 0;
    if (data.personalInfo.fullName) score += 15;
    if (data.personalInfo.email) score += 10;
    if (data.personalInfo.phone) score += 10;
    if (data.personalInfo.summary) score += 15;
    if (data.experience.length > 0) score += 20;
    if (data.education.length > 0) score += 15;
    if (data.skills.length > 0) score += 10;
    if (data.projects.length > 0) score += 5;
    return score;
  };

  const completeness = calculateCompleteness();

  return (
    <div className="flex flex-col h-full glass-panel rounded-2xl overflow-hidden shadow-sm">
      
      {/* Editor Tab Navigation */}
      <div className="flex items-center gap-1 overflow-x-auto p-2 glass-card border-b border-white/20 dark:border-white/10 text-xs font-semibold scrollbar-none">
        <button
          onClick={() => setActiveTab('personal')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all shrink-0 ${
            activeTab === 'personal' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          <User className="w-3.5 h-3.5" /> Personal
        </button>

        <button
          onClick={() => setActiveTab('experience')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all shrink-0 ${
            activeTab === 'experience' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" /> Experience
        </button>

        <button
          onClick={() => setActiveTab('skills')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all shrink-0 ${
            activeTab === 'skills' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          <Wrench className="w-3.5 h-3.5" /> Skills & Edu
        </button>

        <button
          onClick={() => setActiveTab('sections')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all shrink-0 ${
            activeTab === 'sections' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          <Plus className="w-3.5 h-3.5" /> More Sections
        </button>

        <button
          onClick={() => setActiveTab('order')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all shrink-0 ${
            activeTab === 'order' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          <ListOrdered className="w-3.5 h-3.5" /> Order
        </button>

        <button
          onClick={() => setActiveTab('style')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all shrink-0 ${
            activeTab === 'style' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          <Palette className="w-3.5 h-3.5" /> Style
        </button>

        <button
          onClick={() => setActiveTab('templates')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all shrink-0 ${
            activeTab === 'templates' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5" /> Templates
        </button>

        <button
          onClick={() => setActiveTab('smart')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all shrink-0 ${
            activeTab === 'smart' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" /> ATS & Smart
        </button>

        <button
          onClick={() => setActiveTab('storage')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all shrink-0 ${
            activeTab === 'storage' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          <Globe className="w-3.5 h-3.5" /> Saved ({savedResumes.length})
        </button>
      </div>

      {/* Editor Content Body */}
      <div className="p-4 overflow-y-auto flex-1 space-y-5 text-xs">
        
        {/* ==================== TAB: PERSONAL INFO ==================== */}
        {activeTab === 'personal' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600" /> Personal Information
            </h3>

            {/* Photo & Shape */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {data.personalInfo.photoUrl ? (
                  <img 
                    src={data.personalInfo.photoUrl} 
                    alt="Profile" 
                    className="w-12 h-12 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400 font-bold">
                    Photo
                  </div>
                )}
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">Profile Photo</p>
                  <p className="text-[10px] text-slate-500">Upload JPG, PNG or WebP image</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="cursor-pointer px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold flex items-center gap-1 transition-colors">
                  <Upload className="w-3 h-3" /> Upload
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
                {data.personalInfo.photoUrl && (
                  <button
                    onClick={() => updatePersonalInfo('photoUrl', '')}
                    className="px-2.5 py-1.5 bg-red-100 hover:bg-red-200 dark:bg-red-950/50 text-red-600 rounded-lg font-semibold"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={data.personalInfo.fullName}
                  onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Job Title</label>
                <input
                  type="text"
                  value={data.personalInfo.jobTitle}
                  onChange={(e) => updatePersonalInfo('jobTitle', e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  value={data.personalInfo.email}
                  onChange={(e) => updatePersonalInfo('email', e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={data.personalInfo.phone}
                  onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                  placeholder="+1 (555) 000-1234"
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Location / Address</label>
                <input
                  type="text"
                  value={data.personalInfo.address}
                  onChange={(e) => updatePersonalInfo('address', e.target.value)}
                  placeholder="San Francisco, CA"
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Personal Website</label>
                <input
                  type="url"
                  value={data.personalInfo.website}
                  onChange={(e) => updatePersonalInfo('website', e.target.value)}
                  placeholder="https://alexmorgan.dev"
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Portfolio URL</label>
                <input
                  type="url"
                  value={data.personalInfo.portfolio || ''}
                  onChange={(e) => updatePersonalInfo('portfolio', e.target.value)}
                  placeholder="https://alexmorgan.dev/portfolio"
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">LinkedIn Profile</label>
                <input
                  type="url"
                  value={data.personalInfo.linkedIn}
                  onChange={(e) => updatePersonalInfo('linkedIn', e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">GitHub Profile</label>
                <input
                  type="url"
                  value={data.personalInfo.gitHub}
                  onChange={(e) => updatePersonalInfo('gitHub', e.target.value)}
                  placeholder="https://github.com/username"
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 text-xs"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Professional Summary</label>
                <span className="text-[10px] text-slate-400">{data.personalInfo.summary.length} characters</span>
              </div>
              <textarea
                rows={4}
                value={data.personalInfo.summary}
                onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                placeholder="Write 3-4 sentences summarizing your key achievements, skills, and industry impact..."
                className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 text-xs leading-relaxed"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Career Objective</label>
                <span className="text-[10px] text-slate-400">{data.personalInfo.objective.length} characters</span>
              </div>
              <textarea
                rows={2}
                value={data.personalInfo.objective}
                onChange={(e) => updatePersonalInfo('objective', e.target.value)}
                placeholder="Target goal statement for entry-level or career transition resumes..."
                className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 text-xs leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* ==================== TAB: WORK EXPERIENCE ==================== */}
        {activeTab === 'experience' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-600" /> Work Experience
              </h3>
              <button
                onClick={() => {
                  const newItem: ExperienceItem = {
                    id: `exp-${Date.now()}`,
                    title: 'New Role',
                    company: 'Company Name',
                    location: 'City, Country',
                    startDate: '2023',
                    endDate: 'Present',
                    current: true,
                    description: '• Accomplished X measured by Y using Z'
                  };
                  onChange({
                    ...data,
                    experience: [newItem, ...data.experience]
                  });
                }}
                className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Job
              </button>
            </div>

            {data.experience.map((exp, index) => (
              <div key={exp.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-800 dark:text-slate-200"># {index + 1} - {exp.title || 'Untitled Role'}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const newExp = data.experience.filter(e => e.id !== exp.id);
                        onChange({ ...data, experience: newExp });
                      }}
                      className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded"
                      title="Delete experience"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-600 dark:text-slate-400 text-[10px]">Job Title</label>
                    <input
                      type="text"
                      value={exp.title}
                      onChange={(e) => {
                        const updated = data.experience.map(item => item.id === exp.id ? { ...item, title: e.target.value } : item);
                        onChange({ ...data, experience: updated });
                      }}
                      className="w-full p-1.5 rounded bg-white dark:bg-slate-900 border text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600 dark:text-slate-400 text-[10px]">Company Name</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => {
                        const updated = data.experience.map(item => item.id === exp.id ? { ...item, company: e.target.value } : item);
                        onChange({ ...data, experience: updated });
                      }}
                      className="w-full p-1.5 rounded bg-white dark:bg-slate-900 border text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600 dark:text-slate-400 text-[10px]">Location</label>
                    <input
                      type="text"
                      value={exp.location}
                      onChange={(e) => {
                        const updated = data.experience.map(item => item.id === exp.id ? { ...item, location: e.target.value } : item);
                        onChange({ ...data, experience: updated });
                      }}
                      className="w-full p-1.5 rounded bg-white dark:bg-slate-900 border text-xs"
                    />
                  </div>

                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block font-semibold text-slate-600 dark:text-slate-400 text-[10px]">Start Date</label>
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={(e) => {
                          const updated = data.experience.map(item => item.id === exp.id ? { ...item, startDate: e.target.value } : item);
                          onChange({ ...data, experience: updated });
                        }}
                        className="w-full p-1.5 rounded bg-white dark:bg-slate-900 border text-xs"
                      />
                    </div>

                    <div className="flex-1">
                      <label className="block font-semibold text-slate-600 dark:text-slate-400 text-[10px]">End Date</label>
                      <input
                        type="text"
                        disabled={exp.current}
                        value={exp.current ? 'Present' : exp.endDate}
                        onChange={(e) => {
                          const updated = data.experience.map(item => item.id === exp.id ? { ...item, endDate: e.target.value } : item);
                          onChange({ ...data, experience: updated });
                        }}
                        className="w-full p-1.5 rounded bg-white dark:bg-slate-900 border text-xs disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id={`current-${exp.id}`}
                    checked={exp.current}
                    onChange={(e) => {
                      const updated = data.experience.map(item => item.id === exp.id ? { ...item, current: e.target.checked } : item);
                      onChange({ ...data, experience: updated });
                    }}
                    className="rounded text-indigo-600"
                  />
                  <label htmlFor={`current-${exp.id}`} className="font-semibold text-slate-700 dark:text-slate-300">
                    Currently work here
                  </label>
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 text-[10px] mb-1">
                    Key Achievements & Responsibilities (Bullet Points)
                  </label>
                  <textarea
                    rows={3}
                    value={exp.description}
                    onChange={(e) => {
                      const updated = data.experience.map(item => item.id === exp.id ? { ...item, description: e.target.value } : item);
                      onChange({ ...data, experience: updated });
                    }}
                    placeholder="• Built X causing Y result..."
                    className="w-full p-2 rounded bg-white dark:bg-slate-900 border text-xs leading-relaxed"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ==================== TAB: SKILLS & EDUCATION ==================== */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            {/* Education Section */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-indigo-600" /> Education
                </h3>
                <button
                  onClick={() => {
                    const newItem: EducationItem = {
                      id: `edu-${Date.now()}`,
                      degree: 'B.S. Degree',
                      institution: 'University Name',
                      location: 'City, Country',
                      startDate: '2019',
                      endDate: '2023',
                      grade: '3.8 GPA'
                    };
                    onChange({ ...data, education: [...data.education, newItem] });
                  }}
                  className="px-2 py-1 bg-indigo-600 text-white rounded font-semibold flex items-center gap-1 text-[11px]"
                >
                  <Plus className="w-3 h-3" /> Add Education
                </button>
              </div>

              {data.education.map((edu) => (
                <div key={edu.id} className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => {
                        const updated = data.education.map(item => item.id === edu.id ? { ...item, degree: e.target.value } : item);
                        onChange({ ...data, education: updated });
                      }}
                      placeholder="Degree"
                      className="font-bold bg-transparent border-b w-1/2"
                    />
                    <button
                      onClick={() => {
                        onChange({ ...data, education: data.education.filter(e => e.id !== edu.id) });
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => {
                        const updated = data.education.map(item => item.id === edu.id ? { ...item, institution: e.target.value } : item);
                        onChange({ ...data, education: updated });
                      }}
                      placeholder="University"
                      className="p-1 rounded bg-white dark:bg-slate-900 border"
                    />
                    <input
                      type="text"
                      value={edu.grade || ''}
                      onChange={(e) => {
                        const updated = data.education.map(item => item.id === edu.id ? { ...item, grade: e.target.value } : item);
                        onChange({ ...data, education: updated });
                      }}
                      placeholder="GPA / Grade"
                      className="p-1 rounded bg-white dark:bg-slate-900 border"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Skills Section */}
            <div className="space-y-3 pt-3 border-t">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-indigo-600" /> Skills & Tools
                </h3>
                <button
                  onClick={() => {
                    const newItem: SkillItem = {
                      id: `skill-${Date.now()}`,
                      name: 'New Skill',
                      level: 5,
                      category: 'Technical'
                    };
                    onChange({ ...data, skills: [...data.skills, newItem] });
                  }}
                  className="px-2 py-1 bg-indigo-600 text-white rounded font-semibold flex items-center gap-1 text-[11px]"
                >
                  <Plus className="w-3 h-3" /> Add Skill
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {data.skills.map((skill) => (
                  <div key={skill.id} className="flex items-center gap-2 p-1.5 bg-slate-50 dark:bg-slate-800/50 rounded border">
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => {
                        const updated = data.skills.map(s => s.id === skill.id ? { ...s, name: e.target.value } : s);
                        onChange({ ...data, skills: updated });
                      }}
                      className="flex-1 p-1 rounded bg-white dark:bg-slate-900 border text-xs"
                    />
                    <button
                      onClick={() => {
                        onChange({ ...data, skills: data.skills.filter(s => s.id !== skill.id) });
                      }}
                      className="text-red-500 p-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB: MORE SECTIONS ==================== */}
        {activeTab === 'sections' && (
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-indigo-600" /> Projects, Languages & Custom Sections
            </h3>

            {/* Projects */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold">Projects ({data.projects.length})</span>
                <button
                  onClick={() => {
                    const newItem: ProjectItem = {
                      id: `proj-${Date.now()}`,
                      title: 'Project Name',
                      subtitle: 'Subtitle / Role',
                      link: 'https://example.com',
                      technologies: 'React, Node',
                      description: 'Project outcome & tech details'
                    };
                    onChange({ ...data, projects: [...data.projects, newItem] });
                  }}
                  className="px-2 py-1 bg-indigo-600 text-white rounded font-semibold text-[10px]"
                >
                  + Add Project
                </button>
              </div>

              {data.projects.map((p) => (
                <div key={p.id} className="p-2 bg-white dark:bg-slate-900 rounded border space-y-1">
                  <div className="flex justify-between">
                    <input
                      type="text"
                      value={p.title}
                      onChange={(e) => {
                        const updated = data.projects.map(item => item.id === p.id ? { ...item, title: e.target.value } : item);
                        onChange({ ...data, projects: updated });
                      }}
                      placeholder="Project Title"
                      className="font-bold border-b text-xs w-2/3"
                    />
                    <button onClick={() => onChange({ ...data, projects: data.projects.filter(item => item.id !== p.id) })} className="text-red-500">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={p.technologies || ''}
                    onChange={(e) => {
                      const updated = data.projects.map(item => item.id === p.id ? { ...item, technologies: e.target.value } : item);
                      onChange({ ...data, projects: updated });
                    }}
                    placeholder="Technologies e.g. React, Python"
                    className="w-full p-1 border rounded text-[11px]"
                  />
                </div>
              ))}
            </div>

            {/* Languages */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold">Languages ({data.languages.length})</span>
                <button
                  onClick={() => {
                    const newItem: LanguageItem = { id: `lang-${Date.now()}`, language: 'Language', proficiency: 'Fluent' };
                    onChange({ ...data, languages: [...data.languages, newItem] });
                  }}
                  className="px-2 py-1 bg-indigo-600 text-white rounded font-semibold text-[10px]"
                >
                  + Add Language
                </button>
              </div>

              {data.languages.map((l) => (
                <div key={l.id} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={l.language}
                    onChange={(e) => {
                      const updated = data.languages.map(item => item.id === l.id ? { ...item, language: e.target.value } : item);
                      onChange({ ...data, languages: updated });
                    }}
                    className="p-1 rounded bg-white dark:bg-slate-900 border text-xs flex-1"
                  />
                  <input
                    type="text"
                    value={l.proficiency}
                    onChange={(e) => {
                      const updated = data.languages.map(item => item.id === l.id ? { ...item, proficiency: e.target.value } : item);
                      onChange({ ...data, languages: updated });
                    }}
                    className="p-1 rounded bg-white dark:bg-slate-900 border text-xs flex-1"
                  />
                  <button onClick={() => onChange({ ...data, languages: data.languages.filter(item => item.id !== l.id) })} className="text-red-500">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB: ORDER & REORDER ==================== */}
        {activeTab === 'order' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ListOrdered className="w-4 h-4 text-indigo-600" /> Section Order & Reordering
            </h3>
            <p className="text-slate-500 text-[11px]">
              Move sections up or down to change their vertical layout on your resume sheet.
            </p>

            <div className="space-y-2">
              {data.sectionOrder.map((secKey, index) => (
                <div key={secKey} className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border">
                  <span className="font-bold text-slate-800 dark:text-slate-200 capitalize">{secKey}</span>
                  <div className="flex items-center gap-1">
                    <button
                      disabled={index === 0}
                      onClick={() => {
                        if (index === 0) return;
                        const newOrder = [...data.sectionOrder];
                        const temp = newOrder[index - 1];
                        newOrder[index - 1] = newOrder[index];
                        newOrder[index] = temp;
                        onChange({ ...data, sectionOrder: newOrder });
                      }}
                      className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      disabled={index === data.sectionOrder.length - 1}
                      onClick={() => {
                        if (index === data.sectionOrder.length - 1) return;
                        const newOrder = [...data.sectionOrder];
                        const temp = newOrder[index + 1];
                        newOrder[index + 1] = newOrder[index];
                        newOrder[index] = temp;
                        onChange({ ...data, sectionOrder: newOrder });
                      }}
                      className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB: STYLE & COLORS ==================== */}
        {activeTab === 'style' && (
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-indigo-600" /> Resume Styling & Customization
            </h3>

            {/* Layout Settings Toggle (Modern vs Classic) */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Layout className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Layout Settings & Style Preset
                </span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  PDF Formatting
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Switch between clean contemporary styling or traditional serif formatting for your resume PDF.
              </p>

              <div className="grid grid-cols-2 gap-2 pt-1">
                {/* Modern Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    onChange({
                      ...data,
                      styling: {
                        ...data.styling,
                        layoutPreset: 'modern',
                        fontFamily: 'Inter, sans-serif',
                        marginSize: 'normal',
                        lineHeight: 'normal'
                      }
                    });
                  }}
                  className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                    (data.styling.layoutPreset || 'modern') === 'modern'
                      ? 'bg-indigo-50/90 dark:bg-indigo-950/70 border-indigo-600 text-indigo-950 dark:text-indigo-100 ring-2 ring-indigo-500/30 font-bold'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs flex items-center gap-1.5">
                      🚀 Modern Style
                    </span>
                    {(data.styling.layoutPreset || 'modern') === 'modern' && (
                      <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                    Sans-serif Inter font, balanced padding & modern pill accents
                  </p>
                </button>

                {/* Classic Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    onChange({
                      ...data,
                      styling: {
                        ...data.styling,
                        layoutPreset: 'classic',
                        fontFamily: 'Georgia, serif',
                        marginSize: 'spacious',
                        lineHeight: 'relaxed'
                      }
                    });
                  }}
                  className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                    data.styling.layoutPreset === 'classic'
                      ? 'bg-indigo-50/90 dark:bg-indigo-950/70 border-indigo-600 text-indigo-950 dark:text-indigo-100 ring-2 ring-indigo-500/30 font-bold'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs flex items-center gap-1.5 font-serif">
                      📜 Classic Style
                    </span>
                    {data.styling.layoutPreset === 'classic' && (
                      <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                    Traditional Georgia serif typography, generous margins & classic rules
                  </p>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Primary Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={data.styling.primaryColor}
                    onChange={(e) => updateStyling('primaryColor', e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={data.styling.primaryColor}
                    onChange={(e) => updateStyling('primaryColor', e.target.value)}
                    className="p-1.5 rounded bg-slate-50 dark:bg-slate-800 border text-xs w-24"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Paper Size</label>
                <select
                  value={data.styling.paperSize}
                  onChange={(e) => updateStyling('paperSize', e.target.value as PaperSize)}
                  className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border text-xs"
                >
                  <option value="A4">A4 (Standard International)</option>
                  <option value="Letter">US Letter (8.5 x 11 in)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Font Family</label>
                <select
                  value={data.styling.fontFamily}
                  onChange={(e) => updateStyling('fontFamily', e.target.value)}
                  className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border text-xs"
                >
                  <option value="Inter, sans-serif">Inter (Modern Clean)</option>
                  <option value="Georgia, serif">Georgia (Classic Serif)</option>
                  <option value="Playfair Display, serif">Playfair (Elegant Serif)</option>
                  <option value="Courier New, monospace">Monospace (Tech / Code)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Photo Style</label>
                <select
                  value={data.styling.photoShape}
                  onChange={(e) => updateStyling('photoShape', e.target.value as PhotoShape)}
                  className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border text-xs"
                >
                  <option value="round">Round Photo</option>
                  <option value="square">Square Rounded</option>
                  <option value="hidden">Hide Photo (ATS)</option>
                </select>
              </div>
            </div>

            {/* QR Code Settings */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-indigo-600" /> Embedded QR Code
                </span>
                <input
                  type="checkbox"
                  checked={data.qrCode.enabled}
                  onChange={(e) => onChange({ ...data, qrCode: { ...data.qrCode, enabled: e.target.checked } })}
                  className="rounded text-indigo-600"
                />
              </div>

              {data.qrCode.enabled && (
                <div className="space-y-2 pt-2">
                  <input
                    type="text"
                    value={data.qrCode.url}
                    onChange={(e) => onChange({ ...data, qrCode: { ...data.qrCode, url: e.target.value } })}
                    placeholder="QR URL e.g. https://linkedin.com/in/you"
                    className="w-full p-2 rounded bg-white dark:bg-slate-900 border text-xs"
                  />
                  <input
                    type="text"
                    value={data.qrCode.label}
                    onChange={(e) => onChange({ ...data, qrCode: { ...data.qrCode, label: e.target.value } })}
                    placeholder="Label below QR e.g. Scan Portfolio"
                    className="w-full p-2 rounded bg-white dark:bg-slate-900 border text-xs"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== TAB: TEMPLATES ==================== */}
        {activeTab === 'templates' && (
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" /> 20+ Themes & Prefilled Role Samples
            </h3>

            {/* Theme Style Selector */}
            <div className="space-y-2">
              <span className="font-bold text-slate-700 dark:text-slate-300">Choose Visual Theme</span>
              <div className="grid grid-cols-2 gap-2">
                {TEMPLATE_STYLES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => updateStyling('templateStyle', tmpl.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      data.styling.templateStyle === tmpl.id
                        ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-600 font-bold'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                    }`}
                  >
                    <p className="text-xs text-slate-900 dark:text-white">{tmpl.name}</p>
                    <p className="text-[10px] text-slate-500 line-clamp-1">{tmpl.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Sample Role Resumes */}
            <div className="space-y-2 pt-4 border-t">
              <span className="font-bold text-slate-700 dark:text-slate-300">Start from Prefilled Role Template</span>
              <p className="text-[11px] text-slate-500">
                Loading a prefilled role template replaces current data with realistic resume content.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto p-1 border rounded-xl">
                {SAMPLE_ROLE_TEMPLATES.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => {
                      if (window.confirm(`Load ${sample.roleTitle} template data?`)) {
                        onChange({
                          ...sample.data,
                          id: data.id,
                          updatedAt: Date.now()
                        });
                        onShowToast(`Loaded ${sample.roleTitle} template!`);
                      }
                    }}
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-left border border-slate-200 dark:border-slate-700"
                  >
                    <p className="font-bold text-slate-800 dark:text-slate-200 text-xs">{sample.roleTitle}</p>
                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold">
                      {sample.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB: SMART ATS & SUGGESTIONS ==================== */}
        {activeTab === 'smart' && (
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" /> ATS Optimization & Smart Suggestions
            </h3>

            {/* Completeness Bar */}
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-800 space-y-2">
              <div className="flex justify-between items-center font-bold">
                <span>Resume Completeness Score</span>
                <span className="text-indigo-600 dark:text-indigo-400">{completeness}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full transition-all duration-500" style={{ width: `${completeness}%` }}></div>
              </div>
            </div>

            {/* ATS Checklist */}
            <div className="space-y-2">
              <span className="font-bold">ATS Checklist & Tips</span>
              <div className="space-y-1.5">
                {ATS_CHECKLIST_ITEMS.map((item) => (
                  <div key={item.id} className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded border flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200 text-xs">{item.title}</p>
                      <p className="text-[10px] text-slate-500">{item.tip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Verbs */}
            <div className="space-y-2 pt-2 border-t">
              <span className="font-bold">Strong Action Verbs</span>
              <div className="flex flex-wrap gap-1">
                {ACTION_VERBS.slice(0, 16).map((verb) => (
                  <span key={verb} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px] font-semibold">
                    {verb}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB: STORAGE ==================== */}
        {activeTab === 'storage' && (
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-600" /> Saved Resumes & Import/Export
              </h3>
              <button
                onClick={onCreateNewResume}
                className="px-2.5 py-1 bg-indigo-600 text-white rounded font-semibold text-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> New Resume
              </button>
            </div>

            <div className="space-y-2">
              {savedResumes.map((res) => (
                <div 
                  key={res.id} 
                  className={`p-3 rounded-xl border flex items-center justify-between gap-2 ${
                    res.id === data.id ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200'
                  }`}
                >
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-xs">{res.name}</p>
                    <p className="text-[10px] text-slate-500">{res.personalInfo.fullName} • {res.personalInfo.jobTitle}</p>
                  </div>

                  <div className="flex items-center gap-1">
                    {res.id !== data.id && (
                      <button
                        onClick={() => onSelectResume(res.id)}
                        className="px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded font-semibold text-[10px]"
                      >
                        Load
                      </button>
                    )}
                    <button
                      onClick={() => onDuplicateResume(res.id)}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600"
                      title="Duplicate resume"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    {savedResumes.length > 1 && (
                      <button
                        onClick={() => onDeleteResume(res.id)}
                        className="p-1 hover:bg-red-100 text-red-500 rounded"
                        title="Delete resume"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t flex gap-2">
              <button
                onClick={onExportJson}
                className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-semibold rounded-lg text-xs flex items-center justify-center gap-1"
              >
                <Download className="w-3.5 h-3.5" /> Export JSON
              </button>
              <label className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-semibold rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer">
                <Upload className="w-3.5 h-3.5" /> Import JSON
                <input
                  type="file"
                  accept=".json"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => onImportJson(reader.result as string);
                      reader.readAsText(file);
                    }
                  }}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
