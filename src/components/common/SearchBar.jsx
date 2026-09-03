import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';

export const SearchBar = ({ className = '', placeholder = "Busque por título, autor ou ISBN..." }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentQuery = searchParams.get('busca') || '';
  const [query, setQuery] = useState(currentQuery);

  useEffect(() => {
    setQuery(currentQuery);
  }, [currentQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/livros?busca=${encodeURIComponent(query.trim())}`);
    } else {
      navigate('/livros');
    }
  };

  const handleClear = () => {
    setQuery('');
  };

  return (
    <form onSubmit={handleSubmit} className={`relative flex items-center w-full ${className}`}>
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-400">
          <Search className="w-4 h-4" />
        </div>
        
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 bg-paper-100/90 hover:bg-paper-100 focus:bg-white text-sm text-ink-900 placeholder-ink-400 rounded-full border border-paper-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 transition-all outline-none"
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-10 flex items-center pr-2 text-ink-400 hover:text-ink-700"
            aria-label="Limpar busca"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          type="submit"
          className="absolute right-1.5 top-1.5 bottom-1.5 px-3.5 bg-ink-900 text-white rounded-full text-xs font-semibold hover:bg-ink-800 transition-colors flex items-center justify-center shadow-xs"
          aria-label="Buscar livros"
        >
          Buscar
        </button>
      </div>
    </form>
  );
};
