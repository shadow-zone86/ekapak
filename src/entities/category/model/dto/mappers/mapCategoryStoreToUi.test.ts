import { mapCategoryStoreToUi } from './mapCategoryStoreToUi';
import type { ICategoryStoreDto } from '../types';

describe('mapCategoryStoreToUi', () => {
  it('should map category store DTO to UI DTO with all fields', () => {
    const storeCategory: ICategoryStoreDto = {
      uuid: 'category-123',
      name: 'Test Category',
      slug: 'test-category',
      description: 'Test Description',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z',
    };

    const result = mapCategoryStoreToUi(storeCategory);

    expect(result).toEqual({
      uuid: 'category-123',
      name: 'Test Category',
      slug: 'test-category',
      description: 'Test Description',
      children: undefined,
    });
  });

  it('should handle missing description', () => {
    const storeCategory: ICategoryStoreDto = {
      uuid: 'category-456',
      name: 'Test Category',
      slug: 'test-category',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z',
    };

    const result = mapCategoryStoreToUi(storeCategory);

    expect(result.description).toBeUndefined();
  });

  it('should recursively map nested children', () => {
    const storeCategory: ICategoryStoreDto = {
      uuid: 'parent-123',
      name: 'Parent Category',
      slug: 'parent-category',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z',
      children: [
        {
          uuid: 'child-1',
          name: 'Child Category 1',
          slug: 'child-category-1',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
        },
        {
          uuid: 'child-2',
          name: 'Child Category 2',
          slug: 'child-category-2',
          description: 'Child Description',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
        },
      ],
    };

    const result = mapCategoryStoreToUi(storeCategory);

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
    const storeCategory: ICategoryStoreDto = {
      uuid: 'category-111',
      name: 'Test Category',
      slug: 'test-category',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z',
      children: [],
    };

    const result = mapCategoryStoreToUi(storeCategory);

    expect(result.children).toEqual([]);
  });

  it('should handle deeply nested children', () => {
    const storeCategory: ICategoryStoreDto = {
      uuid: 'root-123',
      name: 'Root Category',
      slug: 'root-category',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z',
      children: [
        {
          uuid: 'level1-1',
          name: 'Level 1 Category',
          slug: 'level1-category',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
          children: [
            {
              uuid: 'level2-1',
              name: 'Level 2 Category',
              slug: 'level2-category',
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-02T00:00:00Z',
            },
          ],
        },
      ],
    };

    const result = mapCategoryStoreToUi(storeCategory);

    expect(result.children).toBeDefined();
    expect(result.children).toHaveLength(1);
    expect(result.children![0].children).toBeDefined();
    expect(result.children![0].children).toHaveLength(1);
    expect(result.children![0].children![0].uuid).toBe('level2-1');
    expect(result.children![0].children![0].children).toBeUndefined();
  });

  it('should not include parents in UI DTO', () => {
    const storeCategory: ICategoryStoreDto = {
      uuid: 'child-123',
      name: 'Child Category',
      slug: 'child-category',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z',
      parents: [
        {
          uuid: 'parent-1',
          name: 'Parent Category',
          slug: 'parent-category',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
        },
      ],
    };

    const result = mapCategoryStoreToUi(storeCategory);

    // UI DTO не должен содержать parents
    expect(result).not.toHaveProperty('parents');
    expect(result.uuid).toBe('child-123');
    expect(result.name).toBe('Child Category');
  });
});
