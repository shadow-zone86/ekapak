import type { Meta, StoryObj } from '@storybook/react';
import { Notification } from './notification';
import { useState } from 'react';

const meta: Meta<typeof Notification> = {
  title: 'UI/Notification',
  component: Notification,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Компонент уведомлений с возможностью автоматического закрытия, закрытия кнопкой и визуальной полоской прогресса.',
      },
    },
  },
  argTypes: {
    id: {
      control: 'text',
      description: 'Уникальный идентификатор уведомления',
    },
    title: {
      control: 'text',
      description: 'Заголовок уведомления',
    },
    message: {
      control: 'text',
      description: 'Текст сообщения (обязательный)',
    },
    type: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error'],
      description: 'Тип уведомления',
    },
    autoClose: {
      control: 'boolean',
      description: 'Автоматическое закрытие',
    },
    duration: {
      control: 'number',
      description: 'Длительность в миллисекундах',
    },
    closable: {
      control: 'boolean',
      description: 'Показывать кнопку закрытия',
    },
  },
  args: {
    id: 'notification-1',
    message: 'Это базовое уведомление с возможностью закрытия',
    type: 'info',
    autoClose: true,
    duration: 7000,
    closable: true,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Компонент-обертка для Default story
function DefaultNotification(args: typeof meta.args = {}) {
  const [isVisible, setIsVisible] = useState(true);
  if (!isVisible) return <div>Уведомление закрыто</div>;
  return (
    <Notification
      id={args.id || 'notification-1'}
      message={args.message || 'Это базовое уведомление с возможностью закрытия'}
      {...args}
      onClose={(id) => {
        console.log('Закрыто:', id);
        setIsVisible(false);
      }}
    />
  );
}

// Базовое уведомление
export const Default: Story = {
  args: {
    title: 'Базовое уведомление',
    message: 'Это базовое уведомление с возможностью закрытия',
  },
  render: (args) => <DefaultNotification {...args} />,
};

// Компонент-обертка для Info story
function InfoNotification(args: typeof meta.args = {}) {
  const [isVisible, setIsVisible] = useState(true);
  if (!isVisible) return <div>Уведомление закрыто</div>;
  return (
    <Notification
      id={args.id || 'info-1'}
      message={args.message || 'Информационное сообщение для пользователя'}
      {...args}
      onClose={() => setIsVisible(false)}
    />
  );
}

// Информационное уведомление
export const Info: Story = {
  args: {
    title: 'Информация',
    message: 'Информационное сообщение для пользователя',
    type: 'info',
  },
  render: (args) => <InfoNotification {...args} />,
};

// Компонент-обертка для Success story
function SuccessNotification(args: typeof meta.args = {}) {
  const [isVisible, setIsVisible] = useState(true);
  if (!isVisible) return <div>Уведомление закрыто</div>;
  return (
    <Notification
      id={args.id || 'success-1'}
      message={args.message || 'Операция выполнена успешно! Все данные сохранены.'}
      {...args}
      onClose={() => setIsVisible(false)}
    />
  );
}

// Успешное уведомление
export const Success: Story = {
  args: {
    title: 'Успех',
    message: 'Операция выполнена успешно! Все данные сохранены.',
    type: 'success',
  },
  render: (args) => <SuccessNotification {...args} />,
};

// Компонент-обертка для Warning story
function WarningNotification(args: typeof meta.args = {}) {
  const [isVisible, setIsVisible] = useState(true);
  if (!isVisible) return <div>Уведомление закрыто</div>;
  return (
    <Notification
      id={args.id || 'warning-1'}
      message={args.message || 'Обратите внимание на это сообщение. Проверьте введенные данные.'}
      {...args}
      onClose={() => setIsVisible(false)}
    />
  );
}

// Предупреждение
export const Warning: Story = {
  args: {
    title: 'Предупреждение',
    message: 'Обратите внимание на это сообщение. Проверьте введенные данные.',
    type: 'warning',
  },
  render: (args) => <WarningNotification {...args} />,
};

// Компонент-обертка для Error story
function ErrorNotification(args: typeof meta.args = {}) {
  const [isVisible, setIsVisible] = useState(true);
  if (!isVisible) return <div>Уведомление закрыто</div>;
  return (
    <Notification
      id={args.id || 'error-1'}
      message={args.message || 'Произошла ошибка при выполнении операции. Попробуйте еще раз.'}
      {...args}
      onClose={() => setIsVisible(false)}
    />
  );
}

// Ошибка
export const Error: Story = {
  args: {
    title: 'Ошибка',
    message: 'Произошла ошибка при выполнении операции. Попробуйте еще раз.',
    type: 'error',
  },
  render: (args) => <ErrorNotification {...args} />,
};

// Компонент-обертка для WithoutTitle story
function WithoutTitleNotification(args: typeof meta.args = {}) {
  const [isVisible, setIsVisible] = useState(true);
  if (!isVisible) return <div>Уведомление закрыто</div>;
  return (
    <Notification
      id={args.id || 'notification-1'}
      message={args.message || 'Уведомление без заголовка с длинным текстом сообщения, которое может занимать несколько строк.'}
      {...args}
      onClose={() => setIsVisible(false)}
    />
  );
}

// Без заголовка
export const WithoutTitle: Story = {
  args: {
    message:
      'Уведомление без заголовка с длинным текстом сообщения, которое может занимать несколько строк.',
  },
  render: (args) => <WithoutTitleNotification {...args} />,
};

// Компонент-обертка для LongMessage story
function LongMessageNotification(args: typeof meta.args = {}) {
  const [isVisible, setIsVisible] = useState(true);
  if (!isVisible) return <div>Уведомление закрыто</div>;
  return (
    <Notification
      id={args.id || 'notification-1'}
      message={args.message || 'Это уведомление содержит очень длинный текст, который демонстрирует, как компонент обрабатывает многострочные сообщения. Текст может быть достаточно объемным и должен корректно отображаться с переносом строк.'}
      {...args}
      onClose={() => setIsVisible(false)}
    />
  );
}

// Длинный текст
export const LongMessage: Story = {
  args: {
    title: 'Длинное уведомление',
    message:
      'Это уведомление содержит очень длинный текст, который демонстрирует, как компонент обрабатывает многострочные сообщения. Текст может быть достаточно объемным и должен корректно отображаться с переносом строк.',
  },
  render: (args) => <LongMessageNotification {...args} />,
};

// Компонент-обертка для NoAutoClose story
function NoAutoCloseNotification(args: typeof meta.args = {}) {
  const [isVisible, setIsVisible] = useState(true);
  if (!isVisible) return <div>Уведомление закрыто</div>;
  return (
    <Notification
      id={args.id || 'notification-1'}
      message={args.message || 'Это уведомление не закроется автоматически'}
      {...args}
      onClose={() => setIsVisible(false)}
    />
  );
}

// Без автоматического закрытия
export const NoAutoClose: Story = {
  args: {
    title: 'Постоянное уведомление',
    message: 'Это уведомление не закроется автоматически',
    autoClose: false,
    duration: 0,
  },
  render: (args) => <NoAutoCloseNotification {...args} />,
};

// Компонент-обертка для QuickAutoClose story
function QuickAutoCloseNotification(args: typeof meta.args = {}) {
  const [isVisible, setIsVisible] = useState(true);
  if (!isVisible) return <div>Уведомление закрыто</div>;
  return (
    <Notification
      id={args.id || 'notification-1'}
      message={args.message || 'Это уведомление закроется через 3 секунды'}
      {...args}
      onClose={() => setIsVisible(false)}
    />
  );
}

// Быстрое автоматическое закрытие
export const QuickAutoClose: Story = {
  args: {
    title: 'Быстрое закрытие',
    message: 'Это уведомление закроется через 3 секунды',
    duration: 3000,
  },
  render: (args) => <QuickAutoCloseNotification {...args} />,
};

// Компонент-обертка для NoCloseButton story
function NoCloseButtonNotification(args: typeof meta.args = {}) {
  const [isVisible, setIsVisible] = useState(true);
  if (!isVisible) return <div>Уведомление закрыто</div>;
  return (
    <Notification
      id={args.id || 'notification-1'}
      message={args.message || 'Это уведомление можно закрыть только автоматически'}
      {...args}
      onClose={() => setIsVisible(false)}
    />
  );
}

// Без кнопки закрытия
export const NoCloseButton: Story = {
  args: {
    title: 'Без кнопки закрытия',
    message: 'Это уведомление можно закрыть только автоматически',
    closable: false,
  },
  render: (args) => <NoCloseButtonNotification {...args} />,
};

// Компонент-обертка для AllTypes story
function AllTypesNotifications() {
  const [notifications, setNotifications] = useState({
    info: true,
    success: true,
    warning: true,
    error: true,
  });

  return (
    <div className="flex flex-col gap-4 w-[480px]">
      {notifications.info && (
        <Notification
          id="info-1"
          title="Информация"
          message="Информационное сообщение"
          type="info"
          onClose={() => setNotifications((prev) => ({ ...prev, info: false }))}
        />
      )}
      {notifications.success && (
        <Notification
          id="success-1"
          title="Успех"
          message="Операция выполнена успешно"
          type="success"
          onClose={() => setNotifications((prev) => ({ ...prev, success: false }))}
        />
      )}
      {notifications.warning && (
        <Notification
          id="warning-1"
          title="Предупреждение"
          message="Обратите внимание на это сообщение"
          type="warning"
          onClose={() => setNotifications((prev) => ({ ...prev, warning: false }))}
        />
      )}
      {notifications.error && (
        <Notification
          id="error-1"
          title="Ошибка"
          message="Произошла ошибка при выполнении операции"
          type="error"
          onClose={() => setNotifications((prev) => ({ ...prev, error: false }))}
        />
      )}
    </div>
  );
}

// Все типы уведомлений
export const AllTypes: Story = {
  render: () => <AllTypesNotifications />,
};
