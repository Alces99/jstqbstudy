'use client';

import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Volume2, 
  Gauge, 
  X,
  FastForward,
  Rewind
} from 'lucide-react';
import { TTSState } from '@/lib/tts';

interface AudioPlayerBarProps {
  ttsState: TTSState;
  sectionTitle: string;
  onPlay: () => void;
  onPause: () => void;
  onSkipBack: () => void;
  onSkipForward: () => void;
  onSpeedChange: (speed: number) => void;
  onClose?: () => void;
}

export default function AudioPlayerBar({
  ttsState,
  sectionTitle,
  onPlay,
  onPause,
  onSkipBack,
  onSkipForward,
  onSpeedChange,
  onClose
}: AudioPlayerBarProps) {
  const speeds = [0.8, 1.0, 1.25, 1.5, 2.0];

  const currentPercent = ttsState.totalParagraphs > 0
    ? Math.round(((ttsState.currentParagraphIndex + 1) / ttsState.totalParagraphs) * 100)
    : 0;

  return (
    <div className="fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl transition-all pb-[env(safe-area-inset-bottom)]">
      {/* 進行状況プログレスバー */}
      <div className="w-full bg-slate-200 h-1.5 relative overflow-hidden">
        <div 
          className="bg-blue-600 h-full transition-all duration-300"
          style={{ width: `${currentPercent}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3">
        {/* タイトルと段落番号 */}
        <div className="flex items-center gap-3 w-full sm:w-1/3 min-w-0">
          <div className="p-2 bg-blue-100 text-blue-700 rounded-lg shrink-0">
            <Volume2 className={`w-5 h-5 ${ttsState.isPlaying ? 'animate-pulse text-blue-600' : ''}`} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-blue-600 font-semibold truncate">シラバス聞き流し音声</p>
            <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate" title={sectionTitle}>
              {sectionTitle || 'セクションを選択してください'}
            </h4>
            <p className="text-[11px] sm:text-xs text-slate-500">
              段落 {ttsState.totalParagraphs > 0 ? ttsState.currentParagraphIndex + 1 : 0} / {ttsState.totalParagraphs} ({currentPercent}%)
            </p>
          </div>
        </div>

        {/* コントロールボタン群 */}
        <div className="flex items-center gap-4 sm:gap-4 justify-center w-full sm:w-auto">
          {/* 戻る（前段落） */}
          <button
            onClick={onSkipBack}
            disabled={ttsState.currentParagraphIndex <= 0}
            className="p-2.5 sm:p-2 text-slate-600 hover:text-slate-900 disabled:opacity-30 hover:bg-slate-100 active:bg-slate-200 rounded-full transition touch-manipulation"
            title="前の段落 (15秒戻し相当)"
            aria-label="前の段落"
          >
            <Rewind className="w-5 h-5" />
          </button>

          {/* 再生 / 一時停止ボタン */}
          <button
            onClick={ttsState.isPlaying ? onPause : onPlay}
            className="w-12 h-12 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-full flex items-center justify-center shadow-md shadow-blue-500/30 transition touch-manipulation"
            title={ttsState.isPlaying ? '一時停止' : '再生'}
            aria-label={ttsState.isPlaying ? '一時停止' : '再生'}
          >
            {ttsState.isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-0.5" />
            )}
          </button>

          {/* 送る（次段落） */}
          <button
            onClick={onSkipForward}
            disabled={ttsState.currentParagraphIndex >= ttsState.totalParagraphs - 1}
            className="p-2.5 sm:p-2 text-slate-600 hover:text-slate-900 disabled:opacity-30 hover:bg-slate-100 active:bg-slate-200 rounded-full transition touch-manipulation"
            title="次の段落 (15秒送り相当)"
            aria-label="次の段落"
          >
            <FastForward className="w-5 h-5" />
          </button>
        </div>

        {/* 再生速度調整 & 閉じる */}
        <div className="flex items-center gap-2 sm:justify-end w-full sm:w-1/3">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <Gauge className="w-4 h-4 text-slate-500 ml-1" />
            {speeds.map((s) => (
              <button
                key={s}
                onClick={() => onSpeedChange(s)}
                className={`px-2 py-0.5 rounded text-xs font-medium transition ${
                  ttsState.rate === s
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition ml-2"
              title="プレイヤーを閉じる"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

