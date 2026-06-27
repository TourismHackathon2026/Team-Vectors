import { cn } from '../../utils/helpers';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

export function StarRating({ rating, max = 5, size = 'md', className }: StarRatingProps) {
  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            sizes[size],
            i < rating ? 'fill-secondary text-secondary' : 'fill-gray-200 text-gray-200',
          )}
        />
      ))}
    </div>
  );
}
