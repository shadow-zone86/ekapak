'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProducts } from '@/entities/product/api/useProducts';
import { ProductCardView } from '@/entities/product/ui/product-card-view';
import { ProductQuantityControls, ProductQuantityProvider } from '@/features/product-quantity';
import { AddToCartButton } from '@/features/toggle-add-to-cart';
import { FavoriteButton } from '@/features/toggle-favorite';
import { Pagination } from '@/features/pagination';
import { CategoryFilter } from '@/features/category-filter';
import { ProductSort, sortProducts, type SortOption } from '@/features/product-sort';
import { ScrollAnimateWrapper } from '@/shared/components/scroll-animate-wrapper/scroll-animate-wrapper';

interface ProductsCatalogProps {
  initialPage: number;
  initialCategory?: string;
  searchQuery?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ProductsCatalog(_props: ProductsCatalogProps) {
  const searchParams = useSearchParams();
  const pageParam = searchParams?.get('page');
  const page = parseInt(pageParam || '1', 10);
  const categoryUuid = searchParams?.get('category') || undefined;
  const searchQuery = searchParams?.get('search') || '';
  const sortOption = (searchParams?.get('sort') || 'default') as SortOption;

  // Entities: получение данных
  const { data: productsData, isLoading: isLoadingProducts } = useProducts(
    page,
    20,
    categoryUuid
  );

  // Фильтрация и сортировка продуктов на фронте
  const filteredAndSortedProducts = useMemo(() => {
    const allProducts = productsData?.data || [];

    // Фильтрация по поисковому запросу
    let filtered = allProducts;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = allProducts.filter((product) =>
        product.name.toLowerCase().includes(query)
      );
    }

    // Сортировка
    return sortProducts(filtered, sortOption);
  }, [productsData?.data, searchQuery, sortOption]);

  const meta = productsData?.meta;
  const totalPages = searchQuery.trim() ? 1 : (meta?.last_page || 1);

  return (
    <div className="products-catalog flex flex-col gap-[10px] lg:flex-row">
      <CategoryFilter />

      <div className="products-catalog__content flex-1">
        <div className="products-catalog__sort-wrapper mb-4 flex items-center justify-end">
          <ProductSort />
        </div>
        <>
          {isLoadingProducts ? (
            <div className="products-catalog__skeleton grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="products-catalog__skeleton-item h-80 animate-pulse rounded-lg bg-gray-200"
                />
              ))}
            </div>
          ) : filteredAndSortedProducts.length > 0 ? (
            <>
              <div className="products-catalog__grid grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {filteredAndSortedProducts.map((product, index) => {
                  const defaultOffer = product.defaultOffer;
                  if (!defaultOffer) {
                    return null;
                  }
                  const initialQuantity = defaultOffer.minPurchase ?? 100;

                  return (
                    <ProductQuantityProvider key={product.uuid} initialQuantity={initialQuantity}>
                      <ScrollAnimateWrapper delay={(index % 10) * 50}>
                        <ProductCardView
                          product={product}
                          favoriteButton={<FavoriteButton productUuid={product.uuid} productName={product.name} />}
                          quantityControls={<ProductQuantityControls defaultOffer={defaultOffer} />}
                          addToCartButton={<AddToCartButton product={product} />}
                        />
                      </ScrollAnimateWrapper>
                    </ProductQuantityProvider>
                  );
                })}
              </div>
              {!searchQuery.trim() && totalPages > 1 && (
                <Pagination currentPage={page} totalPages={totalPages} basePath="/" />
              )}
            </>
          ) : (
            <div className="products-catalog__empty col-span-full py-12 text-center text-gray">
              Товары не найдены
            </div>
          )}
        </>
      </div>
    </div>
  );
}

