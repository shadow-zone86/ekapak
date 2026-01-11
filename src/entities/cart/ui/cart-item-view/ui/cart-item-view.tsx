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
    <div className="flex flex-col gap-4 border-b border-stroke py-4 md:flex-row md:gap-4 animate-fade-in transition-smooth">
      {/* Изображение товара и кнопки действий (мобильная версия) */}
      <div className="flex flex-col gap-4 md:contents">
        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-background">
          {cartItem.productImage ? (
            <Image
              src={cartItem.productImage}
              alt={cartItem.productName}
              fill
              className="object-contain p-2"
              sizes="96px"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400 text-xs">
              Нет фото
            </div>
          )}
        </div>

        {/* Кнопки действий (мобильная версия - под изображением) */}
        <div className="flex gap-2 md:hidden">
          {favoriteButton}
          {removeButton}
        </div>
      </div>

      {/* Основной контент */}
      <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Левая часть - информация о товаре и статус наличия */}
        <div className="flex flex-1 flex-col gap-2 md:flex-row md:items-center md:gap-4">
          <div className="flex flex-col">
            {/* Артикул */}
            {cartItem.article && (
              <div className="mb-1 text-xs text-gray-600">Арт. {cartItem.article}</div>
            )}

            {/* Название товара */}
            <PText className="mb-2 line-clamp-3 text-black text-[16px] md:mb-0 md:max-w-[220px]">
              {cartItem.productName}
            </PText>
          </div>

          {/* Статус наличия */}
          <div className="flex items-center">
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
        <div className="flex items-center gap-2">
          {quantityControls}
        </div>

        {/* Правая часть - итоговая цена и действия (десктоп) */}
        <div className="hidden items-center gap-4 md:flex">
          {price}
          <div className="flex gap-[10px]">
            {favoriteButton}
            {removeButton}
          </div>
        </div>

        {/* Цена (мобильная версия) */}
        <div className="md:hidden">
          {price}
        </div>
      </div>
    </div>
  );
}
