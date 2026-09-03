import React from 'react';
import { BookOpen } from 'lucide-react';
import { Button } from './Button';
import { Link } from 'react-router-dom';

export const EmptyState = ({
  icon: Icon = BookOpen,
  title = 'Nenhum item encontrado',
  description = 'Não encontramos nenhum livro com os critérios selecionados.',
  actionText = 'Explorar todos os livros',
  actionLink = '/livros',
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-white rounded-2xl border border-paper-200 shadow-sm max-w-lg mx-auto my-8">
      <div className="w-16 h-16 rounded-full bg-paper-100 flex items-center justify-center text-amber-700 mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-serif font-bold text-ink-900 mb-2">{title}</h3>
      <p className="text-sm text-ink-600 max-w-md mb-6">{description}</p>
      
      {actionLink ? (
        <Link to={actionLink}>
          <Button variant="primary">{actionText}</Button>
        </Link>
      ) : onAction ? (
        <Button variant="primary" onClick={onAction}>{actionText}</Button>
      ) : null}
    </div>
  );
};
