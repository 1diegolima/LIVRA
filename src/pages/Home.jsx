import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Tag,
  Star
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { BookGrid } from '../components/book/BookGrid';
import { api } from '../services/api';
import { CATEGORIES } from '../data/books';

export const Home = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [usedDeals, setUsedDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [featured, used] = await Promise.all([
          api.getFeaturedBooks(),
          api.getUsedBooksDeals()
        ]);
        setFeaturedBooks(featured);
        setUsedDeals(used);
      } catch (err) {
        console.error('Erro ao carregar livros da home:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-16 sm:space-y-24">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#141E30] text-white p-6 sm:p-10 lg:p-14 shadow-2xl border border-ink-800">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>O maior acervo de novos e seminovos</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
              Encontre sua <br />
              <span className="italic font-normal text-amber-400">próxima história.</span>
            </h1>

            <p className="text-paper-200/90 text-sm sm:text-base lg:text-lg max-w-xl leading-relaxed font-light">
              Milhares de livros novos e usados esperando por você. Da grande literatura clássica aos lançamentos mais comentados, com garantia de conservação e preços justos.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/livros">
                <Button variant="accent" size="lg" className="rounded-full shadow-lg hover:shadow-amber-600/30">
                  Explorar Livros
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link to="/livros?categoria=usados">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full border-paper-400/40 text-paper-100 hover:bg-white/10 hover:text-white"
                >
                  Ver Sebo Virtual
                </Button>
              </Link>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-6 border-t border-ink-700/60 grid grid-cols-3 gap-4 text-xs text-paper-300">
              <div>
                <p className="font-serif text-lg sm:text-xl font-bold text-white">+50.000</p>
                <p className="text-ink-400">Exemplares</p>
              </div>
              <div>
                <p className="font-serif text-lg sm:text-xl font-bold text-white">4.9 / 5</p>
                <p className="text-ink-400">Avaliação Média</p>
              </div>
              <div>
                <p className="font-serif text-lg sm:text-xl font-bold text-white">100%</p>
                <p className="text-ink-400">Garantia LIVRA</p>
              </div>
            </div>
          </div>

          {/* Right Visual Book Composition */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative w-full max-w-sm aspect-[4/5] flex items-center justify-center">
              
              {/* Decorative shadow & backdrop */}
              <div className="absolute inset-0 bg-amber-500/20 rounded-2xl transform rotate-6 scale-95 blur-md" />
              <div className="absolute inset-0 bg-ink-950/80 rounded-2xl border border-ink-700/80 shadow-2xl" />

              {/* Book 1 (Back left) */}
              <div className="absolute left-4 top-6 w-36 sm:w-44 aspect-[2/3] rounded-lg shadow-2xl transform -rotate-12 hover:-rotate-6 transition-transform duration-300 overflow-hidden border border-white/10 book-spine-effect">
                <img
                  src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80"
                  alt="Livro em destaque"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Book 2 (Back right) */}
              <div className="absolute right-4 bottom-8 w-36 sm:w-44 aspect-[2/3] rounded-lg shadow-2xl transform rotate-12 hover:rotate-6 transition-transform duration-300 overflow-hidden border border-white/10 book-spine-effect">
                <img
                  src="https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=400&q=80"
                  alt="Livro em destaque"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Center Main Book */}
              <div className="relative w-44 sm:w-52 aspect-[2/3] rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden border-2 border-amber-400/40 z-20 book-spine-effect">
                <img
                  src="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=500&q=80"
                  alt="Livro em destaque"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 inset-x-2 p-2 bg-ink-950/80 backdrop-blur-xs rounded-lg text-center">
                  <p className="text-[10px] uppercase font-bold text-amber-400">Exemplar em Destaque</p>
                  <p className="text-xs font-serif font-bold text-white truncate">1984 - Luxo</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 2. VALUE PROPOSITIONS */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-paper-200 shadow-paper flex items-start gap-3.5">
          <div className="p-2.5 bg-amber-50 text-amber-700 rounded-xl shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-ink-900 text-sm">Frete Grátis</h4>
            <p className="text-xs text-ink-500 mt-0.5">Em compras acima de R$ 120 para todo o país.</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-paper-200 shadow-paper flex items-start gap-3.5">
          <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-ink-900 text-sm">Estado Garantido</h4>
            <p className="text-xs text-ink-500 mt-0.5">Avaliação criteriosa de páginas, lombadas e capas.</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-paper-200 shadow-paper flex items-start gap-3.5">
          <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl shrink-0">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-ink-900 text-sm">Preços de Sebo</h4>
            <p className="text-xs text-ink-500 mt-0.5">Economize até 60% em exemplares seminovos.</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-paper-200 shadow-paper flex items-start gap-3.5">
          <div className="p-2.5 bg-purple-50 text-purple-700 rounded-xl shrink-0">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-ink-900 text-sm">Troca Descomplicada</h4>
            <p className="text-xs text-ink-500 mt-0.5">Até 7 dias para devolução se não estiver satisfeito.</p>
          </div>
        </div>
      </section>

      {/* 3. FEATURED BOOKS SECTION ("Livros em Destaque") */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-paper-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
              Curadoria Especial
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-900 mt-1">
              Livros em Destaque
            </h2>
          </div>
          <Link
            to="/livros"
            className="inline-flex items-center text-sm font-semibold text-ink-900 hover:text-amber-700 transition-colors group"
          >
            Ver catálogo completo
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <BookGrid
          books={featuredBooks}
          loading={loading}
          skeletonCount={8}
          columns="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4"
        />
      </section>

      {/* 4. SEBO VIRTUAL BANNER & DEALS ("Achados de Usados") */}
      <section className="bg-[#F3EFE6] rounded-3xl p-6 sm:p-10 border border-paper-300/80 shadow-sm space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-600 text-white text-xs font-bold">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Garimpo de Sebos</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-ink-900">
              Achados Usados & Raros com até 60% OFF
            </h3>
            <p className="text-ink-600 text-sm leading-relaxed">
              Cada exemplar usado passa por rigorosa conferência de páginas, lombada e autenticidade. Dê uma nova vida a histórias inesquecíveis.
            </p>
          </div>

          <Link to="/livros?categoria=usados">
            <Button variant="primary" size="md" className="shrink-0 rounded-full">
              Explorar Todos os Usados
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        <BookGrid
          books={usedDeals}
          loading={loading}
          skeletonCount={4}
          columns="grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3"
        />
      </section>

      {/* 5. CATEGORIES BROWSE TILES */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-900">
            Navegue por Gêneros Literários
          </h2>
          <p className="text-sm text-ink-600">
            Explore universos sob medida para o seu hábito de leitura.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              to={`/livros?categoria=${cat.slug}`}
              className="group p-4 bg-white rounded-xl border border-paper-200 hover:border-amber-400 hover:shadow-md transition-all text-center flex flex-col items-center justify-center gap-2"
            >
              <div className="w-10 h-10 rounded-full bg-paper-100 group-hover:bg-amber-100 text-ink-700 group-hover:text-amber-800 flex items-center justify-center transition-colors">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-ink-800 group-hover:text-amber-900 truncate w-full">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. TESTIMONIALS & TRUST */}
      <section className="bg-white rounded-3xl p-8 sm:p-12 border border-paper-200 shadow-paper">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="flex justify-center items-center gap-1 text-amber-500 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-500" />
            ))}
          </div>
          <h3 className="font-serif text-2xl font-bold text-ink-900">
            O que dizem os leitores da LIVRA
          </h3>
          <p className="text-xs text-ink-500 mt-1">Mais de 15.000 avaliações de clientes satisfeitos em todo o Brasil</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="p-5 rounded-2xl bg-paper-50 border border-paper-200 space-y-3">
            <p className="text-ink-700 italic leading-relaxed text-xs">
              "Comprei Crime e Castigo usado em estado Muito Bom e o livro parecia novo! Embalagem impecável e envio rápido. Virei cliente fiel."
            </p>
            <div className="pt-2 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center justify-center text-xs">
                MC
              </div>
              <div>
                <p className="font-bold text-xs text-ink-900">Mariana Costa</p>
                <p className="text-[10px] text-ink-400">São Paulo, SP • Compradora Verificada</p>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-paper-50 border border-paper-200 space-y-3">
            <p className="text-ink-700 italic leading-relaxed text-xs">
              "A transparência na descrição do exemplar é o maior diferencial. Saber exatamente se há grifos ou marcas antes de comprar faz toda a diferença."
            </p>
            <div className="pt-2 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-200 text-blue-900 font-bold flex items-center justify-center text-xs">
                RA
              </div>
              <div>
                <p className="font-bold text-xs text-ink-900">Rodrigo Almeida</p>
                <p className="text-[10px] text-ink-400">Belo Horizonte, MG • Leitor Ávido</p>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-paper-50 border border-paper-200 space-y-3">
            <p className="text-ink-700 italic leading-relaxed text-xs">
              "Excelente experiência do início ao fim. O catálogo é rico, o design é agradável aos olhos e o cupom de boas-vindas funcionou perfeitamente."
            </p>
            <div className="pt-2 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-200 text-emerald-900 font-bold flex items-center justify-center text-xs">
                CS
              </div>
              <div>
                <p className="font-bold text-xs text-ink-900">Clara Silveira</p>
                <p className="text-[10px] text-ink-400">Curitiba, PR • Colecionadora</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
