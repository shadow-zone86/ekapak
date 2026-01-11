'use client';

import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';

interface ProductQuantityContextValue {
  quantity: number;
  setQuantity: (quantity: number) => void;
}

const ProductQuantityContext = createContext<ProductQuantityContextValue | undefined>(undefined);

interface ProductQuantityProviderProps {
  children: ReactNode;
  initialQuantity: number;
}

export function ProductQuantityProvider({ children, initialQuantity }: ProductQuantityProviderProps) {
  const [quantity, setQuantity] = useState(initialQuantity);

  const value = useMemo(
    () => ({ quantity, setQuantity }),
    [quantity]
  );

  return (
    <ProductQuantityContext.Provider value={value}>
      {children}
    </ProductQuantityContext.Provider>
  );
}

export function useProductQuantityContext() {
  const context = useContext(ProductQuantityContext);
  if (!context) {
    throw new Error('useProductQuantityContext must be used within ProductQuantityProvider');
  }
  return context;
}
