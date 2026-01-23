import { findCategoryName } from './findCategoryName';
import type { ICategoryUiDto } from '@/entities/category/model/dto/types';

describe('findCategoryName', () => {
  const categories: ICategoryUiDto[] = [
    {
      uuid: 'cat-1',
      name: 'Категория 1',
      slug: 'category-1',
    },
    {
      uuid: 'cat-2',
      name: 'Категория 2',
      slug: 'category-2',
    },
    {
      uuid: 'cat-3',
      name: 'Категория 3',
      slug: 'category-3',
      children: [
        {
          uuid: 'cat-3-1',
          name: 'Подкатегория 3.1',
          slug: 'subcategory-3-1',
        },
        {
          uuid: 'cat-3-2',
          name: 'Подкатегория 3.2',
          slug: 'subcategory-3-2',
        },
      ],
    },
  ];

  it('should find category name by uuid in root level', () => {
    const result = findCategoryName(categories, 'cat-1');
    expect(result).toBe('Категория 1');
  });

  it('should find category name by uuid in nested children', () => {
    const result = findCategoryName(categories, 'cat-3-1');
    expect(result).toBe('Подкатегория 3.1');
  });

  it('should find category name in deeply nested structure', () => {
    const deepCategories: ICategoryUiDto[] = [
      {
        uuid: 'cat-1',
        name: 'Level 1',
        slug: 'level-1',
        children: [
          {
            uuid: 'cat-2',
            name: 'Level 2',
            slug: 'level-2',
            children: [
              {
                uuid: 'cat-3',
                name: 'Level 3',
                slug: 'level-3',
              },
            ],
          },
        ],
      },
    ];

    const result = findCategoryName(deepCategories, 'cat-3');
    expect(result).toBe('Level 3');
  });

  it('should return null when category not found', () => {
    const result = findCategoryName(categories, 'non-existent-uuid');
    expect(result).toBeNull();
  });

  it('should return null for empty categories array', () => {
    const result = findCategoryName([], 'cat-1');
    expect(result).toBeNull();
  });

  it('should handle categories without children', () => {
    const simpleCategories: ICategoryUiDto[] = [
      {
        uuid: 'cat-1',
        name: 'Simple Category',
        slug: 'simple-category',
      },
    ];

    const result = findCategoryName(simpleCategories, 'cat-1');
    expect(result).toBe('Simple Category');
  });

  it('should find category in multiple nested levels', () => {
    const multiLevelCategories: ICategoryUiDto[] = [
      {
        uuid: 'cat-1',
        name: 'Root',
        slug: 'root',
        children: [
          {
            uuid: 'cat-2',
            name: 'Child 1',
            slug: 'child-1',
            children: [
              {
                uuid: 'cat-3',
                name: 'Grandchild 1',
                slug: 'grandchild-1',
                children: [
                  {
                    uuid: 'cat-4',
                    name: 'Great Grandchild',
                    slug: 'great-grandchild',
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    const result = findCategoryName(multiLevelCategories, 'cat-4');
    expect(result).toBe('Great Grandchild');
  });

  it('should handle categories with optional description field', () => {
    const categoriesWithDescription: ICategoryUiDto[] = [
      {
        uuid: 'cat-1',
        name: 'Category with Description',
        slug: 'category-with-description',
        description: 'Some description',
      },
    ];

    const result = findCategoryName(categoriesWithDescription, 'cat-1');
    expect(result).toBe('Category with Description');
  });
});
