import { mapCategoryApiToStore } from './mapCategoryApiToStore';
import type { Category } from '../../types';

describe('mapCategoryApiToStore', () => {
  it('should map category API to store DTO with all fields', () => {
    const apiCategory: Category = {
      uuid: 'category-123',
      name: 'Test Category',
      slug: 'test-category',
      description: 'Test Description',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
    };

    const result = mapCategoryApiToStore(apiCategory);

    expect(result).toEqual({
      uuid: 'category-123',
      name: 'Test Category',
      slug: 'test-category',
      description: 'Test Description',
      parents: undefined,
      children: undefined,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z',
    });
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

    const result = mapCategoryApiToStore(apiCategory);

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

    const result = mapCategoryApiToStore(apiCategory);

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

    const result = mapCategoryApiToStore(apiCategory);

    expect(result.children).toBeDefined();
    expect(result.children).toHaveLength(2);
    expect(result.children![0]).toEqual({
      uuid: 'child-1',
      name: 'Child Category 1',
      slug: 'child-category-1',
      description: undefined,
      parents: undefined,
      children: undefined,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z',
    });
    expect(result.children![1]).toEqual({
      uuid: 'child-2',
      name: 'Child Category 2',
      slug: 'child-category-2',
      description: 'Child Description',
      parents: undefined,
      children: undefined,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z',
    });
  });

  it('should recursively map nested parents', () => {
    const apiCategory: Category = {
      uuid: 'child-123',
      name: 'Child Category',
      slug: 'child-category',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
      parents: [
        {
          uuid: 'parent-1',
          name: 'Parent Category 1',
          slug: 'parent-category-1',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-02T00:00:00Z',
        },
        {
          uuid: 'parent-2',
          name: 'Parent Category 2',
          slug: 'parent-category-2',
          description: 'Parent Description',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-02T00:00:00Z',
        },
      ],
    };

    const result = mapCategoryApiToStore(apiCategory);

    expect(result.parents).toBeDefined();
    expect(result.parents).toHaveLength(2);
    expect(result.parents![0]).toEqual({
      uuid: 'parent-1',
      name: 'Parent Category 1',
      slug: 'parent-category-1',
      description: undefined,
      parents: undefined,
      children: undefined,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z',
    });
    expect(result.parents![1]).toEqual({
      uuid: 'parent-2',
      name: 'Parent Category 2',
      slug: 'parent-category-2',
      description: 'Parent Description',
      parents: undefined,
      children: undefined,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z',
    });
  });

  it('should handle category with both parents and children', () => {
    const apiCategory: Category = {
      uuid: 'category-999',
      name: 'Middle Category',
      slug: 'middle-category',
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
      children: [
        {
          uuid: 'child-1',
          name: 'Child Category',
          slug: 'child-category',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-02T00:00:00Z',
        },
      ],
    };

    const result = mapCategoryApiToStore(apiCategory);

    expect(result.parents).toBeDefined();
    expect(result.parents).toHaveLength(1);
    expect(result.children).toBeDefined();
    expect(result.children).toHaveLength(1);
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

    const result = mapCategoryApiToStore(apiCategory);

    expect(result.children).toEqual([]);
  });

  it('should handle empty parents array', () => {
    const apiCategory: Category = {
      uuid: 'category-222',
      name: 'Test Category',
      slug: 'test-category',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
      parents: [],
    };

    const result = mapCategoryApiToStore(apiCategory);

    expect(result.parents).toEqual([]);
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

    const result = mapCategoryApiToStore(apiCategory);

    expect(result.children).toBeDefined();
    expect(result.children).toHaveLength(1);
    expect(result.children![0].children).toBeDefined();
    expect(result.children![0].children).toHaveLength(1);
    expect(result.children![0].children![0].uuid).toBe('level2-1');
  });
});
