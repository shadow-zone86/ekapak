import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { useState } from 'react';
import { Modal } from './modal';
import { Button } from '@/shared/ui/button';
import { PText } from '@/shared/ui/typography';

const meta = {
  title: 'Shared/UI/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
    },
    closeOnOverlayClick: {
      control: 'boolean',
    },
    closeOnEscape: {
      control: 'boolean',
    },
  },
  args: {
    onClose: fn(),
    closeOnOverlayClick: true,
    closeOnEscape: true,
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

interface ModalWrapperProps {
  isOpen: boolean;
  onClose?: () => void;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

function ModalWrapper({ isOpen: initialIsOpen, ...args }: ModalWrapperProps) {
  const [isOpen, setIsOpen] = useState(initialIsOpen);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Открыть модальное окно</Button>
      <Modal
        {...args}
        isOpen={isOpen}
        title="Заголовок модального окна"
        onClose={() => {
          setIsOpen(false);
          args.onClose?.();
        }}
      >
        <PText>Это содержимое модального окна. Вы можете закрыть его, нажав на кнопку закрытия, нажав Escape или кликнув вне окна.</PText>
      </Modal>
    </>
  );
}

export const Default: Story = {
  render: (args) => <ModalWrapper {...args} isOpen={false} />,
};

export const Open: Story = {
  render: (args) => (
    <Modal {...args} isOpen={true} title="Модальное окно открыто">
      <PText>Это модальное окно открыто по умолчанию.</PText>
    </Modal>
  ),
};

export const WithoutTitle: Story = {
  render: (args) => (
    <Modal {...args} isOpen={true}>
      <PText>Это модальное окно без заголовка. Вы можете закрыть его, нажав Escape или кликнув вне окна.</PText>
    </Modal>
  ),
};

export const WithForm: Story = {
  render: (args) => (
    <Modal {...args} isOpen={true} title="Форма">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Имя</label>
          <input
            type="text"
            className="w-full rounded-lg border border-stroke px-4 py-2"
            placeholder="Введите имя"
          />
        </div>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={args.onClose}>
            Отмена
          </Button>
          <Button variant="primary" onClick={args.onClose}>
            Сохранить
          </Button>
        </div>
      </div>
    </Modal>
  ),
};

export const WithoutCloseOnOverlay: Story = {
  render: (args) => (
    <Modal {...args} isOpen={true} title="Важное окно" closeOnOverlayClick={false}>
      <PText>Это окно можно закрыть только через кнопку закрытия или Escape</PText>
    </Modal>
  ),
};
