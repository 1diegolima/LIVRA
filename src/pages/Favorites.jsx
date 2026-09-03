import { Heart } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { BookGrid } from '../components/book/BookGrid';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { EmptyState } from '../components/ui/EmptyState';

export const Favorites = () => {
  const { favorites, favoritesCount } = useFavorites();

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Meus Favoritos' }]} />

      <div className="flex items-center justify-between pb-4 border-b border-paper-200">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
            <Heart className="w-4 h-4 fill-red-500" />
          </div>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink-900">
              Minha Lista de Desejos
            </h1>
            <p className="text-xs sm:text-sm text-ink-500">
              {favoritesCount === 1 ? '1 livro salvo' : `${favoritesCount} livros salvos`} na sua estante virtual
            </p>
          </div>
        </div>
      </div>

      {favorites.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Sua lista de favoritos está vazia"
          description="Você ainda não adicionou nenhum livro aos seus favoritos. Navegue pelo catálogo e clique no coração para salvar suas leituras desejadas."
          actionText="Explorar Livros"
          actionLink="/livros"
        />
      ) : (
        <BookGrid
          books={favorites}
          columns="grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        />
      )}
    </div>
  );
};
