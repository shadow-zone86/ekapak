# Modal Component

Универсальный компонент модального окна с поддержкой overlay, закрытия по Escape и клику вне окна.

## Использование

```tsx
import { Modal } from '@/shared/ui/modal';
import { Button } from '@/shared/ui/button';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Открыть</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Заголовок">
        Содержимое модального окна
      </Modal>
    </>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | - | Состояние открытия модального окна |
| `onClose` | `() => void` | - | Функция закрытия модального окна |
| `title` | `string` | - | Заголовок модального окна (опционально, если указан, отображается с кнопкой закрытия) |
| `children` | `ReactNode` | - | Содержимое модального окна |
| `className` | `string` | - | Дополнительные CSS классы для модального окна |
| `closeOnOverlayClick` | `boolean` | `true` | Закрывать при клике на overlay |
| `closeOnEscape` | `boolean` | `true` | Закрывать при нажатии Escape |

## Особенности

- **Portal рендеринг** - модальное окно рендерится через `createPortal` в `document.body`
- **Блокировка скролла** - при открытом модальном окне блокируется скролл body
- **Закрытие по Escape** - автоматическое закрытие при нажатии Escape (можно отключить)
- **Закрытие по клику вне окна** - закрытие при клике на overlay (можно отключить)
- **Overlay** - полупрозрачный фон с затемнением
- **Адаптивность** - модальное окно адаптируется под размер экрана (padding на мобильных)
- **Автоматические отступы** - контент имеет padding 24px (p-6)

## Примеры

### Базовое использование с заголовком

```tsx
<Modal isOpen={isOpen} onClose={handleClose} title="Подтверждение">
  <PText>Вы уверены, что хотите выполнить это действие?</PText>
</Modal>
```

### Без заголовка

```tsx
<Modal isOpen={isOpen} onClose={handleClose}>
  <PText>Текст информации без заголовка</PText>
</Modal>
```

### С формой

```tsx
<Modal isOpen={isOpen} onClose={handleClose} title="Редактировать">
  <form className="space-y-4">
    <input type="text" placeholder="Имя" />
    <div className="flex gap-3 justify-end">
      <Button variant="outline" onClick={handleClose}>Отмена</Button>
      <Button variant="primary" onClick={handleSubmit}>Сохранить</Button>
    </div>
  </form>
</Modal>
```

### Отключение закрытия по клику вне окна

```tsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Важное окно"
  closeOnOverlayClick={false}
>
  <PText>Это окно можно закрыть только через кнопку закрытия или Escape</PText>
</Modal>
```
