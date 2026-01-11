import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from './tooltip';
import { Button } from '@/shared/ui/button';

const meta = {
  title: 'Shared/UI/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      description: 'Текст tooltip',
    },
    className: {
      control: 'text',
      description: 'Дополнительные CSS классы',
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: 'Это tooltip с текстом',
    children: <Button>Наведи на меня</Button>,
  },
};

export const WithLongText: Story = {
  args: {
    text: 'Это очень длинный текст tooltip, который может содержать много информации',
    children: <Button>Длинный tooltip</Button>,
  },
};

export const OnIcon: Story = {
  args: {
    text: 'С НДС 20%',
    children: (
      <button
        className="w-[13px] h-[13px] rounded-full flex items-center justify-center hover:bg-blue-50 transition-colors"
        aria-label="Информация о НДС"
      >
        <span className="text-[#00B0FF] text-xs">*</span>
      </button>
    ),
  },
};

export const OnQuestionIcon: Story = {
  args: {
    text: 'Узнать подробности о наличии товара',
    children: (
      <button
        className="w-3.5 h-3.5 rounded-full flex items-center justify-center hover:bg-gray-100"
        aria-label="Информация о наличии"
      >
        <span className="text-gray text-xs">?</span>
      </button>
    ),
  },
};

export const DifferentPositions: Story = {
  args: {
    text: 'Tooltip',
    children: <Button>Кнопка</Button>,
  },
  render: () => (
    <div className="flex flex-col gap-8 items-center p-8">
      <div className="flex gap-4">
        <Tooltip text="Tooltip сверху">
          <Button>Сверху</Button>
        </Tooltip>
      </div>
      <div className="flex gap-4">
        <Tooltip text="Tooltip слева">
          <Button>Слева</Button>
        </Tooltip>
        <Tooltip text="Tooltip справа">
          <Button>Справа</Button>
        </Tooltip>
      </div>
      <div className="flex gap-4">
        <Tooltip text="Tooltip снизу">
          <Button>Снизу</Button>
        </Tooltip>
      </div>
    </div>
  ),
};
