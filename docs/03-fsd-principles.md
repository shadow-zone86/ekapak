# Глава 3: FSD Принципы 🎯

> Feature-Sliced Design — методология организации кода для масштабируемых приложений

---

## 🎯 Основные принципы

### 1. Слои архитектуры

Проект разделен на слои, каждый из которых имеет свою ответственность:

```
app/        ← Next.js App Router (роутинг и SSR)
widgets/    ← Виджеты (композиция features и entities)
features/   ← Функциональность (бизнес-логика)
entities/   ← Бизнес-сущности
shared/     ← Переиспользуемый код
```

### 2. Правила зависимостей

Слои могут зависеть только от слоев ниже себя:

```
app → widgets → features → entities → shared
```

**Запрещено:**

- ❌ `features` → `widgets`
- ❌ `entities` → `features`
- ❌ `shared` → `entities`
- ❌ `widgets` → `widgets` (импорт между виджетами)

**Разрешено:**

- ✅ `widgets` → `features`
- ✅ `features` → `entities`
- ✅ `entities` → `shared`
- ✅ `app` → `widgets`

### 3. Сегментация

Каждый слой может быть разделен на сегменты:

```
entities/
├── product/
│   ├── api/
│   ├── model/
│   └── ui/
└── category/
    ├── api/
    ├── model/
    └── ui/
```

---

## 📁 Структура слоев

### app/ - Next.js App Router

**Назначение:** Роутинг, SSR, инициализация приложения

**Содержит:**

- `page.tsx` — страницы (главная, корзина, избранное)
- `layout.tsx` — layouts
- Провайдеры (store, query, DI)

**Правила:**

- Только роутинг и SSR
- Не содержит бизнес-логики
- Использует виджеты для контента

> ⚠️ **Важно**: В классической FSD архитектуре существует слой `pages/`, но в этом проекте он **не используется**, так как Next.js 16 с App Router уже предоставляет роутинг через папку `app/`. Файлы `app/*/page.tsx` выполняют роль страниц из слоя `pages/` в FSD, но реализованы через механизм Next.js App Router.

**Примеры:**

```typescript
// app/page.tsx (главная страница - каталог товаров)
import { ProductsCatalog } from '@/widgets/products-catalog';

export default async function HomePage({ searchParams }) {
  // SSR: prefetch данных
  await queryClient.prefetchQuery(...);
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductsCatalog />
    </HydrationBoundary>
  );
}

// app/cart/page.tsx (страница корзины)
import { CartItem } from '@/widgets/cart-item';
import { OrderSummary } from '@/widgets/order-summary';

export default function CartPage() {
  // Клиентская страница с использованием виджетов
  return (
    <>
      <CartItem />
      <OrderSummary />
    </>
  );
}
```

---

### widgets/ - Виджеты

**Назначение:** Композиция features и entities в готовые UI блоки

**Содержит:**

- Композиция компонентов
- Конфигурация
- Типы виджета

**Правила:**

- Не содержит бизнес-логики
- Использует features для логики
- Использует entities для данных и UI
- Предоставляет готовый UI блок

**Примеры:**

```typescript
// widgets/products-catalog/products-catalog.tsx
'use client';

import { useProducts } from '@/entities/product/api/useProducts';
import { useCategories } from '@/entities/category/api/useCategories';
import { ProductList } from '@/entities/product/ui/product-list';
import { CategoryList } from '@/entities/category/ui/category-list';
import { usePagination } from '@/features/pagination';
import { useCategoryFilter } from '@/features/category-filter';

export function ProductsCatalog() {
  // Используем entities для данных
  const { data: products } = useProducts(...);
  const { data: categories } = useCategories();
  
  // Используем features для логики
  const { selectCategory } = useCategoryFilter();
  const { goToPage } = usePagination(...);
  
  return (
    <div>
      <CategoryList categories={categories} onSelect={selectCategory} />
      <ProductList products={products} />
    </div>
  );
}
```

---

### features/ - Функциональность

**Назначение:** Бизнес-логика и пользовательские сценарии

**Содержит:**

- Бизнес-логика
- Пользовательские сценарии
- Кастомные хуки

**Правила:**

- Содержит только одну функцию
- Не зависит от других features
- Может использовать entities и shared
- Не содержит UI компонентов (только логика)

**Примеры:**

```typescript
// features/pagination/usePagination.ts
'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function usePagination({ currentPage, totalPages }: UsePaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goToPage = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams?.toString());
    params.set('page', page.toString());
    router.push(`/products?${params.toString()}`);
  }, [router, searchParams]);

  return { goToPage, /* ... */ };
}

// features/category-filter/useCategoryFilter.ts
export function useCategoryFilter() {
  // Логика фильтрации по категориям
  return { selectCategory };
}
```

---

### entities/ - Бизнес-сущности

**Назначение:** Бизнес-сущности и их поведение

**Содержит:**

- Модели данных (types, DTO)
- API сервисы
- UI компоненты сущностей
- Мапперы (API → Store → UI)

