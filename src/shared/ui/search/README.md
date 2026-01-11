# Search Component

Компонент поиска с иконкой и поддержкой обработчиков.

## Использование

```tsx
import { Search } from '@/shared/ui/search';

// Базовое использование
<Search placeholder="Поиск" />

// С обработчиком поиска
<Search 
  placeholder="Поиск товаров" 
  onSearch={(value) => console.log(value)}
/>

// С предзаполненным значением
<Search 
  placeholder="Поиск" 
  defaultValue="Текст поиска"
/>

// Disabled состояние
<Search placeholder="Поиск" disabled />
```

## Props

### SearchProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `placeholder` | `string` | - | Плейсхолдер для поля ввода |
| `onSearch` | `(value: string) => void` | - | Callback при изменении значения |
| `disabled` | `boolean` | `false` | Отключено ли поле |
| `className` | `string` | - | Дополнительные CSS классы |
| `...props` | `InputHTMLAttributes` | - | Все стандартные HTML атрибуты input |

## Особенности

- Автоматически отображает иконку поиска слева
- Поддерживает все стандартные атрибуты HTML input
- Вызывает `onSearch` при каждом изменении значения
- Адаптивная ширина (flex-1 с max-w-lg)
- Стилизован согласно дизайн-системе EKAPAK

## Примеры

```tsx
// Поиск с обработкой
const [searchQuery, setSearchQuery] = useState('');

<Search 
  placeholder="Поиск товаров" 
  value={searchQuery}
  onSearch={setSearchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
/>

// Full width
<div className="w-full">
  <Search placeholder="Поиск по всему каталогу" />
</div>

// В контейнере
<div className="max-w-md">
  <Search placeholder="Поиск" />
</div>
```
