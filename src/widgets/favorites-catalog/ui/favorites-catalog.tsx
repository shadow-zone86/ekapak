'use client';

import { useFavoriteProducts } from '@/entities/product/api/useFavoriteProducts';
import { ProductCardView } from '@/entities/product/ui/product-card-view';
import { ProductQuantityControls, ProductQuantityProvider } from '@/features/product-quantity';
import { AddToCartButton } from '@/features/toggle-add-to-cart';
import { FavoriteButton } from '@/features/toggle-favorite';
import { H1, PText } from '@/shared/ui/typography';

export function FavoritesCatalog() {
  const { products, isLoading, isError, errors } = useFavoriteProducts();

  return (
    <div className="flex flex-col gap-4">
      <H1 className="text-2xl font-bold">Избранное</H1>

      {isError && errors.length > 0 && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-800">
          <p className="font-semibold">Ошибка загрузки товаров:</p>
          <ul className="list-disc list-inside">
            {errors.map((error, index) => (
              <li key={index}>{error?.message || String(error)}</li>
            ))}
          </ul>
        </div>
      )}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-80 animate-pulse rounded-lg bg-gray-200"
            />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {products.map((product) => {
            const defaultOffer = product.defaultOffer;
            if (!defaultOffer) {
              return null;
            }
            const initialQuantity = defaultOffer.minPurchase ?? 100;

            return (
              <ProductQuantityProvider key={product.uuid} initialQuantity={initialQuantity}>
                <ProductCardView
                  product={product}
                  favoriteButton={<FavoriteButton productUuid={product.uuid} productName={product.name} />}
                  quantityControls={<ProductQuantityControls defaultOffer={defaultOffer} />}
                  addToCartButton={<AddToCartButton product={product} />}
                />
              </ProductQuantityProvider>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-16 w-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <H1 className="mb-2 text-xl font-semibold text-gray-900">В избранном пока пусто</H1>
          <PText className="text-gray-500">
            Добавляйте товары в избранное, чтобы вернуться к ним позже
          </PText>
        </div>
      )}
    </div>
  );
}
