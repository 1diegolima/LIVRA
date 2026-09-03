import React from 'react';
import { Star, StarHalf } from 'lucide-react';

export const Rating = ({ rating = 5, reviewsCount, showNumber = true, size = 'sm' }) => {
  const starSize = size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.4 && rating % 1 <= 0.8;

  return (
    <div className="flex items-center gap-1.5" aria-label={`Avaliação: ${rating} de 5 estrelas`}>
      <div className="flex items-center text-amber-500">
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return <Star key={i} className={`${starSize} fill-amber-500 text-amber-500`} />;
          }
          if (i === fullStars && hasHalfStar) {
            return <StarHalf key={i} className={`${starSize} fill-amber-500 text-amber-500`} />;
          }
          return <Star key={i} className={`${starSize} text-paper-300 fill-paper-200`} />;
        })}
      </div>
      {showNumber && (
        <span className="text-xs font-semibold text-ink-700 ml-0.5">
          {rating.toFixed(1)}
        </span>
      )}
      {reviewsCount !== undefined && (
        <span className="text-xs text-ink-400">
          ({reviewsCount})
        </span>
      )}
    </div>
  );
};
