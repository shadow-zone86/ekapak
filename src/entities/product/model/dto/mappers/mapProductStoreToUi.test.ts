import {
  mapOfferStoreToUi,
  mapProductStoreToUi,
} from './mapProductStoreToUi';
import type {
  IOfferStoreDto,
  IProductStoreDto,
} from '../types';

describe('mapProductStoreToUi', () => {
  describe('mapOfferStoreToUi', () => {
    it('should map offer store DTO to UI DTO with RUB currency', () => {
      const storeOffer: IOfferStoreDto = {
        uuid: 'offer-123',
        externalId: 'ext-123',
        name: 'Test Offer',
        unitName: 'шт.',
        unitAbbr: 'шт.',
        article: 'ART-123',
        barcode: '123456789',
        priceType: 'regular',
        price: 100.5,
        currency: 'RUB',
        priceDisplay: '100.50 ₽',
        quantity: 50,
      };

      const result = mapOfferStoreToUi(storeOffer);

      expect(result).toEqual({
        uuid: 'offer-123',
        name: 'Test Offer',
        price: 100.5,
        currency: 'RUB',
        currencySymbol: '₽',
        formattedPrice: '100.50 ₽',
        unit: 'шт.',
        quantity: 50,
        minPurchase: 50,
        isAvailable: true,
        priceType: 'regular',
      });
    });

    it('should format price with USD currency', () => {
      const storeOffer: IOfferStoreDto = {
        uuid: 'offer-456',
        externalId: '',
        name: '',
        unitName: 'кг',
        unitAbbr: 'кг',
        article: '',
        priceType: '',
        price: 25.75,
        currency: 'USD',
        quantity: 10,
      };

      const result = mapOfferStoreToUi(storeOffer);

      expect(result.formattedPrice).toBe('25.75 USD');
      expect(result.currency).toBe('USD');
      expect(result.currencySymbol).toBe('USD');
      expect(result.minPurchase).toBe(10);
    });

    it('should set isAvailable to false when quantity is 0', () => {
      const storeOffer: IOfferStoreDto = {
        uuid: 'offer-789',
        externalId: '',
        name: '',
        unitName: 'шт.',
        unitAbbr: 'шт.',
        article: '',
        priceType: '',
        price: 50,
        currency: 'RUB',
        quantity: 0,
      };

      const result = mapOfferStoreToUi(storeOffer);

      expect(result.isAvailable).toBe(false);
      expect(result.minPurchase).toBe(100);
    });

    it('should format price with two decimal places', () => {
      const storeOffer: IOfferStoreDto = {
        uuid: 'offer-999',
        externalId: '',
        name: '',
        unitName: 'шт.',
        unitAbbr: 'шт.',
        article: '',
        priceType: '',
        price: 99.9,
        currency: 'RUB',
        quantity: 1,
      };

      const result = mapOfferStoreToUi(storeOffer);

      expect(result.formattedPrice).toBe('99.90 ₽');
      expect(result.currencySymbol).toBe('₽');
      expect(result.minPurchase).toBe(1);
    });
  });

  describe('mapProductStoreToUi', () => {
    it('should map product store DTO to UI DTO with single offer', () => {
      const storeProduct: IProductStoreDto = {
        uuid: 'product-123',
        name: 'Test Product',
        sku: 'ART-123',
        description: 'Test Description',
        slug: 'test-product',
        image: 'https://example.com/image.jpg',
        categoryUuid: 'category-123',
        offers: [
          {
            uuid: 'offer-1',
            externalId: '',
            name: '',
            unitName: 'шт.',
            unitAbbr: 'шт.',
            article: '',
            priceType: '',
            price: 100,
            currency: 'RUB',
            quantity: 50,
          },
        ],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-02',
      };

      const result = mapProductStoreToUi(storeProduct);

      expect(result).toEqual({
        uuid: 'product-123',
        name: 'Test Product',
        sku: 'ART-123',
        description: 'Test Description',
        image: 'https://example.com/image.jpg',
        slug: 'test-product',
        defaultOffer: {
          uuid: 'offer-1',
          name: '',
          price: 100,
          currency: 'RUB',
          currencySymbol: '₽',
          formattedPrice: '100.00 ₽',
          unit: 'шт.',
          quantity: 50,
          minPurchase: 50,
          isAvailable: true,
          priceType: '',
        },
        offers: [
          {
            uuid: 'offer-1',
            name: '',
            price: 100,
            currency: 'RUB',
            currencySymbol: '₽',
            formattedPrice: '100.00 ₽',
            unit: 'шт.',
            quantity: 50,
            minPurchase: 50,
            isAvailable: true,
            priceType: '',
          },
        ],
        hasMultipleOffers: false,
        isInStock: true,
        availability: 'В наличии',
        availabilityColor: '#2AC84D',
      });
    });

    it('should map product with multiple offers', () => {
      const storeProduct: IProductStoreDto = {
        uuid: 'product-456',
        name: 'Test Product',
        sku: 'ART-456',
        slug: 'test-product',
        offers: [
          {
            uuid: 'offer-1',
            externalId: '',
            name: '',
            unitName: 'шт.',
            unitAbbr: 'шт.',
            article: '',
            priceType: '',
            price: 100,
            currency: 'RUB',
            quantity: 50,
          },
          {
            uuid: 'offer-2',
            externalId: '',
            name: '',
            unitName: 'кг',
            unitAbbr: 'кг',
            article: '',
            priceType: '',
            price: 200,
            currency: 'RUB',
            quantity: 20,
          },
        ],
        createdAt: '',
        updatedAt: '',
      };

      const result = mapProductStoreToUi(storeProduct);

      expect(result.hasMultipleOffers).toBe(true);
      expect(result.offers).toHaveLength(2);
      expect(result.defaultOffer).toEqual(result.offers[0]);
    });

    it('should set isInStock to true when at least one offer is available', () => {
      const storeProduct: IProductStoreDto = {
        uuid: 'product-789',
        name: 'Test Product',
        sku: 'ART-789',
        slug: 'test-product',
        offers: [
          {
            uuid: 'offer-1',
            externalId: '',
            name: '',
            unitName: 'шт.',
            unitAbbr: 'шт.',
            article: '',
            priceType: '',
            price: 100,
            currency: 'RUB',
            quantity: 0,
          },
          {
            uuid: 'offer-2',
            externalId: '',
            name: '',
            unitName: 'шт.',
            unitAbbr: 'шт.',
            article: '',
            priceType: '',
            price: 200,
            currency: 'RUB',
            quantity: 10,
          },
        ],
        createdAt: '',
        updatedAt: '',
      };

      const result = mapProductStoreToUi(storeProduct);

      expect(result.isInStock).toBe(true);
      expect(result.availabilityColor).toBe('#2AC84D');
    });

    it('should set isInStock to false when all offers are unavailable', () => {
      const storeProduct: IProductStoreDto = {
        uuid: 'product-999',
        name: 'Test Product',
        sku: 'ART-999',
        slug: 'test-product',
        offers: [
          {
            uuid: 'offer-1',
            externalId: '',
            name: '',
            unitName: 'шт.',
            unitAbbr: 'шт.',
            article: '',
            priceType: '',
            price: 100,
            currency: 'RUB',
            quantity: 0,
          },
          {
            uuid: 'offer-2',
            externalId: '',
            name: '',
            unitName: 'шт.',
            unitAbbr: 'шт.',
            article: '',
            priceType: '',
            price: 200,
            currency: 'RUB',
            quantity: 0,
          },
        ],
        createdAt: '',
        updatedAt: '',
      };

      const result = mapProductStoreToUi(storeProduct);

      expect(result.isInStock).toBe(false);
      expect(result.availability).toBe('Под заказ');
      expect(result.availabilityColor).toBe('#00B0FF');
    });

    it('should handle product with no offers', () => {
      const storeProduct: IProductStoreDto = {
        uuid: 'product-111',
        name: 'Test Product',
        sku: 'ART-111',
        slug: 'test-product',
        offers: [],
        createdAt: '',
        updatedAt: '',
      };

      const result = mapProductStoreToUi(storeProduct);

      expect(result.offers).toEqual([]);
      expect(result.defaultOffer).toBeUndefined();
      expect(result.hasMultipleOffers).toBe(false);
      expect(result.isInStock).toBe(false);
      expect(result.availability).toBe('Под заказ');
      expect(result.availabilityColor).toBe('#00B0FF');
    });

    it('should handle missing description', () => {
      const storeProduct: IProductStoreDto = {
        uuid: 'product-222',
        name: 'Test Product',
        sku: 'ART-222',
        slug: 'test-product',
        offers: [],
        createdAt: '',
        updatedAt: '',
      };

      const result = mapProductStoreToUi(storeProduct);

      expect(result.description).toBeUndefined();
    });

    it('should handle missing image', () => {
      const storeProduct: IProductStoreDto = {
        uuid: 'product-333',
        name: 'Test Product',
        sku: 'ART-333',
        slug: 'test-product',
        offers: [],
        createdAt: '',
        updatedAt: '',
      };

      const result = mapProductStoreToUi(storeProduct);

      expect(result.image).toBeUndefined();
    });
  });
});
