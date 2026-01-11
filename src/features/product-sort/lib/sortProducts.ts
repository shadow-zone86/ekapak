import type { IProductUiDto } from '@/entities/product/model/dto/types';
import type { SortOption } from '../model/types';

export function sortProducts(products: IProductUiDto[], sortOption: SortOption): IProductUiDto[] {
  if (sortOption === 'default') {
    return products;
  }

  const sortedProducts = [...products];

  switch (sortOption) {
    case 'name-asc':
      return sortedProducts.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
    case 'name-desc':
      return sortedProducts.sort((a, b) => b.name.localeCompare(a.name, 'ru'));
    case 'price-asc':
      return sortedProducts.sort((a, b) => {
        const priceA = a.defaultOffer?.price ?? 0;
        const priceB = b.defaultOffer?.price ?? 0;
        return priceA - priceB;
      });
    case 'price-desc':
      return sortedProducts.sort((a, b) => {
        const priceA = a.defaultOffer?.price ?? 0;
        const priceB = b.defaultOffer?.price ?? 0;
        return priceB - priceA;
      });
    default:
      return products;
  }
}
