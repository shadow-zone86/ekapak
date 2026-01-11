'use client';

import Image from 'next/image';
import { useAppSelector, useAppDispatch } from '@/shared/config/store-hooks';
import {
  removeItem,
  updateQuantity,
  closeCart,
} from '@/entities/cart/model/cartState';
import { Button } from '@/shared/ui/button';
import { H2, PTextBold, Price, Description } from '@/shared/ui/typography';

export function CartSidebar() {
  const { items, isOpen } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (!isOpen) return null;

  return (
    <>
      <div
        className="cart-sidebar__overlay fixed inset-0 bg-black/50 z-40 animate-fade-in"
        onClick={() => dispatch(closeCart())}
      />
      <aside className="cart-sidebar fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-xl overflow-y-auto animate-slide-in-down">
        <div className="cart-sidebar__container flex h-full flex-col">
          <div className="cart-sidebar__header flex items-center justify-between border-b border-stroke p-4">
            <H2 className="cart-sidebar__title text-black">Корзина</H2>
            <button
              onClick={() => dispatch(closeCart())}
              className="cart-sidebar__close-button text-gray hover:text-black transition-smooth active:scale-95"
            >
              ✕
            </button>
          </div>

          <div className="cart-sidebar__content flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="cart-sidebar__empty flex h-full items-center justify-center text-gray">
                <Description>Корзина пуста</Description>
              </div>
            ) : (
              <ul className="cart-sidebar__items space-y-4">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="cart-sidebar__item flex gap-4 rounded-lg border border-stroke p-4 animate-fade-in hover:shadow-sm transition-smooth"
                  >
                    {item.productImage ? (
                      <div className="cart-sidebar__item-image-wrapper relative h-20 w-20 flex-shrink-0 overflow-hidden rounded bg-background">
                        <Image
                          src={item.productImage}
                          alt={item.productName}
                          fill
                          className="cart-sidebar__item-image object-contain p-2"
                          sizes="80px"
                        />
                      </div>
                    ) : (
                      <div className="cart-sidebar__item-image-placeholder h-20 w-20 flex-shrink-0 rounded bg-background flex items-center justify-center text-gray">
                        <Description className="text-xs">Нет фото</Description>
                      </div>
                    )}
                    <div className="cart-sidebar__item-info flex flex-1 flex-col gap-2">
                      <h3 className="cart-sidebar__item-name text-p-catalog text-black line-clamp-2">
                        {item.productName}
                      </h3>
                      {item.offerName && (
                        <Description className="cart-sidebar__item-offer text-gray">{item.offerName}</Description>
                      )}
                      <div className="cart-sidebar__item-quantity-controls flex items-center gap-2">
                        <button
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                id: item.id,
                                quantity: item.quantity - 1,
                              })
                            )
                          }
                          className="cart-sidebar__item-quantity-button h-6 w-6 rounded border border-stroke text-black hover:bg-background transition-smooth active:scale-95"
                        >
                          −
                        </button>
                        <span className="cart-sidebar__item-quantity-value min-w-[2rem] text-center text-description text-black">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                id: item.id,
                                quantity: item.quantity + 1,
                              })
                            )
                          }
                          className="cart-sidebar__item-quantity-button h-6 w-6 rounded border border-stroke text-black hover:bg-background transition-smooth active:scale-95"
                        >
                          +
                        </button>
                        {item.unit && (
                          <Description className="cart-sidebar__item-unit text-gray">
                            {item.unit}
                          </Description>
                        )}
                      </div>
                      <div className="cart-sidebar__item-price-wrapper flex items-center justify-between">
                        <Price className="cart-sidebar__item-price text-blue-600">
                          {item.price.toFixed(2)} {item.currency === 'RUB' ? '₽' : item.currency} × {item.quantity} = {(item.price * item.quantity).toFixed(2)} {item.currency === 'RUB' ? '₽' : item.currency}
                        </Price>
                        <button
                          onClick={() => dispatch(removeItem(item.id))}
                          className="cart-sidebar__item-remove text-red-500 hover:text-red-700 transition-smooth active:scale-95"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {items.length > 0 && (
            <div className="cart-sidebar__footer border-t border-stroke p-4">
              <div className="cart-sidebar__total-wrapper mb-4 flex items-center justify-between">
                <PTextBold className="cart-sidebar__total-label text-black">Итого:</PTextBold>
                <Price className="cart-sidebar__total-value text-blue-600">
                  {total.toFixed(2)} {items[0]?.currency === 'RUB' ? '₽' : items[0]?.currency || ''}
                </Price>
              </div>
              <Button className="cart-sidebar__checkout-button w-full" size="lg">
                Оформить заказ
              </Button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
