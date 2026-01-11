import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardBody, CardFooter } from './card';
import { H3, PText, Description } from '@/shared/ui/typography';

const meta = {
  title: 'Shared/UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outlined', 'elevated'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    hover: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'default',
    size: 'md',
    hover: false,
    children: (
      <div>
        <PText>Базовая карточка с содержимым</PText>
      </div>
    ),
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    size: 'md',
    children: (
      <div>
        <PText>Карточка с обводкой</PText>
      </div>
    ),
  },
};

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    size: 'md',
    children: (
      <div>
        <PText>Карточка с тенью</PText>
      </div>
    ),
  },
};

export const WithHover: Story = {
  args: {
    variant: 'default',
    size: 'md',
    hover: true,
    children: (
      <div>
        <PText>Карточка с эффектом наведения</PText>
      </div>
    ),
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <Card size="sm">
        <PText>Маленькая карточка (sm)</PText>
      </Card>
      <Card size="md">
        <PText>Средняя карточка (md)</PText>
      </Card>
      <Card size="lg">
        <PText>Большая карточка (lg)</PText>
      </Card>
    </div>
  ),
};

export const WithHeaderAndFooter: Story = {
  render: () => (
    <Card variant="default" size="md" className="w-full max-w-md">
      <CardHeader>
        <H3>Заголовок карточки</H3>
      </CardHeader>
      <CardBody>
        <PText>Основное содержимое карточки. Здесь может быть любой контент.</PText>
        <Description className="mt-2">Дополнительная информация</Description>
      </CardBody>
      <CardFooter>
        <PText>Футер карточки</PText>
      </CardFooter>
    </Card>
  ),
};

export const FullExample: Story = {
  render: () => (
    <Card variant="default" size="md" hover className="w-full max-w-md">
      <CardHeader>
        <H3>Пример полной карточки</H3>
      </CardHeader>
      <CardBody>
        <PText>Это пример карточки со всеми элементами: заголовком, телом и футером.</PText>
        <Description className="mt-2">Описание или дополнительная информация</Description>
      </CardBody>
      <CardFooter>
        <Description>Футер с дополнительными действиями</Description>
      </CardFooter>
    </Card>
  ),
};
