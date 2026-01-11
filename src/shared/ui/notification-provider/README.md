# NotificationProvider

Провайдер для глобального управления и отображения уведомлений в приложении.

## 📋 Описание

NotificationProvider - это контекстный провайдер, который управляет состоянием и отображением уведомлений по всему приложению. Предоставляет хук `useNotificationContext` для добавления, удаления и очистки уведомлений.

## 🎯 Особенности

- **Глобальное управление**: централизованное управление всеми уведомлениями
- **Простой API**: удобный хук для работы с уведомлениями
- **Автоматическое отображение**: уведомления автоматически отображаются в правом верхнем углу
- **Множественные уведомления**: поддержка нескольких уведомлений одновременно

## 📦 Структура

```
notification-provider/
├── ui/
│   └── notification-provider.tsx    # Основной компонент
├── index.ts                          # Экспорт компонента
└── README.md                         # Документация
```

## 🔧 Использование

### Настройка провайдера

Добавьте `NotificationProvider` в корневой layout вашего приложения:

```tsx
// app/layout.tsx
import { NotificationProvider } from '@/shared/ui/notification-provider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </body>
    </html>
  );
}
```

### Использование в компонентах

```tsx
'use client';

import { useNotificationContext } from '@/shared/ui/notification-provider';

function MyComponent() {
  const { addNotification } = useNotificationContext();

  const handleSuccess = () => {
    addNotification({
      type: 'success',
      message: 'Операция выполнена успешно',
      duration: 3000,
    });
  };

  const handleError = () => {
    addNotification({
      type: 'error',
      title: 'Ошибка',
      message: 'Произошла ошибка при выполнении операции',
      duration: 5000,
    });
  };

  return (
    <div>
      <button onClick={handleSuccess}>Показать успех</button>
      <button onClick={handleError}>Показать ошибку</button>
    </div>
  );
}
```

## 📚 API

### NotificationProvider

Компонент-провайдер, который оборачивает приложение и предоставляет контекст для управления уведомлениями.

**Props:**
- `children: ReactNode` - дочерние элементы приложения

### useNotificationContext

Хук для доступа к функциям управления уведомлениями.

**Возвращает:**

```typescript
{
  addNotification: (notification: NotificationData) => string;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}
```

#### addNotification

Добавляет новое уведомление и возвращает его уникальный идентификатор.

**Параметры:**

```typescript
interface NotificationData {
  title?: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  autoClose?: boolean;
  duration?: number;
  closable?: boolean;
  id?: string; // Опционально, будет сгенерирован автоматически
}
```

**Возвращает:** `string` - уникальный идентификатор уведомления

**Пример:**

```tsx
const { addNotification } = useNotificationContext();

const id = addNotification({
  type: 'success',
  title: 'Успех',
  message: 'Товар добавлен в корзину',
  duration: 3000,
});
```

#### removeNotification

Удаляет уведомление по идентификатору.

**Параметры:**
- `id: string` - идентификатор уведомления

**Пример:**

```tsx
const { addNotification, removeNotification } = useNotificationContext();

const id = addNotification({
  message: 'Временное уведомление',
});

// Удалить через 2 секунды
setTimeout(() => {
  removeNotification(id);
}, 2000);
```

#### clearNotifications

Очищает все уведомления.

**Пример:**

```tsx
const { clearNotifications } = useNotificationContext();

const handleClearAll = () => {
  clearNotifications();
};
```

## 🎨 Расположение уведомлений

Уведомления отображаются в фиксированной позиции:
- **Позиция**: правый верхний угол экрана (`top-20 right-4`)
- **Z-index**: `50` (поверх других элементов)
- **Максимальная ширина**: `480px`
- **Отступ между уведомлениями**: `12px` (gap-3)

## 🚀 Примеры использования

### Добавление товара в корзину

```tsx
import { useNotificationContext } from '@/shared/ui/notification-provider';

function AddToCartButton({ product }) {
  const { addNotification } = useNotificationContext();
  const dispatch = useAppDispatch();

  const handleAddToCart = () => {
    dispatch(addItem(product));
    addNotification({
      type: 'success',
      message: `Товар "${product.name}" добавлен в корзину`,
      duration: 3000,
    });
  };

  return <button onClick={handleAddToCart}>Добавить в корзину</button>;
}
```

### Добавление в избранное

```tsx
import { useNotificationContext } from '@/shared/ui/notification-provider';

function FavoriteButton({ product }) {
  const { addNotification } = useNotificationContext();
  const dispatch = useAppDispatch();
  const isFavorite = useAppSelector(state => 
    state.favorites.productUuids.includes(product.uuid)
  );

  const handleToggle = () => {
    dispatch(toggleFavorite(product.uuid));
    
    if (isFavorite) {
      addNotification({
        type: 'info',
        message: `Товар "${product.name}" удален из избранного`,
        duration: 3000,
      });
    } else {
      addNotification({
        type: 'success',
        message: `Товар "${product.name}" добавлен в избранное`,
        duration: 3000,
      });
    }
  };

  return <button onClick={handleToggle}>Избранное</button>;
}
```

### Обработка ошибок

```tsx
import { useNotificationContext } from '@/shared/ui/notification-provider';

function MyComponent() {
  const { addNotification } = useNotificationContext();

  const handleSubmit = async () => {
    try {
      await submitForm();
      addNotification({
        type: 'success',
        message: 'Форма успешно отправлена',
        duration: 3000,
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Ошибка',
        message: error.message || 'Произошла ошибка при отправке формы',
        duration: 5000,
      });
    }
  };

  return <button onClick={handleSubmit}>Отправить</button>;
}
```

### Информационные уведомления

```tsx
import { useNotificationContext } from '@/shared/ui/notification-provider';

function InfoComponent() {
  const { addNotification } = useNotificationContext();

  const handleInfo = () => {
    addNotification({
      type: 'info',
      title: 'Информация',
      message: 'Пожалуйста, проверьте введенные данные перед отправкой',
      duration: 5000,
    });
  };

  return <button onClick={handleInfo}>Показать информацию</button>;
}
```

### Уведомления без автоматического закрытия

```tsx
import { useNotificationContext } from '@/shared/ui/notification-provider';

function ImportantNotification() {
  const { addNotification, removeNotification } = useNotificationContext();

  const handleShowImportant = () => {
    const id = addNotification({
      type: 'warning',
      title: 'Важное уведомление',
      message: 'Это уведомление требует вашего внимания',
      autoClose: false,
      closable: true,
    });

    // Удалить через 10 секунд
    setTimeout(() => {
      removeNotification(id);
    }, 10000);
  };

  return <button onClick={handleShowImportant}>Показать важное</button>;
}
```

## ⚠️ Важные замечания

1. **Обязательный провайдер**: `useNotificationContext` должен использоваться только внутри `NotificationProvider`, иначе будет выброшена ошибка.

2. **Уникальные ID**: Если не указать `id` при добавлении уведомления, он будет сгенерирован автоматически на основе времени и случайного числа.

3. **Автоматическое закрытие**: По умолчанию уведомления закрываются автоматически через 7 секунд. Можно отключить через `autoClose: false`.

4. **Производительность**: Провайдер оптимизирован для работы с множественными уведомлениями, но рекомендуется не показывать более 5-10 уведомлений одновременно.

## 📚 Связанная документация

- [Notification](../notification/README.md) - Компонент уведомления
- [Design System](../../../docs/design-system.md) - Система дизайна
