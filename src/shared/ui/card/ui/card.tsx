import { HTMLAttributes } from 'react';
import { cn } from '@/shared/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated';
  size?: 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export type CardHeaderProps = HTMLAttributes<HTMLDivElement>;

export type CardBodyProps = HTMLAttributes<HTMLDivElement>;

export type CardFooterProps = HTMLAttributes<HTMLDivElement>;

/**
 * Card - базовый компонент карточки
 *
 * @example
 * <Card>
 *   <CardHeader>Заголовок</CardHeader>
 *   <CardBody>Контент</CardBody>
 *   <CardFooter>Футер</CardFooter>
 * </Card>
 */
export function Card({
  className,
  variant = 'default',
  size = 'md',
  hover = false,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'card',
        'rounded-lg bg-white transition-shadow',
        {
          // Variants
          'card--default border-stroke shadow-sm': variant === 'default',
          'card--outlined border-stroke': variant === 'outlined',
          'card--elevated shadow-md': variant === 'elevated',
          // Hover effect
          'hover:shadow-md': hover && variant === 'default',
          'hover:shadow-lg': hover && variant === 'elevated',
          // Sizes
          'card--sm p-3': size === 'sm',
          'card--md p-4': size === 'md',
          'card--lg p-6': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * CardHeader - заголовок карточки
 */
export function CardHeader({
  className,
  children,
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={cn('card__header', 'mb-4 border-b border-stroke pb-4 last:mb-0 last:border-b-0 last:pb-0', className)}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * CardBody - основной контент карточки
 */
export function CardBody({
  className,
  children,
  ...props
}: CardBodyProps) {
  return (
    <div className={cn('card__body', className)} {...props}>
      {children}
    </div>
  );
}

/**
 * CardFooter - футер карточки
 */
export function CardFooter({
  className,
  children,
  ...props
}: CardFooterProps) {
  return (
    <div
      className={cn('card__footer', 'mt-4 border-t border-stroke pt-4 first:mt-0 first:border-t-0 first:pt-0', className)}
      {...props}
    >
      {children}
    </div>
  );
}

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
