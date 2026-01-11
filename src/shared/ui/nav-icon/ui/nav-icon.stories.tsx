import type { Meta, StoryObj } from '@storybook/react';
import { NavIcon } from './nav-icon';

const meta = {
  title: 'Shared/UI/NavIcon',
  component: NavIcon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: 'text',
      description: 'Путь к SVG иконке (например, /cart.svg)',
    },
    label: {
      control: 'text',
      description: 'Текст метки для иконки',
    },
    href: {
      control: 'text',
      description: 'URL для ссылки (опционально)',
    },
    className: {
      control: 'text',
      description: 'Дополнительные CSS классы',
    },
    onClick: {
      action: 'clicked',
      description: 'Обработчик клика',
    },
  },
} satisfies Meta<typeof NavIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Cart: Story = {
  args: {
    icon: '/cart.svg',
    label: 'Корзина',
  },
};

export const Favorites: Story = {
  args: {
    icon: '/favorites.svg',
    label: 'Избранное',
  },
};

export const Profile: Story = {
  args: {
    icon: '/profile.svg',
    label: 'Профиль',
  },
};

export const Search: Story = {
  args: {
    icon: '/search.svg',
    label: 'Поиск',
  },
};

export const Location: Story = {
  args: {
    icon: '/location.svg',
    label: 'Местоположение',
  },
};

export const Phone: Story = {
  args: {
    icon: '/phone.svg',
    label: 'Телефон',
  },
};

export const Mail: Story = {
  args: {
    icon: '/mail.svg',
    label: 'Email',
  },
};

export const Telegram: Story = {
  args: {
    icon: '/telegram.svg',
    label: 'Telegram',
  },
};

export const WhatsApp: Story = {
  args: {
    icon: '/whatsapp.svg',
    label: 'WhatsApp',
  },
};

export const Globe: Story = {
  args: {
    icon: '/globe.svg',
    label: 'Язык',
  },
};

export const WithHref: Story = {
  args: {
    icon: '/cart.svg',
    label: 'Корзина',
    href: '/cart',
  },
};

export const WithClickHandler: Story = {
  args: {
    icon: '/cart.svg',
    label: 'Корзина',
    onClick: () => console.log('Icon clicked'),
  },
};

export const WithBadge: Story = {
  args: {
    icon: '/cart.svg',
    label: 'Корзина',
    badge: 3,
  },
};
