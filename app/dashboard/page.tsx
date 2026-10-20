'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BarChart2, 
  CheckCircle2, 
  XCircle, 
  Bookmark, 
  TrendingUp, 
  Award, 
  RotateCcw, 
  Trash2, 
  ArrowRight,
  BookOpen,
  Zap,
  FileText
} from 'lucide-react';
import { 
  calculateDashboardStats, 
  DashboardStats, 
  clearAllLearningData, 
  getAnswerLogs 
} from '@/lib/storage';
import { initialQuickQuestions, initialScenarioGroups } from '@/lib/questionsData';
import { Question } from '@/lib/types';
import KLevelBadge from '@/components/KLevelBadge';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [allQuestionsMap, setAllQuestionsMap] = useState<Record<string, Question>>({});

  const refreshStats = () => {
    const s = calculateDashboardStats();
    setStats(s);

    const map: Record<string, Question> = {};
    initialQuickQuestions.forEach(q => { map[q.id] = q; });
    initialScenarioGroups.forEach(sc => {
      sc.questions.forEach(q => { map[q.id] = q; });
    });
    setAllQuestionsMap(map);
  };

  useEffect(() => {
    refreshStats();
  }, []);

  const handleClearData = () => {
    if (window.confirm('これまでの学習履歴・ブックマークをすべて消去しますか？')) {
      clearAllLearningData();
      refreshStats();
    }
  };

  if (!stats) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* ヘッダー */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200 mb-2">
            <BarChart2 className="w-3.5 h-3.5" />
            学習進捗 & 弱点アナリティクス
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            学習管理ダッシュボード
          </h1>
        </div>

        <button
          onClick={handleClearData}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 border border-rose-200 transition"
        >
          <Trash2 className="w-4 h-4" />
          学習データを初期化
        </button>
      </div>

      {/* トップサマリーカード */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 総合正答率 */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">総合正答率</span>
            <Award className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {stats.accuracyRate}%
          </div>
          <p className="text-xs text-slate-500">
            目標ライン: 65% (JSTQB合格基準)
          </p>
        </div>

        {/* 累計解答数 */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">累計解答数</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {stats.totalAnswered} <span className="text-sm font-medium text-slate-400">問</span>
          </div>
          <p className="text-xs text-slate-500">
            正解数: {stats.totalCorrect} 問
          </p>
        </div>

        {/* 一問一答 正答率 */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">一問一答 (K1/K2)</span>
            <Zap className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {stats.quickAccuracyRate}%
          </div>
          <p className="text-xs text-slate-500">
            基礎概念・用語定着度
          </p>
        </div>

        {/* シナリオ文章題 正答率 */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">シナリオ題 (K3/K4)</span>
            <FileText className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {stats.scenarioAccuracyRate}%
          </div>
          <p className="text-xs text-slate-500">
            マネジメント意思決定力
          </p>
        </div>
      </div>

      {/* 2カラム分析: Kレベル別習熟度 & 章別正答率 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kレベル別分析 */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-600" />
            認知レベル別 (K1〜K4) 習熟度
          </h3>

          <div className="space-y-4">
            {(['K1', 'K2', 'K3', 'K4'] as const).map(k => {
              const data = stats.kLevelStats[k];
              const descriptions: Record<string, string> = {
                K1: '用語・定義の記憶',
                K2: '概念の理解・比較',
                K3: '技法の適用・実務計算',
                K4: 'マネジメント判断・総合評価'
              };

              return (
                <div key={k} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <KLevelBadge kLevel={k} />
                      <span className="text-slate-600 font-medium">{descriptions[k]}</span>
                    </div>
                    <span className="font-bold text-slate-900">
                      {data.rate}% ({data.correct}/{data.total}問)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        data.rate >= 65 ? 'bg-emerald-500' : data.rate > 0 ? 'bg-amber-500' : 'bg-slate-300'
                      }`}
                      style={{ width: `${data.rate}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 章別正答率 */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            シラバス章別 正答率
          </h3>

          <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
            {Object.keys(stats.chapterStats).map(ch => {
              const item = stats.chapterStats[ch];
              return (
                <div key={ch} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{item.title}</span>
                    <span className="font-semibold text-slate-600">
                      {item.rate}% ({item.correct}/{item.total}問)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.rate >= 65 ? 'bg-blue-600' : item.rate > 0 ? 'bg-indigo-400' : 'bg-slate-300'
                      }`}
                      style={{ width: `${item.rate}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 要復習リスト (直近で間違えた問題 & ブックマーク) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              要復習問題・弱点克服リスト
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              直近の演習で不正解だった問題およびブックマークした重要問題です。
            </p>
          </div>
        </div>

        {stats.incorrectQuestionIds.length === 0 && stats.bookmarkedQuestionIds.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-sm">
            <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-400 mb-2" />
            現在、要復習リストに入っている問題はありません。順調です！
          </div>
        ) : (
          <div className="space-y-3">
            {/* 不正解問題 */}
            {stats.incorrectQuestionIds.map(qid => {
              const q = allQuestionsMap[qid];
              if (!q) return null;
              return (
                <div
                  key={qid}
                  className="p-4 rounded-2xl border border-rose-100 bg-rose-50/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                        要復習
                      </span>
                      <KLevelBadge kLevel={q.k_level} />
                      <span className="text-xs text-slate-500">第{q.chapter_code}節</span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      {q.question_text}
                    </p>
                  </div>

                  <Link
                    href={q.question_mode === 'quick' ? '/practice/quick' : `/practice/scenario/${q.scenario_id}`}
                    className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-rose-300 text-rose-800 rounded-lg text-xs font-bold hover:bg-rose-50 transition"
                  >
                    復習する
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}

            {/* ブックマーク問題 */}
            {stats.bookmarkedQuestionIds.map(qid => {
              if (stats.incorrectQuestionIds.includes(qid)) return null; // 重複除外
              const q = allQuestionsMap[qid];
              if (!q) return null;
              return (
                <div
                  key={qid}
                  className="p-4 rounded-2xl border border-amber-100 bg-amber-50/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded flex items-center gap-1">
                        <Bookmark className="w-3 h-3 fill-current" /> ブックマーク
                      </span>
                      <KLevelBadge kLevel={q.k_level} />
                      <span className="text-xs text-slate-500">第{q.chapter_code}節</span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      {q.question_text}
                    </p>
                  </div>

                  <Link
                    href={q.question_mode === 'quick' ? '/practice/quick' : `/practice/scenario/${q.scenario_id}`}
                    className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-amber-300 text-amber-800 rounded-lg text-xs font-bold hover:bg-amber-50 transition"
                  >
                    再確認する
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

