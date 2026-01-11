import type { Meta, StoryObj } from '@storybook/react';
import {
  H1,
  H2,
  H3,
  PTextBold,
  PText,
  PTextCatalog,
  Price,
  Description,
} from './typography';

const meta = {
  title: 'Shared/UI/Typography',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Headings: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <H1>Заголовок H1 - MANROPE BOLD 40/130%</H1>
        <Description className="mt-2">Самый крупный заголовок для главных разделов</Description>
      </div>
      <div>
        <H2>Заголовок H2 - MANROPE BOLD 30/130%</H2>
        <Description className="mt-2">Заголовок второго уровня</Description>
      </div>
      <div>
        <H3>Заголовок H3 - MANROPE BOLD 24/140%</H3>
        <Description className="mt-2">Заголовок третьего уровня</Description>
      </div>
    </div>
  ),
};

export const Paragraphs: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-2xl">
      <div>
        <PTextBold>Жирный текст - MANROPE BOLD 18/140%</PTextBold>
        <PText className="mt-2">
          Обычный текст - MANROPE REGULAR 18/140%. Используется для основного содержимого страницы.
          Поддерживает многострочный текст и может содержать любой контент.
        </PText>
        <PTextCatalog className="mt-2">
          Текст каталога - MANROPE REGULAR 18/140%. Используется для описания товаров в каталоге.
        </PTextCatalog>
      </div>
    </div>
  ),
};

export const PriceComponent: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline gap-2">
        <Price>1 234 ₽</Price>
        <Description>за единицу</Description>
      </div>
      <div className="flex items-baseline gap-2">
        <Price className="text-blue-600">999 ₽</Price>
        <Description>специальная цена</Description>
      </div>
      <div className="flex items-baseline gap-2">
        <Price className="text-gray">2 500 ₽</Price>
        <Description>старая цена</Description>
      </div>
    </div>
  ),
};

export const DescriptionComponent: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-2xl">
      <Description>
        Описание - MANROPE REGULAR 14/140%. По умолчанию серый цвет. Используется для
        дополнительной информации, подсказок и описаний.
      </Description>
      <Description className="text-black">
        Описание с черным цветом - можно переопределить через className
      </Description>
      <Description className="text-blue-600">
        Описание с синим цветом - для акцентов
      </Description>
    </div>
  ),
};

export const AllComponents: Story = {
  render: () => (
    <div className="flex flex-col gap-8 max-w-3xl">
      <section>
        <H1>Полный набор типографики</H1>
        <Description className="mt-2">Демонстрация всех компонентов типографики EKAPAK</Description>
      </section>

      <section>
        <H2>Заголовки</H2>
        <H3>Подзаголовок</H3>
        <PText className="mt-2">
          Основной текст для описания содержимого. Может быть любой длины и содержать
          несколько абзацев. Используется для основного контента страницы.
        </PText>
      </section>

      <section>
        <H3>Тексты</H3>
        <PTextBold className="mt-2">Жирный текст для акцентов</PTextBold>
        <PText className="mt-2">Обычный текст для контента</PText>
        <PTextCatalog className="mt-2">Текст для каталога товаров</PTextCatalog>
      </section>

      <section>
        <H3>Цены</H3>
        <div className="flex items-baseline gap-4 mt-2">
          <Price>1 234 ₽</Price>
          <Price className="text-blue-600">999 ₽</Price>
          <Price className="text-gray line-through">2 500 ₽</Price>
        </div>
      </section>

      <section>
        <H3>Описания</H3>
        <Description className="mt-2">
          Стандартное описание с серым цветом
        </Description>
        <Description className="mt-2 text-black">
          Описание с черным цветом
        </Description>
      </section>
    </div>
  ),
};

export const InCard: Story = {
  render: () => (
    <div className="w-full max-w-md p-6 bg-white border border-stroke rounded-lg">
      <H3>Название товара</H3>
      <PTextCatalog className="mt-2">Описание товара в каталоге</PTextCatalog>
      <div className="flex items-baseline gap-2 mt-4">
        <Price className="text-blue-600">1 999 ₽</Price>
        <Description>за единицу</Description>
      </div>
      <Description className="mt-2">Артикул: 12345</Description>
    </div>
  ),
};
