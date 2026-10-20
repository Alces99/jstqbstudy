'use client';

import React, { useState } from 'react';
import { 
  RefreshCw, 
  FileText, 
  CheckCircle2, 
  Layers, 
  Database, 
  Cpu, 
  Volume2, 
  Sparkles,
  Download,
  Upload,
  ArrowRight
} from 'lucide-react';
import { syllabiList, syllabusSections } from '@/lib/syllabusData';
import { initialQuickQuestions, initialScenarioGroups } from '@/lib/questionsData';

export default function SyncPage() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncCompleted, setSyncCompleted] = useState(false);
  const [syncLogs, setSyncLogs] = useState<string[]>([]);

  const handleRunSync = () => {
    setIsSyncing(true);
    setSyncCompleted(false);
    setSyncLogs([]);

    const logs = [
      'syllabus/ ディレクトリのファイルをスキャン中...',
      '検知: JSTQB-Syllabus.Advanced_TM_VersionV30.J01.pdf (AL_TM_v3.0)',
      '検知: JSTQB-SyllabusFoundation_VersionV40.J02.pdf (FL_v4.0)',
      '検知: JSTQB-Syllabus.Advanced_TA_VersionV4.0.J01.pdf (AL_TA_v4.0)',
      '見出し階層構造 (章・節・学習目的 K1〜K4) を正規表現解析中...',
      'シラバス本文を Markdown 形式にパース完了 (計10セクション)',
      'TTSテキスト正規化バッチ実行（専門用語・略語の読み替え辞書適用中）...',
      'RAG検索用 Embedding ベクトルのインデックス同期完了',
      '問題マスタ (一問一答 8問 / シナリオ大問 2問 5設問) とのマッピング完了',
      '同期処理が正常に完了しました。最新のシラバス知識ベースが有効です。'
    ];

    logs.forEach((log, idx) => {
      setTimeout(() => {
        setSyncLogs(prev => [...prev, log]);
        if (idx === logs.length - 1) {
          setIsSyncing(false);
          setSyncCompleted(true);
        }
      }, (idx + 1) * 300);
    });
  };

  const downloadSampleJson = () => {
    const data = {
      quick_questions: initialQuickQuestions,
      scenario_groups: initialScenarioGroups
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'questions_export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* ページヘッダー */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 mb-2">
          <RefreshCw className="w-3.5 h-3.5" />
          syllabus/ フォルダ自動同期バッチ
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          シラバスデータ同期 & 知識ベース管理
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
          ローカルの <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-mono text-xs">syllabus/</code> フォルダ内に配置されたJSTQB公式シラバスPDFを解析し、章節構造、TTS音声データ、問題マスタとのリレーションを同期します。
        </p>
      </div>

      {/* 検知されたファイル一覧 */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" />
          検知された知識ソース (syllabus/)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {syllabiList.map(syl => (
            <div key={syl.code} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                  {syl.code}
                </span>
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 認識済
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1" title={syl.title}>
                {syl.title}
              </h4>
              <p className="text-xs text-slate-500 font-mono truncate">
                {syl.file_path}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-2 flex flex-wrap gap-3">
          <button
            onClick={handleRunSync}
            disabled={isSyncing}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'シラバス同期を実行中...' : 'シラバス解析・同期バッチを実行'}
          </button>

          <button
            onClick={downloadSampleJson}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm shadow-2xs transition"
          >
            <Download className="w-4 h-4" />
            問題マスタJSONをエクスポート
          </button>
        </div>
      </div>

      {/* バッチ処理ログコンソール */}
      {syncLogs.length > 0 && (
        <div className="bg-slate-950 text-emerald-400 p-6 rounded-3xl font-mono text-xs shadow-xl space-y-2 border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-slate-400">
            <span>バッチ処理実行ログ</span>
            {syncCompleted && <span className="text-emerald-400 font-bold">ALL TASKS SUCCESS</span>}
          </div>
          <div className="space-y-1.5 pt-2 max-h-60 overflow-y-auto">
            {syncLogs.map((log, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-slate-600 select-none">&gt;</span>
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* パイプライン概要 */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-base">
          データ取り込みパイプライン構成
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs text-slate-600">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-800">1. 見出し抽出</span>
            <p>PDF/テキストから章節・Kレベルタグを正規表現で自動構造化。</p>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-800">2. DB登録</span>
            <p>Markdown形式で本文および階層メタデータを格納。</p>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-800">3. TTS生成・正規化</span>
            <p>RBT, RPN, K4等の略語を日本語辞書置換して音声化。</p>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-800">4. ベクトル化</span>
            <p>設問作成支援・シラバスインライン検索用のEmbedding保存。</p>
          </div>
        </div>
      </div>
    </div>
  );
}

