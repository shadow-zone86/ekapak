import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { NotificationProvider, useNotificationContext } from './notification-provider';
import { Button } from '@/shared/ui/button';

const meta: Meta<typeof NotificationProvider> = {
  title: 'UI/NotificationProvider',
  component: NotificationProvider,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Провайдер для глобального управления и отображения уведомлений в приложении. Предоставляет хук useNotificationContext для добавления, удаления и очистки уведомлений.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Компонент-демонстрация для использования контекста
function NotificationDemo() {
  const { addNotification, clearNotifications } = useNotificationContext();

  return (
    <div className="p-8 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Управление уведомлениями</h2>
      
      <div className="flex flex-wrap gap-4">
        <Button
          variant="primary"
          onClick={() => {
            addNotification({
              type: 'success',
              message: 'Операция выполнена успешно!',
              duration: 3000,
            });
          }}
        >
          Показать Success
        </Button>

        <Button
          variant="primary"
          onClick={() => {
            addNotification({
              type: 'info',
              title: 'Информация',
              message: 'Информационное сообщение для пользователя',
              duration: 5000,
            });
          }}
        >
          Показать Info
        </Button>

        <Button
          variant="primary"
          onClick={() => {
            addNotification({
              type: 'warning',
              title: 'Предупреждение',
              message: 'Обратите внимание на это сообщение',
              duration: 5000,
            });
          }}
        >
          Показать Warning
        </Button>

        <Button
          variant="primary"
          onClick={() => {
            addNotification({
              type: 'error',
              title: 'Ошибка',
              message: 'Произошла ошибка при выполнении операции',
              duration: 5000,
            });
          }}
        >
          Показать Error
        </Button>

        <Button
          variant="secondary"
          onClick={() => {
            clearNotifications();
          }}
        >
          Очистить все
        </Button>
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">Примеры использования:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Нажмите на кнопки выше, чтобы добавить уведомления</li>
          <li>Уведомления отображаются в правом верхнем углу</li>
          <li>Уведомления закрываются автоматически или по кнопке</li>
          <li>Используйте &quot;Очистить все&quot; для удаления всех уведомлений</li>
        </ul>
      </div>
    </div>
  );
}

// Базовое использование
export const Default: Story = {
  render: () => (
    <NotificationProvider>
      <NotificationDemo />
    </NotificationProvider>
  ),
};

// Демонстрация добавления товара в корзину
function AddToCartDemo() {
  const { addNotification } = useNotificationContext();

  const handleAddToCart = (productName: string) => {
    addNotification({
      type: 'success',
      message: `Товар "${productName}" добавлен в корзину`,
      duration: 3000,
    });
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Добавление в корзину</h2>
      <div className="flex flex-wrap gap-4">
        <Button
          variant="primary"
          onClick={() => handleAddToCart('Пленка для запайки лотков 270мм*300м')}
        >
          Добавить товар 1
        </Button>
        <Button
          variant="primary"
          onClick={() => handleAddToCart('Пленка для запайки лотков 130мм*300м')}
        >
          Добавить товар 2
        </Button>
        <Button
          variant="primary"
          onClick={() => handleAddToCart('Пленка для запайки лотков 190мм*300м')}
        >
          Добавить товар 3
        </Button>
      </div>
    </div>
  );
}

export const AddToCart: Story = {
  render: () => (
    <NotificationProvider>
      <AddToCartDemo />
    </NotificationProvider>
  ),
};

// Демонстрация работы с избранным
function FavoritesDemo() {
  const { addNotification } = useNotificationContext();
  const [favorites, setFavorites] = useState<string[]>([]);

  const handleToggleFavorite = (productName: string, productUuid: string) => {
    const isFavorite = favorites.includes(productUuid);
    
    if (isFavorite) {
      setFavorites(favorites.filter((id) => id !== productUuid));
      addNotification({
        type: 'info',
        message: `Товар "${productName}" удален из избранного`,
        duration: 3000,
      });
    } else {
      setFavorites([...favorites, productUuid]);
      addNotification({
        type: 'success',
        message: `Товар "${productName}" добавлен в избранное`,
        duration: 3000,
      });
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Работа с избранным</h2>
      <div className="flex flex-wrap gap-4">
        <Button
          variant="primary"
          onClick={() => handleToggleFavorite('Товар 1', 'product-1')}
        >
          {favorites.includes('product-1') ? 'Удалить из избранного' : 'Добавить в избранное'}
        </Button>
        <Button
          variant="primary"
          onClick={() => handleToggleFavorite('Товар 2', 'product-2')}
        >
          {favorites.includes('product-2') ? 'Удалить из избранного' : 'Добавить в избранное'}
        </Button>
        <Button
          variant="primary"
          onClick={() => handleToggleFavorite('Товар 3', 'product-3')}
        >
          {favorites.includes('product-3') ? 'Удалить из избранного' : 'Добавить в избранное'}
        </Button>
      </div>
    </div>
  );
}

export const Favorites: Story = {
  render: () => (
    <NotificationProvider>
      <FavoritesDemo />
    </NotificationProvider>
  ),
};

// Демонстрация обработки ошибок
function ErrorHandlingDemo() {
  const { addNotification } = useNotificationContext();

  const handleSuccess = () => {
    addNotification({
      type: 'success',
      title: 'Успех',
      message: 'Операция выполнена успешно! Все данные сохранены.',
      duration: 3000,
    });
  };

  const handleError = () => {
    addNotification({
      type: 'error',
      title: 'Ошибка',
      message: 'Произошла ошибка при выполнении операции. Попробуйте еще раз.',
      duration: 5000,
    });
  };

  const handleValidationError = () => {
    addNotification({
      type: 'warning',
      title: 'Предупреждение',
      message: 'Пожалуйста, проверьте введенные данные перед отправкой',
      duration: 5000,
    });
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Обработка результатов операций</h2>
      <div className="flex flex-wrap gap-4">
        <Button variant="primary" onClick={handleSuccess}>
          Успешная операция
        </Button>
        <Button variant="primary" onClick={handleError}>
          Ошибка
        </Button>
        <Button variant="primary" onClick={handleValidationError}>
          Предупреждение
        </Button>
      </div>
    </div>
  );
}

export const ErrorHandling: Story = {
  render: () => (
    <NotificationProvider>
      <ErrorHandlingDemo />
    </NotificationProvider>
  ),
};

// Демонстрация множественных уведомлений
function MultipleNotificationsDemo() {
  const { addNotification, clearNotifications } = useNotificationContext();

  const handleAddMultiple = () => {
    addNotification({
      type: 'info',
      message: 'Первое уведомление',
      duration: 3000,
    });
    addNotification({
      type: 'success',
      message: 'Второе уведомление',
      duration: 4000,
    });
    addNotification({
      type: 'warning',
      message: 'Третье уведомление',
      duration: 5000,
    });
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Множественные уведомления</h2>
      <div className="flex flex-wrap gap-4">
        <Button variant="primary" onClick={handleAddMultiple}>
          Добавить несколько уведомлений
        </Button>
        <Button variant="secondary" onClick={clearNotifications}>
          Очистить все
        </Button>
      </div>
    </div>
  );
}

export const MultipleNotifications: Story = {
  render: () => (
    <NotificationProvider>
      <MultipleNotificationsDemo />
    </NotificationProvider>
  ),
};

// Демонстрация удаления уведомлений по ID
function RemoveByIdDemo() {
  const { addNotification, removeNotification } = useNotificationContext();
  const [notificationId, setNotificationId] = useState<string | null>(null);

  const handleAdd = () => {
    const id = addNotification({
      type: 'info',
      title: 'Временное уведомление',
      message: 'Это уведомление будет удалено через 2 секунды',
      autoClose: false,
    });
    setNotificationId(id);

    setTimeout(() => {
      removeNotification(id);
      setNotificationId(null);
    }, 2000);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Удаление уведомления по ID</h2>
      <div className="flex flex-wrap gap-4">
        <Button variant="primary" onClick={handleAdd} disabled={notificationId !== null}>
          Добавить и удалить через 2 сек
        </Button>
      </div>
      {notificationId && (
        <p className="mt-4 text-sm text-gray-600">
          ID уведомления: {notificationId}
        </p>
      )}
    </div>
  );
}

export const RemoveById: Story = {
  render: () => (
    <NotificationProvider>
      <RemoveByIdDemo />
    </NotificationProvider>
  ),
};
