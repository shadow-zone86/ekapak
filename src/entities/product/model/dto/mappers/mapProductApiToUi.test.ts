import { mapProductApiToUi } from './mapProductApiToUi';
import type { IProductApiDto } from '../types';

describe('mapProductApiToUi', () => {
  it('should map product API DTO to UI DTO (composition of API→Store→UI)', () => {
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
      },
    };

    const result = mapProductApiToUi(apiProduct);

    // Проверяем базовые поля
    expect(result.uuid).toBe('product-123');
    expect(result.name).toBe('Test Product');
    expect(result.description).toBe('Test Description');
    expect(result.sku).toBe('ART-123');
    expect(result.slug).toBe('test-product');
    expect(result.image).toBe('https://example.com/card.jpg');

    // Проверяем offers
    expect(result.offers).toHaveLength(1);
    expect(result.defaultOffer).toBeDefined();
    expect(result.defaultOffer?.uuid).toBe('offer-1');
    expect(result.defaultOffer?.price).toBe(100.5);
    expect(result.defaultOffer?.currency).toBe('RUB');
    expect(result.defaultOffer?.formattedPrice).toBe('100.50 ₽');
    expect(result.defaultOffer?.unit).toBe('шт.');
    expect(result.defaultOffer?.quantity).toBe(50);
    expect(result.defaultOffer?.isAvailable).toBe(true);

    // Проверяем флаги
    expect(result.hasMultipleOffers).toBe(false);
    expect(result.isInStock).toBe(true);
  });

  it('should handle product with multiple offers', () => {
    const apiProduct: IProductApiDto = {
      uuid: 'product-456',
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

    const result = mapProductApiToUi(apiProduct);

    expect(result.offers).toHaveLength(2);
    expect(result.hasMultipleOffers).toBe(true);
    expect(result.defaultOffer).toEqual(result.offers[0]);
  });

  it('should handle product with no images', () => {
    const apiProduct: IProductApiDto = {
      uuid: 'product-789',
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
      ],
    };

    const result = mapProductApiToUi(apiProduct);

    expect(result.image).toBeUndefined();
  });

  it('should use original_url when card_url is not available', () => {
    const apiProduct: IProductApiDto = {
      uuid: 'product-999',
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

    const result = mapProductApiToUi(apiProduct);

    expect(result.image).toBe('https://example.com/original.jpg');
  });

  it('should handle null description', () => {
    const apiProduct: IProductApiDto = {
      uuid: 'product-111',
      name: 'Test Product',
      description: null,
      slug: 'test-product',
      offers: [],
    };

    const result = mapProductApiToUi(apiProduct);

    expect(result.description).toBeUndefined();
  });

  it('should handle missing article', () => {
    const apiProduct: IProductApiDto = {
      uuid: 'product-222',
      name: 'Test Product',
      slug: 'test-product',
      offers: [],
    };

    const result = mapProductApiToUi(apiProduct);

    expect(result.sku).toBe('');
  });

  it('should set isInStock to false when all offers are unavailable', () => {
    const apiProduct: IProductApiDto = {
      uuid: 'product-333',
      name: 'Test Product',
      slug: 'test-product',
      offers: [
        {
          uuid: 'offer-1',
          price: '100.00',
          currency: 'RUB',
          unit: 'шт.',
          quantity: 0,
        },
        {
          uuid: 'offer-2',
          price: '200.00',
          currency: 'RUB',
          unit: 'шт.',
          quantity: 0,
        },
      ],
    };

    const result = mapProductApiToUi(apiProduct);

    expect(result.isInStock).toBe(false);
  });

  it('should set isInStock to true when at least one offer is available', () => {
    const apiProduct: IProductApiDto = {
      uuid: 'product-444',
      name: 'Test Product',
      slug: 'test-product',
      offers: [
        {
          uuid: 'offer-1',
          price: '100.00',
          currency: 'RUB',
          unit: 'шт.',
          quantity: 0,
        },
        {
          uuid: 'offer-2',
          price: '200.00',
          currency: 'RUB',
          unit: 'шт.',
          quantity: 10,
        },
      ],
    };

    const result = mapProductApiToUi(apiProduct);

    expect(result.isInStock).toBe(true);
  });

  it('should handle product with no offers', () => {
    const apiProduct: IProductApiDto = {
      uuid: 'product-555',
      name: 'Test Product',
      slug: 'test-product',
      offers: [],
    };

    const result = mapProductApiToUi(apiProduct);

    expect(result.offers).toEqual([]);
    expect(result.defaultOffer).toBeUndefined();
    expect(result.hasMultipleOffers).toBe(false);
    expect(result.isInStock).toBe(false);
  });

  it('should format price correctly for different currencies', () => {
    const apiProduct: IProductApiDto = {
      uuid: 'product-666',
      name: 'Test Product',
      slug: 'test-product',
      offers: [
        {
          uuid: 'offer-1',
          price: '99.90',
          currency: 'RUB',
          unit: 'шт.',
          quantity: 10,
        },
        {
          uuid: 'offer-2',
          price: '25.75',
          currency: 'USD',
          unit: 'кг',
          quantity: 5,
        },
      ],
    };

    const result = mapProductApiToUi(apiProduct);

    expect(result.offers[0].formattedPrice).toBe('99.90 ₽');
    expect(result.offers[1].formattedPrice).toBe('25.75 USD');
  });
});
