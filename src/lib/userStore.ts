import { ToolId } from '../types';

const FAVORITES_KEY = 'splitdrop_favorites';
const RECENT_KEY = 'splitdrop_recent_tools';
const STATS_KEY = 'splitdrop_tool_stats';
const FEEDBACK_KEY = 'splitdrop_user_feedback';

export interface RecentToolItem {
  id: ToolId;
  timestamp: number;
}

export interface ToolStatItem {
  useCount: number;
  downloadCount: number;
  lastUsed: number;
}

export interface FeedbackRecord {
  id: string;
  timestamp: string;
  type: 'bug' | 'feature' | 'general' | 'praise';
  rating: number;
  message: string;
  toolId?: string;
}

// Favorites Management
export function getFavorites(): ToolId[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isFavorite(toolId: ToolId): boolean {
  return getFavorites().includes(toolId);
}

export function toggleFavorite(toolId: ToolId): boolean {
  try {
    const favs = getFavorites();
    let updated: ToolId[];
    let added = false;
    if (favs.includes(toolId)) {
      updated = favs.filter(id => id !== toolId);
    } else {
      updated = [...favs, toolId];
      added = true;
    }
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    // Dispatch custom event for reactive UI updates
    window.dispatchEvent(new CustomEvent('splitdrop_favorites_updated', { detail: updated }));
    return added;
  } catch {
    return false;
  }
}

// Recently Used Management
export function recordToolUsage(toolId: ToolId) {
  if (!toolId) return;
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    let list: RecentToolItem[] = raw ? JSON.parse(raw) : [];
    
    // Remove if already present
    list = list.filter(item => item.id !== toolId);
    
    // Add to top
    list.unshift({ id: toolId, timestamp: Date.now() });
    
    // Keep top 20
    if (list.length > 20) list = list.slice(0, 20);
    
    localStorage.setItem(RECENT_KEY, JSON.stringify(list));
    
    // Increment stats usage
    incrementToolUsage(toolId);

    window.dispatchEvent(new CustomEvent('splitdrop_recent_updated', { detail: list }));
  } catch {
    // ignore
  }
}

export function getRecentTools(): RecentToolItem[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Statistics Management
export function getToolStats(): Record<string, ToolStatItem> {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function incrementToolUsage(toolId: ToolId) {
  try {
    const stats = getToolStats();
    const curr = stats[toolId] || { useCount: 0, downloadCount: 0, lastUsed: Date.now() };
    stats[toolId] = {
      ...curr,
      useCount: curr.useCount + 1,
      lastUsed: Date.now()
    };
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // ignore
  }
}

export function recordDownload(toolId: ToolId) {
  try {
    const stats = getToolStats();
    const curr = stats[toolId] || { useCount: 0, downloadCount: 0, lastUsed: Date.now() };
    stats[toolId] = {
      ...curr,
      downloadCount: curr.downloadCount + 1,
      lastUsed: Date.now()
    };
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    window.dispatchEvent(new CustomEvent('splitdrop_download_recorded', { detail: { toolId } }));
  } catch {
    // ignore
  }
}

// Feedback Management
export function getFeedbackList(): FeedbackRecord[] {
  try {
    const raw = localStorage.getItem(FEEDBACK_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveFeedback(record: Omit<FeedbackRecord, 'id' | 'timestamp'>): FeedbackRecord {
  const newRecord: FeedbackRecord = {
    ...record,
    id: 'fb_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    timestamp: new Date().toISOString()
  };
  try {
    const list = getFeedbackList();
    list.unshift(newRecord);
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
  return newRecord;
}

export function exportFeedbackJSON() {
  const list = getFeedbackList();
  const blob = new Blob([JSON.stringify(list, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `splitdrop_feedback_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// Saved User Summary (Resumes, Notes, etc)
export function getSavedUserDataSummary() {
  let resumesCount = 0;
  let notesCount = 0;
  let habitCount = 0;
  let expenseCount = 0;
  
  try {
    const rawResume = localStorage.getItem('splitdrop_resume_data') || localStorage.getItem('resumeData');
    if (rawResume) resumesCount = 1;
    
    const rawNotes = localStorage.getItem('splitdrop_secure_notes');
    if (rawNotes) {
      const parsed = JSON.parse(rawNotes);
      notesCount = Array.isArray(parsed) ? parsed.length : 1;
    }

    const rawHabits = localStorage.getItem('splitdrop_habits');
    if (rawHabits) {
      const parsed = JSON.parse(rawHabits);
      habitCount = Array.isArray(parsed) ? parsed.length : 0;
    }

    const rawExpenses = localStorage.getItem('splitdrop_expenses');
    if (rawExpenses) {
      const parsed = JSON.parse(rawExpenses);
      expenseCount = Array.isArray(parsed) ? parsed.length : 0;
    }
  } catch {
    // ignore
  }

  return {
    resumesCount,
    notesCount,
    habitCount,
    expenseCount
  };
}
