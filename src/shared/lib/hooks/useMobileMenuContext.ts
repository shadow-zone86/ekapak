'use client';

import { createContext, useContext } from 'react';

export interface MobileMenuContextValue {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

export const MobileMenuContext = createContext<MobileMenuContextValue | null>(null);

export function useMobileMenuContext() {
  const context = useContext(MobileMenuContext);
  if (!context) {
    throw new Error('useMobileMenuContext must be used within MobileMenuProvider');
  }
  return context;
}
