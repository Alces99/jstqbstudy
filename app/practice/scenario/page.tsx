'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, ArrowRight, Layers, HelpCircle, CheckCircle } from 'lucide-react';
import { initialScenarioGroups } from '@/lib/questionsData';
import KLevelBadge from '@/components/KLevelBadge';

export default function ScenarioListPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* ページヘッダー */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200 mb-2">
          <FileText className="w-3.5 h-3.5" />
          K3 / K4 実務・マネジメント判断演習
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          シナリオ文章題（大問演習）
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
          プロジェクトの制約条件、メトリクス表、不具合状況などの長文シナリオを多角的に読み解き、テストマネージャとしての意思決定・リスク評価・リソース再配分を回答する本格演習です。
        </p>
      </div>

      {/* シナリオ一覧カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {initialScenarioGroups.map((sc, idx) => {
          return (
            <div
              key={sc.scenario_id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">
                    大問 {idx + 1}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {sc.questions.map(q => (
                      <KLevelBadge key={q.id} kLevel={q.k_level} />
                    ))}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {sc.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {sc.background_text.replace(/#+|\||-/g, ' ')}
                </p>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center gap-1.5 font-medium">
                    <HelpCircle className="w-4 h-4 text-slate-400" />
                    小問数: {sc.questions.length} 問
                  </span>
                  <span className="text-slate-500">
                    章: 第{sc.chapter_code}節
                  </span>
                </div>
              </div>

              <div className="pt-6">
                <Link
                  href={`/practice/scenario/${sc.scenario_id}`}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-500/20 transition transform active:scale-95"
                >
                  シナリオ演習を開始
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

