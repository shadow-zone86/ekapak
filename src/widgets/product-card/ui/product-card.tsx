'use client';

import Image from 'next/image';
import { useProductBySlug } from '@/entities/product/api/useProductBySlug';
import { ProductQuantityProvider, ProductQuantityControls } from '@/features/product-quantity';
import { AddToCartButton } from '@/features/toggle-add-to-cart';
import { FavoriteButton } from '@/features/toggle-favorite';
import { CardAvailability } from '@/shared/components/card-availability';
import { Card } from '@/shared/ui/card';
import { PText, Description, H1 } from '@/shared/ui/typography';

interface ProductCardProps {
  slug: string;
}

export function ProductCard({ slug }: ProductCardProps) {
  const { data: product, isLoading, error } = useProductBySlug(slug);

  if (isLoading) {
    return (
      <div className="product-card product-card--loading py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="product-card__skeleton-image aspect-square animate-pulse rounded-lg bg-gray-200" />
          <div className="product-card__skeleton-content space-y-4">
            <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
            <div className="h-24 w-full animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-card product-card--error py-12 text-center">
        <H1 className="mb-4">Товар не найден</H1>
        <PText className="text-gray">К сожалению, товар с таким адресом не существует.</PText>
      </div>
    );
  }

  const defaultOffer = product.defaultOffer;
  const initialQuantity = defaultOffer?.minPurchase ?? 100;

  return (
    <ProductQuantityProvider initialQuantity={initialQuantity}>
      <div className="product-card py-6">
        <div className="product-card__container grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Изображение товара */}
          <div className="product-card__image-wrapper relative aspect-square w-full overflow-hidden rounded-lg bg-background">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="product-card__image object-contain p-4"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="product-card__image-placeholder flex h-full items-center justify-center text-gray text-lg">
                Нет изображения
              </div>
            )}
            {/* Кнопка избранного */}
            <div className="product-card__favorite-wrapper absolute top-5 right-4 z-10">
              <FavoriteButton productUuid={product.uuid} productName={product.name} />
            </div>
          </div>

          {/* Информация о товаре */}
          <div className="product-card__info flex flex-col gap-6">
            {/* Артикул */}
            {product.sku && (
              <Description className="product-card__sku text-gray text-sm">
                Артикул: {product.sku}
              </Description>
            )}

            {/* Название */}
            <H1 className="product-card__title text-2xl font-bold text-black lg:text-3xl">
              {product.name}
            </H1>

            {/* Наличие */}
            <div className="product-card__availability flex items-center gap-2">
              <CardAvailability
                availability={product.availability}
                availabilityColor={product.availabilityColor}
                isInStock={product.isInStock}
              />
            </div>

            {/* Цена */}
            {defaultOffer && (
              <div className="product-card__price flex items-baseline gap-2">
                <span className="product-card__price-value text-3xl font-bold text-black">
                  {defaultOffer.formattedPrice}
                </span>
                <span className="product-card__price-unit text-lg text-gray">
                  за {defaultOffer.unit}
                </span>
              </div>
            )}

            {/* Описание */}
            {product.description && (
              <Card variant="outlined" className="product-card__description p-4">
                <PText className="text-gray whitespace-pre-line">
                  {product.description}
                </PText>
              </Card>
            )}

            {/* Управление количеством */}
            {defaultOffer && (
              <div className="product-card__controls flex flex-col gap-4">
                <div className="product-card__quantity-wrapper flex items-center justify-center">
                  <ProductQuantityControls defaultOffer={defaultOffer} withBorder={true} />
                </div>
                <AddToCartButton product={product} />
              </div>
            )}

            {/* Все предложения, если их несколько */}
            {product.hasMultipleOffers && product.offers.length > 1 && (
              <Card variant="outlined" className="product-card__offers p-4">
                <H1 className="product-card__offers-title mb-4 text-lg font-semibold">Доступные варианты:</H1>
                <div className="product-card__offers-list space-y-2">
                  {product.offers.map((offer) => (
                    <div
                      key={offer.uuid}
                      className="product-card__offer-item flex items-center justify-between rounded border border-stroke p-3"
                    >
                      <div className="product-card__offer-info">
                        <PText className="product-card__offer-name font-medium">{offer.name}</PText>
                        <Description className="product-card__offer-price text-xs text-gray">
                          {offer.formattedPrice} за {offer.unit}
                        </Description>
                      </div>
                      <CardAvailability
                        availability={offer.isAvailable ? 'В наличии' : 'Под заказ'}
                        availabilityColor={offer.isAvailable ? '#2AC84D' : '#00B0FF'}
                        isInStock={offer.isAvailable}
                      />
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </ProductQuantityProvider>
  );
}
