import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { ConditionBadge } from './ConditionBadge';
import { Rating } from './Rating';
import { Price } from './Price';
import { FavoriteButton } from './FavoriteButton';
import { useCart } from '../../context/CartContext';

export const BookCard = ({ book }) => {
  const { addToCart } = useCart();

  if (!book) return null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(book, 1);
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-xl border border-paper-200/90 shadow-paper hover:shadow-book-hover transition-all duration-300 overflow-hidden hover:-translate-y-1">
      {/* Book Cover Link & Image */}
      <Link
        to={`/livro/${book.id}`}
        className="relative block w-full aspect-[2/3] bg-paper-100 overflow-hidden"
      >
        <img
          src={book.image}
          alt={`Capa do livro ${book.title}`}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 book-spine-effect"
        />
        <div className="absolute inset-0 bg-ink-950/0 group-hover:bg-ink-950/5 transition-colors duration-300" />

        {/* Top Badges & Favorite overlaid on image */}
        <div className="absolute top-2.5 inset-x-2.5 z-10 flex items-start justify-between pointer-events-none">
          <div className="pointer-events-auto shadow-xs">
            <ConditionBadge
              condition={book.condition}
              conditionState={book.condition === 'Usado' ? book.conditionState : null}
              size="sm"
            />
          </div>
          <div className="pointer-events-auto">
            <FavoriteButton book={book} size="sm" />
          </div>
        </div>
      </Link>

      {/* Book Details */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <span className="text-[11px] font-medium text-ink-500 uppercase tracking-wider block mb-1 truncate">
            {book.category}
          </span>
          <Link to={`/livro/${book.id}`} className="block group-hover:text-amber-700 transition-colors">
            <h3 className="font-serif font-bold text-ink-900 text-base leading-snug line-clamp-2" title={book.title}>
              {book.title}
            </h3>
          </Link>
          <p className="text-xs text-ink-600 font-medium mt-1 truncate">
            {book.author}
          </p>

          <div className="mt-2.5">
            <Rating rating={book.rating} reviewsCount={book.reviewsCount} />
          </div>
        </div>

        {/* Price & Action */}
        <div className="pt-3 border-t border-paper-100 flex items-center justify-between gap-2">
          <Price price={book.price} oldPrice={book.oldPrice} size="md" />

          <button
            type="button"
            onClick={handleAddToCart}
            aria-label={`Adicionar ${book.title} ao carrinho`}
            className="flex items-center justify-center p-2.5 rounded-lg bg-paper-100 text-ink-800 hover:bg-ink-900 hover:text-white transition-colors duration-200 shadow-2xs group/btn shrink-0"
            title="Adicionar ao carrinho"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
