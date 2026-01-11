import GetCategoriesService from './getCategoriesService';
import GetCategoryByUuidService from './getCategoryByUuidService';
import GetCategoryBySlugService from './getCategoryBySlugService';

export const createGetCategoriesService = () => new GetCategoriesService();
export const createGetCategoryByUuidService = () => new GetCategoryByUuidService();
export const createGetCategoryBySlugService = () => new GetCategoryBySlugService();
