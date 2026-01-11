import { BaseApiService } from '@/shared/api/BaseApiService';
import type { CategoriesResponse, Category } from '../model/types';

export default class GetCategoriesService extends BaseApiService<CategoriesResponse> {
  protected readonly serviceName = 'GetCategoriesService';
  protected readonly baseUrl = '/api/categories';

  /**
   * Получить все категории
   */
  async getCategories(): Promise<CategoriesResponse> {
    type ApiResponseWithData = { data: Category[] };
    type ApiResponseWithItems = { items: Category[] };
    type ApiResponse = Category[] | ApiResponseWithData | ApiResponseWithItems;

    const response = await this.httpGet<ApiResponse>('');

    // Убеждаемся, что возвращаем массив
    if (Array.isArray(response)) {
      return response;
    }

    // Если API возвращает объект с массивом внутри
    if (response && typeof response === 'object' && 'data' in response) {
      const responseWithData = response as ApiResponseWithData;
      if (Array.isArray(responseWithData.data)) {
        return responseWithData.data;
      }
    }

    // Если API возвращает объект с массивом items
    if (response && typeof response === 'object' && 'items' in response) {
      const responseWithItems = response as ApiResponseWithItems;
      if (Array.isArray(responseWithItems.items)) {
        return responseWithItems.items;
      }
    }

    // Если ничего не найдено, возвращаем пустой массив
    console.warn('API returned non-array data for categories:', response);
    return [];
  }
}
