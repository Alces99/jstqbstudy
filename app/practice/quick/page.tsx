'use client';

import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  BookOpen, 
  Bookmark, 
  ArrowRight, 
  Filter,
  Sparkles,
  Award
} from 'lucide-react';
import { initialQuickQuestions } from '@/lib/questionsData';
import { Question } from '@/lib/types';
import { saveAnswerLog, isBookmarked, toggleBookmark } from '@/lib/storage';
import KLevelBadge from '@/components/KLevelBadge';
import SyllabusDrawer from '@/components/SyllabusDrawer';
import Link from 'next/link';

export default function QuickPracticePage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // フィルタ状態
  const [countLimit, setCountLimit] = useState<number>(5); // 5, 10, all
  const [selectedKLevel, setSelectedKLevel] = useState<string>('all');
  const [isBookmarkedState, setIsBookmarkedState] = useState(false);

  // 初期ロード・リセット
  const initQuestions = () => {
    let list = [...initialQuickQuestions];
    if (selectedKLevel !== 'all') {
      list = list.filter(q => q.k_level === selectedKLevel);
    }
    // シャッフル
    list = list.sort(() => Math.random() - 0.5);
    if (countLimit > 0 && list.length > countLimit) {
      list = list.slice(0, countLimit);
    }
    setQuestions(list);
    setCurrentIndex(0);
    setSelectedChoice(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  useEffect(() => {
    initQuestions();
  }, [countLimit, selectedKLevel]);

  const currentQ = questions[currentIndex];

  useEffect(() => {
    if (currentQ) {
      setIsBookmarkedState(isBookmarked(currentQ.id));
    }
  }, [currentQ]);

  const handleSelectChoice = (choiceNumber: number) => {
    if (isAnswered || !currentQ) return;
    setSelectedChoice(choiceNumber);
    setIsAnswered(true);

    const choice = currentQ.choices.find(c => c.choice_number === choiceNumber);
    const correct = !!choice?.is_correct;
    if (correct) {
      setScore(prev => prev + 1);
    }

    // 学習履歴を保存
    saveAnswerLog({
      question_id: currentQ.id,
      selected_choice_number: choiceNumber,
      is_correct: correct,
      answered_at: Date.now(),
      question_mode: 'quick',
      k_level: currentQ.k_level,
      chapter_code: currentQ.chapter_code
    });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedChoice(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleToggleBookmark = () => {
    if (!currentQ) return;
    const nextState = toggleBookmark(currentQ.id);
    setIsBookmarkedState(nextState);
  };

  if (questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <Zap className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-800">問題が見つかりませんでした</h2>
        <p className="text-sm text-slate-500 mt-2">条件を変更して再度お試しください。</p>
        <button
          onClick={() => { setSelectedKLevel('all'); setCountLimit(5); }}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold"
        >
          条件をリセット
        </button>
      </div>
    );
  }

  // 終了画面
  if (isFinished) {
    const accuracy = Math.round((score / questions.length) * 100);
    const isPassed = accuracy >= 65;

    return (
      <div className="max-w-xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6">
          <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center ${
            isPassed ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
          }`}>
            <Award className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">一問一答セッション完了</span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
              {isPassed ? '素晴らしい成果です！' : 'お疲れ様でした！復習しましょう'}
            </h2>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500">正解数 / 出題数</p>
              <p className="text-3xl font-black text-slate-900 mt-1">
                {score} <span className="text-sm font-medium text-slate-400">/ {questions.length}</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">正答率</p>
              <p className={`text-3xl font-black mt-1 ${isPassed ? 'text-emerald-600' : 'text-amber-600'}`}>
                {accuracy}%
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={initQuestions}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/20 transition"
            >
              <RotateCcw className="w-4 h-4" />
              もう一度解く
            </button>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition"
            >
              ダッシュボードで分析
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8 space-y-5">
      {/* フィルタ & 進捗バー */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">出題数:</span>
          {[5, 10, 0].map(cnt => (
            <button
              key={cnt}
              onClick={() => setCountLimit(cnt)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                countLimit === cnt
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cnt === 0 ? '全問' : `${cnt}問`}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">難易度:</span>
          {['all', 'K1', 'K2', 'K3'].map(k => (
            <button
              key={k}
              onClick={() => setSelectedKLevel(k)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                selectedKLevel === k
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {k === 'all' ? 'すべて' : k}
            </button>
          ))}
        </div>
      </div>

      {/* プログレスヘッダー */}
      <div className="flex items-center justify-between text-xs font-medium text-slate-500 px-1">
        <span>第 {currentIndex + 1} 問 / 全 {questions.length} 問</span>
        <span>正解数: {score}</span>
      </div>
      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
        <div 
          className="bg-blue-600 h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* 問題カード */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6 relative">
        {/* メタ情報 & ブックマーク */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
              第{currentQ.chapter_code}節 {currentQ.chapter_title}
            </span>
            <KLevelBadge kLevel={currentQ.k_level} showDescription />
          </div>

          <button
            onClick={handleToggleBookmark}
            className={`p-2 rounded-full transition ${
              isBookmarkedState 
                ? 'text-amber-500 bg-amber-50 hover:bg-amber-100' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
            title={isBookmarkedState ? 'ブックマーク解除' : '要復習ブックマーク'}
          >
            <Bookmark className={`w-5 h-5 ${isBookmarkedState ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* 設問文 */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
          {currentQ.question_text}
        </h3>

        {/* 選択肢一覧 */}
        <div className="space-y-3 pt-2">
          {currentQ.choices.map((choice) => {
            const isSelected = selectedChoice === choice.choice_number;
            let btnStyle = "border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/30 text-slate-800";
            let icon = null;

            if (isAnswered) {
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
                disabled={isAnswered}
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

        {/* 解答後の即座解説表示 */}
        {isAnswered && (
          <div className="mt-6 pt-5 border-t border-slate-100 space-y-4 animate-in fade-in duration-200">
            <div className={`p-4 rounded-2xl border ${
              currentQ.choices.find(c => c.choice_number === selectedChoice)?.is_correct
                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                : 'bg-rose-50/60 border-rose-200 text-rose-900'
            }`}>
              <div className="font-bold text-sm mb-1 flex items-center gap-2">
                {currentQ.choices.find(c => c.choice_number === selectedChoice)?.is_correct ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span>正解です！</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-600" />
                    <span>不正解です</span>
                  </>
                )}
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-700 mt-2">
                {currentQ.choices.find(c => c.choice_number === selectedChoice)?.explanation}
              </p>
            </div>

            {/* 全体解説 */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">要約解説</div>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                {currentQ.overall_explanation}
              </p>
            </div>

            {/* シラバス根拠ボタン & 次へボタン */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                onClick={() => setDrawerOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs sm:text-sm font-semibold transition"
              >
                <BookOpen className="w-4 h-4" />
                シラバス該当箇所を見る
              </button>

              <button
                onClick={handleNext}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition transform active:scale-95"
              >
                {currentIndex < questions.length - 1 ? '次の問題へ' : '結果を見る'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* シラバス参照スライドドロワー */}
      <SyllabusDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sectionId={currentQ.syllabus_section_id}
        chapterCode={currentQ.chapter_code}
        referenceText={currentQ.syllabus_reference}
      />
    </div>
  );
}

