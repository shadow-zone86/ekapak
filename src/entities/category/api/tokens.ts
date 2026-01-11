import { createToken } from '@/shared/lib/di/container';

export const CATEGORY_TOKENS = {
  GetCategoriesService: createToken('Category.GetCategoriesService'),
  GetCategoryByUuidService: createToken('Category.GetCategoryByUuidService'),
  GetCategoryBySlugService: createToken('Category.GetCategoryBySlugService'),
};
