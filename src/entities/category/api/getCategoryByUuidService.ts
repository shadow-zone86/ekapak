import { BaseApiService } from '@/shared/api/BaseApiService';
import type { Category } from '../model/types';

export default class GetCategoryByUuidService extends BaseApiService<Category> {
  protected readonly serviceName = 'GetCategoryByUuidService';
  protected readonly baseUrl = '/api/categories';

  /**
   * Получить категорию по UUID
   */
  async getCategoryByUuid(uuid: string): Promise<Category> {
    return this.httpGet<Category>(uuid);
  }
}
