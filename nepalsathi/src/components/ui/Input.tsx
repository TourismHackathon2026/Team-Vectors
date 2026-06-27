import { type InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/helpers';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-text-primary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full px-3.5 py-2.5 rounded-lg border bg-card text-sm text-text-primary placeholder:text-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
            error ? 'border-red-500 focus:ring-red-500/30 focus:border-red-500' : 'border-border',
            className,
          )}
          {...props}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
