import { BaseApiService } from '@/shared/api/BaseApiService';
import type { Product } from '../model/types';

export default class GetProductByUuidService extends BaseApiService<Product> {
  protected readonly serviceName = 'GetProductByUuidService';
  protected readonly baseUrl = '/api/products';

  /**
   * Получить товар по UUID
   */
  async getProductByUuid(uuid: string): Promise<Product> {
    return this.httpGet<Product>(uuid);
  }
}
