'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  ArrowLeft, 
  BookOpen, 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  ChevronRight, 
  ChevronLeft,
  Bookmark,
  Share2
} from 'lucide-react';
import { initialScenarioGroups } from '@/lib/questionsData';
import { saveAnswerLog, isBookmarked, toggleBookmark } from '@/lib/storage';
import KLevelBadge from '@/components/KLevelBadge';
import SyllabusDrawer from '@/components/SyllabusDrawer';

export default function ScenarioDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const scenario = initialScenarioGroups.find(s => s.scenario_id === resolvedParams.id);

  if (!scenario) {
    notFound();
  }

  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { choiceNumber: number; isAnswered: boolean }>>({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeDrawerSectionId, setActiveDrawerSectionId] = useState<string | undefined>(undefined);
  const [activeDrawerChapterCode, setActiveDrawerChapterCode] = useState<string | undefined>(undefined);
  // モバイル・iOS向けのタブ切替（'scenario' | 'question'）
  const [mobileTab, setMobileTab] = useState<'scenario' | 'question'>('question');

  const currentQuestion = scenario.questions[activeQuestionIndex];
  const currentAnswer = answers[currentQuestion.id];

  const handleSelectChoice = (choiceNumber: number) => {
    if (currentAnswer?.isAnswered) return;

    const choice = currentQuestion.choices.find(c => c.choice_number === choiceNumber);
    const correct = !!choice?.is_correct;

    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: {
        choiceNumber,
        isAnswered: true
      }
    }));

    saveAnswerLog({
      question_id: currentQuestion.id,
      selected_choice_number: choiceNumber,
      is_correct: correct,
      answered_at: Date.now(),
      question_mode: 'scenario',
      k_level: currentQuestion.k_level,
      chapter_code: currentQuestion.chapter_code
    });
  };

  const openDrawerForCurrent = () => {
    setActiveDrawerSectionId(currentQuestion.syllabus_section_id || scenario.related_section_id);
    setActiveDrawerChapterCode(currentQuestion.chapter_code);
    setDrawerOpen(true);
  };

  // 全問解答済みか
  const allAnswered = scenario.questions.every(q => answers[q.id]?.isAnswered);
  const totalCorrect = scenario.questions.filter(q => {
    const ans = answers[q.id];
    if (!ans) return false;
    return !!q.choices.find(c => c.choice_number === ans.choiceNumber)?.is_correct;
  }).length;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-slate-50">
      {/* トップサブバー */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/practice/scenario"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
              大問演習
            </span>
            <h2 className="text-sm font-bold text-slate-900 truncate max-w-[160px] sm:max-w-md">
              {scenario.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openDrawerForCurrent}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold border border-blue-200 transition"
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">シラバス根拠を表示</span>
            <span className="sm:hidden">シラバス</span>
          </button>
        </div>
      </div>

      {/* モバイル（iOS）専用: シナリオ本文 / 設問 切替タブ */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-center gap-2 sticky top-16 z-20">
        <button
          onClick={() => setMobileTab('scenario')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
            mobileTab === 'scenario'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          📄 シナリオ本文を読む
        </button>
        <button
          onClick={() => setMobileTab('question')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
            mobileTab === 'question'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          ✍️ 設問に回答する ({activeQuestionIndex + 1}/{scenario.questions.length})
        </button>
      </div>

      {/* 左右2分割スプリットビュー */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* 左ペイン: シナリオ本文・前提・メトリクス表 */}
        <div className={`w-full lg:w-1/2 p-4 sm:p-6 lg:p-8 overflow-y-auto border-b lg:border-b-0 lg:border-r border-slate-200 bg-white space-y-6 ${
          mobileTab === 'question' ? 'hidden lg:block' : 'block'
        }`}>
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
              【前提シナリオ・プロジェクト背景】
            </h3>
            <span className="text-xs text-slate-400">常時スクロール可能</span>
          </div>

          <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
            {scenario.background_text}
          </div>

          {/* モバイルでシナリオ読了後、設問へ進むボタン */}
          <div className="lg:hidden pt-4 pb-8">
            <button
              onClick={() => setMobileTab('question')}
              className="w-full py-3 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-md transition"
            >
              設問へ進む (設問 {activeQuestionIndex + 1} へ) →
            </button>
          </div>
        </div>

        {/* 右ペイン: 設問群・選択肢 */}
        <div className={`w-full lg:w-1/2 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-slate-50 space-y-6 ${
          mobileTab === 'scenario' ? 'hidden lg:block' : 'block'
        }`}>
          {/* 設問ステッパー / タブ */}
          <div className="flex items-center justify-between bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {scenario.questions.map((q, idx) => {
                const ans = answers[q.id];
                const isActive = activeQuestionIndex === idx;
                let statusBadge = 'bg-slate-100 text-slate-600';

                if (ans?.isAnswered) {
                  const correct = !!q.choices.find(c => c.choice_number === ans.choiceNumber)?.is_correct;
                  statusBadge = correct ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setActiveQuestionIndex(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      isActive 
                        ? 'bg-indigo-600 text-white shadow-xs' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>設問 {idx + 1}</span>
                    <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : statusBadge}`} />
                  </button>
                );
              })}
            </div>

            <span className="text-xs text-slate-500 font-medium px-2">
              {activeQuestionIndex + 1} / {scenario.questions.length}
            </span>
          </div>

          {/* 現在の設問カード */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">設問 {activeQuestionIndex + 1}</span>
                <KLevelBadge kLevel={currentQuestion.k_level} showDescription />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMobileTab('scenario')}
                  className="lg:hidden text-xs text-indigo-600 font-bold hover:underline"
                >
                  シナリオ確認
                </button>
                <span className="text-xs text-slate-400">
                  第{currentQuestion.chapter_code}節
                </span>
              </div>
            </div>

            <h4 className="text-base font-bold text-slate-900 leading-relaxed">
              {currentQuestion.question_text}
            </h4>

            {/* 選択肢 */}
            <div className="space-y-3">
              {currentQuestion.choices.map((choice) => {
                const isSelected = currentAnswer?.choiceNumber === choice.choice_number;
                let btnStyle = "border-slate-200 hover:border-indigo-400 bg-slate-50/50 hover:bg-indigo-50/30 text-slate-800";
                let icon = null;

                if (currentAnswer?.isAnswered) {
                  if (choice.is_correct) {
                    btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold ring-2 ring-emerald-500/20";
                    icon = <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />;
                  } else if (isSelected) {
                    btnStyle = "border-rose-400 bg-rose-50 text-rose-950 ring-2 ring-rose-400/20";
                    icon = <XCircle className="w-5 h-5 text-rose-600 shrink-0" />;
                  } else {
                    btnStyle = "opacity-40 border-slate-200 bg-slate-50 text-slate-400";
                  }
                }

                return (
                  <button
                    key={choice.choice_number}
                    onClick={() => handleSelectChoice(choice.choice_number)}
                    disabled={currentAnswer?.isAnswered}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition flex items-start gap-3 text-sm ${btnStyle}`}
                  >
                    <span className="w-6 h-6 rounded-full bg-white border border-slate-300 flex items-center justify-center font-bold text-xs text-slate-700 shrink-0 mt-0.5">
                      {choice.choice_number}
                    </span>
                    <span className="flex-1 leading-relaxed">{choice.choice_text}</span>
                    {icon}
                  </button>
                );
              })}
            </div>

            {/* 解説セクション */}
            {currentAnswer?.isAnswered && (
              <div className="mt-6 pt-5 border-t border-slate-100 space-y-4 animate-in fade-in duration-200">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">解説</div>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                    {currentQuestion.overall_explanation}
                  </p>
                  <p className="text-xs text-indigo-700 font-medium pt-1">
                    根拠: {currentQuestion.syllabus_reference}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={openDrawerForCurrent}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold transition border border-blue-200"
                  >
                    <BookOpen className="w-4 h-4" />
                    シラバス本文を確認
                  </button>

                  <div className="flex items-center gap-2">
                    {activeQuestionIndex > 0 && (
                      <button
                        onClick={() => setActiveQuestionIndex(prev => prev - 1)}
                        className="px-3 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition"
                      >
                        前へ
                      </button>
                    )}
                    {activeQuestionIndex < scenario.questions.length - 1 && (
                      <button
                        onClick={() => setActiveQuestionIndex(prev => prev + 1)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition"
                      >
                        次の設問へ
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 全問完了サマリー */}
          {allAnswered && (
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-lg space-y-3">
              <h4 className="font-black text-lg">大問完了！</h4>
              <p className="text-xs sm:text-sm text-emerald-100">
                すべての小問への回答が完了しました。正解数: {totalCorrect} / {scenario.questions.length} 問
              </p>
              <div className="pt-2 flex gap-3">
                <Link
                  href="/practice/scenario"
                  className="px-4 py-2 bg-white text-emerald-800 text-xs font-bold rounded-xl hover:bg-emerald-50 transition"
                >
                  シナリオ一覧へ戻る
                </Link>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 bg-emerald-700/60 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition"
                >
                  学習分析を見る
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* シラバススライドドロワー */}
      <SyllabusDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sectionId={activeDrawerSectionId}
        chapterCode={activeDrawerChapterCode}
        referenceText={currentQuestion.syllabus_reference}
      />
    </div>
  );
}

