import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumbs } from './breadcrumbs';

const meta = {
  title: 'Shared/UI/Breadcrumbs',
  component: Breadcrumbs,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    items: {
      control: 'object',
      description: 'Массив элементов хлебных крошек',
    },
  },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { label: 'Главная', href: '/' },
      { label: 'Корзина', active: true },
    ],
  },
};

export const ThreeLevels: Story = {
  args: {
    items: [
      { label: 'Главная', href: '/' },
      { label: 'Категория', href: '/category' },
      { label: 'Товар', active: true },
    ],
  },
};

export const FourLevels: Story = {
  args: {
    items: [
      { label: 'Главная', href: '/' },
      { label: 'Категория 1', href: '/category1' },
      { label: 'Категория 2', href: '/category2' },
      { label: 'Подкатегория', active: true },
    ],
  },
};

export const SingleItem: Story = {
  args: {
    items: [{ label: 'Главная', active: true }],
  },
};

export const AllLinks: Story = {
  args: {
    items: [
      { label: 'Главная', href: '/' },
      { label: 'Категория', href: '/category' },
      { label: 'Товар', href: '/product' },
    ],
  },
};