import { mapCategoryApiToUi } from './mapCategoryApiToUi';
import type { Category } from '../../types';

describe('mapCategoryApiToUi', () => {
  it('should map category API to UI DTO (composition of API→Store→UI)', () => {
    const apiCategory: Category = {
      uuid: 'category-123',
      name: 'Test Category',
      slug: 'test-category',
      description: 'Test Description',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
    };

    const result = mapCategoryApiToUi(apiCategory);

    // Проверяем базовые поля
    expect(result.uuid).toBe('category-123');
    expect(result.name).toBe('Test Category');
    expect(result.slug).toBe('test-category');
    expect(result.description).toBe('Test Description');
    // UI DTO не содержит created_at и updated_at
    expect(result).not.toHaveProperty('created_at');
    expect(result).not.toHaveProperty('updated_at');
  });

  it('should handle null description', () => {
    const apiCategory: Category = {
      uuid: 'category-456',
      name: 'Test Category',
      slug: 'test-category',
      description: null,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
    };

    const result = mapCategoryApiToUi(apiCategory);

    expect(result.description).toBeUndefined();
  });

  it('should handle undefined description', () => {
    const apiCategory: Category = {
      uuid: 'category-789',
      name: 'Test Category',
      slug: 'test-category',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
    };

    const result = mapCategoryApiToUi(apiCategory);

    expect(result.description).toBeUndefined();
  });

  it('should recursively map nested children', () => {
    const apiCategory: Category = {
      uuid: 'parent-123',
      name: 'Parent Category',
      slug: 'parent-category',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
      children: [
        {
          uuid: 'child-1',
          name: 'Child Category 1',
          slug: 'child-category-1',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-02T00:00:00Z',
        },
        {
          uuid: 'child-2',
          name: 'Child Category 2',
          slug: 'child-category-2',
          description: 'Child Description',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-02T00:00:00Z',
        },
      ],
    };

    const result = mapCategoryApiToUi(apiCategory);

    expect(result.children).toBeDefined();
    expect(result.children).toHaveLength(2);
    expect(result.children![0]).toEqual({
      uuid: 'child-1',
      name: 'Child Category 1',
      slug: 'child-category-1',
      description: undefined,
      children: undefined,
    });
    expect(result.children![1]).toEqual({
      uuid: 'child-2',
      name: 'Child Category 2',
      slug: 'child-category-2',
      description: 'Child Description',
      children: undefined,
    });
  });

  it('should handle empty children array', () => {
    const apiCategory: Category = {
      uuid: 'category-111',
      name: 'Test Category',
      slug: 'test-category',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
      children: [],
    };

    const result = mapCategoryApiToUi(apiCategory);

    expect(result.children).toEqual([]);
  });

  it('should handle deeply nested children', () => {
    const apiCategory: Category = {
      uuid: 'root-123',
      name: 'Root Category',
      slug: 'root-category',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
      children: [
        {
          uuid: 'level1-1',
          name: 'Level 1 Category',
          slug: 'level1-category',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-02T00:00:00Z',
          children: [
            {
              uuid: 'level2-1',
              name: 'Level 2 Category',
              slug: 'level2-category',
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-02T00:00:00Z',
            },
          ],
        },
      ],
    };

    const result = mapCategoryApiToUi(apiCategory);

    expect(result.children).toBeDefined();
    expect(result.children).toHaveLength(1);
    expect(result.children![0].children).toBeDefined();
    expect(result.children![0].children).toHaveLength(1);
    expect(result.children![0].children![0].uuid).toBe('level2-1');
  });

  it('should not include parents in UI DTO', () => {
    const apiCategory: Category = {
      uuid: 'child-123',
      name: 'Child Category',
      slug: 'child-category',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
      parents: [
        {
          uuid: 'parent-1',
          name: 'Parent Category',
          slug: 'parent-category',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-02T00:00:00Z',
        },
      ],
    };

    const result = mapCategoryApiToUi(apiCategory);

    // UI DTO не должен содержать parents
    expect(result).not.toHaveProperty('parents');
    expect(result.uuid).toBe('child-123');
    expect(result.name).toBe('Child Category');
  });

  it('should not include created_at and updated_at in UI DTO', () => {
    const apiCategory: Category = {
      uuid: 'category-999',
      name: 'Test Category',
      slug: 'test-category',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
    };

    const result = mapCategoryApiToUi(apiCategory);

    expect(result).not.toHaveProperty('created_at');
    expect(result).not.toHaveProperty('updated_at');
    expect(result).not.toHaveProperty('createdAt');
    expect(result).not.toHaveProperty('updatedAt');
  });
});
