import React from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '../../context/FavoritesContext';

export const FavoriteButton = ({ book, size = 'md', className = '' }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(book?.id);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (book) {
      toggleFavorite(book);
    }
  };

  const sizes = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      className={`rounded-full transition-all duration-200 border shadow-xs focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
        favorited
          ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
          : 'bg-white/90 backdrop-blur-xs text-ink-400 border-paper-200 hover:text-red-500 hover:bg-white'
      } ${sizes[size]} ${className}`}
    >
      <Heart
        className={`${iconSizes[size]} transition-transform duration-200 ${
          favorited ? 'fill-red-500 text-red-500 scale-110' : ''
        }`}
      />
    </button>
  );
};
