'use client';

import { useState, useMemo } from 'react';

interface UseProductQuantityProps {
  minPurchase: number;
  price: number;
  unit: string;
  currency: string;
}

export function useProductQuantity({
  minPurchase,
  price,
  unit,
  currency,
}: UseProductQuantityProps) {
  const [quantity, setQuantity] = useState(minPurchase);

  const totalPrice = useMemo(() => price * quantity, [price, quantity]);

  const handleDecrease = () => {
    setQuantity(prev => Math.max(minPurchase, prev - 1));
  };

  const handleIncrease = () => {
    setQuantity(prev => prev + 1);
  };

  return {
    quantity,
    totalPrice,
    unit,
    currency,
    handleDecrease,
    handleIncrease,
  };
}
