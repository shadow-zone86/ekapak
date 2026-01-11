/**
 * Базовый класс для всех API сервисов
 * Предоставляет методы для HTTP запросов с типизацией
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ekapak.ru';

export abstract class BaseApiService<T> {
  protected abstract readonly serviceName: string;
  protected abstract readonly baseUrl: string;

  /**
   * Формирует полный URL для запроса
   */
  protected buildUrl(endpoint: string = ''): string {
    const base = `${API_BASE_URL}${this.baseUrl}`;
    return endpoint ? `${base}/${endpoint}` : base;
  }

  /**
   * GET запрос
   */
  protected async httpGet<R = T>(url: string = ''): Promise<R> {
    const fullUrl = this.buildUrl(url);

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!response.ok) {
      throw new Error(
        `[${this.serviceName}] GET ${fullUrl}: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  /**
   * POST запрос
   */
  protected async httpPost<R = T>(
    data?: unknown,
    url: string = '',
    config?: RequestInit
  ): Promise<R> {
    const fullUrl = this.buildUrl(url);

    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
      ...config,
    });

    if (!response.ok) {
      throw new Error(
        `[${this.serviceName}] POST ${fullUrl}: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  /**
   * PUT запрос
   */
  protected async httpPut<R = T>(
    data?: unknown,
    url: string = ''
  ): Promise<R> {
    const fullUrl = this.buildUrl(url);

    const response = await fetch(fullUrl, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(
        `[${this.serviceName}] PUT ${fullUrl}: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  /**
   * DELETE запрос
   */
  protected async httpDelete<R = void>(url: string = ''): Promise<R> {
    const fullUrl = this.buildUrl(url);

    const response = await fetch(fullUrl, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(
        `[${this.serviceName}] DELETE ${fullUrl}: ${response.status} ${response.statusText}`
      );
    }

    // DELETE может не возвращать данные
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return undefined as R;
    }

    return response.json();
  }

  /**
   * PATCH запрос
   */
  protected async httpPatch<R = T>(
    data?: unknown,
    url: string = ''
  ): Promise<R> {
    const fullUrl = this.buildUrl(url);

    const response = await fetch(fullUrl, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(
        `[${this.serviceName}] PATCH ${fullUrl}: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  /**
   * GET запрос с query параметрами
   */
  protected async getWithQuery<R = T>(params: { [key: string]: string | number | boolean | undefined | null }): Promise<R> {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });

    const queryString = queryParams.toString();
    const url = queryString ? `?${queryString}` : '';

    return this.httpGet<R>(url);
  }
}
