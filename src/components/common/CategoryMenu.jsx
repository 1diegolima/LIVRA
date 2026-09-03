import React from 'react';
import { NavLink } from 'react-router-dom';
import { CATEGORIES } from '../../data/books';

export const CategoryMenu = () => {
  return (
    <div className="w-full bg-[#F5F2EB] border-b border-paper-300 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2.5 scrollbar-none text-xs sm:text-sm font-medium">
          <NavLink
            to="/livros"
            end
            className={({ isActive }) =>
              `whitespace-nowrap px-3 py-1.5 rounded-full transition-all duration-150 ${
                isActive
                  ? 'bg-ink-900 text-white shadow-xs'
                  : 'text-ink-700 hover:text-ink-950 hover:bg-paper-200/80'
              }`
            }
          >
            Todos os Livros
          </NavLink>

          {CATEGORIES.map((cat) => (
            <NavLink
              key={cat.slug}
              to={`/livros?categoria=${cat.slug}`}
              className={({ isActive }) =>
                `whitespace-nowrap px-3 py-1.5 rounded-full transition-all duration-150 ${
                  cat.slug === 'usados'
                    ? 'text-amber-900 bg-amber-100/70 hover:bg-amber-100 font-semibold border border-amber-200/60'
                    : 'text-ink-700 hover:text-ink-950 hover:bg-paper-200/80'
                }`
              }
            >
              {cat.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};
