import React from 'react';
import { BookCard } from './BookCard';
import { BookCardSkeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';

export const BookGrid = ({
  books = [],
  loading = false,
  skeletonCount = 8,
  columns = 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4',
  emptyTitle,
  emptyDescription
}) => {
  if (loading) {
    return (
      <div className={`grid ${columns} gap-4 sm:gap-6`}>
        {[...Array(skeletonCount)].map((_, i) => (
          <BookCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <EmptyState
        title={emptyTitle || 'Nenhum livro encontrado'}
        description={emptyDescription || 'Tente ajustar os filtros ou pesquisar por outros termos.'}
      />
    );
  }

  return (
    <div className={`grid ${columns} gap-4 sm:gap-6`}>
      {books.map(book => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
};
