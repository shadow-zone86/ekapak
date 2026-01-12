'use client';

import Link from 'next/link';
import { cn } from '@/shared/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav className={cn('breadcrumbs flex items-center gap-2', className)} aria-label="Хлебные крошки">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const isActive = item.active !== undefined ? item.active : isLast;

        return (
          <div key={index} className="breadcrumbs__item flex items-center gap-2">
            {index > 0 && (
              <span className="breadcrumbs__separator text-gray-400" aria-hidden="true">
                /
              </span>
            )}
            {item.href && !isActive ? (
              <Link
                href={item.href}
                className="breadcrumbs__link rounded-lg border border-stroke bg-white px-3 py-1.5 text-gray-700 text-sm transition-smooth hover:bg-gray-50 hover:shadow-sm active:scale-[0.98]"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={cn(
                  'breadcrumbs__label rounded-lg px-3 py-1.5 text-sm',
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'border border-stroke bg-white text-gray-700'
                )}
              >
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}