import GetCategoryBySlugService from './getCategoryBySlugService';
import type { Category } from '../model/types';

// Мокаем global fetch
global.fetch = jest.fn();

describe('GetCategoryBySlugService', () => {
  const originalEnv = process.env.NEXT_PUBLIC_API_URL;
  let service: GetCategoryBySlugService;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_API_URL = 'https://api.ekapak.ru';
    service = new GetCategoryBySlugService();
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_API_URL = originalEnv;
  });

  describe('getCategoryBySlug', () => {
    const mockCategory: Category = {
      uuid: 'category-123',
      name: 'Test Category',
      slug: 'test-category',
      description: 'Test Description',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
    };

    it('should fetch category by slug', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCategory,
      });

      const slug = 'test-category';
      const result = await service.getCategoryBySlug(slug);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        'https://api.ekapak.ru/api/categories/slug/test-category',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result).toEqual(mockCategory);
    });

    it('should handle category with all fields', async () => {
      const fullCategory: Category = {
        uuid: 'category-456',
        name: 'Full Category',
        slug: 'full-category',
        description: 'Full description',
        parents: [
          {
            uuid: 'parent-1',
            name: 'Parent Category',
            slug: 'parent-category',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-02T00:00:00Z',
          },
        ],
        children: [
          {
            uuid: 'child-1',
            name: 'Child Category',
            slug: 'child-category',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-02T00:00:00Z',
          },
        ],
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => fullCategory,
      });

      const result = await service.getCategoryBySlug('full-category');

      expect(result).toEqual(fullCategory);
      expect(result.uuid).toBe('category-456');
      expect(result.parents).toHaveLength(1);
      expect(result.children).toHaveLength(1);
    });

    it('should handle category with null description', async () => {
      const categoryWithNullDescription: Category = {
        uuid: 'category-789',
        name: 'Test Category',
        slug: 'test-category',
        description: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => categoryWithNullDescription,
      });

      const result = await service.getCategoryBySlug('test-category');

      expect(result.description).toBeNull();
    });

    it('should throw error when response is not ok', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({}),
      });

      await expect(service.getCategoryBySlug('non-existent')).rejects.toThrow(
        '[GetCategoryBySlugService] GET https://api.ekapak.ru/api/categories/slug/non-existent: 404 Not Found'
      );
    });

    it('should handle empty slug', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCategory,
      });

      await service.getCategoryBySlug('');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.ekapak.ru/api/categories/slug',
        expect.any(Object)
      );
    });

    it('should handle slug with special characters', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCategory,
      });

      const slugWithSpecialChars = 'test-category-123';
      await service.getCategoryBySlug(slugWithSpecialChars);

      expect(fetch).toHaveBeenCalledWith(
        'https://api.ekapak.ru/api/categories/slug/test-category-123',
        expect.any(Object)
      );
    });
  });
});
