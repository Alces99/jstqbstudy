'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Award, 
  Clock, 
  Flag, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  RotateCcw, 
  ListFilter,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { initialQuickQuestions, initialScenarioGroups } from '@/lib/questionsData';
import { Question, ExamSession } from '@/lib/types';
import { saveExamSession, saveAnswerLog } from '@/lib/storage';
import KLevelBadge from '@/components/KLevelBadge';
import SyllabusDrawer from '@/components/SyllabusDrawer';

export default function MockExamPage() {
  const [examStarted, setExamStarted] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [examType, setExamType] = useState<'standard' | 'short'>('short'); // standard=65問, short=15問
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { selectedChoice?: number; flagged: boolean }>>({});
  const [remainingTime, setRemainingTime] = useState(180 * 60); // AL TM本番は180分
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scoreData, setScoreData] = useState<{
    score: number;
    total: number;
    accuracy: number;
    isPassed: boolean;
  } | null>(null);

  // 問題プールを生成
  const generateExamQuestions = (count: number) => {
    // 全問題を統合
    const pool: Question[] = [
      ...initialQuickQuestions,
      ...initialScenarioGroups.flatMap(s => s.questions)
    ];

    // 本番シミュレーションのため重複やシャッフル対応
    const selected: Question[] = [];
    while (selected.length < count) {
      const shuffled = [...pool].sort(() => Math.random() - 0.5);
      for (const q of shuffled) {
        if (selected.length >= count) break;
        // 重複してもよいようにユニークIDを付与
        selected.push({
          ...q,
          id: `${q.id}_exam_${selected.length + 1}`
        });
      }
    }
    return selected;
  };

  const handleStartExam = (type: 'standard' | 'short') => {
    setExamType(type);
    const count = type === 'standard' ? 65 : 15;
    const timeSec = type === 'standard' ? 180 * 60 : 45 * 60;

    const examQs = generateExamQuestions(count);
    setQuestions(examQs);
    setCurrentIndex(0);
    setAnswers({});
    setRemainingTime(timeSec);
    setExamStarted(true);
    setExamFinished(false);
    setScoreData(null);
  };

  // タイマー処理
  useEffect(() => {
    if (!examStarted || examFinished) return;

    const timer = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          finishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, examFinished, questions, answers]);

  const handleSelectChoice = (choiceNumber: number) => {
    if (examFinished) return;
    const currentQ = questions[currentIndex];
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: {
        selectedChoice: choiceNumber,
        flagged: !!prev[currentQ.id]?.flagged
      }
    }));
  };

  const handleToggleFlag = () => {
    const currentQ = questions[currentIndex];
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: {
        selectedChoice: prev[currentQ.id]?.selectedChoice,
        flagged: !prev[currentQ.id]?.flagged
      }
    }));
  };

  const finishExam = () => {
    let correctCount = 0;
    questions.forEach(q => {
      const ans = answers[q.id];
      if (ans?.selectedChoice !== undefined) {
        const choice = q.choices.find(c => c.choice_number === ans.selectedChoice);
        const isCorrect = !!choice?.is_correct;
        if (isCorrect) correctCount++;

        saveAnswerLog({
          question_id: q.id,
          selected_choice_number: ans.selectedChoice,
          is_correct: isCorrect,
          answered_at: Date.now(),
          question_mode: q.question_mode,
          k_level: q.k_level,
          chapter_code: q.chapter_code
        });
      }
    });

    const accuracy = Math.round((correctCount / questions.length) * 100);
    const passed = accuracy >= 65; // 合格ライン65%

    const result = {
      score: correctCount,
      total: questions.length,
      accuracy,
      isPassed: passed
    };

    setScoreData(result);
    setExamFinished(true);

    if (passed) {
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // 開始前画面
  if (!examStarted) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200 mb-2">
            <Award className="w-3.5 h-3.5" />
            本番準拠シミュレーション
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            JSTQB AL TM 本番模擬試験
          </h1>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            テストマネージャ認定試験の本番環境を忠実にシミュレート。制限時間、問題フラグ管理、合格基準65%による厳格な合否判定を行います。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* フル本番モード */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-amber-400 transition">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-black text-lg">
                65問
              </div>
              <h3 className="text-xl font-bold text-slate-900">本番フル模試 (65問)</h3>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-center gap-2">✓ 制限時間: 180分（3時間）</li>
                <li className="flex items-center gap-2">✓ 合格基準: 65%（43問以上正解）</li>
                <li className="flex items-center gap-2">✓ 一問一答・シナリオ文章題の混合プール</li>
                <li className="flex items-center gap-2">✓ 後で見直すフラグ・一覧パレット搭載</li>
              </ul>
            </div>
            <div className="pt-6">
              <button
                onClick={() => handleStartExam('standard')}
                className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md shadow-amber-500/20 transition flex items-center justify-center gap-2"
              >
                180分フル模試を開始
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* クイック模試モード */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-blue-400 transition">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-lg">
                15問
              </div>
              <h3 className="text-xl font-bold text-slate-900">クイック実力判定模試 (15問)</h3>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-center gap-2">✓ 制限時間: 45分</li>
                <li className="flex items-center gap-2">✓ 合格基準: 65%（10問以上正解）</li>
                <li className="flex items-center gap-2">✓ 短時間での弱点発見・腕試しに最適</li>
                <li className="flex items-center gap-2">✓ 終了後すぐに詳細解説を全問確認可能</li>
              </ul>
            </div>
            <div className="pt-6">
              <button
                onClick={() => handleStartExam('short')}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2"
              >
                45分クイック模試を開始
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 終了・結果画面
  if (examFinished && scoreData) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl text-center space-y-6">
          <div className={`w-24 h-24 mx-auto rounded-3xl flex items-center justify-center ${
            scoreData.isPassed ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
          }`}>
            <Award className="w-12 h-12" />
          </div>

          <div>
            <div className={`inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${
              scoreData.isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {scoreData.isPassed ? '合格ライン達成 (Passed)' : '不合格 (Failed)'}
            </div>
            <h2 className="text-3xl font-black text-slate-900">
              {scoreData.isPassed ? '合格おめでとうございます！' : '合格ラインまであと一歩です'}
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              合格基準は65%です。間違えた問題の解説とシラバス根拠を復習しましょう。
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-slate-500">正解スコア</p>
              <p className="text-3xl font-black text-slate-900 mt-1">
                {scoreData.score} <span className="text-sm font-medium text-slate-400">/ {scoreData.total} 問</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">あなたの正答率</p>
              <p className={`text-3xl font-black mt-1 ${scoreData.isPassed ? 'text-emerald-600' : 'text-rose-600'}`}>
                {scoreData.accuracy}%
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">合格基準</p>
              <p className="text-3xl font-black text-slate-700 mt-1">
                65%
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <button
              onClick={() => handleStartExam(examType)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md shadow-amber-500/20 transition"
            >
              <RotateCcw className="w-4 h-4" />
              もう一度挑戦する
            </button>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition"
            >
              ダッシュボードで弱点分析
            </Link>
          </div>
        </div>

        {/* 全問振り返りリスト */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">解答結果と解説の確認</h3>
          <div className="space-y-4">
            {questions.map((q, idx) => {
              const userAns = answers[q.id]?.selectedChoice;
              const correctChoice = q.choices.find(c => c.is_correct);
              const isUserCorrect = userAns === correctChoice?.choice_number;

              return (
                <div key={q.id} className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold text-white ${
                        isUserCorrect ? 'bg-emerald-600' : 'bg-rose-500'
                      }`}>
                        第 {idx + 1} 問: {isUserCorrect ? '正解' : '不正解'}
                      </span>
                      <KLevelBadge kLevel={q.k_level} />
                      <span className="text-xs text-slate-500 font-medium">第{q.chapter_code}節</span>
                    </div>
                    {answers[q.id]?.flagged && (
                      <span className="text-xs text-amber-600 font-semibold flex items-center gap-1">
                        <Flag className="w-3.5 h-3.5 fill-current" /> フラグ付き
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-relaxed">
                    {q.question_text}
                  </h4>

                  <div className="space-y-2 text-xs sm:text-sm">
                    {q.choices.map(c => {
                      const isSelected = userAns === c.choice_number;
                      let badge = "border-slate-200 text-slate-700 bg-white";
                      if (c.is_correct) {
                        badge = "border-emerald-500 bg-emerald-50 text-emerald-900 font-bold ring-1 ring-emerald-500/20";
                      } else if (isSelected) {
                        badge = "border-rose-400 bg-rose-50 text-rose-900 line-through";
                      }
                      return (
                        <div key={c.choice_number} className={`p-3 rounded-xl border ${badge} flex items-start gap-2`}>
                          <span className="font-bold">{c.choice_number}.</span>
                          <span className="flex-1">{c.choice_text}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 space-y-1">
                    <p className="font-bold text-slate-900">解説:</p>
                    <p>{q.overall_explanation}</p>
                    <p className="text-xs text-blue-700 font-semibold pt-1">シラバス根拠: {q.syllabus_reference}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const currentAnswer = answers[currentQ?.id];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* 模試コントロールバー */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4 sticky top-16 z-20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-50 text-amber-700 rounded-lg">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">残り時間</div>
            <div className={`text-xl font-black tabular-nums ${remainingTime < 300 ? 'text-rose-600 animate-bounce' : 'text-slate-900'}`}>
              {formatTime(remainingTime)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleFlag}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition ${
              currentAnswer?.flagged
                ? 'bg-amber-50 border-amber-300 text-amber-700'
                : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Flag className={`w-4 h-4 ${currentAnswer?.flagged ? 'fill-current text-amber-600' : ''}`} />
            後で見直す
          </button>

          <button
            onClick={finishExam}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition"
          >
            試験を終了して採点
          </button>
        </div>
      </div>

      {/* 問題一覧ナビゲーションパレット */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
          <span>設問一覧ナビゲーター</span>
          <span>解答済: {Object.values(answers).filter(a => a.selectedChoice !== undefined).length} / {questions.length}</span>
        </div>
        <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
          {questions.map((q, idx) => {
            const ans = answers[q.id];
            const isAnswered = ans?.selectedChoice !== undefined;
            const isFlagged = !!ans?.flagged;
            const isCurrent = currentIndex === idx;

            let bg = 'bg-slate-100 text-slate-700 hover:bg-slate-200';
            if (isAnswered) bg = 'bg-blue-600 text-white';
            if (isCurrent) bg += ' ring-2 ring-indigo-500 ring-offset-1 font-bold';

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`relative w-8 h-8 rounded-lg text-xs font-medium transition ${bg}`}
              >
                {idx + 1}
                {isFlagged && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 現在の設問カード */}
      {currentQ && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">
                第 {currentIndex + 1} 問 / {questions.length} 問
              </span>
              <KLevelBadge kLevel={currentQ.k_level} showDescription />
            </div>
            <span className="text-xs text-slate-400">
              第{currentQ.chapter_code}節
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            {currentQ.question_text}
          </h3>

          <div className="space-y-3">
            {currentQ.choices.map((choice) => {
              const isSelected = currentAnswer?.selectedChoice === choice.choice_number;
              return (
                <button
                  key={choice.choice_number}
                  onClick={() => handleSelectChoice(choice.choice_number)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition flex items-start gap-3 text-sm ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 text-blue-950 font-semibold ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-800'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                    isSelected ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-100 text-slate-700 border-slate-300'
                  }`}>
                    {choice.choice_number}
                  </span>
                  <span className="flex-1 leading-relaxed">{choice.choice_text}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-bold rounded-xl text-xs transition"
            >
              前の問題
            </button>

            <button
              onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
              disabled={currentIndex === questions.length - 1}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold rounded-xl text-xs transition"
            >
              次の問題
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

