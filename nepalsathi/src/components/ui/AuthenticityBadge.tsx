import { cn } from '../../utils/helpers';

interface AuthenticityBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabel?: boolean;
}

const sizeClasses = {
  sm: 'text-xs px-1.5 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5',
};

export function AuthenticityBadge({ score, size = 'md', className, showLabel = true }: AuthenticityBadgeProps) {
  const color =
    score >= 90 ? 'bg-green-100 text-green-800 border-green-300' :
    score >= 75 ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
    'bg-orange-100 text-orange-800 border-orange-300';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium rounded-full border',
        color,
        sizeClasses[size],
        className,
      )}
    >
      <span
        className={cn(
          'w-1.5 h-1.5 rounded-full',
          score >= 90 ? 'bg-green-600' :
          score >= 75 ? 'bg-yellow-600' :
          'bg-orange-600',
        )}
      />
      {showLabel ? `${score}/100` : score}
    </span>
  );
}

export function AuthenticityIndicator({ label, value }: { label: string; value: boolean }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className={cn(
        'w-2 h-2 rounded-full',
        value ? 'bg-green-500' : 'bg-gray-300',
      )} />
      <span className={value ? 'text-text-primary' : 'text-text-secondary line-through'}>
        {label}
      </span>
    </div>
  );
}
