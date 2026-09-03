import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumb = ({ items = [] }) => {
  return (
    <nav className="flex items-center text-xs font-medium text-ink-500 py-3" aria-label="Navegação estrutural">
      <Link to="/" className="inline-flex items-center hover:text-ink-900 transition-colors">
        <Home className="w-3.5 h-3.5 mr-1 text-ink-400" />
        <span>Início</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-paper-400 shrink-0" />
            {isLast || !item.href ? (
              <span className="text-ink-800 font-semibold truncate max-w-[200px] sm:max-w-xs">
                {item.label}
              </span>
            ) : (
              <Link to={item.href} className="hover:text-ink-900 transition-colors truncate">
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
