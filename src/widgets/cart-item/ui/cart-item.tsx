'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/shared/config/store-hooks';
import { updateQuantity } from '@/entities/cart/model/cartState';
import { CartItem as CartItemType } from '@/entities/cart/model/types';
import { IProductUiDto, IOfferUiDto } from '@/entities/product/model/dto/types';
import { CartItemView } from '@/entities/cart/ui/cart-item-view';
import { ProductQuantityProvider, ProductQuantityControls } from '@/features/product-quantity';
import { useProductQuantityContext } from '@/features/product-quantity/lib/useProductQuantityContext';
import { FavoriteButton } from '@/features/toggle-favorite';
import { RemoveFromCartButton } from '@/features/remove-from-cart';
import { Description } from '@/shared/ui/typography';

interface CartItemProps {
  cartItem: CartItemType;
  product?: IProductUiDto;
}

function CartItemContent({ cartItem, product }: CartItemProps) {
  const dispatch = useAppDispatch();
  const { quantity } = useProductQuantityContext();

  const offer: IOfferUiDto | undefined = product?.offers.find((o) => o.uuid === cartItem.offerUuid);
  const defaultOffer: IOfferUiDto | undefined = offer ? {
    ...offer,
    quantity: cartItem.quantity,
  } : undefined;

  // Синхронизируем количество из контекста с корзиной
  useEffect(() => {
    if (quantity !== cartItem.quantity) {
      dispatch(updateQuantity({ id: cartItem.id, quantity }));
    }
  }, [quantity, cartItem.id, cartItem.quantity, dispatch]);

  return (
    <CartItemView
      cartItem={cartItem}
      product={product}
      quantityControls={defaultOffer ? <ProductQuantityControls defaultOffer={defaultOffer} withBorder /> : null}
      price={
        <div className="cart-item__price text-left">
          <div className="cart-item__price-total text-base font-semibold text-black">
            {(cartItem.price * quantity).toFixed(2)}{cartItem.currency.trim().toUpperCase() === 'RUB' ? 'Р' : cartItem.currency}
          </div>
          <Description className="cart-item__price-details text-xs text-gray-600">
            {quantity} × {cartItem.price.toFixed(2)}
          </Description>
        </div>
      }
      removeButton={<RemoveFromCartButton cartItemId={cartItem.id} />}
      favoriteButton={<FavoriteButton productUuid={cartItem.productUuid} productName={cartItem.productName} variant="compact" />}
    />
  );
}

export function CartItem({ cartItem, product }: CartItemProps) {
  return (
    <ProductQuantityProvider initialQuantity={cartItem.quantity}>
      <CartItemContent cartItem={cartItem} product={product} />
    </ProductQuantityProvider>
  );
}
