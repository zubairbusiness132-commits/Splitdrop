import { ResumeData } from '../types/resume';
import { SAMPLE_RESUME_DATA, EMPTY_RESUME_DATA } from '../data/resumeTemplatesData';
import { CoverLetterData, getDefaultCoverLetter } from '../data/careerData';

const ACTIVE_RESUME_KEY = 'splitdrop_active_resume';
const RESUME_VERSIONS_KEY = 'splitdrop_resume_versions';
const ACTIVE_COVER_LETTER_KEY = 'splitdrop_active_cover_letter';
const COVER_LETTER_VERSIONS_KEY = 'splitdrop_cover_letter_versions';

export function getActiveResume(): ResumeData {
  try {
    const raw = localStorage.getItem(ACTIVE_RESUME_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && parsed.personalInfo) {
        return parsed as ResumeData;
      }
    }
  } catch (e) {
    console.warn('[ResumeStore] Failed to load active resume:', e);
  }

  // Fallback to initial sample
  const initial: ResumeData = {
    ...SAMPLE_RESUME_DATA,
    id: `resume_${Date.now()}`,
    updatedAt: Date.now()
  };
  saveActiveResume(initial);
  return initial;
}

export function saveActiveResume(data: ResumeData): void {
  try {
    const updated = { ...data, updatedAt: Date.now() };
    localStorage.setItem(ACTIVE_RESUME_KEY, JSON.stringify(updated));
    
    // Also sync into versions
    const versions = getResumeVersions();
    const existingIdx = versions.findIndex(v => v.id === updated.id);
    if (existingIdx >= 0) {
      versions[existingIdx] = updated;
    } else {
      versions.unshift(updated);
    }
    localStorage.setItem(RESUME_VERSIONS_KEY, JSON.stringify(versions));
  } catch (e) {
    console.warn('[ResumeStore] Failed to save active resume:', e);
  }
}

export function getResumeVersions(): ResumeData[] {
  try {
    const raw = localStorage.getItem(RESUME_VERSIONS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed as ResumeData[];
      }
    }
  } catch (e) {
    console.warn('[ResumeStore] Failed to load versions:', e);
  }
  const active = getActiveResume();
  return [active];
}

export function saveResumeVersions(versions: ResumeData[]): void {
  try {
    localStorage.setItem(RESUME_VERSIONS_KEY, JSON.stringify(versions));
  } catch (e) {
    console.warn('[ResumeStore] Failed to save versions:', e);
  }
}

export function getActiveCoverLetter(): CoverLetterData {
  try {
    const raw = localStorage.getItem(ACTIVE_COVER_LETTER_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && parsed.personalInfo) {
        return parsed as CoverLetterData;
      }
    }
  } catch (e) {
    console.warn('[ResumeStore] Failed to load active cover letter:', e);
  }

  const initial = getDefaultCoverLetter();
  saveActiveCoverLetter(initial);
  return initial;
}

export function saveActiveCoverLetter(data: CoverLetterData): void {
  try {
    const updated = { ...data, updatedAt: Date.now() };
    localStorage.setItem(ACTIVE_COVER_LETTER_KEY, JSON.stringify(updated));
    
    const versions = getCoverLetterVersions();
    const existingIdx = versions.findIndex(v => v.id === updated.id);
    if (existingIdx >= 0) {
      versions[existingIdx] = updated;
    } else {
      versions.unshift(updated);
    }
    localStorage.setItem(COVER_LETTER_VERSIONS_KEY, JSON.stringify(versions));
  } catch (e) {
    console.warn('[ResumeStore] Failed to save active cover letter:', e);
  }
}

export function getCoverLetterVersions(): CoverLetterData[] {
  try {
    const raw = localStorage.getItem(COVER_LETTER_VERSIONS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed as CoverLetterData[];
      }
    }
  } catch (e) {
    console.warn('[ResumeStore] Failed to load cover letter versions:', e);
  }
  const active = getActiveCoverLetter();
  return [active];
}
