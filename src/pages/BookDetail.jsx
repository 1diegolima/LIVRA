import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Zap,
  ShieldCheck,
  Truck,
  BookOpen,
  Calendar,
  Layers,
  Globe,
  Hash,
  Store,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { api } from '../services/api';
import { ConditionBadge } from '../components/book/ConditionBadge';
import { Rating } from '../components/book/Rating';
import { Price } from '../components/book/Price';
import { FavoriteButton } from '../components/book/FavoriteButton';
import { QuantitySelector } from '../components/book/QuantitySelector';
import { Button } from '../components/ui/Button';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { BookGrid } from '../components/book/BookGrid';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';

export const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [book, setBook] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [cepInput, setCepInput] = useState('');
  const [shippingResult, setShippingResult] = useState(null);

  useEffect(() => {
    const loadBook = async () => {
      try {
        setLoading(true);
        const data = await api.getBookById(id);
        setBook(data);
        setSelectedImage(data.image);
        setQuantity(1);

        // Carregar livros relacionados
        const allBooks = await api.getBooks({ category: data.categorySlug });
        setRelatedBooks(allBooks.filter(b => b.id !== data.id).slice(0, 4));
      } catch (err) {
        console.error('Livro não encontrado:', err);
      } finally {
        setLoading(false);
      }
    };

    loadBook();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-ink-600">Abrindo as páginas do livro...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-serif font-bold text-ink-900 mb-2">Livro não encontrado</h2>
        <p className="text-sm text-ink-600 mb-6">O exemplar solicitado não foi localizado em nosso acervo.</p>
        <Link to="/livros">
          <Button variant="primary">Explorar outros livros</Button>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(book, quantity);
  };

  const handleBuyNow = () => {
    addToCart(book, quantity);
    navigate('/carrinho');
  };

  const handleSimulateShipping = (e) => {
    e.preventDefault();
    if (cepInput.replace(/\D/g, '').length === 8) {
      setShippingResult({
        cost: book.price >= 120 ? 'Grátis' : 'R$ 14,90',
        deadline: '3 a 5 dias úteis via Sedex Especial'
      });
    }
  };

  const isUsed = book.condition?.toLowerCase() === 'usado';

  return (
    <div className="space-y-12 pb-12">
      <Breadcrumb
        items={[
          { label: 'Catálogo', href: '/livros' },
          { label: book.category, href: `/livros?categoria=${book.categorySlug}` },
          { label: book.title }
        ]}
      />

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* LEFT COLUMN: Gallery & Book Presentation */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Big main cover image */}
          <div className="relative aspect-[3/4] bg-paper-100 rounded-2xl overflow-hidden border border-paper-200 shadow-book group flex items-center justify-center p-4">
            <img
              src={selectedImage || book.image}
              alt={`Capa do livro ${book.title}`}
              className="w-full h-full object-contain rounded-lg drop-shadow-xl transition-all duration-300 group-hover:scale-105"
            />
            
            <div className="absolute top-4 right-4 z-10">
              <FavoriteButton book={book} size="lg" />
            </div>

            <div className="absolute bottom-4 left-4 z-10">
              <ConditionBadge
                condition={book.condition}
                conditionState={isUsed ? book.conditionState : null}
                size="md"
              />
            </div>
          </div>

          {/* Miniatures */}
          {book.thumbnails && book.thumbnails.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {book.thumbnails.map((thumb, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(thumb)}
                  className={`relative w-20 aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === thumb
                      ? 'border-amber-600 ring-2 ring-amber-500/20 shadow-md'
                      : 'border-paper-300 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={thumb}
                    alt={`Miniatura ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Seller / Store Highlight */}
          {book.seller && (
            <div className="p-4 bg-white rounded-xl border border-paper-200 shadow-2xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-paper-100 flex items-center justify-center text-ink-700">
                  <Store className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-ink-500 font-semibold">Vendido por</p>
                  <p className="text-sm font-bold text-ink-900">{book.seller.name}</p>
                  <p className="text-xs text-ink-500">{book.seller.city} • {book.seller.totalSales} vendas</p>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  ★ {book.seller.rating}
                </span>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Book Specs, Price, Actions */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Header Title & Author */}
          <div className="space-y-2 border-b border-paper-200 pb-5">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
              {book.category}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-ink-900 leading-tight">
              {book.title}
            </h1>
            <p className="text-base text-ink-700 font-medium">
              por <span className="text-ink-950 font-semibold underline decoration-paper-300 underline-offset-4">{book.author}</span>
            </p>

            <div className="flex items-center gap-4 pt-1">
              <Rating rating={book.rating} reviewsCount={book.reviewsCount} size="md" />
              <span className="text-xs text-ink-400">•</span>
              <span className="text-xs text-ink-600 font-medium">{book.publisher} ({book.year})</span>
            </div>
          </div>

          {/* Special Condition Box (Used vs New) */}
          {isUsed ? (
            <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wide text-amber-900 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-amber-700" />
                  Exemplar de Sebo — Estado: {book.conditionState}
                </span>
                <span className="text-xs font-medium text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded">
                  Item Único
                </span>
              </div>
              <p className="text-xs text-ink-700 leading-relaxed font-book">
                "{book.conditionDescription}"
              </p>
            </div>
          ) : (
            <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-900 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Exemplar 100% Novo, lacrado e direto da editora com garantia total.</span>
            </div>
          )}

          {/* Pricing Box */}
          <div className="p-5 bg-white rounded-2xl border border-paper-200 shadow-2xs space-y-4">
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-xs text-ink-500 uppercase tracking-wider font-semibold">Valor do exemplar</p>
                <Price price={book.price} oldPrice={book.oldPrice} size="xl" />
              </div>
              <p className="text-xs text-ink-500 text-right">
                Em até <strong>3x de {formatCurrency(book.price / 3)}</strong> sem juros
              </p>
            </div>

            {/* Quantity and CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-ink-700 sm:hidden">Qtd:</span>
                <QuantitySelector
                  quantity={quantity}
                  onIncrease={() => setQuantity(q => q + 1)}
                  onDecrease={() => setQuantity(q => Math.max(1, q - 1))}
                  size="md"
                />
              </div>

              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleAddToCart}
                  icon={ShoppingBag}
                  className="w-full"
                >
                  Adicionar ao Carrinho
                </Button>

                <Button
                  variant="accent"
                  size="md"
                  onClick={handleBuyNow}
                  icon={Zap}
                  className="w-full shadow-md"
                >
                  Comprar Agora
                </Button>
              </div>
            </div>

            {/* Simulated CEP calculator */}
            <div className="pt-4 border-t border-paper-100">
              <form onSubmit={handleSimulateShipping} className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-ink-400 shrink-0" />
                <input
                  type="text"
                  value={cepInput}
                  onChange={(e) => setCepInput(e.target.value)}
                  placeholder="Calcular frete: 00000-000"
                  maxLength={9}
                  className="px-3 py-1.5 text-xs bg-paper-100 border border-paper-300 rounded-lg text-ink-800 focus:outline-none focus:border-amber-600 w-36"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-semibold bg-paper-200 text-ink-800 hover:bg-paper-300 rounded-lg transition-colors"
                >
                  Calcular
                </button>
              </form>
              {shippingResult && (
                <p className="text-xs text-emerald-800 font-medium mt-2 animate-in fade-in">
                  ✓ Frete <strong>{shippingResult.cost}</strong> — {shippingResult.deadline}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-serif font-bold text-lg text-ink-900">Sinopse da Obra</h3>
            <p className="text-sm text-ink-700 leading-relaxed font-book">
              {book.description}
            </p>
          </div>

          {/* Technical Specifications Table */}
          <div className="space-y-3 pt-2">
            <h3 className="font-serif font-bold text-lg text-ink-900">Ficha Técnica</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-paper-200">
                <div className="flex items-center gap-1.5 text-ink-500 mb-1">
                  <Hash className="w-3.5 h-3.5 text-amber-600" />
                  <span className="font-semibold uppercase tracking-wider">ISBN</span>
                </div>
                <span className="font-mono text-ink-900">{book.isbn}</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-paper-200">
                <div className="flex items-center gap-1.5 text-ink-500 mb-1">
                  <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                  <span className="font-semibold uppercase tracking-wider">Páginas</span>
                </div>
                <span className="font-bold text-ink-900">{book.pages} págs.</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-paper-200">
                <div className="flex items-center gap-1.5 text-ink-500 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  <span className="font-semibold uppercase tracking-wider">Ano</span>
                </div>
                <span className="font-bold text-ink-900">{book.year}</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-paper-200">
                <div className="flex items-center gap-1.5 text-ink-500 mb-1">
                  <Layers className="w-3.5 h-3.5 text-amber-600" />
                  <span className="font-semibold uppercase tracking-wider">Editora</span>
                </div>
                <span className="font-bold text-ink-900 truncate block">{book.publisher}</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-paper-200">
                <div className="flex items-center gap-1.5 text-ink-500 mb-1">
                  <Globe className="w-3.5 h-3.5 text-amber-600" />
                  <span className="font-semibold uppercase tracking-wider">Idioma</span>
                </div>
                <span className="font-bold text-ink-900">{book.language}</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-paper-200">
                <div className="flex items-center gap-1.5 text-ink-500 mb-1">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span className="font-semibold uppercase tracking-wider">Condição</span>
                </div>
                <span className="font-bold text-ink-900">{book.condition}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* RELATED BOOKS SECTION */}
      {relatedBooks.length > 0 && (
        <section className="pt-12 border-t border-paper-200 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl font-bold text-ink-900">
              Quem leu este livro também comprou
            </h3>
            <Link to={`/livros?categoria=${book.categorySlug}`} className="text-xs font-bold text-amber-800 hover:underline">
              Ver mais de {book.category} →
            </Link>
          </div>
          <BookGrid
            books={relatedBooks}
            columns="grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4"
          />
        </section>
      )}

    </div>
  );
};
