import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import { FilterSidebar } from '../components/catalog/FilterSidebar';
import { MobileFilterDrawer } from '../components/catalog/MobileFilterDrawer';
import { SortSelect } from '../components/catalog/SortSelect';
import { Pagination } from '../components/catalog/Pagination';
import { BookGrid } from '../components/book/BookGrid';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { api } from '../services/api';

const ITEMS_PER_PAGE = 8;

export const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Filtros extraídos dos searchParams
  const categoryParam = searchParams.get('categoria') || 'all';
  const conditionParam = searchParams.get('condicao') || 'all';
  const conditionStateParam = searchParams.get('estado') || 'all';
  const searchParam = searchParams.get('busca') || '';
  const sortParam = searchParams.get('ordenacao') || 'relevance';
  const minPriceParam = searchParams.get('min') ? Number(searchParams.get('min')) : 0;
  const maxPriceParam = searchParams.get('max') ? Number(searchParams.get('max')) : undefined;
  const languageParam = searchParams.get('idioma') || 'all';

  const filters = {
    category: categoryParam,
    condition: conditionParam,
    conditionState: conditionStateParam,
    search: searchParam,
    sortBy: sortParam,
    minPrice: minPriceParam,
    maxPrice: maxPriceParam,
    language: languageParam
  };

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        const result = await api.getBooks(filters);
        setBooks(result);
        setCurrentPage(1); // Reset page on filter change
      } catch (err) {
        console.error('Erro ao buscar catálogo:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [
    categoryParam,
    conditionParam,
    conditionStateParam,
    searchParam,
    sortParam,
    minPriceParam,
    maxPriceParam,
    languageParam
  ]);

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);

    const paramMap = {
      category: 'categoria',
      condition: 'condicao',
      conditionState: 'estado',
      search: 'busca',
      sortBy: 'ordenacao',
      minPrice: 'min',
      maxPrice: 'max',
      language: 'idioma'
    };

    const urlKey = paramMap[key] || key;

    if (value === undefined || value === null || value === 'all' || value === '') {
      newParams.delete(urlKey);
    } else {
      newParams.set(urlKey, value);
    }

    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  // Paginação
  const totalPages = Math.ceil(books.length / ITEMS_PER_PAGE) || 1;
  const paginatedBooks = books.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getPageTitle = () => {
    if (searchParam) return `Busca por: "${searchParam}"`;
    if (categoryParam === 'usados') return 'Livros Usados & Sebos';
    if (categoryParam && categoryParam !== 'all') {
      return `Categoria: ${categoryParam.replace(/-/g, ' ').toUpperCase()}`;
    }
    return 'Catálogo Completo de Livros';
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: 'Catálogo de Livros', href: '/livros' },
          ...(categoryParam && categoryParam !== 'all'
            ? [{ label: categoryParam.replace(/-/g, ' ') }]
            : [])
        ]}
      />

      {/* Title & Mobile Filter Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-paper-200">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink-900 capitalize">
            {getPageTitle()}
          </h1>
          <p className="text-xs sm:text-sm text-ink-500 mt-1">
            {loading ? 'Consultando acervo...' : `${books.length} livros encontrados no acervo LIVRA`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Filter Button */}
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3.5 py-2 bg-white border border-paper-300 rounded-lg text-xs font-semibold text-ink-800 hover:bg-paper-100 shadow-2xs"
          >
            <SlidersHorizontal className="w-4 h-4 text-amber-600" />
            <span>Filtros</span>
            {books.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-ink-900 text-white text-[10px] flex items-center justify-center">
                {books.length}
              </span>
            )}
          </button>

          {/* Sort selector */}
          <SortSelect
            value={sortParam}
            onChange={(val) => handleFilterChange('sortBy', val)}
          />
        </div>
      </div>

      {/* Main Layout Grid (Sidebar + Books) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:col-span-1 sticky top-28">
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            totalResults={books.length}
          />
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-3 space-y-8">
          <BookGrid
            books={paginatedBooks}
            loading={loading}
            skeletonCount={ITEMS_PER_PAGE}
            columns="grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3"
            emptyTitle="Nenhum livro encontrado para os filtros selecionados"
            emptyDescription="Tente relaxar a faixa de preço, selecionar outra categoria ou buscar por outro autor/título."
          />

          {/* Pagination */}
          {!loading && books.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 150, behavior: 'smooth' });
              }}
            />
          )}
        </div>

      </div>

      {/* Mobile Drawer */}
      <MobileFilterDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        totalResults={books.length}
      />
    </div>
  );
};
