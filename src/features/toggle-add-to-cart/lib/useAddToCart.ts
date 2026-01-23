'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/config/store-hooks';
import { addItem, updateQuantity } from '@/entities/cart/model/store/cartState';
import { useNotificationContext } from '@/shared/ui/notification-provider';
import type { IProductUiDto } from '@/entities/product/model/dto/types';

interface UseAddToCartProps {
  product: IProductUiDto;
  quantity: number;
}

export function useAddToCart({ product, quantity }: UseAddToCartProps) {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const { addNotification } = useNotificationContext();

  const defaultOffer = product.defaultOffer;
  const price = defaultOffer?.price || 0;
  const unit = defaultOffer?.unit || 'шт.';
  const currency = defaultOffer?.currency || 'RUB';
  const currencySymbol = defaultOffer?.currencySymbol || '₽';

  // Проверяем, есть ли товар уже в корзине
  const existingCartItem = defaultOffer
    ? cartItems.find(
        (item) =>
          item.productUuid === product.uuid && item.offerUuid === defaultOffer.uuid
      )
    : null;

  const handleAddToCart = useCallback(() => {
    if (!defaultOffer || !price || isNaN(price)) return;

    if (existingCartItem) {
      // Если товар уже в корзине, увеличиваем количество
      dispatch(
        updateQuantity({
          id: existingCartItem.id,
          quantity: existingCartItem.quantity + quantity,
        })
      );
      addNotification({
        type: 'success',
        message: `Количество товара "${product.name}" обновлено в корзине`,
        duration: 3000,
      });
    } else {
      // Если товара нет в корзине, добавляем его quantity раз
      for (let i = 0; i < quantity; i++) {
        dispatch(
          addItem({
            productUuid: product.uuid,
            productName: product.name,
            productImage: product.image || null,
            offerUuid: defaultOffer.uuid,
            offerName: product.name,
            price,
            currency,
            currencySymbol,
            unit,
            article: product.sku || '',
          })
        );
      }
      addNotification({
        type: 'success',
        message: `Товар "${product.name}" добавлен в корзину`,
        duration: 3000,
      });
    }
  }, [dispatch, defaultOffer, price, existingCartItem, quantity, product, currency, currencySymbol, unit, addNotification]);

  const isDisabled = !defaultOffer || !price || isNaN(price) || !product.isInStock;

  return {
    handleAddToCart,
    isDisabled,
  };
}
