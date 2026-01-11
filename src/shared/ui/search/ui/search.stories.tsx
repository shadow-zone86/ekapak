import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { Search } from './search';

const meta = {
  title: 'Shared/UI/Search',
  component: Search,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
  },
  args: {
    onSearch: fn(),
  },
} satisfies Meta<typeof Search>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Поиск',
  },
};

export const WithValue: Story = {
  args: {
    placeholder: 'Поиск',
    defaultValue: 'Текст поиска',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Поиск',
    disabled: true,
  },
};

export const CustomPlaceholder: Story = {
  args: {
    placeholder: 'Введите название товара...',
  },
};

export const FullWidth: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <Search placeholder="Поиск по всему каталогу" />
    </div>
  ),
};

export const InCard: Story = {
  render: () => (
    <div className="w-full max-w-md p-4 bg-white border border-stroke rounded-lg">
      <Search placeholder="Поиск в карточке" />
    </div>
  ),
};
