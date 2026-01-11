# Button Component

Универсальный компонент кнопки с поддержкой различных вариантов и размеров.

## Использование

```tsx
import { Button } from '@/shared/ui/button';

// Primary кнопка
<Button variant="primary">Нажми меня</Button>

// Secondary кнопка
<Button variant="secondary">Вторичная</Button>

// Outline кнопка
<Button variant="outline">Обведенная</Button>

// Размеры
<Button size="sm">Маленькая</Button>
<Button size="md">Средняя</Button>
<Button size="lg">Большая</Button>

// Disabled
<Button disabled>Отключена</Button>
```

## Props

### ButtonProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'outline'` | `'primary'` | Вариант стиля кнопки |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Размер кнопки |
| `disabled` | `boolean` | `false` | Отключено ли состояние |
| `className` | `string` | - | Дополнительные CSS классы |
| `...props` | `ButtonHTMLAttributes` | - | Все стандартные HTML атрибуты кнопки |

## Варианты

- **primary** - Основная кнопка (синяя, белый текст)
- **secondary** - Вторичная кнопка (серая, черный текст)
- **outline** - Обведенная кнопка (прозрачная, с рамкой)

## Размеры

- **sm** - Маленькая (h-8, px-3, text-sm)
- **md** - Средняя (h-10, px-4, text-base)
- **lg** - Большая (h-12, px-6, text-lg)

## Примеры

```tsx
// Полный пример
<Button 
  variant="primary" 
  size="lg" 
  onClick={() => console.log('Clicked')}
>
  Отправить
</Button>

// С обработчиком
<Button 
  variant="primary"
  onClick={handleSubmit}
  disabled={isLoading}
>
  {isLoading ? 'Загрузка...' : 'Отправить'}
</Button>
```
