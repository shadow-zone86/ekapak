import GetProductByUuidService from './getProductByUuidService';
import type { Product } from '../model/types';

// Мокаем global fetch
global.fetch = jest.fn();

describe('GetProductByUuidService', () => {
  const originalEnv = process.env.NEXT_PUBLIC_API_URL;
  let service: GetProductByUuidService;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_API_URL = 'https://api.ekapak.ru';
    service = new GetProductByUuidService();
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_API_URL = originalEnv;
  });

  describe('getProductByUuid', () => {
    const mockProduct: Product = {
      uuid: 'product-123',
      name: 'Test Product',
      slug: 'test-product',
      offers: [
        {
          uuid: 'offer-1',
          price: '100.00',
          currency: 'RUB',
          unit: 'шт.',
          quantity: 100,
        },
      ],
    };

    it('should fetch product by UUID', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockProduct,
      });

      const uuid = 'product-123';
      const result = await service.getProductByUuid(uuid);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        'https://api.ekapak.ru/api/products/product-123',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result).toEqual(mockProduct);
    });

    it('should handle product with all fields', async () => {
      const fullProduct: Product = {
        uuid: 'product-456',
        name: 'Full Product',
        description: 'Product description',
        slug: 'full-product',
        category_uuid: 'category-123',
        offers_min_price: '50.00',
        offers: [
          {
            uuid: 'offer-2',
            price: '50.00',
            currency: 'RUB',
            unit: 'шт.',
            quantity: 50,
          },
        ],
        seo_description: 'SEO description',
        'Мин. покупка, шт.': '10',
        Наличие: 'В наличии',
        article: 'ART-123',
        images: [
          {
            original_url: 'https://example.com/image.jpg',
            card_url: 'https://example.com/image-card.jpg',
          },
        ],
        properties: {
          'Ширина, мм': '100',
          'Длина, мм': '200',
        },
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => fullProduct,
      });

      const result = await service.getProductByUuid('product-456');

      expect(result).toEqual(fullProduct);
      expect(result.uuid).toBe('product-456');
      expect(result.offers).toHaveLength(1);
      expect(result.images).toHaveLength(1);
    });

    it('should throw error when response is not ok', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({}),
      });

      await expect(service.getProductByUuid('non-existent-uuid')).rejects.toThrow(
        '[GetProductByUuidService] GET https://api.ekapak.ru/api/products/non-existent-uuid: 404 Not Found'
      );
    });

    it('should handle empty UUID', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockProduct,
      });

      await service.getProductByUuid('');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.ekapak.ru/api/products',
        expect.any(Object)
      );
    });

    it('should handle UUID with dashes', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockProduct,
      });

      const uuidWithDashes = '550e8400-e29b-41d4-a716-446655440000';
      await service.getProductByUuid(uuidWithDashes);

      expect(fetch).toHaveBeenCalledWith(
        `https://api.ekapak.ru/api/products/${uuidWithDashes}`,
        expect.any(Object)
      );
    });
  });
});
