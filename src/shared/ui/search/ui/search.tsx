'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import Image from 'next/image';
import { cn } from '@/shared/lib/utils';

export interface SearchProps extends InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
}

export const Search = forwardRef<HTMLInputElement, SearchProps>(
  ({ className, onSearch, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      onSearch?.(e.target.value);
    };

    return (
      <div className="relative flex-1 max-w-lg">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Image
            src="/search.svg"
            alt="Search"
            width={20}
            height={20}
            className="opacity-50"
          />
        </div>
        <input
          ref={ref}
          type="search"
          className={cn(
            'w-full rounded-lg border border-stroke bg-white pl-10 pr-4 py-2.5',
            'text-p placeholder:text-gray',
            'focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent',
            'transition-all',
            className
          )}
          onChange={handleChange}
          {...props}
        />
      </div>
    );
  }
);

Search.displayName = 'Search';
