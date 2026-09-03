import React from 'react';
import { Sparkles, BookMarked } from 'lucide-react';

export const ConditionBadge = ({ condition, conditionState, size = 'md' }) => {
  const isUsed = condition?.toLowerCase() === 'usado';

  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  if (!isUsed) {
    return (
      <span className={`inline-flex items-center gap-1 font-semibold rounded-md bg-amber-50 text-amber-900 border border-amber-200/80 ${sizeClasses}`}>
        <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />
        <span>Novo</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 font-medium rounded-md bg-[#F4EFE6] text-stone-700 border border-[#E3DCCE] ${sizeClasses}`}>
      <BookMarked className="w-3 h-3 text-stone-500 shrink-0" />
      <span>Usado</span>
      {conditionState && (
        <span className="text-stone-500 font-normal">
          • {conditionState}
        </span>
      )}
    </span>
  );
};
