import { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

interface TypographyProps {
  children: ReactNode;
  className?: string;
}

/**
 * H1 heading: MANROPE BOLD 40/130%
 */
export function H1({ children, className }: TypographyProps) {
  return <h1 className={cn('h1', className)}>{children}</h1>;
}

/**
 * H2 heading: MANROPE BOLD 30/130%
 */
export function H2({ children, className }: TypographyProps) {
  return <h2 className={cn('h2', className)}>{children}</h2>;
}

/**
 * H3 heading: MANROPE BOLD 24/140%
 */
export function H3({ children, className }: TypographyProps) {
  return <h3 className={cn('h3', className)}>{children}</h3>;
}

/**
 * P text bold: MANROPE BOLD 18/140%
 */
export function PTextBold({ children, className }: TypographyProps) {
  return <p className={cn('text-p-bold', className)}>{children}</p>;
}

/**
 * P text: MANROPE REGULAR 18/140%
 */
export function PText({ children, className }: TypographyProps) {
  return <p className={cn('text-p', className)}>{children}</p>;
}

/**
 * P text catalog: MANROPE REGULAR 18/140%
 */
export function PTextCatalog({ children, className }: TypographyProps) {
  return <p className={cn('text-p-catalog', className)}>{children}</p>;
}

/**
 * Price: MANROPE BOLD 14/140%
 */
export function Price({ children, className }: TypographyProps) {
  return <span className={cn('text-price', className)}>{children}</span>;
}

/**
 * Description: MANROPE REGULAR 14/140%
 * Default color: gray (#9A9A9A)
 */
export function Description({ children, className }: TypographyProps) {
  return <p className={cn('text-description text-gray', className)}>{children}</p>;
}
