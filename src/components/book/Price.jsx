import React from 'react';
import { formatCurrency, calculateDiscount } from '../../utils/formatters';

export const Price = ({ price, oldPrice, size = 'md', showDiscount = true, className = '' }) => {
  const discount = calculateDiscount(price, oldPrice);

  const priceSizes = {
    sm: 'text-base font-bold',
    md: 'text-lg font-bold',
    lg: 'text-2xl font-bold font-serif',
    xl: 'text-3xl font-extrabold font-serif text-ink-950'
  };

  const oldPriceSizes = {
    sm: 'text-xs',
    md: 'text-xs',
    lg: 'text-sm',
    xl: 'text-base'
  };

  return (
    <div className={`flex items-baseline flex-wrap gap-2 ${className}`}>
      <span className={`text-ink-900 tracking-tight ${priceSizes[size]}`}>
        {formatCurrency(price)}
      </span>

      {oldPrice && oldPrice > price && (
        <div className="flex items-center gap-1.5">
          <span className={`text-ink-400 line-through ${oldPriceSizes[size]}`}>
            {formatCurrency(oldPrice)}
          </span>
          {showDiscount && discount > 0 && (
            <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
              -{discount}%
            </span>
          )}
        </div>
      )}
    </div>
  );
};
