'use client';

import React from 'react';
import { X, BookOpen, ExternalLink } from 'lucide-react';
import { syllabusSections } from '@/lib/syllabusData';
import KLevelBadge from './KLevelBadge';
import Link from 'next/link';

interface SyllabusDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sectionId?: string;
  chapterCode?: string;
  referenceText?: string;
}

export default function SyllabusDrawer({
  isOpen,
  onClose,
  sectionId,
  chapterCode,
  referenceText
}: SyllabusDrawerProps) {
  if (!isOpen) return null;

  // sectionId または chapterCode からシラバス節を検索
  const section = syllabusSections.find(s => 
    (sectionId && s.id === sectionId) || 
    (chapterCode && s.chapter_code === chapterCode)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white shadow-2xl flex flex-col transform transition-transform ease-out duration-300">
          {/* ヘッダー */}
          <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">公式シラバス根拠解説</h3>
                <p className="text-xs text-slate-500">
                  {section ? `${section.syllabus_code} / 第${section.chapter_code}節` : 'シラバス参照'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* コンテンツ本文 */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {section ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-blue-800">
                      第 {section.chapter_code} 節
                    </span>
                    {section.k_level && (
                      <KLevelBadge kLevel={section.k_level} showDescription />
                    )}
                  </div>
                  <Link
                    href={`/syllabus?section=${section.id}`}
                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    シラバス全文で開く
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <h4 className="text-lg font-bold text-slate-900 leading-snug">
                  {section.title}
                </h4>

                {section.key_terms && section.key_terms.length > 0 && (
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                    <div className="text-xs font-semibold text-slate-500 mb-1.5">重要用語:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {section.key_terms.map(term => (
                        <span
                          key={term}
                          className="px-2 py-0.5 bg-white text-slate-700 text-xs font-medium rounded border border-slate-200 shadow-2xs"
                        >
                          {term}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Markdownコンテンツ */}
                <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {section.content_markdown}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500">
                <BookOpen className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                <p className="font-medium text-slate-700">該当のシラバス節が見つかりませんでした。</p>
                {referenceText && (
                  <div className="mt-4 p-3 bg-slate-50 rounded-lg text-xs text-slate-600 max-w-md mx-auto border border-slate-200">
                    <span className="font-semibold text-slate-800">参照箇所情報:</span> {referenceText}
                  </div>
                )}
                <div className="mt-6">
                  <Link
                    href="/syllabus"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                  >
                    シラバス一覧を見る
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* フッター */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-100 transition shadow-2xs"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

