import React from 'react';
import { CATEGORIES } from '../../data/books';
import { RotateCcw, Filter, Check } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const FilterSidebar = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalResults
}) => {
  const conditions = [
    { label: 'Todos', value: 'all' },
    { label: 'Novos', value: 'novo' },
    { label: 'Usados', value: 'usado' },
  ];

  const conditionStates = [
    { label: 'Todos os estados', value: 'all' },
    { label: 'Excelente', value: 'excelente' },
    { label: 'Muito bom', value: 'muito bom' },
    { label: 'Bom', value: 'bom' },
    { label: 'Aceitável', value: 'aceitável' },
  ];

  const priceRanges = [
    { label: 'Todos os preços', min: 0, max: 200 },
    { label: 'Até R$ 30', min: 0, max: 30 },
    { label: 'R$ 30 a R$ 50', min: 30, max: 50 },
    { label: 'R$ 50 a R$ 80', min: 50, max: 80 },
    { label: 'Acima de R$ 80', min: 80, max: 500 },
  ];

  const publishers = [
    'Companhia das Letras',
    'Editora 34',
    'Antofágica',
    'HarperCollins',
    'Editora Aleph',
    'Record',
    'Todavia',
    'Alta Books',
    'Panini',
    'Novatec'
  ];

  return (
    <aside className="w-full bg-white rounded-2xl border border-paper-200 p-5 space-y-6 shadow-2xs">
      {/* Header & Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-paper-200">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-amber-600" />
          <h3 className="font-serif font-bold text-ink-900 text-base">Filtros</h3>
        </div>
        <button
          onClick={onResetFilters}
          className="text-xs font-semibold text-ink-500 hover:text-amber-700 flex items-center gap-1 transition-colors"
          title="Limpar todos os filtros"
        >
          <RotateCcw className="w-3 h-3" />
          Limpar
        </button>
      </div>

      {/* Condição: Novo vs Usado */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-3">
          Condição do Exemplar
        </label>
        <div className="flex flex-wrap gap-1.5">
          {conditions.map((item) => {
            const isSelected = (filters.condition || 'all') === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => onFilterChange('condition', item.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-ink-900 text-white shadow-2xs'
                    : 'bg-paper-100 text-ink-700 hover:bg-paper-200'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Estado de Conservação (Especial para Sebos/Usados) */}
      {(filters.condition === 'usado' || filters.condition === 'all') && (
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-2">
            Estado de Conservação
          </label>
          <div className="space-y-1">
            {conditionStates.map((state) => {
              const isSelected = (filters.conditionState || 'all') === state.value;
              return (
                <button
                  key={state.value}
                  type="button"
                  onClick={() => onFilterChange('conditionState', state.value)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors text-left ${
                    isSelected
                      ? 'bg-amber-50 text-amber-900 font-bold'
                      : 'text-ink-600 hover:bg-paper-100'
                  }`}
                >
                  <span>{state.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-700" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Categorias */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-2">
          Categorias
        </label>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => onFilterChange('category', 'all')}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors text-left ${
              !filters.category || filters.category === 'all'
                ? 'bg-amber-50 text-amber-900 font-bold'
                : 'text-ink-600 hover:bg-paper-100'
            }`}
          >
            <span>Todas as categorias</span>
            {(!filters.category || filters.category === 'all') && <Check className="w-3.5 h-3.5 text-amber-700" />}
          </button>

          {CATEGORIES.map((cat) => {
            const isSelected = filters.category === cat.slug;
            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => onFilterChange('category', cat.slug)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors text-left ${
                  isSelected
                    ? 'bg-amber-50 text-amber-900 font-bold'
                    : 'text-ink-600 hover:bg-paper-100'
                }`}
              >
                <span>{cat.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-amber-700" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Faixa de Preço */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-2">
          Faixa de Preço
        </label>
        <div className="space-y-1">
          {priceRanges.map((range, idx) => {
            const isSelected =
              filters.minPrice === range.min &&
              (range.max === 500 ? filters.maxPrice === undefined || filters.maxPrice >= 500 : filters.maxPrice === range.max);

            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onFilterChange('minPrice', range.min);
                  onFilterChange('maxPrice', range.max >= 500 ? undefined : range.max);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors text-left ${
                  isSelected
                    ? 'bg-amber-50 text-amber-900 font-bold'
                    : 'text-ink-600 hover:bg-paper-100'
                }`}
              >
                <span>{range.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-amber-700" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Idioma */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-2">
          Idioma
        </label>
        <div className="space-y-1 text-xs text-ink-600">
          <label className="flex items-center gap-2 px-2.5 py-1 cursor-pointer hover:bg-paper-100 rounded">
            <input
              type="radio"
              name="language"
              checked={!filters.language || filters.language === 'all'}
              onChange={() => onFilterChange('language', 'all')}
              className="text-amber-600 focus:ring-amber-500"
            />
            <span>Todos os idiomas</span>
          </label>
          <label className="flex items-center gap-2 px-2.5 py-1 cursor-pointer hover:bg-paper-100 rounded">
            <input
              type="radio"
              name="language"
              checked={filters.language === 'Português'}
              onChange={() => onFilterChange('language', 'Português')}
              className="text-amber-600 focus:ring-amber-500"
            />
            <span>Português</span>
          </label>
        </div>
      </div>

    </aside>
  );
};
