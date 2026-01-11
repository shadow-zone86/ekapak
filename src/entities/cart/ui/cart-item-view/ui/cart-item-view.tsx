'use client';

import Image from 'next/image';
import { CartItem as CartItemType } from '../../../model/types';
import { IProductUiDto, IOfferUiDto } from '@/entities/product/model/dto/types';
import { PText } from '@/shared/ui/typography';
import { CardAvailability } from '@/shared/components/card-availability';

interface CartItemViewProps {
  cartItem: CartItemType;
  product?: IProductUiDto;
  quantityControls: React.ReactNode;
  price: React.ReactNode;
  removeButton: React.ReactNode;
  favoriteButton: React.ReactNode;
}

export function CartItemView({
  cartItem,
  product,
  quantityControls,
  price,
  removeButton,
  favoriteButton,
}: CartItemViewProps) {
  const offer: IOfferUiDto | undefined = product?.offers.find((o) => o.uuid === cartItem.offerUuid);
  const isInStock = offer?.isAvailable ?? false;
  const availability = isInStock ? 'В наличии' : 'Под заказ';
  const availabilityColor = isInStock ? '#2AC84D' : '#00B0FF';

  return (
    <div className="cart-item-view flex flex-col gap-4 border-b border-stroke py-4 md:flex-row md:gap-4 animate-fade-in transition-smooth">
      {/* Изображение товара и кнопки действий (мобильная версия) */}
      <div className="cart-item-view__image-section flex flex-col gap-4 md:contents">
        <div className="cart-item-view__image-wrapper relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-background">
          {cartItem.productImage ? (
            <Image
              src={cartItem.productImage}
              alt={cartItem.productName}
              fill
              className="cart-item-view__image object-contain p-2"
              sizes="96px"
            />
          ) : (
            <div className="cart-item-view__image-placeholder flex h-full items-center justify-center text-gray-400 text-xs">
              Нет фото
            </div>
          )}
        </div>

        {/* Кнопки действий (мобильная версия - под изображением) */}
        <div className="cart-item-view__actions-mobile flex gap-2 md:hidden">
          {favoriteButton}
          {removeButton}
        </div>
      </div>

      {/* Основной контент */}
      <div className="cart-item-view__content flex flex-1 flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Левая часть - информация о товаре и статус наличия */}
        <div className="cart-item-view__info flex flex-1 flex-col gap-2 md:flex-row md:items-center md:gap-4">
          <div className="cart-item-view__product-info flex flex-col">
            {/* Артикул */}
            {cartItem.article && (
              <div className="cart-item-view__article mb-1 text-xs text-gray-600">Арт. {cartItem.article}</div>
            )}

            {/* Название товара */}
            <PText className="cart-item-view__name mb-2 line-clamp-3 text-black text-[16px] md:mb-0 md:max-w-[220px]">
              {cartItem.productName}
            </PText>
          </div>

          {/* Статус наличия */}
          <div className="cart-item-view__availability flex items-center">
            {offer && (
              <CardAvailability
                availability={availability}
                availabilityColor={availabilityColor}
                isInStock={isInStock}
              />
            )}
          </div>
        </div>

        {/* Центральная часть - количество и цена за единицу */}
        <div className="cart-item-view__quantity-wrapper flex items-center gap-2">
          {quantityControls}
        </div>

        {/* Правая часть - итоговая цена и действия (десктоп) */}
        <div className="cart-item-view__desktop-actions hidden items-center gap-4 md:flex">
          <div className="cart-item-view__price-desktop">{price}</div>
          <div className="cart-item-view__actions-desktop flex gap-[10px]">
            {favoriteButton}
            {removeButton}
          </div>
        </div>

        {/* Цена (мобильная версия) */}
        <div className="cart-item-view__price-mobile md:hidden">
          {price}
        </div>
      </div>
    </div>
  );
}
