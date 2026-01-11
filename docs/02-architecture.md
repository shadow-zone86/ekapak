# Глава 2: Архитектурные решения 🏗️

> Обзор архитектуры, паттерны проектирования и принципы SOLID

---

## 📐 Обзор архитектуры

Проект построен на **трёх столпах**:

1. **Feature-Sliced Design (FSD)** — методология организации кода
2. **SOLID принципы** — принципы объектно-ориентированного проектирования
3. **Dependency Injection (DI)** — управление зависимостями

Эта комбинация обеспечивает:

- ✅ Масштабируемость — легко добавлять новые функции
- ✅ Поддерживаемость — код легко понять и изменить
- ✅ Тестируемость — всё покрыто тестами
- ✅ Переиспользуемость — меньше дублирования кода

---

## 🎯 SOLID принципы

Проект полностью соответствует принципам SOLID. Рассмотрим каждый принцип с примерами из проекта.

### S — Single Responsibility (Единственная ответственность)

**Принцип**: Каждый класс/модуль имеет только одну причину для изменения.

#### ✅ Правильно: Разделение ответственностей

```typescript
// entities/product/api/productApi.ts
// Отвечает ТОЛЬКО за получение данных с API
export const productApi = {
  async getProducts(
    page = 1,
    perPage = 20,
    categoryUuid?: string
  ): Promise<ProductsResponse> {
    const url = `${API_BASE_URL}/products?page=${page}&per_page=${perPage}`;
    if (categoryUuid) {
      url += `&category=${categoryUuid}`;
    }
    const response = await fetch(url);
    return response.json();
  }
};

// entities/product/model/types.ts
// Отвечает ТОЛЬКО за определение типов
export interface Product {
  uuid: string;
  name: string;
  // ...
}

// entities/product/ui/product-card/product-card.tsx
// Отвечает ТОЛЬКО за отображение карточки продукта
export function ProductCard({ product }: ProductCardProps) {
  // UI логика
}
```

#### ❌ Неправильно: Смешивание ответственностей

```typescript
// ❌ Один компонент делает всё: API, валидацию, форматирование, отображение
function ProductCard({ productId }: { productId: string }) {
  const [product, setProduct] = useState(null);
  
  useEffect(() => {
    // ❌ API запрос внутри компонента
    fetch(`/api/products/${productId}`).then(/*...*/);
  }, []);
  
  const validateProduct = (p) => { /* ❌ Валидация */ };
  const formatPrice = (p) => { /* ❌ Форматирование */ };
  
  return <div>{/* UI */}</div>;
}
```

---

### O — Open/Closed (Открыт для расширения, закрыт для модификации)

**Принцип**: Классы открыты для расширения, но закрыты для модификации.

#### ✅ Правильно: Композиция и расширение

```typescript
// shared/ui/button/button.tsx
// Базовый компонент — можно расширять через props, но не нужно модифицировать
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', ...props }, ref) => {
    // Базовая реализация
  }
);

// Использование с расширением через className
<Button variant="primary" className="custom-class">
  Кнопка
</Button>
```

#### ✅ Правильно: Хуки для расширения функциональности

```typescript
// features/pagination/usePagination.ts
// Хук можно расширять, но не нужно модифицировать
export function usePagination({ currentPage, totalPages }: UsePaginationProps) {
  // Базовая логика пагинации
  
  return {
    goToPage,
    goToPreviousPage,
    goToNextPage,
    canGoPrevious,
    canGoNext,
  };
}

// Расширение через композицию
function useAdvancedPagination(props) {
  const base = usePagination(props);
  // Добавляем новую функциональность без модификации базового хука
  return {
    ...base,
    goToFirstPage: () => base.goToPage(1),
    goToLastPage: () => base.goToPage(props.totalPages),
  };
}
```

---

### L — Liskov Substitution (Подстановка Барбары Лисков)

**Принцип**: Объекты производных классов должны корректно заменять объекты базового класса.

#### ✅ Правильно: Полиморфизм через интерфейсы

```typescript
// shared/ui/card/card.tsx
// Базовый компонент Card
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated';
  size?: 'sm' | 'md' | 'lg';
}

export function Card({ variant = 'default', size = 'md', ...props }: CardProps) {
  // Реализация
}

// Использование Card везде одинаково, независимо от variant
<Card variant="default">Контент</Card>
<Card variant="elevated">Контент</Card>
<Card variant="outlined">Контент</Card>
```

---

### I — Interface Segregation (Разделение интерфейсов)

**Принцип**: Клиенты не должны зависеть от интерфейсов, которые они не используют.

#### ✅ Правильно: Разделённые интерфейсы

```typescript
// entities/product/model/types.ts

// Интерфейс для API ответа
export interface Product {
  uuid: string;
  name: string;
  sku: string;
  image?: string | null;
  offers: Offer[];
  // ... все поля из API
}

// Интерфейс для UI (только нужные поля)
export interface ProductCardProps {
  product: Product;
}

// Компонент использует только нужные поля
export function ProductCard({ product }: ProductCardProps) {
  return (
    <div>
      <h3>{product.name}</h3>
      <p>{product.sku}</p>
      {/* Используем только необходимые поля */}
    </div>
  );
}
```

