import React from 'react';
import { BookX } from 'lucide-react';
import { EmptyState } from '../components/ui/EmptyState';
import { Breadcrumb } from '../components/common/Breadcrumb';

export const NotFound = () => {
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Página Não Encontrada' }]} />
      <EmptyState
        icon={BookX}
        title="404 — Página Não Encontrada"
        description="Parece que este capítulo ainda não foi escrito ou a página que você procura foi movida."
        actionText="Voltar para a Página Inicial"
        actionLink="/"
      />
    </div>
  );
};
