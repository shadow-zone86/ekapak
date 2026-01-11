'use client';

import Link from 'next/link';
import type { IProductUiDto } from '../../../model/dto/types';
import { Card } from '@/shared/ui/card';
import { Description } from '@/shared/ui/typography';
import { CardImage } from '@/shared/components/card-image';
import { CardTitle } from '@/shared/components/card-title';
import { CardPrice } from '@/shared/components/card-price';
import { CardAvailability } from '@/shared/components/card-availability';

interface ProductCardViewProps {
  product: IProductUiDto;
  quantityControls: React.ReactNode;
  addToCartButton: React.ReactNode;
  favoriteButton?: React.ReactNode;
}

export function ProductCardView({
  product,
  quantityControls,
  addToCartButton,
  favoriteButton,
}: ProductCardViewProps) {
  const defaultOffer = product.defaultOffer;

  return (
    <Card
      variant="default"
      size="sm"
      className="product-card-view group relative flex flex-col overflow-hidden p-0 h-full animate-fade-in hover:shadow-lg transition-smooth"
    >
      {/* Изображение продукта с иконкой избранного */}
      <div className="product-card-view__image-wrapper relative w-full overflow-hidden" style={{ aspectRatio: '1 / 1', maxHeight: '200px' }}>
        <Link href={`/product/${product.slug}`} className="product-card-view__image-link absolute inset-0 z-0">
          <CardImage image={product.image} alt={product.name} />
        </Link>
        {/* Иконка избранного */}
        {favoriteButton && (
          <div className="product-card-view__favorite-wrapper absolute top-1.5 right-1.5 z-10" onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
            {favoriteButton}
          </div>
        )}
      </div>

      {/* Информация о продукте */}
      <div className="product-card-view__content flex flex-1 flex-col p-3">
        {/* Артикул */}
        {product.sku && (
          <Description className="mb-1.5 text-gray text-xs">
            Арт. {product.sku}
          </Description>
        )}

        {/* Название */}
        <CardTitle name={product.name} />

        {/* Цена с единицей измерения */}
        {defaultOffer && (
          <div className="mb-2 flex items-center gap-1">
            <CardPrice price={defaultOffer.price} currencySymbol={defaultOffer.currencySymbol} unit={defaultOffer.unit} />
          </div>
        )}

        {/* Наличие */}
        <div className="mb-2.5 flex items-center gap-1">
          <CardAvailability availability={product.availability} availabilityColor={product.availabilityColor} isInStock={product.isInStock} />
        </div>

        {/* Счетчик количества */}
        <div className="mb-2.5 flex items-center justify-center gap-2">
          {quantityControls}
        </div>

        {/* Кнопка добавления в корзину */}
        {addToCartButton}
      </div>
    </Card>
  );
}
