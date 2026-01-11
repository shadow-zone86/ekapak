import { BaseApiService } from '@/shared/api/BaseApiService';
import type { ProductsResponse } from '../model/types';

export interface GetProductsRequest {
  page?: number;
  per_page?: number;
  category?: string;
}

export default class GetProductsService extends BaseApiService<ProductsResponse> {
  protected readonly serviceName = 'GetProductsService';
  protected readonly baseUrl = '/api/products';

  /**
   * Получить список товаров
   */
  async getProducts(request: GetProductsRequest): Promise<ProductsResponse> {
    return this.getWithQuery<ProductsResponse>(request as { [key: string]: string | number | boolean | undefined | null });
  }
}
