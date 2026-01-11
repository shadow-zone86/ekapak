'use client';

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
      className="group relative flex flex-col overflow-hidden p-0 h-full"
    >
      {/* Изображение продукта с иконкой избранного */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '1 / 1', maxHeight: '200px' }}>
        <CardImage image={product.image} alt={product.name} />
        {/* Иконка избранного */}
        {favoriteButton}
      </div>

      {/* Информация о продукте */}
      <div className="flex flex-1 flex-col p-3">
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
