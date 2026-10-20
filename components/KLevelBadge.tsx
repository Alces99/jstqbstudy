import React from 'react';
import { KLevel } from '@/lib/types';

interface KLevelBadgeProps {
  kLevel: KLevel;
  className?: string;
  showDescription?: boolean;
}

export default function KLevelBadge({ kLevel, className = '', showDescription = false }: KLevelBadgeProps) {
  const config: Record<KLevel, { bg: string; text: string; border: string; label: string; desc: string }> = {
    K1: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      label: 'K1: 記憶',
      desc: '用語や定義の暗記・認識'
    },
    K2: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      label: 'K2: 理解',
      desc: '概念の説明・比較・分類'
    },
    K3: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      label: 'K3: 適用',
      desc: '技法の実践・計算・実行'
    },
    K4: {
      bg: 'bg-purple-50',
      text: 'text-purple-800',
      border: 'border-purple-200',
      label: 'K4: 分析',
      desc: 'マネジメント判断・評価・意思決定'
    }
  };

  const item = config[kLevel] || config.K2;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${item.bg} ${item.text} ${item.border} ${className}`}
      title={item.desc}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>
      {showDescription ? item.label : kLevel}
    </span>
  );
}

