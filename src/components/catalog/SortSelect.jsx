import React from 'react';
import { ArrowUpDown } from 'lucide-react';

export const SortSelect = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="hidden sm:inline text-xs font-semibold uppercase tracking-wider text-ink-500">
        Ordenar por:
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none bg-white border border-paper-300 rounded-lg pl-3 pr-8 py-2 text-xs sm:text-sm font-medium text-ink-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 cursor-pointer shadow-2xs"
          aria-label="Opções de ordenação de livros"
        >
          <option value="relevance">Mais relevantes</option>
          <option value="price-asc">Menor preço</option>
          <option value="price-desc">Maior preço</option>
          <option value="bestseller">Mais vendidos</option>
          <option value="rating">Melhor avaliados</option>
        </select>
        <ArrowUpDown className="w-3.5 h-3.5 text-ink-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
};
