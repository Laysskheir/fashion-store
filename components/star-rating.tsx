import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  color?: string;
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  maxRating = 5, 
  size = 20, 
  color = 'text-yellow-500',
  className = ''
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      {[...Array(maxRating)].map((_, index) => (
        <Star 
          key={index} 
          size={size} 
          className={`
            ${index < rating ? 'fill-current' : 'stroke-current'}
            ${color}
            mr-1
          `}
        />
      ))}
      <span className="ml-2 text-sm text-gray-600">({rating}/{maxRating})</span>
    </div>
  );
};
