export type KLevel = 'K1' | 'K2' | 'K3' | 'K4';

export type QuestionMode = 'quick' | 'scenario';

export interface Choice {
  choice_number: number;
  choice_text: string;
  is_correct: boolean;
  explanation: string;
}

export interface Question {
  id: string;
  scenario_id?: string | null;
  question_mode: QuestionMode;
  syllabus_code: string;
  chapter_code: string;
  chapter_number?: number;
  chapter_title: string;
  k_level: KLevel;
  question_text: string;
  choices: Choice[];
  overall_explanation: string;
  syllabus_reference: string;
  syllabus_section_id?: string;
}

export interface Scenario {
  scenario_id: string;
  title: string;
  background_text: string;
  related_section_id?: string;
  chapter_code?: string;
  chapter_title?: string;
  questions: Question[];
}

export interface SyllabusSection {
  id: string;
  syllabus_code: string; // e.g. "AL_TM_v3.0", "FL_v4.0"
  chapter_code: string;  // e.g. "1.1", "2.2.1"
  chapter_number: number;
  title: string;
  k_level?: KLevel;
  content_markdown: string;
  key_terms?: string[];
  audio_url?: string;
}

export interface Syllabus {
  id: string;
  code: string;
  title: string;
  version: string;
  file_path: string;
  description: string;
}

export interface UserAnswerLog {
  question_id: string;
  selected_choice_number: number;
  is_correct: boolean;
  answered_at: number; // timestamp
  question_mode: QuestionMode;
  k_level: KLevel;
  chapter_code: string;
}

export interface BookmarkItem {
  question_id: string;
  added_at: number;
}

export interface ExamSession {
  id: string;
  started_at: number;
  time_limit_sec: number;
  remaining_sec: number;
  completed_at?: number;
  score?: number;
  total_questions: number;
  passed?: boolean;
  answers: {
    [question_id: string]: {
      selected_choice_number?: number;
      flagged: boolean;
    };
  };
}
