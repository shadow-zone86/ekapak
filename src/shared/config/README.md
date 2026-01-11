# Design System EKAPAK

## Цветовая палитра

Все цвета определены в `src/app/globals.css` и доступны через Tailwind CSS классы:

### Blue (Синий)
- `bg-blue-600`, `text-blue-600` - Основной синий: `#00B0FF`
- `bg-blue-active`, `text-blue-active` - Активный синий: `#43C5FF`
- `bg-blue-50` - Светлый синий фон для активных элементов

### Black (Черный)
- `bg-black`, `text-black` - Черный текст: `#2C2C2C`

### Gray (Серый)
- `bg-gray`, `text-gray` - Основной серый: `#9A9A9A`
- `bg-gray-50` - Светло-серый фон: `#F5F7FB` (background)
- `bg-gray-100`, `bg-gray-200`, `bg-gray-300` - Оттенки серого для UI элементов

### Stroke (Обводка)
- `border-stroke` - Цвет границ: `#D4D4D4`

### Background (Фон)
- `bg-background` - Основной фон приложения: `#F5F7FB`

### White (Белый)
- `bg-white`, `text-white` - Белый: `#FFFFFF`

## Использование

```tsx
// Основной синий цвет
<div className="bg-blue-600 text-white">Primary Button</div>

// Активный синий
<button className="hover:bg-blue-active">Hover</button>

// Черный текст
<h1 className="text-black">Заголовок</h1>

// Серый текст
<p className="text-gray">Описание</p>

// Границы
<div className="border border-stroke">Card</div>

// Фон
<main className="bg-background">Content</main>
```

## Расширенная палитра

Для совместимости с существующим кодом также доступны стандартные оттенки:
- `gray-50`, `gray-100`, `gray-200`, `gray-300`, `gray-400`, `gray-500`, `gray-600`, `gray-700`, `gray-900`
- `blue-50`, `blue-100`, `blue-700`

Эти цвета автоматически маппятся на нашу палитру.

---

## Типографика

Проект использует шрифт **Manrope** из Google Fonts.

### Доступные стили

Все стили определены в `src/app/globals.css` и доступны через CSS классы и React компоненты:

#### 1. H1 heading
- **Стиль**: MANROPE BOLD 40/130%
- **CSS класс**: `.h1`
- **React компонент**: `<H1>`

```tsx
import { H1 } from '@/shared/ui/typography';

<H1 className="text-black">Заголовок страницы</H1>
```

#### 2. H2 heading
- **Стиль**: MANROPE BOLD 30/130%
- **CSS класс**: `.h2`
- **React компонент**: `<H2>`

```tsx
import { H2 } from '@/shared/ui/typography';

<H2 className="text-black">Подзаголовок</H2>
```

#### 3. H3 heading
- **Стиль**: MANROPE BOLD 24/140%
- **CSS класс**: `.h3`
- **React компонент**: `<H3>`

```tsx
import { H3 } from '@/shared/ui/typography';

<H3 className="text-black">Заголовок секции</H3>
```

#### 4. P text bold
- **Стиль**: MANROPE BOLD 18/140%
- **CSS класс**: `.text-p-bold`
- **React компонент**: `<PTextBold>`

```tsx
import { PTextBold } from '@/shared/ui/typography';

<PTextBold>Жирный текст</PTextBold>
```

#### 5. P text
- **Стиль**: MANROPE REGULAR 18/140%
- **CSS класс**: `.text-p`
- **React компонент**: `<PText>`

```tsx
import { PText } from '@/shared/ui/typography';

<PText>Основной текст</PText>
```

#### 6. P text catalog
- **Стиль**: MANROPE REGULAR 18/140%
- **CSS класс**: `.text-p-catalog`
- **React компонент**: `<PTextCatalog>`

```tsx
import { PTextCatalog } from '@/shared/ui/typography';

<PTextCatalog>Текст для каталога</PTextCatalog>
```

#### 7. Price
- **Стиль**: MANROPE BOLD 14/140%
- **CSS класс**: `.text-price`
- **React компонент**: `<Price>`

```tsx
import { Price } from '@/shared/ui/typography';

<Price className="text-blue-600">1 250 ₽</Price>
```

#### 8. Description
- **Стиль**: MANROPE REGULAR 14/140%
- **CSS класс**: `.text-description`
- **React компонент**: `<Description>`

```tsx
import { Description } from '@/shared/ui/typography';

<Description className="text-gray">Описание товара</Description>
```

### Использование

Все компоненты типографики поддерживают стандартные Tailwind CSS классы для цветов и других стилей:

```tsx
import { H1, PText, Price } from '@/shared/ui/typography';

<H1 className="text-black mb-4">Заголовок</H1>
<PText className="text-gray-600">Текст описания</PText>
<Price className="text-blue-600">1 250 ₽</Price>
```

### CSS переменные

Все размеры шрифтов, высоты строк и веса определены через CSS переменные в `globals.css`:

```css
--font-size-h1: 40px;
--line-height-h1: 1.3;
--font-weight-h1: 700;
/* и т.д. */
```
