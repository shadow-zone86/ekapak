# Typography Components

Набор типографических компонентов согласно дизайн-системе EKAPAK (шрифт Manrope).

## Использование

```tsx
import { 
  H1, H2, H3, 
  PTextBold, PText, PTextCatalog,
  Price, Description 
} from '@/shared/ui/typography';

// Заголовки
<H1>Главный заголовок</H1>
<H2>Заголовок раздела</H2>
<H3>Подзаголовок</H3>

// Тексты
<PTextBold>Жирный текст</PTextBold>
<PText>Обычный текст</PText>
<PTextCatalog>Текст для каталога</PTextCatalog>

// Специальные
<Price>1 234 ₽</Price>
<Description>Описание или подсказка</Description>
```

## Компоненты

### Заголовки

#### H1
- **Шрифт**: Manrope Bold
- **Размер**: 40px
- **Высота строки**: 130%
- **Использование**: Главные заголовки страниц

#### H2
- **Шрифт**: Manrope Bold
- **Размер**: 30px
- **Высота строки**: 130%
- **Использование**: Заголовки крупных разделов

#### H3
- **Шрифт**: Manrope Bold
- **Размер**: 24px
- **Высота строки**: 140%
- **Использование**: Заголовки подразделов

### Параграфы

#### PTextBold
- **Шрифт**: Manrope Bold
- **Размер**: 18px
- **Высота строки**: 140%
- **Использование**: Акцентированный текст

#### PText
- **Шрифт**: Manrope Regular
- **Размер**: 18px
- **Высота строки**: 140%
- **Использование**: Основной текст страниц

#### PTextCatalog
- **Шрифт**: Manrope Regular
- **Размер**: 18px
- **Высота строки**: 140%
- **Использование**: Описания в каталоге товаров

### Специальные

#### Price
- **Шрифт**: Manrope Bold
- **Размер**: 14px
- **Высота строки**: 140%
- **Использование**: Отображение цен
- **Цвет**: По умолчанию черный, можно переопределить

#### Description
- **Шрифт**: Manrope Regular
- **Размер**: 14px
- **Высота строки**: 140%
- **Использование**: Описания, подсказки, дополнительная информация
- **Цвет**: По умолчанию серый (#9A9A9A), можно переопределить

## Props

Все компоненты принимают стандартные props:

```tsx
interface TypographyProps {
  children: ReactNode;
  className?: string; // Дополнительные CSS классы
}
```

## Примеры

```tsx
// Заголовок страницы
<H1>Каталог товаров</H1>
<PText>Выберите товар из каталога</PText>

// Карточка товара
<H3>Название товара</H3>
<PTextCatalog>Описание товара</PTextCatalog>
<div className="flex items-baseline gap-2">
  <Price className="text-blue-600">1 999 ₽</Price>
  <Description>за единицу</Description>
</div>

// С кастомными стилями
<H1 className="text-center mb-8">Заголовок</H1>
<Description className="text-black">Черное описание</Description>
<Price className="text-red-600 line-through">Старая цена</Price>
```

## Переопределение цветов

Все компоненты поддерживают переопределение цветов через `className`:

```tsx
<H1 className="text-blue-600">Синий заголовок</H1>
<Price className="text-green-600">Зеленая цена</Price>
<Description className="text-black">Черное описание</Description>
```
