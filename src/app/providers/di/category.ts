import { container } from '@/shared/lib/di/container';
import { CATEGORY_TOKENS } from '@/entities/category/api/tokens';
import {
  createGetCategoriesService,
  createGetCategoryByUuidService,
  createGetCategoryBySlugService,
} from '@/entities/category/api/factories';

export function registerCategoryDependencies(): void {
  container.registerFactory(CATEGORY_TOKENS.GetCategoriesService, createGetCategoriesService);
  container.registerFactory(CATEGORY_TOKENS.GetCategoryByUuidService, createGetCategoryByUuidService);
  container.registerFactory(CATEGORY_TOKENS.GetCategoryBySlugService, createGetCategoryBySlugService);
}
