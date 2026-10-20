export interface TTSState {
  isPlaying: boolean;
  isPaused: boolean;
  currentParagraphIndex: number;
  totalParagraphs: number;
  rate: number; // 0.8 to 2.0
}

// 専門用語・略語の読み上げ辞書
const PRONUNCIATION_DICTIONARY: [RegExp, string][] = [
  [/\bRBT\b/g, 'リスクベースドテスト'],
  [/\bRPN\b/g, 'アールピーエヌ'],
  [/\bTMMi\b/g, 'ティーエムエムアイ'],
  [/\bTPI Next\b/g, 'ティーピーアイネクスト'],
  [/\bFMEA\b/g, 'エフエムイーエー'],
  [/\bUAT\b/g, '受入テスト'],
  [/\bDRE\b/g, 'ディーアールイー'],
  [/\bROI\b/g, 'アールオーアイ'],
  [/\bPoC\b/g, 'ポック'],
  [/\bMTP\b/g, 'マスターテスト計画'],
  [/\bLTP\b/g, 'レベルテスト計画'],
  [/\bK1\b/g, 'ケーワン'],
  [/\bK2\b/g, 'ケーツー'],
  [/\bK3\b/g, 'ケースリー'],
  [/\bK4\b/g, 'ケーフォー'],
  [/\bJSTQB\b/g, 'ジェイエスティークイビー'],
  [/\bAL TM\b/g, 'アドバンスドレベル テストマネージャ'],
  [/\bFL\b/g, 'ファンデーションレベル'],
  [/\bTA\b/g, 'テストアナリスト'],
];

export function normalizeSpeechText(text: string): string {
  // Markdown記号の除去
  let clean = text
    .replace(/^#+\s+/gm, '') // 見出し記号
    .replace(/\*\*([^*]+)\*\*/g, '$1') // 太字
    .replace(/\*([^*]+)\*/g, '$1') // 斜体
    .replace(/`([^`]+)`/g, '$1') // インラインコード
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // リンク
    .replace(/^[\s-]*[-*+]\s+/gm, '') // リストマーカー
    .replace(/^\|.*\|$/gm, ''); // テーブル行

  // 専門用語置換
  for (const [pattern, replacement] of PRONUNCIATION_DICTIONARY) {
    clean = clean.replace(pattern, replacement);
  }

  return clean.trim();
}

export class SyllabusTTSPlayer {
  private synth: SpeechSynthesis | null = null;
  private utterance: SpeechSynthesisUtterance | null = null;
  private paragraphs: string[] = [];
  private currentIndex: number = 0;
  private rate: number = 1.0;
  private onStateChange: ((state: TTSState) => void) | null = null;
  private japaneseVoice: SpeechSynthesisVoice | null = null;
  private isManuallyStopped: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoice();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => this.initVoice();
      }
    }
  }

  private initVoice() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    // 日本語の音声を優先 (iOS: Kyoko, Otoya, Hattori 等)
    this.japaneseVoice = voices.find(v => 
      v.lang === 'ja_JP' || 
      v.lang === 'ja-JP' || 
      v.lang.startsWith('ja')
    ) || null;
  }

  public setListener(listener: (state: TTSState) => void) {
    this.onStateChange = listener;
  }

  // iOS Safari向けのアンロック処理（ユーザー操作時に一度空の発話を走らせる）
  public unlockIOS() {
    if (!this.synth) return;
    try {
      const dummy = new SpeechSynthesisUtterance('');
      dummy.volume = 0;
      dummy.rate = 2;
      this.synth.speak(dummy);
    } catch (e) {
      // ignore
    }
  }

  private notify() {
    if (!this.onStateChange) return;
    this.onStateChange({
      isPlaying: !!(this.synth && this.synth.speaking && !this.synth.paused),
      isPaused: !!(this.synth && this.synth.paused),
      currentParagraphIndex: this.currentIndex,
      totalParagraphs: this.paragraphs.length,
      rate: this.rate
    });
  }

  public loadParagraphs(paragraphs: string[], startIndex: number = 0) {
    this.stop();
    this.paragraphs = paragraphs;
    this.currentIndex = Math.max(0, Math.min(startIndex, paragraphs.length - 1));
    this.notify();
  }

  public play(index?: number) {
    if (!this.synth || this.paragraphs.length === 0) return;

    if (this.synth.paused) {
      this.synth.resume();
      this.notify();
      return;
    }

    if (index !== undefined) {
      this.currentIndex = Math.max(0, Math.min(index, this.paragraphs.length - 1));
    }

    this.isManuallyStopped = false;
    this.playCurrent();
  }

  private playCurrent() {
    if (!this.synth || this.isManuallyStopped) return;
    if (this.currentIndex >= this.paragraphs.length) {
      this.stop();
      return;
    }

    this.synth.cancel();

    const rawText = this.paragraphs[this.currentIndex];
    const textToSpeak = normalizeSpeechText(rawText);

    if (!textToSpeak) {
      // 空行なら次へスキップ
      this.currentIndex++;
      this.playCurrent();
      return;
    }

    this.utterance = new SpeechSynthesisUtterance(textToSpeak);
    this.utterance.lang = 'ja-JP';
    if (this.japaneseVoice) {
      this.utterance.voice = this.japaneseVoice;
    }
    this.utterance.rate = this.rate;

    this.utterance.onstart = () => {
      this.notify();
    };

    this.utterance.onend = () => {
      if (!this.isManuallyStopped && this.currentIndex < this.paragraphs.length - 1) {
        this.currentIndex++;
        this.playCurrent();
      } else {
        this.notify();
      }
    };

    this.utterance.onerror = (e) => {
      console.warn('TTS error', e);
      this.notify();
    };

    this.synth.speak(this.utterance);
    this.notify();
  }

  public pause() {
    if (this.synth && this.synth.speaking && !this.synth.paused) {
      this.synth.pause();
      this.notify();
    }
  }

  public stop() {
    this.isManuallyStopped = true;
    if (this.synth) {
      this.synth.cancel();
    }
    this.notify();
  }

  public setRate(newRate: number) {
    this.rate = Math.max(0.8, Math.min(2.0, newRate));
    if (this.synth && this.synth.speaking && !this.synth.paused) {
      // 速度を変更して現在の段落を再開
      this.playCurrent();
    } else {
      this.notify();
    }
  }

  public skipForward() {
    // 15秒送り相当: 次の段落へスキップ
    if (this.currentIndex < this.paragraphs.length - 1) {
      this.currentIndex++;
      this.playCurrent();
    }
  }

  public skipBackward() {
    // 15秒戻し相当: 前の段落へスキップ
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.playCurrent();
    }
  }

  public getState(): TTSState {
    return {
      isPlaying: !!(this.synth && this.synth.speaking && !this.synth.paused),
      isPaused: !!(this.synth && this.synth.paused),
      currentParagraphIndex: this.currentIndex,
      totalParagraphs: this.paragraphs.length,
      rate: this.rate
    };
  }
}

