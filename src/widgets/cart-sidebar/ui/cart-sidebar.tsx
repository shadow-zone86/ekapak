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
        className="fixed inset-0 bg-black/50 z-40"
        onClick={() => dispatch(closeCart())}
      />
      <aside className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-xl overflow-y-auto">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-stroke p-4">
            <H2 className="text-black">Корзина</H2>
            <button
              onClick={() => dispatch(closeCart())}
              className="text-gray hover:text-black"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex h-full items-center justify-center text-gray">
                <Description>Корзина пуста</Description>
              </div>
            ) : (
              <ul className="space-y-4">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex gap-4 rounded-lg border border-stroke p-4"
                  >
                    {item.productImage ? (
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded bg-background">
                        <Image
                          src={item.productImage}
                          alt={item.productName}
                          fill
                          className="object-contain p-2"
                          sizes="80px"
                        />
                      </div>
                    ) : (
                      <div className="h-20 w-20 flex-shrink-0 rounded bg-background flex items-center justify-center text-gray">
                        <Description className="text-xs">Нет фото</Description>
                      </div>
                    )}
                    <div className="flex flex-1 flex-col gap-2">
                      <h3 className="text-p-catalog text-black line-clamp-2">
                        {item.productName}
                      </h3>
                      {item.offerName && (
                        <Description className="text-gray">{item.offerName}</Description>
                      )}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                id: item.id,
                                quantity: item.quantity - 1,
                              })
                            )
                          }
                          className="h-6 w-6 rounded border border-stroke text-black hover:bg-background"
                        >
                          −
                        </button>
                        <span className="min-w-[2rem] text-center text-description text-black">
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
                          className="h-6 w-6 rounded border border-stroke text-black hover:bg-background"
                        >
                          +
                        </button>
                        {item.unit && (
                          <Description className="text-gray">
                            {item.unit}
                          </Description>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <Price className="text-blue-600">
                          {item.price.toFixed(2)} {item.currency === 'RUB' ? '₽' : item.currency} × {item.quantity} = {(item.price * item.quantity).toFixed(2)} {item.currency === 'RUB' ? '₽' : item.currency}
                        </Price>
                        <button
                          onClick={() => dispatch(removeItem(item.id))}
                          className="text-red-500 hover:text-red-700"
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
            <div className="border-t border-stroke p-4">
              <div className="mb-4 flex items-center justify-between">
                <PTextBold className="text-black">Итого:</PTextBold>
                <Price className="text-blue-600">
                  {total.toFixed(2)} {items[0]?.currency === 'RUB' ? '₽' : items[0]?.currency || ''}
                </Price>
              </div>
              <Button className="w-full" size="lg">
                Оформить заказ
              </Button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
