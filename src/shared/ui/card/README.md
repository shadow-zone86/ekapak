# Card Component

Универсальный компонент карточки для использования в проекте.

## Использование

```tsx
import { Card, CardHeader, CardBody, CardFooter } from '@/shared/ui/card';

// Простая карточка
<Card>
  <CardBody>
    <p>Контент карточки</p>
  </CardBody>
</Card>

// Карточка с header и footer
<Card>
  <CardHeader>
    <h3>Заголовок</h3>
  </CardHeader>
  <CardBody>
    <p>Основной контент</p>
  </CardBody>
  <CardFooter>
    <button>Действие</button>
  </CardFooter>
</Card>
```

## Props

### Card

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `variant` | `'default' \| 'outlined' \| 'elevated'` | `'default'` | Вариант стиля карточки |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Размер отступов |
| `hover` | `boolean` | `false` | Включить эффект при наведении |
| `className` | `string` | - | Дополнительные CSS классы |
| `children` | `ReactNode` | - | Содержимое карточки |

### CardHeader

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `className` | `string` | - | Дополнительные CSS классы |
| `children` | `ReactNode` | - | Содержимое заголовка |

### CardBody

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `className` | `string` | - | Дополнительные CSS классы |
| `children` | `ReactNode` | - | Содержимое тела карточки |

### CardFooter

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `className` | `string` | - | Дополнительные CSS классы |
| `children` | `ReactNode` | - | Содержимое футера |

## Варианты

### Default

Стандартная карточка с границей и тенью:

```tsx
<Card variant="default">
  <CardBody>Контент</CardBody>
</Card>
```

### Outlined

Карточка только с границей, без тени:

```tsx
<Card variant="outlined">
  <CardBody>Контент</CardBody>
</Card>
```

### Elevated

Карточка с более выраженной тенью:

```tsx
<Card variant="elevated">
  <CardBody>Контент</CardBody>
</Card>
```

## Размеры

- `sm` - маленький отступ (12px)
- `md` - средний отступ (16px) - по умолчанию
- `lg` - большой отступ (24px)

```tsx
<Card size="sm">Маленькая карточка</Card>
<Card size="md">Средняя карточка</Card>
<Card size="lg">Большая карточка</Card>
```

## Hover эффект

Включите эффект при наведении:

```tsx
<Card hover>
  <CardBody>Карточка с hover эффектом</CardBody>
</Card>
```

## Примеры

### Карточка продукта

```tsx
<Card variant="default" hover className="flex flex-col">
  <div className="aspect-square bg-background">
    <Image src="/product.jpg" alt="Product" />
  </div>
  <CardBody>
    <h3>Название продукта</h3>
    <Price>1 250 ₽</Price>
  </CardBody>
  <CardFooter>
    <Button>В корзину</Button>
  </CardFooter>
</Card>
```

### Карточка с header

```tsx
<Card>
  <CardHeader>
    <H3>Заголовок</H3>
  </CardHeader>
  <CardBody>
    <PText>Описание</PText>
  </CardBody>
</Card>
```

### Кастомная карточка

```tsx
<Card 
  variant="elevated" 
  size="lg" 
  hover
  className="max-w-md mx-auto"
>
  <CardBody>
    Кастомный контент
  </CardBody>
</Card>
```

## Композиция

Компоненты CardHeader, CardBody и CardFooter автоматически добавляют отступы и границы. Если вам нужна кастомная композиция, можете использовать Card без подкомпонентов:

```tsx
<Card>
  <div className="p-4">
    Кастомная структура
  </div>
</Card>
```
