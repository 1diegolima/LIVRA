import React from 'react';
import { Minus, Plus } from 'lucide-react';

export const QuantitySelector = ({
  quantity = 1,
  onIncrease,
  onDecrease,
  min = 1,
  max = 99,
  size = 'md'
}) => {
  const sizeClasses = size === 'sm' ? 'h-8 px-2 text-xs' : 'h-10 px-3 text-sm';
  const buttonSize = size === 'sm' ? 'w-6 h-6' : 'w-7 h-7';

  return (
    <div className={`inline-flex items-center border border-paper-300 rounded-lg bg-white shadow-2xs ${sizeClasses}`}>
      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= min}
        className={`inline-flex items-center justify-center rounded text-ink-600 hover:bg-paper-100 hover:text-ink-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors ${buttonSize}`}
        aria-label="Diminuir quantidade"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>

      <span className="w-10 text-center font-semibold text-ink-900 select-none">
        {quantity}
      </span>

      <button
        type="button"
        onClick={onIncrease}
        disabled={quantity >= max}
        className={`inline-flex items-center justify-center rounded text-ink-600 hover:bg-paper-100 hover:text-ink-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors ${buttonSize}`}
        aria-label="Aumentar quantidade"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
