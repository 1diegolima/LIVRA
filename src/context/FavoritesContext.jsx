import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const FavoritesContext = createContext({});

const STORAGE_KEY = 'livra_favorite_books';

export const FavoritesProvider = ({ children }) => {
  const { addToast } = useToast();
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error('Erro ao salvar favoritos no localStorage:', e);
    }
  }, [favorites]);

  const toggleFavorite = (book) => {
    setFavorites(prev => {
      const exists = prev.some(item => item.id === book.id);
      if (exists) {
        addToast(`"${book.title}" removido dos favoritos.`, 'info');
        return prev.filter(item => item.id !== book.id);
      } else {
        addToast(`"${book.title}" adicionado aos favoritos!`, 'success');
        return [...prev, book];
      }
    });
  };

  const isFavorite = (bookId) => {
    return favorites.some(item => item.id === String(bookId));
  };

  const removeFavorite = (bookId) => {
    setFavorites(prev => prev.filter(item => item.id !== String(bookId)));
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        removeFavorite,
        favoritesCount: favorites.length
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
