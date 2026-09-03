import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ShieldCheck, CreditCard, Headphones, QrCode, Lock, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-ink-950 text-paper-200 pt-16 pb-12 border-t border-ink-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-ink-800 text-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-ink-900 text-amber-400 rounded-xl shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-white text-base mb-1">Formas de Pagamento</h4>
              <p className="text-ink-400 text-xs leading-relaxed">
                Pix com 5% de desconto, Cartão de Crédito em até 6x sem juros ou Boleto Bancário.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-ink-900 text-amber-400 rounded-xl shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-white text-base mb-1">Segurança Garantida</h4>
              <p className="text-ink-400 text-xs leading-relaxed">
                Compra protegida de ponta a ponta e vendedores verificados com avaliação rigorosa do estado do livro.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-ink-900 text-amber-400 rounded-xl shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-white text-base mb-1">Atendimento Humanizado</h4>
              <p className="text-ink-400 text-xs leading-relaxed">
                Segunda a sexta das 09h às 18h. Suporte rápido para dúvidas sobre exemplares e envios.
              </p>
            </div>
          </div>
        </div>

        {/* Main Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 py-12 border-b border-ink-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-amber-600 text-white flex items-center justify-center shadow-md">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                LIVRA
              </span>
            </div>
            <p className="text-ink-300 text-sm max-w-sm leading-relaxed">
              Livros para todos os momentos. Unindo leitores, livreiros e sebos independentes em uma plataforma moderna e apaixonada pela literatura.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs text-ink-400">
              <span className="inline-flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-emerald-400" /> SSL 256-Bit</span>
              <span className="inline-flex items-center gap-1.5"><QrCode className="w-3.5 h-3.5 text-amber-400" /> Pix Instantâneo</span>
            </div>
          </div>

          {/* Comprar */}
          <div>
            <h5 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Comprar</h5>
            <ul className="space-y-2.5 text-xs text-ink-400">
              <li><Link to="/livros" className="hover:text-amber-400 transition-colors">Todos os Livros</Link></li>
              <li><Link to="/livros?categoria=usados" className="hover:text-amber-400 transition-colors">Livros Usados & Raros</Link></li>
              <li><Link to="/livros?condicao=novo" className="hover:text-amber-400 transition-colors">Lançamentos Novos</Link></li>
              <li><Link to="/livros?ordenacao=bestseller" className="hover:text-amber-400 transition-colors">Mais Vendidos</Link></li>
              <li><Link to="/favoritos" className="hover:text-amber-400 transition-colors">Lista de Desejos</Link></li>
            </ul>
          </div>

          {/* Categorias */}
          <div>
            <h5 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Categorias</h5>
            <ul className="space-y-2.5 text-xs text-ink-400">
              <li><Link to="/livros?categoria=ficcao" className="hover:text-amber-400 transition-colors">Ficção e Romance</Link></li>
              <li><Link to="/livros?categoria=literatura-brasileira" className="hover:text-amber-400 transition-colors">Literatura Brasileira</Link></li>
              <li><Link to="/livros?categoria=filosofia" className="hover:text-amber-400 transition-colors">Filosofia e Ciências</Link></li>
              <li><Link to="/livros?categoria=fantasia" className="hover:text-amber-400 transition-colors">Fantasia e Suspense</Link></li>
              <li><Link to="/livros?categoria=tecnologia" className="hover:text-amber-400 transition-colors">Tecnologia e HQs</Link></li>
            </ul>
          </div>

          {/* Ajuda e Institucional */}
          <div>
            <h5 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Institucional</h5>
            <ul className="space-y-2.5 text-xs text-ink-400">
              <li><Link to="/" className="hover:text-amber-400 transition-colors">Sobre a LIVRA</Link></li>
              <li><Link to="/" className="hover:text-amber-400 transition-colors">Como Vender no Sebo</Link></li>
              <li><Link to="/" className="hover:text-amber-400 transition-colors">Perguntas Frequentes</Link></li>
              <li><Link to="/" className="hover:text-amber-400 transition-colors">Termos de Uso</Link></li>
              <li><Link to="/" className="hover:text-amber-400 transition-colors">Política de Privacidade</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-ink-500 gap-4">
          <p>© {new Date().getFullYear()} LIVRA Marketplace de Livros Ltda. Todos os direitos reservados.</p>
          <div className="flex items-center gap-6">
            <span>Desenvolvido com excelência técnica para apresentação acadêmica</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