---

### D — Dependency Inversion (Инверсия зависимостей)

**Принцип**: Модули верхнего уровня не должны зависеть от модулей нижнего уровня. Оба должны зависеть от абстракций.

#### ✅ Правильно: Через DI контейнер

```typescript
// entities/product/api/tokens.ts
// Создаём токены (абстракции)
export const PRODUCT_TOKENS = {
  ProductApi: createToken('Product.ProductApi'),
  CategoryApi: createToken('Product.CategoryApi')
};

// shared/config/di/container.ts
// Регистрируем реализации
export function registerProductDependencies() {
  container.registerFactory(
    PRODUCT_TOKENS.ProductApi,
    () => productApi
  );
}

// entities/product/api/useProducts.ts
// Зависим от абстракции, а не от конкретной реализации
export function useProducts(page: number, perPage: number, categoryUuid?: string) {
  const api = resolveOr(
    PRODUCT_TOKENS.ProductApi,
    () => productApi
  );
  
  return useQuery({
    queryKey: ['products', page, perPage, categoryUuid],
    queryFn: () => api.getProducts(page, perPage, categoryUuid),
  });
}
```

#### ❌ Неправильно: Прямая зависимость

```typescript
// ❌ Хук напрямую использует API
import { productApi } from '../api/productApi';

export function useProducts(...) {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => productApi.getProducts(...), // ❌ Жёсткая связь
  });
}
```

---

## 🏗️ Архитектурные паттерны

### 1. Паттерн Strategy (Стратегия)

**Назначение**: Инкапсуляция алгоритмов и возможность их переключения.

#### Пример: Фильтры продуктов

```typescript
// features/category-filter/useCategoryFilter.ts
// Стратегия фильтрации по категориям

export function useCategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectCategory = useCallback(
    (categoryUuid: string | undefined) => {
      const params = new URLSearchParams(searchParams?.toString());
      if (categoryUuid) {
        params.set('category', categoryUuid);
      } else {
        params.delete('category');
      }
      params.set('page', '1');
      router.push(`/products?${params.toString()}`);
    },
    [router, searchParams]
  );

  return { selectCategory };
}
```

### 2. Паттерн Factory (Фабрика)

**Назначение**: Создание объектов без указания их конкретных классов.

```typescript
// shared/config/query.ts
// Фабрика для создания QueryClient

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        gcTime: 10 * 60 * 1000, // 10 minutes
      },
    },
  });
}
```

### 3. Паттерн Mapper (Преобразователь)

**Назначение**: Преобразование данных между слоями (API → Store → UI).

```typescript
// entities/product/model/dto/mappers/mapProductApiToStore.ts
// Преобразование из API DTO в Store DTO

export function mapProductApiToStore(apiDto: Product): ProductStoreDto {
  return {
    uuid: apiDto.uuid,
    name: apiDto.name,
    // Преобразование полей
  };
}

// entities/product/model/dto/mappers/mapProductStoreToUi.ts
// Преобразование из Store DTO в UI DTO

export function mapProductStoreToUi(storeDto: ProductStoreDto): ProductUiDto {
  return {
    displayName: storeDto.name,
    // Форматирование для UI
  };
}
```

---

## 🎨 Структура проекта

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Корневой layout
│   ├── page.tsx            # Главная страница
│   └── products/
│       └── page.tsx        # Страница продуктов
├── widgets/                # Виджеты (композиция features)
│   ├── header/
│   ├── cart-sidebar/
│   └── products-catalog/
├── features/               # Функциональность (бизнес-логика)
│   ├── pagination/
│   └── category-filter/
├── entities/               # Бизнес-сущности
│   ├── product/
│   │   ├── api/
│   │   ├── model/
│   │   └── ui/
│   └── category/
├── shared/                 # Переиспользуемый код
│   ├── ui/                 # UI компоненты
│   ├── lib/                # Утилиты
│   └── config/             # Конфигурация
```

---

## ✅ Лучшие практики

### 1. Разделение ответственностей

✅ **Правильно:**
- API функции — только запросы
- Components — только UI
- Hooks — только логика

❌ **Неправильно:**
- Компонент делает API запросы напрямую
- API функции содержат UI логику

### 2. Использование типов

✅ **Правильно:**
```typescript
export interface ProductProps {
  product: Product;
}

export function ProductCard({ product }: ProductProps) {
  // ...
}
```

❌ **Неправильно:**
```typescript
export function ProductCard({ product }: { product: any }) {
  // ...
}
```

### 3. Композиция вместо наследования

✅ **Правильно:**
```typescript
// Композиция через props
<Card>
  <CardHeader>Заголовок</CardHeader>
  <CardBody>Контент</CardBody>
</Card>
```

---

## 📚 Дополнительные материалы

- [Feature-Sliced Design](./03-fsd-principles.md)
- [Dependency Injection](./04-di-and-patterns.md)
- [API Guide](./05-api-guide.md)
