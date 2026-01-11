import { sortProducts } from './sortProducts';
import type { IProductUiDto } from '@/entities/product/model/dto/types';
import type { SortOption } from './useProductSort';

describe('sortProducts', () => {
  const mockProducts: IProductUiDto[] = [
    {
      uuid: '1',
      name: 'Яблоко',
      sku: 'SKU-001',
      slug: 'apple',
      description: 'Описание яблока',
      defaultOffer: {
        uuid: 'offer-1',
        name: 'Яблоко',
        price: 100,
        currency: 'RUB',
        currencySymbol: '₽',
        formattedPrice: '100 ₽',
        unit: 'шт',
        quantity: 1,
        minPurchase: 1,
        isAvailable: true,
      },
      offers: [],
      hasMultipleOffers: false,
      isInStock: true,
      availability: 'В наличии',
      availabilityColor: 'green',
    },
    {
      uuid: '2',
      name: 'Банан',
      sku: 'SKU-002',
      slug: 'banana',
      description: 'Описание банана',
      defaultOffer: {
        uuid: 'offer-2',
        name: 'Банан',
        price: 50,
        currency: 'RUB',
        currencySymbol: '₽',
        formattedPrice: '50 ₽',
        unit: 'шт',
        quantity: 1,
        minPurchase: 1,
        isAvailable: true,
      },
      offers: [],
      hasMultipleOffers: false,
      isInStock: true,
      availability: 'В наличии',
      availabilityColor: 'green',
    },
    {
      uuid: '3',
      name: 'Апельсин',
      sku: 'SKU-003',
      slug: 'orange',
      description: 'Описание апельсина',
      defaultOffer: {
        uuid: 'offer-3',
        name: 'Апельсин',
        price: 150,
        currency: 'RUB',
        currencySymbol: '₽',
        formattedPrice: '150 ₽',
        unit: 'шт',
        quantity: 1,
        minPurchase: 1,
        isAvailable: true,
      },
      offers: [],
      hasMultipleOffers: false,
      isInStock: true,
      availability: 'В наличии',
      availabilityColor: 'green',
    },
  ];

  it('should return products unchanged when sortOption is default', () => {
    const result = sortProducts(mockProducts, 'default');
    expect(result).toEqual(mockProducts);
    expect(result).toBe(mockProducts); // Возвращает оригинальный массив
  });

  describe('name-asc', () => {
    it('should sort products by name in ascending order (Russian locale)', () => {
      const result = sortProducts(mockProducts, 'name-asc');
      expect(result[0].name).toBe('Апельсин');
      expect(result[1].name).toBe('Банан');
      expect(result[2].name).toBe('Яблоко');
    });

    it('should not mutate original array', () => {
      const original = [...mockProducts];
      sortProducts(mockProducts, 'name-asc');
      expect(mockProducts).toEqual(original);
    });
  });

  describe('name-desc', () => {
    it('should sort products by name in descending order (Russian locale)', () => {
      const result = sortProducts(mockProducts, 'name-desc');
      expect(result[0].name).toBe('Яблоко');
      expect(result[1].name).toBe('Банан');
      expect(result[2].name).toBe('Апельсин');
    });

    it('should not mutate original array', () => {
      const original = [...mockProducts];
      sortProducts(mockProducts, 'name-desc');
      expect(mockProducts).toEqual(original);
    });
  });

  describe('price-asc', () => {
    it('should sort products by price in ascending order', () => {
      const result = sortProducts(mockProducts, 'price-asc');
      expect(result[0].defaultOffer?.price).toBe(50);
      expect(result[1].defaultOffer?.price).toBe(100);
      expect(result[2].defaultOffer?.price).toBe(150);
    });

    it('should handle products without defaultOffer (treat as 0)', () => {
      const productsWithMissingOffer: IProductUiDto[] = [
        {
          ...mockProducts[0],
          defaultOffer: undefined,
        },
        mockProducts[1],
      ];
      const result = sortProducts(productsWithMissingOffer, 'price-asc');
      expect(result[0].defaultOffer).toBeUndefined();
      expect(result[1].defaultOffer?.price).toBe(50);
    });

    it('should not mutate original array', () => {
      const original = [...mockProducts];
      sortProducts(mockProducts, 'price-asc');
      expect(mockProducts).toEqual(original);
    });
  });

  describe('price-desc', () => {
    it('should sort products by price in descending order', () => {
      const result = sortProducts(mockProducts, 'price-desc');
      expect(result[0].defaultOffer?.price).toBe(150);
      expect(result[1].defaultOffer?.price).toBe(100);
      expect(result[2].defaultOffer?.price).toBe(50);
    });

    it('should handle products without defaultOffer (treat as 0)', () => {
      const productsWithMissingOffer: IProductUiDto[] = [
        mockProducts[0],
        {
          ...mockProducts[1],
          defaultOffer: undefined,
        },
      ];
      const result = sortProducts(productsWithMissingOffer, 'price-desc');
      expect(result[0].defaultOffer?.price).toBe(100);
      expect(result[1].defaultOffer).toBeUndefined();
    });

    it('should not mutate original array', () => {
      const original = [...mockProducts];
      sortProducts(mockProducts, 'price-desc');
      expect(mockProducts).toEqual(original);
    });
  });

  describe('edge cases', () => {
    it('should handle empty array', () => {
      const result = sortProducts([], 'name-asc');
      expect(result).toEqual([]);
    });

    it('should handle single product', () => {
      const singleProduct = [mockProducts[0]];
      const result = sortProducts(singleProduct, 'name-desc');
      expect(result).toEqual(singleProduct);
      expect(result).not.toBe(singleProduct);
    });

    it('should handle products with same prices', () => {
      const productsWithSamePrice: IProductUiDto[] = [
        mockProducts[0],
        {
          ...mockProducts[1],
          defaultOffer: {
            ...mockProducts[1].defaultOffer!,
            price: mockProducts[0].defaultOffer!.price,
          },
        },
      ];
      const result = sortProducts(productsWithSamePrice, 'price-asc');
      expect(result).toHaveLength(2);
      expect(result[0].defaultOffer?.price).toBe(result[1].defaultOffer?.price);
    });

    it('should handle products with same names', () => {
      const productsWithSameName: IProductUiDto[] = [
        mockProducts[0],
        {
          ...mockProducts[1],
          name: mockProducts[0].name,
        },
      ];
      const result = sortProducts(productsWithSameName, 'name-asc');
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe(result[1].name);
    });

    it('should handle all products without defaultOffer', () => {
      const productsWithoutOffer: IProductUiDto[] = mockProducts.map((p) => ({
        ...p,
        defaultOffer: undefined,
      }));
      const result = sortProducts(productsWithoutOffer, 'price-asc');
      expect(result).toHaveLength(3);
      // Все цены должны быть 0, порядок может быть любым
      result.forEach((product) => {
        expect(product.defaultOffer).toBeUndefined();
      });
    });
  });

  describe('default case handling', () => {
    it('should handle unknown sort option as default', () => {
      const result = sortProducts(mockProducts, 'unknown' as SortOption);
      expect(result).toEqual(mockProducts);
      expect(result).toBe(mockProducts); // Возвращает оригинальный массив
    });
  });
});
