import React, { useEffect, useState } from 'react';
import { ResumeData } from '../../../types/resume';
import QRCode from 'qrcode';
import { Globe, Mail, Phone, MapPin, Linkedin, Github, ExternalLink } from 'lucide-react';

interface ResumePreviewProps {
  data: ResumeData;
  previewRef?: React.RefObject<HTMLDivElement | null>;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data, previewRef }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  // Generate QR code when enabled & url changes
  useEffect(() => {
    if (data.qrCode.enabled && data.qrCode.url) {
      QRCode.toDataURL(data.qrCode.url, {
        margin: 1,
        width: 120,
        color: {
          dark: data.styling.primaryColor || '#000000',
          light: '#FFFFFF'
        }
      })
        .then(url => setQrDataUrl(url))
        .catch(() => setQrDataUrl(null));
    } else {
      setQrDataUrl(null);
    }
  }, [data.qrCode.enabled, data.qrCode.url, data.styling.primaryColor]);

  const { personalInfo, styling, language } = data;
  const isRtl = language === 'ar' || language === 'ur';

  // Paper Dimensions & Padding
  const paperClass = styling.paperSize === 'Letter' 
    ? 'w-[215.9mm] min-h-[279.4mm]' 
    : 'w-[210mm] min-h-[297mm]';

  const marginClass = styling.marginSize === 'compact' 
    ? 'p-6' 
    : styling.marginSize === 'spacious' 
      ? 'p-12' 
      : 'p-8';

  const fontClass = styling.fontSize === 'small' 
    ? 'text-[11px] leading-tight' 
    : styling.fontSize === 'large' 
      ? 'text-[13px] leading-relaxed' 
      : 'text-[12px] leading-normal';

  const fontStyle = {
    fontFamily: styling.fontFamily || 'Inter, sans-serif'
  };

  // Render individual sections dynamically based on sectionOrder
  const renderSectionContent = (sectionKey: string) => {
    switch (sectionKey) {
      case 'summary':
        if (!personalInfo.summary) return null;
        return (
          <div key="summary" className="mb-5">
            <h3 
              className="text-xs font-bold uppercase tracking-wider mb-2 border-b pb-1 flex items-center justify-between"
              style={{ color: styling.primaryColor, borderColor: `${styling.primaryColor}30` }}
            >
              <span>Professional Summary</span>
            </h3>
            <p className="text-slate-700 dark:text-slate-200 whitespace-pre-line leading-relaxed font-normal">
              {personalInfo.summary}
            </p>
          </div>
        );

      case 'objective':
        if (!personalInfo.objective) return null;
        return (
          <div key="objective" className="mb-5">
            <h3 
              className="text-xs font-bold uppercase tracking-wider mb-2 border-b pb-1"
              style={{ color: styling.primaryColor, borderColor: `${styling.primaryColor}30` }}
            >
              Career Objective
            </h3>
            <p className="text-slate-700 dark:text-slate-200 whitespace-pre-line leading-relaxed">
              {personalInfo.objective}
            </p>
          </div>
        );

      case 'experience':
        if (!data.experience || data.experience.length === 0) return null;
        return (
          <div key="experience" className="mb-5 space-y-4">
            <h3 
              className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-3"
              style={{ color: styling.primaryColor, borderColor: `${styling.primaryColor}30` }}
            >
              Work Experience
            </h3>
            {data.experience.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-[13px]">
                    {exp.title} <span className="font-semibold text-slate-600 dark:text-slate-400">@ {exp.company}</span>
                  </h4>
                  <span className="text-[11px] font-medium text-slate-500 shrink-0">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate} {exp.location ? `| ${exp.location}` : ''}
                  </span>
                </div>
                {exp.description && (
                  <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line text-[11px] leading-relaxed pl-2 border-l-2 border-slate-200 dark:border-slate-700 mt-1">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        );

      case 'education':
        if (!data.education || data.education.length === 0) return null;
        return (
          <div key="education" className="mb-5 space-y-3">
            <h3 
              className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2"
              style={{ color: styling.primaryColor, borderColor: `${styling.primaryColor}30` }}
            >
              Education
            </h3>
            {data.education.map((edu) => (
              <div key={edu.id} className="flex flex-wrap items-baseline justify-between gap-1">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-[12px]">
                    {edu.degree}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                    {edu.institution} {edu.location ? `• ${edu.location}` : ''} {edu.grade ? `(${edu.grade})` : ''}
                  </p>
                  {edu.description && <p className="text-[10px] text-slate-500 mt-0.5">{edu.description}</p>}
                </div>
                <span className="text-[11px] font-medium text-slate-500">
                  {edu.startDate} – {edu.endDate}
                </span>
              </div>
            ))}
          </div>
        );

      case 'projects':
        if (!data.projects || data.projects.length === 0) return null;
        return (
          <div key="projects" className="mb-5 space-y-3">
            <h3 
              className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2"
              style={{ color: styling.primaryColor, borderColor: `${styling.primaryColor}30` }}
            >
              Key Projects
            </h3>
            {data.projects.map((proj) => (
              <div key={proj.id} className="space-y-0.5">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-[12px] flex items-center gap-1.5">
                    <span>{proj.title}</span>
                    {proj.subtitle && <span className="text-slate-500 font-normal">({proj.subtitle})</span>}
                  </h4>
                  {proj.link && (
                    <a href={proj.link} target="_blank" rel="noreferrer" className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5">
                      View <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
                {proj.technologies && (
                  <p className="text-[10px] font-medium text-indigo-600 dark:text-indigo-300">
                    Tech: {proj.technologies}
                  </p>
                )}
                <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-snug">
                  {proj.description}
                </p>
              </div>
            ))}
          </div>
        );

      case 'skills':
        if (!data.skills || data.skills.length === 0) return null;
        return (
          <div key="skills" className="mb-5">
            <h3 
              className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2"
              style={{ color: styling.primaryColor, borderColor: `${styling.primaryColor}30` }}
            >
              Skills & Expertise
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {data.skills.map((skill) => (
                <span 
                  key={skill.id}
                  className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                >
                  {skill.name} {skill.level ? `(${skill.level}/5)` : ''}
                </span>
              ))}
            </div>
          </div>
        );

      case 'languages':
        if (!data.languages || data.languages.length === 0) return null;
        return (
          <div key="languages" className="mb-5">
            <h3 
              className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2"
              style={{ color: styling.primaryColor, borderColor: `${styling.primaryColor}30` }}
            >
              Languages
            </h3>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {data.languages.map((lang) => (
                <div key={lang.id} className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-0.5">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{lang.language}</span>
                  <span className="text-slate-500">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'certifications':
        if (!data.certifications || data.certifications.length === 0) return null;
        return (
          <div key="certifications" className="mb-5 space-y-1.5">
            <h3 
              className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2"
              style={{ color: styling.primaryColor, borderColor: `${styling.primaryColor}30` }}
            >
              Certifications
            </h3>
            {data.certifications.map((cert) => (
              <div key={cert.id} className="flex justify-between items-baseline text-[11px]">
                <span className="font-semibold text-slate-800 dark:text-slate-200">{cert.title} — {cert.issuer}</span>
                <span className="text-slate-500">{cert.date}</span>
              </div>
            ))}
          </div>
        );

      case 'achievements':
        if (!data.achievements || data.achievements.length === 0) return null;
        return (
          <div key="achievements" className="mb-5 space-y-1.5">
            <h3 
              className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2"
              style={{ color: styling.primaryColor, borderColor: `${styling.primaryColor}30` }}
            >
              Key Achievements
            </h3>
            {data.achievements.map((ach) => (
              <div key={ach.id} className="text-[11px]">
                <span className="font-bold text-slate-900 dark:text-slate-100">{ach.title}</span>
                {ach.date && <span className="text-slate-500 ml-2">({ach.date})</span>}
                <p className="text-slate-600 dark:text-slate-300 mt-0.5">{ach.description}</p>
              </div>
            ))}
          </div>
        );

      case 'awards':
        if (!data.awards || data.awards.length === 0) return null;
        return (
          <div key="awards" className="mb-5 space-y-1">
            <h3 
              className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2"
              style={{ color: styling.primaryColor, borderColor: `${styling.primaryColor}30` }}
            >
              Honors & Awards
            </h3>
            {data.awards.map((aw) => (
              <div key={aw.id} className="flex justify-between text-[11px]">
                <span className="font-semibold text-slate-800 dark:text-slate-200">{aw.title} ({aw.organization})</span>
                <span className="text-slate-500">{aw.date}</span>
              </div>
            ))}
          </div>
        );

      case 'internships':
        if (!data.internships || data.internships.length === 0) return null;
        return (
          <div key="internships" className="mb-5 space-y-2">
            <h3 
              className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2"
              style={{ color: styling.primaryColor, borderColor: `${styling.primaryColor}30` }}
            >
              Internships
            </h3>
            {data.internships.map((intern) => (
              <div key={intern.id} className="text-[11px]">
                <div className="flex justify-between font-bold">
                  <span>{intern.role} @ {intern.company}</span>
                  <span className="text-slate-500 font-normal">{intern.date}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 mt-0.5">{intern.description}</p>
              </div>
            ))}
          </div>
        );

      case 'references':
        if (!data.references || data.references.length === 0) return null;
        return (
          <div key="references" className="mb-5">
            <h3 
              className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2"
              style={{ color: styling.primaryColor, borderColor: `${styling.primaryColor}30` }}
            >
              References
            </h3>
            <div className="grid grid-cols-2 gap-3 text-[11px]">
              {data.references.map((ref) => (
                <div key={ref.id} className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded border border-slate-200 dark:border-slate-700">
                  <p className="font-bold text-slate-900 dark:text-slate-100">{ref.name}</p>
                  <p className="text-slate-600 dark:text-slate-400 text-[10px]">{ref.title} - {ref.company}</p>
                  <p className="text-indigo-600 dark:text-indigo-400 text-[10px] mt-0.5">{ref.contact}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'hobbies':
        if (!data.hobbies || data.hobbies.length === 0) return null;
        return (
          <div key="hobbies" className="mb-5">
            <h3 
              className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2"
              style={{ color: styling.primaryColor, borderColor: `${styling.primaryColor}30` }}
            >
              Interests & Hobbies
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-[11px]">
              {data.hobbies.join(' • ')}
            </p>
          </div>
        );

      default:
        // Custom sections handling
        const customSec = data.customSections?.find(cs => cs.id === sectionKey);
        if (customSec && customSec.items.length > 0) {
          return (
            <div key={customSec.id} className="mb-5 space-y-2">
              <h3 
                className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2"
                style={{ color: styling.primaryColor, borderColor: `${styling.primaryColor}30` }}
              >
                {customSec.title}
              </h3>
              {customSec.items.map((item) => (
                <div key={item.id} className="text-[11px]">
                  <div className="flex justify-between font-bold text-slate-900 dark:text-slate-100">
                    <span>{item.title} {item.subtitle ? `— ${item.subtitle}` : ''}</span>
                    {item.date && <span className="text-slate-500 font-normal">{item.date}</span>}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mt-0.5 whitespace-pre-line">{item.description}</p>
                </div>
              ))}
            </div>
          );
        }
        return null;
    }
  };

  // Header Contact Info Bar
  const renderContactBar = () => (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-600 dark:text-slate-300 mt-2">
      {personalInfo.email && (
        <span className="flex items-center gap-1">
          <Mail className="w-3 h-3 text-indigo-500 shrink-0" /> {personalInfo.email}
        </span>
      )}
      {personalInfo.phone && (
        <span className="flex items-center gap-1">
          <Phone className="w-3 h-3 text-indigo-500 shrink-0" /> {personalInfo.phone}
        </span>
      )}
      {personalInfo.address && (
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-indigo-500 shrink-0" /> {personalInfo.address}
        </span>
      )}
      {personalInfo.website && (
        <span className="flex items-center gap-1">
          <Globe className="w-3 h-3 text-indigo-500 shrink-0" /> {personalInfo.website.replace(/^https?:\/\//, '')}
        </span>
      )}
      {personalInfo.linkedIn && (
        <span className="flex items-center gap-1">
          <Linkedin className="w-3 h-3 text-indigo-500 shrink-0" /> LinkedIn
        </span>
      )}
      {personalInfo.gitHub && (
        <span className="flex items-center gap-1">
          <Github className="w-3 h-3 text-indigo-500 shrink-0" /> GitHub
        </span>
      )}
    </div>
  );

  return (
    <div className="flex justify-center w-full overflow-x-auto p-2 sm:p-6 bg-slate-200/60 dark:bg-slate-950/80 rounded-2xl">
      {/* Resume Container Sheet */}
      <div 
        ref={previewRef}
        dir={isRtl ? 'rtl' : 'ltr'}
        style={fontStyle}
        className={`${paperClass} ${marginClass} ${fontClass} bg-white text-slate-900 shadow-2xl rounded-sm transition-all duration-300 relative print:shadow-none print:m-0 print:p-8 print:w-full`}
      >
        {/* TOP HEADER SECTION */}
        <div 
          className="pb-5 mb-5 border-b flex items-center justify-between gap-4"
          style={{ borderColor: `${styling.primaryColor}40` }}
        >
          <div className="flex-1">
            <h1 
              className="text-2xl sm:text-3xl font-black tracking-tight"
              style={{ color: styling.primaryColor }}
            >
              {personalInfo.fullName || 'Your Full Name'}
            </h1>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-0.5">
              {personalInfo.jobTitle || 'Target Job Title'}
            </p>
            {renderContactBar()}
          </div>

          {/* Optional Photo */}
          {styling.photoShape !== 'hidden' && personalInfo.photoUrl && (
            <img 
              src={personalInfo.photoUrl} 
              alt={personalInfo.fullName}
              className={`w-20 h-20 object-cover border-2 shadow-sm shrink-0 ${
                styling.photoShape === 'round' ? 'rounded-full' : 'rounded-xl'
              }`}
              style={{ borderColor: styling.primaryColor }}
            />
          )}

          {/* Optional QR Code */}
          {qrDataUrl && (
            <div className="flex flex-col items-center justify-center shrink-0 p-1 bg-white border rounded shadow-xs">
              <img src={qrDataUrl} alt="QR Code" className="w-14 h-14" />
              <span className="text-[8px] text-slate-500 font-semibold mt-0.5">{data.qrCode.label}</span>
            </div>
          )}
        </div>

        {/* DYNAMIC SECTIONS ORDER */}
        <div className="space-y-1">
          {data.sectionOrder.map((sectionKey) => renderSectionContent(sectionKey))}
        </div>
      </div>
    </div>
  );
};
