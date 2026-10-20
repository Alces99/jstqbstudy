'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Headphones, 
  Search, 
  ChevronRight, 
  Volume2, 
  Play, 
  Pause,
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { syllabiList, syllabusSections } from '@/lib/syllabusData';
import { SyllabusSection } from '@/lib/types';
import { SyllabusTTSPlayer, TTSState } from '@/lib/tts';
import KLevelBadge from '@/components/KLevelBadge';
import AudioPlayerBar from '@/components/AudioPlayerBar';

export default function SyllabusViewerPage() {
  const [selectedSyllabusCode, setSelectedSyllabusCode] = useState<string>('AL_TM_v3.0');
  const [selectedSectionId, setSelectedSectionId] = useState<string>(syllabusSections[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [ttsState, setTtsState] = useState<TTSState>({
    isPlaying: false,
    isPaused: false,
    currentParagraphIndex: 0,
    totalParagraphs: 0,
    rate: 1.0
  });

  const playerRef = useRef<SyllabusTTSPlayer | null>(null);
  const paragraphRefs = useRef<(HTMLDivElement | null)[]>([]);

  // TTSプレイヤーの初期化
  useEffect(() => {
    const player = new SyllabusTTSPlayer();
    player.setListener((state) => {
      setTtsState(state);
    });
    playerRef.current = player;

    return () => {
      player.stop();
    };
  }, []);

  // 選択中の節
  const currentSection = syllabusSections.find(s => s.id === selectedSectionId) || syllabusSections[0];

  // セクションの本文を段落に分割
  const paragraphs = currentSection.content_markdown
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  // セクション変更時にTTSをセット
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.loadParagraphs(paragraphs, 0);
    }
  }, [selectedSectionId]);

  // 読み上げ中の段落へ自動スクロール
  useEffect(() => {
    if (ttsState.isPlaying && paragraphRefs.current[ttsState.currentParagraphIndex]) {
      paragraphRefs.current[ttsState.currentParagraphIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [ttsState.currentParagraphIndex, ttsState.isPlaying]);

  // シラバスごとのセクション絞り込み
  const filteredSections = syllabusSections.filter(s => {
    const matchCode = s.syllabus_code === selectedSyllabusCode;
    if (!matchCode) return false;
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return s.title.toLowerCase().includes(query) || 
      s.chapter_code.toLowerCase().includes(query) ||
      s.content_markdown.toLowerCase().includes(query) ||
      (s.key_terms && s.key_terms.some(t => t.toLowerCase().includes(query)));
  });

  // 章ごとにグルーピング
  const groupedSections: Record<number, SyllabusSection[]> = {};
  filteredSections.forEach(sec => {
    if (!groupedSections[sec.chapter_number]) {
      groupedSections[sec.chapter_number] = [];
    }
    groupedSections[sec.chapter_number].push(sec);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 space-y-6">
      {/* ページ上部セレクタ */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">公式シラバス階層リーダー</span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
            シラバス本文閲覧 & 音声聞き流し
          </h1>
        </div>

        {/* シラバス切り替えタブ */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          {syllabiList.map(syl => (
            <button
              key={syl.code}
              onClick={() => {
                setSelectedSyllabusCode(syl.code);
                const first = syllabusSections.find(s => s.syllabus_code === syl.code);
                if (first) setSelectedSectionId(first.id);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                selectedSyllabusCode === syl.code
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {syl.code}
            </button>
          ))}
        </div>
      </div>

      {/* メインレイアウト: 左サイドバー目次ツリー + 右本文ビューア */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 左: 目次ツリー (4カラム) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4 max-h-[75vh] overflow-y-auto sticky top-20">
          {/* 検索入力 */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="シラバス本文・用語を検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>

          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider pt-1">
            目次・節一覧
          </div>

          {/* ツリー構造 */}
          <div className="space-y-3">
            {Object.keys(groupedSections).map((chNum) => {
              const secs = groupedSections[Number(chNum)];
              return (
                <div key={chNum} className="space-y-1">
                  <div className="text-xs font-bold text-slate-700 bg-slate-50 px-2.5 py-1.5 rounded-lg">
                    第 {chNum} 章
                  </div>
                  <div className="space-y-1 pl-2">
                    {secs.map(sec => {
                      const isSelected = selectedSectionId === sec.id;
                      return (
                        <button
                          key={sec.id}
                          onClick={() => setSelectedSectionId(sec.id)}
                          className={`w-full text-left p-2 rounded-xl text-xs transition flex items-start gap-2 ${
                            isSelected
                              ? 'bg-blue-50 text-blue-800 font-bold border border-blue-200'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          <span className="shrink-0 text-slate-400 font-mono">{sec.chapter_code}</span>
                          <span className="flex-1 truncate leading-tight">{sec.title}</span>
                          {sec.k_level && <KLevelBadge kLevel={sec.k_level} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 右: 本文ビューア & 読み上げ段落ハイライト (8カラム) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
          {/* 節ヘッダー */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                  第 {currentSection.chapter_code} 節
                </span>
                {currentSection.k_level && (
                  <KLevelBadge kLevel={currentSection.k_level} showDescription />
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                {currentSection.title}
              </h2>
            </div>

            {/* 音声聞き流し再生開始ボタン */}
            <button
              onClick={() => {
                if (ttsState.isPlaying) {
                  playerRef.current?.pause();
                } else {
                  playerRef.current?.play();
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-500/20 transition transform active:scale-95"
            >
              {ttsState.isPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  一時停止
                </>
              ) : (
                <>
                  <Headphones className="w-4 h-4" />
                  この節を聞き流す
                </>
              )}
            </button>
          </div>

          {/* キーワードタグ */}
          {currentSection.key_terms && currentSection.key_terms.length > 0 && (
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1.5">
              <span className="text-xs font-bold text-slate-500">学習キー用語:</span>
              <div className="flex flex-wrap gap-1.5">
                {currentSection.key_terms.map(term => (
                  <span
                    key={term}
                    className="px-2.5 py-1 bg-white text-slate-700 text-xs font-medium rounded-lg border border-slate-200 shadow-2xs"
                  >
                    {term}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 段落ごとの本文レンダリング (読み上げ中の段落はハイライト表示) */}
          <div className="space-y-4 pt-2">
            {paragraphs.map((para, index) => {
              const isCurrentReading = ttsState.isPlaying && ttsState.currentParagraphIndex === index;
              return (
                <div
                  key={index}
                  ref={el => { paragraphRefs.current[index] = el; }}
                  onClick={() => playerRef.current?.play(index)}
                  className={`p-3 rounded-2xl transition cursor-pointer text-sm sm:text-base leading-relaxed ${
                    isCurrentReading 
                      ? 'highlight-reading shadow-xs' 
                      : 'hover:bg-slate-50 text-slate-800'
                  }`}
                  title="クリックでこの段落から読み上げ"
                >
                  <p className="whitespace-pre-wrap">{para}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 固定オーディオプレイヤーバー */}
      <AudioPlayerBar
        ttsState={ttsState}
        sectionTitle={`第${currentSection.chapter_code}節: ${currentSection.title}`}
        onPlay={() => playerRef.current?.play()}
        onPause={() => playerRef.current?.pause()}
        onSkipBack={() => playerRef.current?.skipBackward()}
        onSkipForward={() => playerRef.current?.skipForward()}
        onSpeedChange={(speed) => playerRef.current?.setRate(speed)}
      />
    </div>
  );
}

