'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Zap, 
  FileText, 
  Award, 
  Headphones, 
  BarChart2, 
  BookOpen, 
  ArrowRight, 
  CheckCircle2, 
  Bookmark, 
  Layers,
  Sparkles,
  Volume2
} from 'lucide-react';
import { calculateDashboardStats, DashboardStats } from '@/lib/storage';
import { initialQuickQuestions, initialScenarioGroups } from '@/lib/questionsData';

export default function HomePage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    setStats(calculateDashboardStats());
  }, []);

  const totalScenarioQuestions = initialScenarioGroups.reduce((acc, sc) => acc + sc.questions.length, 0);
  const totalMasterQuestions = initialQuickQuestions.length + totalScenarioQuestions;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* ヒーローセクション */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white p-8 sm:p-12 shadow-xl border border-blue-900/50">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            JSTQB Advanced Level テストマネージャ (AL TM) 合格支援
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            「見る」「解く」「聴く」で攻略する、<br className="hidden sm:inline" />
            テストマネジメントの実践知。
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            基礎用語（FL/K1〜K2）の定着から、長文シナリオに基づく実務・マネジメント判断（AL TM: K3〜K4）まで。公式シラバスと直結した3軸の学習サイクルで、確実な合格力を養成します。
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/practice/quick"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-600/30 transition transform hover:-translate-y-0.5"
            >
              <Zap className="w-4 h-4" />
              一問一答を始める
            </Link>
            <Link
              href="/practice/scenario"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-bold backdrop-blur-xs border border-white/20 transition"
            >
              <FileText className="w-4 h-4" />
              シナリオ文章題へ
            </Link>
            <Link
              href="/syllabus"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600/80 hover:bg-emerald-500 text-white text-sm font-bold transition"
            >
              <Headphones className="w-4 h-4" />
              シラバス聞き流し
            </Link>
          </div>
        </div>

        {/* 右上の装飾・進捗ミニカード */}
        <div className="mt-8 sm:mt-0 sm:absolute sm:right-8 sm:bottom-8 sm:w-72 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300">現在の学習進捗</span>
            <span className="text-xs font-bold text-blue-300">
              {stats?.accuracyRate || 0}% 正答率
            </span>
          </div>
          <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden mb-3">
            <div 
              className="bg-blue-400 h-full rounded-full transition-all duration-500" 
              style={{ width: `${stats ? Math.min(100, Math.round((stats.totalAnswered / Math.max(1, totalMasterQuestions)) * 100)) : 0}%` }}
            />
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
            <div>
              解答数: <span className="font-bold text-white">{stats?.totalAnswered || 0}</span> 問
            </div>
            <div>
              正解数: <span className="font-bold text-emerald-400">{stats?.totalCorrect || 0}</span> 問
            </div>
          </div>
        </div>
      </section>

      {/* 3つの学習軸コンセプト */}
      <section className="space-y-4">
        <div className="text-center sm:text-left">
          <h2 className="text-xl font-bold text-slate-900">3軸で定着させる学習メソッド</h2>
          <p className="text-sm text-slate-500">インプットとアウトプットを高速に循環させ、マネージャに必要な意思決定力を培います。</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* 1. 見る（読む） */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">1. 見る（シラバス閲覧）</h3>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              章・節のツリー構造からシラバス本文を閲覧。重要用語ハイライトやKレベルタグを視覚的にインプット。演習中もドロワーですぐ参照可能。
            </p>
            <Link
              href="/syllabus"
              className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              シラバスリーダーを見る <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 2. 解く */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">2. 解く（一問一答 & シナリオ）</h3>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              スキマ時間に回せるスピード一問一答と、実践的な前提背景・メトリクス表を読み解く左右分割シナリオ文章題の2本柱でアウトプット。
            </p>
            <Link
              href="/practice/quick"
              className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
            >
              問題演習へ進む <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 3. 聴く */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
              <Volume2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">3. 聴く（音声聞き流し）</h3>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              通勤中や作業中の「耳学習」に対応。シラバス本文を自然なTTS音声で連続再生。速度変更（0.8x〜2.0x）と段落追従ハイライトを搭載。
            </p>
            <Link
              href="/syllabus"
              className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-800"
            >
              聞き流しプレイヤーを起動 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 主要機能メニュー一覧 */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">学習メニュー</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 一問一答 */}
          <Link
            href="/practice/quick"
            className="group p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1">スピード一問一答</h4>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                用語定義・K1/K2に特化。即時判定と要約解説でスキマ時間に1回5〜10問をサクサク周回。
              </p>
            </div>
            <span className="text-xs font-semibold text-blue-600 flex items-center gap-1">
              演習を開始 <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          {/* シナリオ文章題 */}
          <Link
            href="/practice/scenario"
            className="group p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-400 hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1">シナリオ文章題</h4>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                左ペインに前提長文・メトリクス表、右ペインに設問群のスプリットビュー。K3/K4実践大問。
              </p>
            </div>
            <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1">
              大問演習へ <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          {/* 本番模試モード */}
          <Link
            href="/practice/mock"
            className="group p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1">本番模試モード</h4>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                合格ライン65%判定。制限時間カウントダウン、「後で見直す」フラグ、解答状況一覧付き通し演習。
              </p>
            </div>
            <span className="text-xs font-semibold text-amber-600 flex items-center gap-1">
              模試に挑戦 <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          {/* 学習ダッシュボード */}
          <Link
            href="/dashboard"
            className="group p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-400 hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <BarChart2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1">進捗ダッシュボード</h4>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                章別・Kレベル別（K2/K3/K4）の正答率、弱点分析、要復習リストの集中トレーニング。
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              分析を見る <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </section>

      {/* シラバス資料情報 */}
      <section className="bg-slate-100 rounded-2xl p-6 border border-slate-200/80">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-600" />
              準拠知識ソース (syllabus/ フォルダ同期)
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              JSTQB Advanced Level テストマネージャ Version 3.0.J01 / Foundation Level Version 4.0.J02 / テストアナリスト Version 4.0.J01
            </p>
          </div>
          <Link
            href="/sync"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition shadow-2xs"
          >
            シラバス同期・データ確認
          </Link>
        </div>
      </section>
    </div>
  );
}

