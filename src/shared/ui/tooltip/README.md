# Tooltip Component

Компонент всплывающей подсказки, который отображается при наведении на элемент.

## Использование

```tsx
import { Tooltip } from '@/shared/ui/tooltip';

// Базовое использование
<Tooltip text="Текст подсказки">
  <button>Наведи на меня</button>
</Tooltip>

// С иконкой
<Tooltip text="С НДС 20%">
  <button aria-label="Информация о НДС">
    <span>*</span>
  </button>
</Tooltip>
```

## Props

### TooltipProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactElement` | - | Элемент, при наведении на который показывается tooltip |
| `text` | `string` | - | Текст tooltip |
| `className` | `string` | - | Дополнительные CSS классы для обертки |

## Особенности

- **Fixed позиционирование** - tooltip не обрезается границами родительского контейнера
- **Автоматическое позиционирование** - рассчитывается через `getBoundingClientRect`
- **Белый фон** - белый фон с черным текстом и серой границей
- **Стрелка** - автоматически добавляется стрелка, указывающая на элемент
- **Z-index** - высокий z-index (50) для отображения поверх других элементов

## Примеры

```tsx
// С кнопкой
<Tooltip text="Нажми для отправки">
  <Button>Отправить</Button>
</Tooltip>

// С иконкой информации
<Tooltip text="С НДС 20%">
  <button className="w-[13px] h-[13px] rounded-full">
    <span>*</span>
  </button>
</Tooltip>

// С вопросом
<Tooltip text="Узнать подробности о наличии товара">
  <button className="w-3.5 h-3.5 rounded-full">
    <span>?</span>
  </button>
</Tooltip>
```

## Стилизация

Tooltip использует следующие стили:
- Фон: белый (`bg-white`)
- Текст: черный (`text-black`)
- Граница: серая (`border-stroke`)
- Тень: `shadow-lg`
- Скругление: `rounded`
- Размер текста: `text-xs`
- Padding: `px-2 py-1.5`

## Технические детали

- Компонент использует `fixed` позиционирование для предотвращения обрезки
- Позиция рассчитывается динамически через `getBoundingClientRect`
- Tooltip появляется при `onMouseEnter` и скрывается при `onMouseLeave`
- Использует `pointer-events-none` для предотвращения блокировки взаимодействия с элементами под tooltip
