import type { Meta, StoryObj } from '@storybook/react';
import { Logo } from './logo';

const meta = {
  title: 'Shared/UI/Logo',
  component: Logo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Дополнительные CSS классы',
    },
  },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithCustomClass: Story = {
  args: {
    className: 'w-32 h-32',
  },
};

export const Small: Story = {
  args: {
    className: 'w-16 h-16',
  },
};

export const Large: Story = {
  args: {
    className: 'w-48 h-48',
  },
};
