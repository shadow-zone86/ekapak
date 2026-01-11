import { BaseApiService } from '@/shared/api/BaseApiService';
import type { Category } from '../model/types';

export default class GetCategoryBySlugService extends BaseApiService<Category> {
  protected readonly serviceName = 'GetCategoryBySlugService';
  protected readonly baseUrl = '/api/categories/slug';

  /**
   * Получить категорию по slug
   */
  async getCategoryBySlug(slug: string): Promise<Category> {
    return this.httpGet<Category>(slug);
  }
}
