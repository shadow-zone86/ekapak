import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/shared/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'button',
          'inline-flex items-center justify-center rounded-lg font-medium transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98]',
          {
            'button--primary bg-blue-600 text-white hover:bg-blue-active hover:shadow-md': variant === 'primary',
            'button--secondary bg-gray-200 text-black hover:bg-gray-300 hover:shadow-sm': variant === 'secondary',
            'button--outline border border-stroke bg-white hover:bg-background hover:shadow-sm': variant === 'outline',
            'button--sm h-8 px-3 text-sm': size === 'sm',
            'button--md h-10 px-4 text-base': size === 'md',
            'button--lg h-12 px-6 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
