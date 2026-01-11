import {
  mapOfferApiToStore,
  mapProductApiToStore,
} from './mapProductApiToStore';
import type {
  IOfferApiDto,
  IProductApiDto,
} from '../types';

describe('mapProductApiToStore', () => {
  describe('mapOfferApiToStore', () => {
    it('should map offer API DTO to store DTO', () => {
      const apiOffer: IOfferApiDto = {
        uuid: 'offer-123',
        price: '100.50',
        currency: 'RUB',
        unit: 'шт.',
        quantity: 50,
      };

      const result = mapOfferApiToStore(apiOffer);

      expect(result).toEqual({
        uuid: 'offer-123',
        externalId: '',
        name: '',
        unitName: 'шт.',
        unitAbbr: 'шт.',
        article: '',
        barcode: undefined,
        priceType: '',
        price: 100.5,
        currency: 'RUB',
        priceDisplay: undefined,
        quantity: 50,
      });
    });

    it('should handle invalid price string', () => {
      const apiOffer: IOfferApiDto = {
        uuid: 'offer-456',
        price: 'invalid',
        currency: 'USD',
        unit: 'кг',
        quantity: 10,
      };

      const result = mapOfferApiToStore(apiOffer);

      expect(result.price).toBe(0); // parseFloat('invalid') || 0
      expect(result.currency).toBe('USD');
      expect(result.unitName).toBe('кг');
    });

    it('should handle zero price', () => {
      const apiOffer: IOfferApiDto = {
        uuid: 'offer-789',
        price: '0',
        currency: 'RUB',
        unit: 'шт.',
        quantity: 0,
      };

      const result = mapOfferApiToStore(apiOffer);

      expect(result.price).toBe(0);
      expect(result.quantity).toBe(0);
    });
  });

  describe('mapProductApiToStore', () => {
    it('should map product API DTO to store DTO with all fields', () => {
      const apiProduct: IProductApiDto = {
        uuid: 'product-123',
        name: 'Test Product',
        description: 'Test Description',
        slug: 'test-product',
        category_uuid: 'category-123',
        offers_min_price: '100.00',
        offers: [
          {
            uuid: 'offer-1',
            price: '100.50',
            currency: 'RUB',
            unit: 'шт.',
            quantity: 50,
          },
        ],
        article: 'ART-123',
        images: [
          {
            original_url: 'https://example.com/original.jpg',
            card_url: 'https://example.com/card.jpg',
          },
        ],
        properties: {
          'Ширина, мм': '100',
          'Длина, мм': '200',
          'Толщина, мкм': '50',
        },
      };

      const result = mapProductApiToStore(apiProduct);

      expect(result).toEqual({
        uuid: 'product-123',
        externalId: undefined,
        name: 'Test Product',
        sku: 'ART-123',
        description: 'Test Description',
        slug: 'test-product',
        image: 'https://example.com/card.jpg',
        categoryUuid: 'category-123',
        dimensions: {
          thickness: 50,
          width: 100,
          height: 200,
          volume: undefined,
          weight: undefined,
        },
        offers: [
          {
            uuid: 'offer-1',
            externalId: '',
            name: '',
            unitName: 'шт.',
            unitAbbr: 'шт.',
            article: '',
            barcode: undefined,
            priceType: '',
            price: 100.5,
            currency: 'RUB',
            priceDisplay: undefined,
            quantity: 50,
          },
        ],
        createdAt: '',
        updatedAt: '',
      });
    });

    it('should use original_url if card_url is not available', () => {
      const apiProduct: IProductApiDto = {
        uuid: 'product-456',
        name: 'Test Product',
        slug: 'test-product',
        offers: [],
        images: [
          {
            original_url: 'https://example.com/original.jpg',
            card_url: '',
          },
        ],
      };

      const result = mapProductApiToStore(apiProduct);

      expect(result.image).toBe('https://example.com/original.jpg');
    });

    it('should handle missing images', () => {
      const apiProduct: IProductApiDto = {
        uuid: 'product-789',
        name: 'Test Product',
        slug: 'test-product',
        offers: [],
      };

      const result = mapProductApiToStore(apiProduct);

      expect(result.image).toBeUndefined();
    });

    it('should handle empty images array', () => {
      const apiProduct: IProductApiDto = {
        uuid: 'product-999',
        name: 'Test Product',
        slug: 'test-product',
        offers: [],
        images: [],
      };

      const result = mapProductApiToStore(apiProduct);

      expect(result.image).toBeUndefined();
    });

    it('should handle null description', () => {
      const apiProduct: IProductApiDto = {
        uuid: 'product-111',
        name: 'Test Product',
        description: null,
        slug: 'test-product',
        offers: [],
      };

      const result = mapProductApiToStore(apiProduct);

      expect(result.description).toBeUndefined();
    });

    it('should handle undefined description', () => {
      const apiProduct: IProductApiDto = {
        uuid: 'product-222',
        name: 'Test Product',
        slug: 'test-product',
        offers: [],
      };

      const result = mapProductApiToStore(apiProduct);

      expect(result.description).toBeUndefined();
    });

    it('should handle missing article', () => {
      const apiProduct: IProductApiDto = {
        uuid: 'product-333',
        name: 'Test Product',
        slug: 'test-product',
        offers: [],
      };

      const result = mapProductApiToStore(apiProduct);

      expect(result.sku).toBe('');
    });

    it('should extract dimensions from properties', () => {
      const apiProduct: IProductApiDto = {
        uuid: 'product-444',
        name: 'Test Product',
        slug: 'test-product',
        offers: [],
        properties: {
          'Ширина, мм': '150',
          'Длина, мм': '250',
          'Толщина, мкм': '75',
          'Объем, л': '5.5',
          'Вес пакета, г': '200',
        },
      };

      const result = mapProductApiToStore(apiProduct);

      expect(result.dimensions).toEqual({
        thickness: 75,
        width: 150,
        height: 250,
        volume: 5.5,
        weight: 200,
      });
    });

    it('should handle missing properties', () => {
      const apiProduct: IProductApiDto = {
        uuid: 'product-555',
        name: 'Test Product',
        slug: 'test-product',
        offers: [],
      };

      const result = mapProductApiToStore(apiProduct);

      expect(result.dimensions).toBeUndefined();
    });

    it('should handle empty properties', () => {
      const apiProduct: IProductApiDto = {
        uuid: 'product-666',
        name: 'Test Product',
        slug: 'test-product',
        offers: [],
        properties: {},
      };

      const result = mapProductApiToStore(apiProduct);

      expect(result.dimensions).toBeUndefined();
    });

    it('should handle partial dimensions in properties', () => {
      const apiProduct: IProductApiDto = {
        uuid: 'product-777',
        name: 'Test Product',
        slug: 'test-product',
        offers: [],
        properties: {
          'Ширина, мм': '100',
        },
      };

      const result = mapProductApiToStore(apiProduct);

      expect(result.dimensions).toEqual({
        thickness: undefined,
        width: 100,
        height: undefined,
        volume: undefined,
        weight: undefined,
      });
    });

    it('should map multiple offers', () => {
      const apiProduct: IProductApiDto = {
        uuid: 'product-888',
        name: 'Test Product',
        slug: 'test-product',
        offers: [
          {
            uuid: 'offer-1',
            price: '100.00',
            currency: 'RUB',
            unit: 'шт.',
            quantity: 50,
          },
          {
            uuid: 'offer-2',
            price: '200.00',
            currency: 'RUB',
            unit: 'кг',
            quantity: 20,
          },
        ],
      };

      const result = mapProductApiToStore(apiProduct);

      expect(result.offers).toHaveLength(2);
      expect(result.offers[0].price).toBe(100);
      expect(result.offers[1].price).toBe(200);
      expect(result.offers[0].unitName).toBe('шт.');
      expect(result.offers[1].unitName).toBe('кг');
    });

    it('should handle empty offers array', () => {
      const apiProduct: IProductApiDto = {
        uuid: 'product-999',
        name: 'Test Product',
        slug: 'test-product',
        offers: [],
      };

      const result = mapProductApiToStore(apiProduct);

      expect(result.offers).toEqual([]);
    });
  });
});