**Правила:**

- Одна сущность = одна папка
- Содержит всю логику сущности
- Может использоваться в разных features
- UI компоненты только для отображения сущности

**Примеры:**

```typescript
// entities/product/model/types.ts
export interface Product {
  uuid: string;
  name: string;
  // ...
}

// entities/product/api/productApi.ts
export const productApi = {
  async getProducts(...): Promise<ProductsResponse> {
    // API запросы
  }
};

// entities/product/api/useProducts.ts
export function useProducts(page: number, perPage: number) {
  return useQuery({
    queryKey: ['products', page, perPage],
    queryFn: () => productApi.getProducts(page, perPage),
  });
}

// entities/product/ui/product-card/product-card.tsx
export function ProductCard({ product }: ProductCardProps) {
  // UI компонент продукта
}

// entities/product/ui/product-list/product-list.tsx
export function ProductList({ products }: ProductListProps) {
  // Список продуктов
}
```

---

### shared/ - Переиспользуемый код

**Назначение:** Код, который может использоваться в любом слое

**Содержит:**

- UI компоненты (Button, Card, Search, Typography)
- Утилиты
- Константы
- Конфигурация (DI, store, query)
- Типы

**Правила:**

- Не содержит бизнес-логики
- Максимально переиспользуем
- Не зависит от других слоев
- Может использоваться везде

**Примеры:**

```typescript
// shared/ui/button/button.tsx
export function Button({ variant, size, ...props }: ButtonProps) {
  // Универсальный компонент кнопки
}

// shared/ui/card/card.tsx
export function Card({ variant, size, ...props }: CardProps) {
  // Универсальный компонент карточки
}

// shared/lib/utils.ts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// shared/config/types.ts
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

## 🔧 Практические правила

### Именование

**Файлы:**

- `*.tsx` - React компоненты
- `*.ts` - TypeScript файлы
- `types.ts` - Типы
- `*.api.ts` - API функции
- `*.hook.ts` или `use*.ts` - Хуки

**Папки:**

- `ui/` - UI компоненты
- `model/` - Модели, типы, DTO
- `api/` - API сервисы и хуки
- `config/` - Конфигурация

### Импорты

**Правильно:**

```typescript
// Виджет импортирует feature и entity
import { usePagination } from '@/features/pagination';
import { ProductList } from '@/entities/product/ui/product-list';

// Feature импортирует entity
import { useProducts } from '@/entities/product/api/useProducts';

// Entity импортирует shared
import { Button } from '@/shared/ui/button';
```

**Неправильно:**

```typescript
// ❌ Feature импортирует widget
import ProductsCatalog from '@/widgets/products-catalog';

// ❌ Entity импортирует feature
import { useCategoryFilter } from '@/features/category-filter';

// ❌ Widget импортирует другой widget
import { Header } from '@/widgets/header';
```

### Структура компонента

```typescript
// 1. Импорты (сначала внешние, потом внутренние)
import { useCallback } from 'react';
import { Button } from '@/shared/ui/button';
import { Product } from '../../model/types';

// 2. Типы
interface ProductCardProps {
  product: Product;
}

// 3. Компонент
export function ProductCard({ product }: ProductCardProps) {
  // 4. Хуки
  const dispatch = useAppDispatch();
  
  // 5. Handlers
  const handleClick = useCallback(() => {
    // ...
  }, []);
  
  // 6. Render
  return <div>...</div>;
}
```

---

## 🚫 Анти-паттерны

### 1. Циклические зависимости

❌ **Неправильно:**
```
widgets/products-catalog → widgets/cart-sidebar
widgets/cart-sidebar → widgets/products-catalog
```

✅ **Правильно:**
```
widgets/products-catalog → entities/cart
widgets/cart-sidebar → entities/cart
```

### 2. Нарушение правил зависимостей

❌ **Неправильно:**
```typescript
// features/pagination импортирует widget
import { ProductsCatalog } from '@/widgets/products-catalog';
```

✅ **Правильно:**
```typescript
// widget импортирует feature
import { usePagination } from '@/features/pagination';
```

### 3. Бизнес-логика в UI

❌ **Неправильно:**
```typescript
// UI компонент содержит бизнес-логику
export function ProductCard({ product }) {
  const [filtered, setFiltered] = useState([]);
  
  useEffect(() => {
    // Бизнес-логика фильтрации
    const filtered = products.filter(/* ... */);
    setFiltered(filtered);
  }, []);
}
```

✅ **Правильно:**
```typescript
// Логика в feature
export function useProductFilter(products, filters) {
  return useMemo(() => {
    return products.filter(/* ... */);
  }, [products, filters]);
}

// UI только отображает
export function ProductCard({ product }) {
  return <div>{product.name}</div>;
}
```

---

## 📚 Дополнительные материалы

- [Архитектура](./02-architecture.md)
- [Dependency Injection](./04-di-and-patterns.md)
- [API Guide](./05-api-guide.md)
