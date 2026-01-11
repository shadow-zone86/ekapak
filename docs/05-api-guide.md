# Глава 7: Работа с API 🌐

> API клиент, типизация, обработка ошибок, нормализация ответов

---

## 📋 Содержание

1. [API клиент (Fetch)](#api-клиент-fetch)
2. [Создание API сервиса](#создание-api-сервиса)
3. [Типизация запросов и ответов](#типизация-запросов-и-ответов)
4. [Обработка ошибок](#обработка-ошибок)
5. [Нормализация ответов](#нормализация-ответов)
6. [React Query интеграция](#react-query-интеграция)
7. [SSR и Prefetching](#ssr-и-prefetching)
8. [Примеры использования](#примеры-использования)

---

## 🌐 API клиент (Fetch)

### Расположение

```
src/entities/<Domain>/api/<entity>Api.ts
```

### Конфигурация

```typescript
// entities/product/api/productApi.ts
const API_BASE_URL = 'https://api.ekapak.ru/api';

export const productApi = {
  async getProducts(
    page = 1,
    perPage = 20,
    categoryUuid?: string
  ): Promise<ProductsResponse> {
    let url = `${API_BASE_URL}/products?page=${page}&per_page=${perPage}`;

    if (categoryUuid) {
      url += `&category=${categoryUuid}`;
    }

    const response = await fetch(url, {
      next: { revalidate: 60 }, // Next.js revalidation
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    return response.json();
  }
};
```

### Revalidation (Next.js)

```typescript
// Автоматическая ревалидация через определенное время
fetch(url, {
  next: { revalidate: 60 }, // 60 секунд
});

// Или ISR с тегом
fetch(url, {
  next: { tags: ['products'] },
});
```

---

## 🏗️ Создание API сервиса

### Структура

```
entities/product/api/
├── productApi.ts          # Основной API сервис
├── useProducts.ts         # React Query хук
├── tokens.ts              # DI токены
└── factories.ts           # DI фабрики
```

### Шаг 1: Базовый API сервис

```typescript
// entities/product/api/productApi.ts
import { Product, ProductsResponse, Category, CategoriesResponse } from '../model/types';

const API_BASE_URL = 'https://api.ekapak.ru/api';

export const productApi = {
  /**
   * GET - Получение списка продуктов
   */
  async getProducts(
    page = 1,
    perPage = 20,
    categoryUuid?: string
  ): Promise<ProductsResponse> {
    let url = `${API_BASE_URL}/products?page=${page}&per_page=${perPage}`;

    if (categoryUuid) {
      url += `&category=${categoryUuid}`;
    }

    const response = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * GET - Получение списка категорий
   */
  async getCategories(): Promise<CategoriesResponse> {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }

    const data = await response.json();

    // Нормализация различных форматов ответа
    if (Array.isArray(data)) {
      return data;
    }
    if (data?.data && Array.isArray(data.data)) {
      return data.data;
    }
    if (data?.items && Array.isArray(data.items)) {
      return data.items;
    }

    console.warn('API returned non-array data for categories:', data);
    return [];
  },
};
```

### Шаг 2: React Query хук

```typescript
// entities/product/api/useProducts.ts
import { useQuery } from '@tanstack/react-query';
import { productApi } from './productApi';
import { ProductsResponse } from '../model/types';

export function useProducts(
  page: number,
  perPage: number,
  categoryUuid?: string
) {
  return useQuery<ProductsResponse, Error>({
    queryKey: ['products', page, perPage, categoryUuid],
    queryFn: () => productApi.getProducts(page, perPage, categoryUuid),
    staleTime: 60 * 1000, // 1 минута
  });
}
```

---

## 📝 Типизация запросов и ответов

### Структура типов

```typescript
// entities/product/model/types.ts

// ================ API DTOs ================
// Данные от API (точно как с сервера)

export interface Offer {
  uuid: string;
  external_id: string;
  name: string;
  price_value: number;
  price_currency: string;
  quantity: number;
  // ...
}

export interface Product {
  uuid: string;
  name: string;
  sku: string;
  image?: string | null;
  offers: Offer[];
  created_at: string;      // ISO строка от API
  updated_at: string;
}

export interface Category {
  uuid: string;
  name: string;
  slug: string;
  parents?: Category[];
  children?: Category[];
  created_at: string;
  updated_at: string;
}

// ================ RESPONSE DTOs ================
// Обёртка ответа от API

export interface ProductsResponse {
  data: Product[];
  meta?: {
    total?: number;
    page?: number;
    per_page?: number;
    last_page?: number;
  };
}

export type CategoriesResponse = Category[];
```

### Правила именования типов

| Тип | Суффикс | Пример |
|-----|---------|--------|
| Данные от API | Без суффикса | `Product`, `Category` |
| Ответ API | `Response` | `ProductsResponse` |
| Данные в Store | `StoreDto` | `ProductStoreDto` |
| Данные для UI | `UiDto` | `ProductUiDto` |

---

## ⚠️ Обработка ошибок

### Try-Catch в API функциях

```typescript
// entities/product/api/productApi.ts

async getProducts(
  page = 1,
  perPage = 20,
  categoryUuid?: string
): Promise<ProductsResponse> {
  try {
    let url = `${API_BASE_URL}/products?page=${page}&per_page=${perPage}`;

    if (categoryUuid) {
      url += `&category=${categoryUuid}`;
    }

    const response = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('[productApi] Error fetching products:', error);
    throw error; // Пробрасываем дальше для обработки в компоненте
  }
}
```

### Обработка в React Query

```typescript
// entities/product/api/useProducts.ts

export function useProducts(...) {
  return useQuery<ProductsResponse, Error>({
    queryKey: ['products', ...],
    queryFn: () => productApi.getProducts(...),
    onError: (error) => {
      console.error('Query error:', error);
      // Можно показать уведомление пользователю
    },
  });
}
```

### Обработка в компонентах

```typescript
// widgets/products-catalog/products-catalog.tsx

export function ProductsCatalog() {
  const { data, isLoading, error } = useProducts(page, perPage, categoryUuid);

  if (error) {
    return (
      <div className="error">
        Ошибка загрузки: {error.message}
      </div>
    );
  }

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return <ProductList products={data?.data || []} />;
}
```

---

## 📦 Нормализация ответов

### Зачем нужна нормализация?

API может возвращать данные в разных форматах:
- `{ data: [...] }`
- `{ items: [...] }`
- `[...]`
- `{ item: {...} }`
- `{...}`

Нормализация приводит все к единому формату.

### Функции нормализации

```typescript
// shared/lib/normalization/normalizeResponse.ts

/**
 * Нормализация списков
 */
export function normalizeListResponse<T>(response: any): T[] {
  if (response?.items) return response.items;        // { items: [...] }
  if (response?.data && Array.isArray(response.data)) {
    return response.data;                            // { data: [...] }
  }
  if (Array.isArray(response)) return response;      // [...]
  return [];
}

/**
 * Нормализация одиночных объектов
 */
export function normalizeSingleResponse<T>(response: any): T | null {
  if (response?.item) return response.item;          // { item: {...} }
  if (response?.data && typeof response.data === 'object') {
    return response.data;                            // { data: {...} }
  }
  if (response && typeof response === 'object') {
    return response;                                 // {...}
  }
  return null;
}
```

### Использование в API

```typescript
// entities/product/api/productApi.ts
import { normalizeListResponse } from '@/shared/lib/normalization/normalizeResponse';

async getCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE_URL}/categories`);
  const data = await response.json();

  // Нормализация различных форматов ответа
  return normalizeListResponse<Category>(data);
}
```

---

## 🔄 React Query интеграция

### Базовое использование

```typescript
// entities/product/api/useProducts.ts
import { useQuery } from '@tanstack/react-query';

export function useProducts(page: number, perPage: number, categoryUuid?: string) {
  return useQuery({
    queryKey: ['products', page, perPage, categoryUuid],
    queryFn: () => productApi.getProducts(page, perPage, categoryUuid),
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
```

### Настройка QueryClient

```typescript
// shared/config/query.ts
import { QueryClient } from '@tanstack/react-query';

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        gcTime: 10 * 60 * 1000, // 10 minutes
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}
```

---

## 🚀 SSR и Prefetching

### Prefetching в Server Components

```typescript
// app/products/page.tsx
import { makeQueryClient } from '@/shared/config/query';
import { productApi } from '@/entities/product/api/productApi';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export default async function ProductsPage({ searchParams }) {
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);
  const categoryUuid = params.category;
  const perPage = 20;

  const queryClient = makeQueryClient();

  // Prefetch данных для SSR
  await queryClient.prefetchQuery({
    queryKey: ['products', page, perPage, categoryUuid],
    queryFn: () => productApi.getProducts(page, perPage, categoryUuid),
  });

  await queryClient.prefetchQuery({
    queryKey: ['categories'],
    queryFn: () => productApi.getCategories(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductsCatalog initialPage={page} initialCategory={categoryUuid} />
    </HydrationBoundary>
  );
}
```

### Использование prefetched данных

```typescript
// widgets/products-catalog/products-catalog.tsx
'use client';

export function ProductsCatalog({ initialPage, initialCategory }) {
  // Данные будут взяты из кэша React Query
  const { data: productsData } = useProducts(initialPage, 20, initialCategory);
  const { data: categories } = useCategories();

  // ...
}
```

---

## 📚 Примеры использования

### Получение списка продуктов

```typescript
// В компоненте
const { data, isLoading, error } = useProducts(1, 20);

if (isLoading) return <div>Загрузка...</div>;
if (error) return <div>Ошибка: {error.message}</div>;

return <ProductList products={data?.data || []} />;
```

### Фильтрация по категории

```typescript
const [selectedCategory, setSelectedCategory] = useState<string>();

const { data } = useProducts(1, 20, selectedCategory);

// При изменении категории автоматически обновятся данные
```

### Пагинация

```typescript
const [page, setPage] = useState(1);
const { data } = useProducts(page, 20);

const totalPages = data?.meta?.last_page || 1;

<button onClick={() => setPage(page - 1)} disabled={page === 1}>
  Назад
</button>
<button onClick={() => setPage(page + 1)} disabled={page >= totalPages}>
  Вперёд
</button>
```

---

## ✅ Лучшие практики

### 1. Всегда типизируйте

✅ **Правильно:**
```typescript
async getProducts(...): Promise<ProductsResponse> {
  // ...
}
```

❌ **Неправильно:**
```typescript
async getProducts(...): Promise<any> {
  // ...
}
```

### 2. Обрабатывайте ошибки

✅ **Правильно:**
```typescript
if (!response.ok) {
  throw new Error(`Failed to fetch: ${response.statusText}`);
}
```

❌ **Неправильно:**
```typescript
return response.json(); // Без проверки статуса
```

### 3. Используйте нормализацию

✅ **Правильно:**
```typescript
const data = await response.json();
return normalizeListResponse<Category>(data);
```

❌ **Неправильно:**
```typescript
const data = await response.json();
return data.items; // Предполагаем формат
```

---

## 📚 Дополнительные материалы

- [Архитектура](./02-architecture.md)
- [FSD Принципы](./03-fsd-principles.md)
- [Dependency Injection](./04-di-and-patterns.md)
