import { BaseApiService } from '@/shared/api/BaseApiService';
import type { Product } from '../model/types';

export default class GetProductBySlugService extends BaseApiService<Product> {
  protected readonly serviceName = 'GetProductBySlugService';
  protected readonly baseUrl = '/api/products/slug';

  /**
   * Получить товар по slug
   */
  async getProductBySlug(slug: string): Promise<Product> {
    return this.httpGet<Product>(slug);
  }
}
