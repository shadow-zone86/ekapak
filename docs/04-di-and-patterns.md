# Глава 4: DI и Паттерны 🧩

> Dependency Injection, Strategy, Factory, Mappers — управление зависимостями и паттерны проектирования

---

## 📋 Содержание

1. [Dependency Injection (DI)](#dependency-injection-di)
2. [DI Контейнер](#di-контейнер)
3. [Токены и фабрики](#токены-и-фабрики)
4. [Использование в хуках и компонентах](#использование-в-хуках-и-компонентах)
5. [Паттерн Strategy](#паттерн-strategy)
6. [Нормализация и пагинация](#нормализация-и-пагинация)
7. [Система мапперов](#система-мапперов)
8. [Кэширование запросов](#кэширование-запросов)
9. [Миграция на DI](#миграция-на-di)

---

## 🧩 Dependency Injection (DI)

### Что это?

**Dependency Injection** — паттерн проектирования, при котором зависимости объекта передаются извне, а не создаются внутри самого объекта.

### Зачем нужно?

- ✅ **Тестируемость** — легко подменять зависимости моками
- ✅ **Гибкость** — можно менять реализацию без изменения кода
- ✅ **Переиспользуемость** — один экземпляр на всё приложение
- ✅ **SOLID** — следование принципу Dependency Inversion

### Пример: До и После DI

#### ❌ Без DI (жёсткая связь)

```typescript
// entities/product/api/useProducts.ts
import { productApi } from './productApi';

export function useProducts(page: number, perPage: number) {
  // ❌ Прямое использование зависимости
  return useQuery({
    queryKey: ['products', page, perPage],
    queryFn: () => productApi.getProducts(page, perPage), // ❌ Жёсткая связь
  });
}
```

**Проблемы:**

- 🔴 Невозможно протестировать без реального API
- 🔴 Нельзя переключить реализацию
- 🔴 Каждый раз используется одна и та же зависимость

#### ✅ С DI (инверсия зависимостей)

```typescript
// entities/product/api/useProducts.ts
import { resolveOr } from '@/shared/lib/di/container';
import { PRODUCT_TOKENS } from './tokens';
import { productApi } from './productApi';

// Получаем зависимость из контейнера с фолбэком
const api = resolveOr(
  PRODUCT_TOKENS.ProductApi,
  () => productApi
);

export function useProducts(page: number, perPage: number) {
  // ✅ Используем зависимость из DI
  return useQuery({
    queryKey: ['products', page, perPage],
    queryFn: () => api.getProducts(page, perPage),
  });
}
```

**Преимущества:**

- ✅ Легко тестировать — подменяем через `container.registerFactory()`
- ✅ Можно переключить реализацию в `shared/config/di/`
- ✅ Один экземпляр на всё приложение (если нужно)

---

## 🗂️ DI Контейнер

### Расположение

```
src/shared/lib/di/container.ts
```

### Основные методы

```typescript
// Регистрация фабрики (создаёт новый экземпляр при каждом resolve)
container.registerFactory(token, factory)

// Регистрация синглтона (один экземпляр на всё приложение)
container.registerSingleton(token, instance)

// Получение зависимости (может вернуть undefined)
container.resolve<T>(token)
```

### Вспомогательные функции

```typescript
// Получить зависимость или создать через fallback
resolveOr<T>(token, fallbackFactory)

// Получить зависимость или выбросить ошибку
resolveRequired<T>(token, message?)
```

### Пример использования

```typescript
import { container, resolveOr, resolveRequired } from '@/shared/lib/di/container';
import { PRODUCT_TOKENS } from '@/entities/product/api/tokens';

// Вариант 1: С фолбэком (рекомендуется)
const productApi = resolveOr(
  PRODUCT_TOKENS.ProductApi,
  () => productApi
);

// Вариант 2: Строгая проверка (для критичных зависимостей)
const strictApi = resolveRequired(
  PRODUCT_TOKENS.ProductApi,
  'ProductApi not registered in DI container'
);
```

---

## 🏷️ Токены и фабрики

### Структура для каждого домена

```
entities/<Domain>/
├── api/
│   ├── tokens.ts          # Токены для DI
│   ├── factories.ts       # Фабрики для создания сервисов
│   ├── productApi.ts
│   └── ...
```

### Создание токенов

```typescript
// entities/product/api/tokens.ts
import { createToken } from '@/shared/lib/di/container';

export const PRODUCT_TOKENS = {
  ProductApi: createToken('Product.ProductApi'),
  CategoryApi: createToken('Product.CategoryApi'),
};
```

**Правила именования токенов:**

- Формат: `'Domain.ServiceName'`
- Пример: `'Product.ProductApi'`
- Всегда через `createToken()` для типобезопасности

### Создание фабрик

```typescript
// entities/product/api/factories.ts
import { productApi } from './productApi';
import { categoryApi } from './categoryApi';

export const createProductApi = () => productApi;
export const createCategoryApi = () => categoryApi;
```

---

## 📦 Регистрация зависимостей

### Структура провайдеров

```
src/shared/config/di/
├── index.ts              # Экспорт всех провайдеров
├── product.ts            # Продукты
└── category.ts           # Категории
```

### Пример провайдера

```typescript
// shared/config/di/product.ts
import { container } from '@/shared/lib/di/container';
import { PRODUCT_TOKENS } from '@/entities/product/api/tokens';
import {
  createProductApi,
  createCategoryApi,
} from '@/entities/product/api/factories';

export function registerProductDependencies() {
  container.registerFactory(PRODUCT_TOKENS.ProductApi, createProductApi);
  container.registerFactory(PRODUCT_TOKENS.CategoryApi, createCategoryApi);
}
```

### Регистрация в app

```typescript
// app/layout.tsx или app/providers.ts
import { registerProductDependencies } from '@/shared/config/di/product';
import { registerCategoryDependencies } from '@/shared/config/di/category';

// Регистрация всех зависимостей
registerProductDependencies();
registerCategoryDependencies();
```

---

## 💼 Использование в хуках и компонентах

### В хуках React Query

```typescript
// entities/product/api/useProducts.ts
import { useQuery } from '@tanstack/react-query';
import { resolveOr } from '@/shared/lib/di/container';
import { PRODUCT_TOKENS } from './tokens';
import { productApi } from './productApi';

// Получаем сервис из DI
const api = resolveOr(
  PRODUCT_TOKENS.ProductApi,
  () => productApi
);

export function useProducts(page: number, perPage: number, categoryUuid?: string) {
  return useQuery({
    queryKey: ['products', page, perPage, categoryUuid],
    queryFn: () => api.getProducts(page, perPage, categoryUuid),
  });
}
```

### В React компонентах

```typescript
// features/add-to-cart/useAddToCart.ts
import { useCallback } from 'react';
import { useAppDispatch } from '@/shared/config/types';
import { resolveOr } from '@/shared/lib/di/container';
import { CART_TOKENS } from '@/entities/cart/api/tokens';
import { addItem } from '@/entities/cart/model/slice';

export function useAddToCart() {
  const dispatch = useAppDispatch();
  
  // Если нужен сервис через DI
  const cartService = resolveOr(
    CART_TOKENS.CartService,
    () => null
  );

  const addToCart = useCallback((product: Product) => {
    dispatch(addItem({
      productUuid: product.uuid,
      // ...
    }));
  }, [dispatch]);

  return { addToCart };
}
```

### ⚠️ Запреты

#### ❌ Нельзя: Прямое создание new в хуках/компонентах

```typescript
// ❌ НЕПРАВИЛЬНО
export function useProducts() {
  const api = new ProductApi(); // ❌ Запрещено!
  return useQuery({
    queryFn: () => api.getProducts(),
  });
}
```

#### ✅ Можно: В фабриках и провайдерах

```typescript
// ✅ ПРАВИЛЬНО — в фабрике
// entities/product/api/factories.ts
export const createProductApi = () => productApi;

// ✅ ПРАВИЛЬНО — в провайдере
// shared/config/di/product.ts
export function registerProductDependencies() {
  container.registerFactory(PRODUCT_TOKENS.ProductApi, createProductApi);
}
```

---

## 🔀 Паттерн Strategy

### Назначение

Инкапсуляция алгоритмов и возможность их переключения в рантайме.

### Применение в проекте

#### 1. Фильтры продуктов

```typescript
// features/category-filter/useCategoryFilter.ts

export function useCategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Стратегия фильтрации через URL параметры
  const selectCategory = useCallback(
    (categoryUuid: string | undefined) => {
      const params = new URLSearchParams(searchParams?.toString());
      
      if (categoryUuid) {
        params.set('category', categoryUuid);
      } else {
        params.delete('category');
      }
      
      params.set('page', '1'); // Сброс страницы при смене категории
      router.push(`/products?${params.toString()}`);
    },
    [router, searchParams]
  );

  return { selectCategory };
}
```

#### 2. Стратегия пагинации

```typescript
// features/pagination/usePagination.ts

export function usePagination({ currentPage, totalPages }: UsePaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createPageURL = useCallback(
    (pageNumber: number | string) => {
      const params = new URLSearchParams(searchParams?.toString());
      params.set('page', pageNumber.toString());
      return `/products?${params.toString()}`;
    },
    [searchParams]
  );

  const goToPage = useCallback(
    (pageNumber: number) => {
      if (pageNumber >= 1 && pageNumber <= totalPages) {
        router.push(createPageURL(pageNumber));
      }
    },
    [router, createPageURL, totalPages]
  );

  return { goToPage, goToPreviousPage, goToNextPage, /* ... */ };
}
```

---

## 📊 Нормализация и пагинация

### 1. Нормализация ответов API

**Назначение**: Приведение всех ответов API к единому формату.

```typescript
// shared/lib/normalization/normalizeResponse.ts

// Для списков
export function normalizeListResponse<T>(response: any): T[] {
  if (response?.items) return response.items;        // { items: [...] }
  if (response?.data && Array.isArray(response.data)) {
    return response.data;                            // { data: [...] }
  }
  if (Array.isArray(response)) return response;      // [...]
  return [];
}

// Для одиночных объектов
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

**Использование:**

```typescript
// entities/product/api/productApi.ts
import { normalizeListResponse } from '@/shared/lib/normalization/normalizeResponse';

export const productApi = {
  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${API_BASE_URL}/categories`);
    const data = await response.json();
    
    // Нормализация — работает с любым форматом API
    return normalizeListResponse<Category>(data);
  }
};
```

### 2. Единая пагинация

**Назначение**: Стандартизация пагинации во всех списках.

```typescript
// shared/lib/pagination/pagination.ts

export interface PaginationMeta {
  page: number;
  per_page: number;
  total?: number;
  last_page?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta?: PaginationMeta;
}

// Гарантирует корректные данные пагинации
export function ensurePagination(meta?: PaginationMeta): PaginationMeta {
  return {
    page: meta?.page ?? 1,
    per_page: meta?.per_page ?? 20,
    total: meta?.total ?? 0,
    last_page: meta?.last_page ?? Math.ceil((meta?.total ?? 0) / (meta?.per_page ?? 20)),
  };
}
```

**Использование:**

```typescript
// entities/product/model/types.ts
import { ensurePagination } from '@/shared/lib/pagination/pagination';

export interface ProductsResponse {
  data: Product[];
  meta?: PaginationMeta;
}

// Использование в компоненте
const { data: productsData } = useProducts(page, perPage);
const meta = ensurePagination(productsData?.meta);
```

---

## 🗂️ Система мапперов

### Трёхуровневая архитектура мапперов

#### Когда использовать какой маппер:

| Ситуация                         | Маппер          | Причина                                 |
| -------------------------------- | --------------- | --------------------------------------- |
| Данные нужны в нескольких местах | **API → Store** | Сохранить в store для переиспользования |
| Одноразовое отображение          | **API → UI**    | Прямое отображение без store            |
| Данные уже в store               | **Store → UI**  | Форматирование из store                 |

#### Структура мапперов

```
entities/<Domain>/model/dto/mappers/
├── index.ts                        # Экспорт всех мапперов
├── map<Entity>ApiToStore.ts       # API → Store
├── map<Entity>ApiToUi.ts          # API → UI
└── map<Entity>StoreToUi.ts        # Store → UI
```

#### Примеры мапперов

```typescript
// entities/product/model/dto/mappers/mapProductApiToStore.ts
import { Product } from '../../types';
import { ProductStoreDto } from '../types';

export function mapProductApiToStore(apiDto: Product): ProductStoreDto {
  return {
    uuid: apiDto.uuid,
    name: apiDto.name,
    sku: apiDto.sku,
    image: apiDto.image,
    // Преобразование полей для store
  };
}

// entities/product/model/dto/mappers/mapProductStoreToUi.ts
import { ProductStoreDto } from '../types';
import { ProductUiDto } from '../types';

export function mapProductStoreToUi(storeDto: ProductStoreDto): ProductUiDto {
  return {
    displayName: storeDto.name,
    displayPrice: formatPrice(storeDto.price),
    // Форматирование для UI
  };
}
```

---

## 🗄️ Кэширование запросов

### React Query кэширование

React Query автоматически кэширует запросы:

```typescript
// entities/product/api/useProducts.ts
export function useProducts(page: number, perPage: number, categoryUuid?: string) {
  return useQuery({
    queryKey: ['products', page, perPage, categoryUuid],
    queryFn: () => productApi.getProducts(page, perPage, categoryUuid),
    staleTime: 60 * 1000, // 1 минута
    gcTime: 10 * 60 * 1000, // 10 минут
  });
}
```

### Настройка кэширования

```typescript
// shared/config/query.ts
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

## 🔄 Миграция на DI

### Шаг 1: Создать токены

```typescript
// entities/product/api/tokens.ts
import { createToken } from '@/shared/lib/di/container';

export const PRODUCT_TOKENS = {
  ProductApi: createToken('Product.ProductApi'),
};
```

### Шаг 2: Создать фабрики

```typescript
// entities/product/api/factories.ts
import { productApi } from './productApi';

export const createProductApi = () => productApi;
```

### Шаг 3: Зарегистрировать в DI

```typescript
// shared/config/di/product.ts
import { container } from '@/shared/lib/di/container';
import { PRODUCT_TOKENS } from '@/entities/product/api/tokens';
import { createProductApi } from '@/entities/product/api/factories';

export function registerProductDependencies() {
  container.registerFactory(PRODUCT_TOKENS.ProductApi, createProductApi);
}
```

### Шаг 4: Использовать в коде

```typescript
// entities/product/api/useProducts.ts
import { resolveOr } from '@/shared/lib/di/container';
import { PRODUCT_TOKENS } from './tokens';
import { productApi } from './productApi';

const api = resolveOr(PRODUCT_TOKENS.ProductApi, () => productApi);

export function useProducts(...) {
  return useQuery({
    queryFn: () => api.getProducts(...),
  });
}
```

---

## 📚 Дополнительные материалы

- [Архитектура](./02-architecture.md)
- [FSD Принципы](./03-fsd-principles.md)
- [API Guide](./05-api-guide.md)
