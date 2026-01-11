# NavIcon

Компонент для отображения иконок навигации и действий.

## Описание

`NavIcon` - это универсальный компонент для отображения SVG иконок. Поддерживает различные типы иконок (корзина, избранное, профиль, поиск и др.) и позволяет кастомизировать размер и стили.

## Использование

```tsx
import { NavIcon } from '@/shared/ui/nav-icon';

export function Navigation() {
  return (
    <nav>
      <NavIcon icon="cart" onClick={() => openCart()} />
      <NavIcon icon="favorites" />
      <NavIcon icon="profile" />
    </nav>
  );
}
```

## Props

| Prop | Тип | Обязательный | По умолчанию | Описание |
|------|-----|--------------|--------------|----------|
| `icon` | `string` | Да | - | Путь к SVG иконке (например, `/cart.svg`) |
| `label` | `string` | Нет | `undefined` | Текст метки для иконки |
| `href` | `string` | Нет | `undefined` | URL для ссылки (если указан, иконка будет ссылкой) |
| `onClick` | `() => void` | Нет | `undefined` | Обработчик клика (используется, если `href` не указан) |
| `badge` | `number` | Нет | `undefined` | Число для отображения бейджа на иконке |
| `className` | `string` | Нет | `undefined` | Дополнительные CSS классы |
| `iconSize` | `number` | Нет | `24` | Размер иконки в пикселях |

## Доступные иконки

Иконки находятся в директории `/public/`:

- `/cart.svg` - Корзина покупок
- `/favorites.svg` - Избранное
- `/profile.svg` - Профиль пользователя
- `/search.svg` - Поиск
- `/location.svg` - Местоположение
- `/phone.svg` - Телефон
- `/mail.svg` - Электронная почта
- `/telegram.svg` - Telegram
- `/whatsapp.svg` - WhatsApp
- `/globe.svg` - Глобус/Язык

## Примеры

### Базовое использование

```tsx
<NavIcon icon="/cart.svg" label="Корзина" />
```

### С обработчиком клика

```tsx
<NavIcon 
  icon="/cart.svg" 
  label="Корзина"
  onClick={() => {
    console.log('Cart clicked');
    openCart();
  }} 
/>
```

### Как ссылка

```tsx
<NavIcon 
  icon="/profile.svg" 
  label="Профиль"
  href="/profile" 
/>
```

### С бейджем

```tsx
<NavIcon 
  icon="/cart.svg" 
  label="Корзина"
  badge={3}
  onClick={() => openCart()} 
/>
```

### Кастомный размер

```tsx
<NavIcon icon="/cart.svg" label="Корзина" className="w-8 h-8" />
```

### Кастомные стили

```tsx
<NavIcon 
  icon="/favorites.svg" 
  label="Избранное"
  className="text-red-500 hover:text-red-700 transition-colors" 
/>
```

### Все доступные иконки

```tsx
<div className="flex gap-4">
  <NavIcon icon="/cart.svg" label="Корзина" />
  <NavIcon icon="/favorites.svg" label="Избранное" />
  <NavIcon icon="/profile.svg" label="Профиль" />
  <NavIcon icon="/search.svg" label="Поиск" />
  <NavIcon icon="/location.svg" label="Местоположение" />
  <NavIcon icon="/phone.svg" label="Телефон" />
  <NavIcon icon="/mail.svg" label="Email" />
  <NavIcon icon="/telegram.svg" label="Telegram" />
  <NavIcon icon="/whatsapp.svg" label="WhatsApp" />
  <NavIcon icon="/globe.svg" label="Язык" />
</div>
```

## Технические детали

- Использует Next.js `Image` компонент для загрузки SVG иконок
- Иконки находятся в директории `/public/`
- Может работать как кнопка (с `onClick`) или как ссылка (с `href`)
- Поддерживает бейджи для отображения счетчиков (например, количество товаров в корзине)
- Адаптивный размер через Tailwind CSS классы
- Типизирован через TypeScript для безопасности типов

## Структура файлов

```
public/
├── cart.svg
├── favorites.svg
├── profile.svg
├── search.svg
├── location.svg
├── phone.svg
├── mail.svg
├── telegram.svg
├── whatsapp.svg
└── globe.svg
```

## Связанные компоненты

- `Logo` - логотип приложения
- `Button` - кнопки с иконками
- `NavigationBar` - панель навигации
