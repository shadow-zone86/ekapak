'use client';

import { useState, useCallback, ReactNode } from 'react';
import { MobileMenuContext } from '@/shared/lib/hooks';

export function MobileMenuProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <MobileMenuContext.Provider value={{ isOpen, toggle, open, close }}>
      {children}
    </MobileMenuContext.Provider>
  );
}
