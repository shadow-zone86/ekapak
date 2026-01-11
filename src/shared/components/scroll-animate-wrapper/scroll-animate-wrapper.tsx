'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

interface ScrollAnimateWrapperProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function ScrollAnimateWrapper({ children, className, delay = 0 }: ScrollAnimateWrapperProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || isVisible) return;

    // Cleanup previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
          if (observerRef.current) {
            observerRef.current.unobserve(element);
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [delay, isVisible]);

  return (
    <div
      ref={elementRef}
      className={cn(
        'animate-on-scroll',
        isVisible && 'visible',
        className
      )}
    >
      {children}
    </div>
  );
}
