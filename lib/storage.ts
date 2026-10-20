import { UserAnswerLog, ExamSession, QuestionMode, KLevel } from './types';
import { initialQuickQuestions, initialScenarioGroups } from './questionsData';

const STORAGE_KEYS = {
  ANSWER_LOGS: 'jstqb_answer_logs',
  BOOKMARKS: 'jstqb_bookmarks',
  EXAM_SESSIONS: 'jstqb_exam_sessions',
};

export function getAnswerLogs(): UserAnswerLog[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ANSWER_LOGS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load answer logs', e);
    return [];
  }
}

export function saveAnswerLog(log: UserAnswerLog): void {
  if (typeof window === 'undefined') return;
  try {
    const logs = getAnswerLogs();
    logs.push(log);
    localStorage.setItem(STORAGE_KEYS.ANSWER_LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to save answer log', e);
  }
}

export function getBookmarks(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load bookmarks', e);
    return [];
  }
}

export function toggleBookmark(questionId: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const bookmarks = getBookmarks();
    const index = bookmarks.indexOf(questionId);
    let bookmarked = false;
    if (index >= 0) {
      bookmarks.splice(index, 1);
      bookmarked = false;
    } else {
      bookmarks.push(questionId);
      bookmarked = true;
    }
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
    return bookmarked;
  } catch (e) {
    console.error('Failed to toggle bookmark', e);
    return false;
  }
}

export function isBookmarked(questionId: string): boolean {
  const bookmarks = getBookmarks();
  return bookmarks.includes(questionId);
}

export function saveExamSession(session: ExamSession): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EXAM_SESSIONS);
    const sessions: ExamSession[] = raw ? JSON.parse(raw) : [];
    const index = sessions.findIndex(s => s.id === session.id);
    if (index >= 0) {
      sessions[index] = session;
    } else {
      sessions.unshift(session);
    }
    localStorage.setItem(STORAGE_KEYS.EXAM_SESSIONS, JSON.stringify(sessions));
  } catch (e) {
    console.error('Failed to save exam session', e);
  }
}

export function getExamSessions(): ExamSession[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EXAM_SESSIONS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load exam sessions', e);
    return [];
  }
}

export function clearAllLearningData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.ANSWER_LOGS);
  localStorage.removeItem(STORAGE_KEYS.BOOKMARKS);
  localStorage.removeItem(STORAGE_KEYS.EXAM_SESSIONS);
}

// 統計サマリー計算
export interface DashboardStats {
  totalAnswered: number;
  totalCorrect: number;
  accuracyRate: number;
  quickAccuracyRate: number;
  scenarioAccuracyRate: number;
  kLevelStats: Record<KLevel, { total: number; correct: number; rate: number }>;
  chapterStats: Record<string, { title: string; total: number; correct: number; rate: number }>;
  incorrectQuestionIds: string[];
  bookmarkedQuestionIds: string[];
}

export function calculateDashboardStats(): DashboardStats {
  const logs = getAnswerLogs();
  const bookmarks = getBookmarks();

  let totalAnswered = logs.length;
  let totalCorrect = logs.filter(l => l.is_correct).length;
  let accuracyRate = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  const quickLogs = logs.filter(l => l.question_mode === 'quick');
  const scenarioLogs = logs.filter(l => l.question_mode === 'scenario');

  const quickAccuracyRate = quickLogs.length > 0 
    ? Math.round((quickLogs.filter(l => l.is_correct).length / quickLogs.length) * 100) 
    : 0;

  const scenarioAccuracyRate = scenarioLogs.length > 0 
    ? Math.round((scenarioLogs.filter(l => l.is_correct).length / scenarioLogs.length) * 100) 
    : 0;

  const kLevelStats: Record<KLevel, { total: number; correct: number; rate: number }> = {
    K1: { total: 0, correct: 0, rate: 0 },
    K2: { total: 0, correct: 0, rate: 0 },
    K3: { total: 0, correct: 0, rate: 0 },
    K4: { total: 0, correct: 0, rate: 0 },
  };

  for (const log of logs) {
    if (kLevelStats[log.k_level]) {
      kLevelStats[log.k_level].total += 1;
      if (log.is_correct) kLevelStats[log.k_level].correct += 1;
    }
  }

  for (const k of ['K1', 'K2', 'K3', 'K4'] as KLevel[]) {
    const s = kLevelStats[k];
    s.rate = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
  }

  const chapterNames: Record<string, string> = {
    '1': '第1章: テストプロセス',
    '2': '第2章: リスクベースドテスト',
    '3': '第3章: レビューのマネジメント',
    '4': '第4章: 欠陥マネジメント',
    '5': '第5章: テストプロセス改善',
    '6': '第6章: ツールと自動化',
    '7': '第7章: スキルとチーム構成',
  };

  const chapterStats: Record<string, { title: string; total: number; correct: number; rate: number }> = {};
  for (let ch = 1; ch <= 7; ch++) {
    chapterStats[String(ch)] = {
      title: chapterNames[String(ch)],
      total: 0,
      correct: 0,
      rate: 0
    };
  }

  // 最新の各設問ごとの正誤判定マップ
  const latestByQuestion: Record<string, UserAnswerLog> = {};
  for (const log of logs) {
    // タイムスタンプ順
    if (!latestByQuestion[log.question_id] || latestByQuestion[log.question_id].answered_at < log.answered_at) {
      latestByQuestion[log.question_id] = log;
    }
  }

  for (const log of logs) {
    const mainChapter = log.chapter_code ? log.chapter_code.split('.')[0] : '1';
    if (chapterStats[mainChapter]) {
      chapterStats[mainChapter].total += 1;
      if (log.is_correct) chapterStats[mainChapter].correct += 1;
    }
  }

  for (const ch in chapterStats) {
    const s = chapterStats[ch];
    s.rate = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
  }

  const incorrectQuestionIds = Object.values(latestByQuestion)
    .filter(l => !l.is_correct)
    .map(l => l.question_id);

  return {
    totalAnswered,
    totalCorrect,
    accuracyRate,
    quickAccuracyRate,
    scenarioAccuracyRate,
    kLevelStats,
    chapterStats,
    incorrectQuestionIds,
    bookmarkedQuestionIds: bookmarks
  };
}

