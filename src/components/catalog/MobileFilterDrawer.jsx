import React from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import { FilterSidebar } from './FilterSidebar';
import { Button } from '../ui/Button';

export const MobileFilterDrawer = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onResetFilters,
  totalResults
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Top Bar */}
          <div className="flex items-center justify-between p-4 border-b border-paper-200">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-amber-600" />
              <h2 className="font-serif font-bold text-lg text-ink-900">
                Filtros ({totalResults} livros)
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-ink-400 hover:text-ink-900 rounded-lg hover:bg-paper-100 transition-colors"
              aria-label="Fechar filtros"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4">
            <FilterSidebar
              filters={filters}
              onFilterChange={onFilterChange}
              onResetFilters={onResetFilters}
              totalResults={totalResults}
            />
          </div>

          {/* Footer Action */}
          <div className="p-4 border-t border-paper-200 bg-paper-50">
            <Button
              variant="primary"
              className="w-full"
              onClick={onClose}
            >
              Ver {totalResults} Resultados
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
