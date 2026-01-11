'use client';

import { useCategories } from '@/entities/category/api/useCategories';
import { CategoryList } from '@/entities/category/ui/category-list';
import { useCategoryFilter } from '../lib/useCategoryFilter';

export function CategoryFilter() {
  const { data: categories = [] } = useCategories();
  const { selectedCategory, selectCategory } = useCategoryFilter();

  return (
    <CategoryList
      categories={categories}
      selectedCategory={selectedCategory}
      onCategorySelect={selectCategory}
    />
  );
}
