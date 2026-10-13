import React from 'react';
import { Star } from 'lucide-react';

export const StarRating = ({ rating = 5, reviewCount, size = 'sm', showCount = true }) => {
  const stars = [1, 2, 3, 4, 5];
  const starSize = size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center text-mustard">
        {stars.map((s) => (
          <Star
            key={s}
            className={`${starSize} ${
              s <= Math.round(rating)
                ? 'fill-mustard text-mustard'
                : 'text-gray-300 fill-gray-100'
            }`}
          />
        ))}
      </div>
      {showCount && (
        <span className="text-xs font-semibold text-charcoal-muted">
          {rating.toFixed(1)} {reviewCount !== undefined && `(${reviewCount})`}
        </span>
      )}
    </div>
  );
};

export default StarRating;

