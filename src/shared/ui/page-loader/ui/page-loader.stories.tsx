import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';
import { Button } from '@/shared/ui/button';
import { PageLoader } from './page-loader';

const meta = {
  title: 'Shared/UI/PageLoader',
  component: PageLoader,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Компонент загрузки страницы с анимацией прогресса. Показывает логотип с эффектом закрашивания слева направо во время загрузки приложения.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PageLoader>;

export default meta;
type Story = StoryObj<typeof meta>;

// Компонент-обертка для демонстрации с возможностью перезапуска
function PageLoaderDemo() {
  const [key, setKey] = useState(0);

  return (
    <div className="relative">
      <PageLoader key={key} />
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100001]">
        <Button
          variant="primary"
          onClick={() => {
            setKey((prev) => prev + 1);
          }}
        >
          Перезапустить анимацию
        </Button>
      </div>
    </div>
  );
}

// Компонент для демонстрации состояния загрузки
function LoadingStateDemo() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Имитация загрузки
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative">
      {isLoading && <PageLoader />}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100001]">
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <p className="text-sm">
            {isLoading ? 'Загрузка...' : 'Загрузка завершена!'}
          </p>
        </div>
      </div>
    </div>
  );
}

// Компонент для ручного управления
function ManualControlDemo() {
  const [showLoader, setShowLoader] = useState(false);

  return (
    <div className="relative min-h-screen">
      {showLoader && <PageLoader />}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100001] flex flex-col gap-4 items-center">
        <Button
          variant="primary"
          onClick={() => {
            setShowLoader(true);
            setTimeout(() => {
              setShowLoader(false);
            }, 3000);
          }}
        >
          Показать загрузку (3 сек)
        </Button>
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <p className="text-sm text-center">
            {showLoader ? 'Загрузка активна...' : 'Нажмите кнопку для демонстрации'}
          </p>
        </div>
      </div>
    </div>
  );
}

export const Default: Story = {
  render: () => <PageLoader />,
  parameters: {
    docs: {
      description: {
        story: 'Базовое использование компонента. Спиннер автоматически показывается и скрывается после загрузки.',
      },
    },
  },
};

export const WithRestart: Story = {
  render: () => <PageLoaderDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Демонстрация с возможностью перезапуска анимации. Нажмите кнопку, чтобы увидеть анимацию заново.',
      },
    },
  },
};

export const LoadingState: Story = {
  render: () => <LoadingStateDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Демонстрация состояния загрузки. Спиннер автоматически скроется через 3 секунды.',
      },
    },
  },
};

export const ManualControl: Story = {
  render: () => <ManualControlDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Ручное управление отображением спиннера. Нажмите кнопку, чтобы показать загрузку на 3 секунды.',
      },
    },
  },
};
