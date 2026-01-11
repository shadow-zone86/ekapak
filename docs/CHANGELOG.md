# Changelog

Все значимые изменения в проекте будут документироваться в этом файле.

Формат основан на [Keep a Changelog](https://keepachangelog.com/ru/1.0.0/),
и этот проект придерживается [Semantic Versioning](https://semver.org/lang/ru/).

## [Unreleased]

### Added
- **Cart functionality**: Реализована функциональность корзины покупок
  - Страница корзины (`/cart`) с отображением товаров
  - Виджет `cart-item` для отображения товара в корзине
  - Виджет `order-summary` для отображения сводки заказа
  - Entity `cart-item-view` с поддержкой slots для композиции
  - Feature `remove-from-cart` для удаления товаров из корзины
  - Redux slice `cartState` для управления состоянием корзины
  - Интеграция с `product-quantity` для управления количеством товаров

- **Favorites functionality**: Реализована функциональность избранного
  - Страница избранного (`/favorites`) с отображением товаров
  - Виджет `favorites-catalog` для отображения каталога избранных товаров
  - Feature `toggle-favorite` для добавления/удаления товаров из избранного
  - Redux slice `favoritesState` для управления состоянием избранного
  - Интеграция с бейджами в header и мобильном меню

- **Product quantity controls**: Реализованы контролы количества товаров
  - Feature `product-quantity` с контекстом для управления количеством
  - Компонент `ProductQuantityControls` с поддержкой рамки через проп `withBorder`
  - Интеграция в карточки товаров и корзину

- **Notifications system**: Реализована система уведомлений
  - Компонент `Notification` и `NotificationProvider`
  - Hook `useNotification` для управления уведомлениями
  - Уведомления при добавлении в корзину и избранное
  - Storybook stories и документация для компонентов уведомлений

- **Shared components**: Добавлены переиспользуемые компоненты
  - `CardAvailability` - отображение статуса наличия товара
  - `CardPrice` - отображение цены товара
  - `CardTitle` - отображение названия товара
  - `CardImage` - отображение изображения товара
  - `Tooltip` - всплывающая подсказка
  - Все компоненты покрыты Storybook stories и документацией

- **Mobile responsiveness**: Адаптивная верстка
  - Адаптивная верстка для `cart-item-view`
  - Адаптивная верстка для мобильного меню
  - Поддержка различных размеров экранов во всех основных компонентах

- **Testing**: Расширенное тестовое покрытие
  - Тесты для `useRemoveFromCart`
  - Тесты для `useProductQuantity` и `useProductQuantityContext`
  - Тесты для `useToggleFavorite`
  - Тесты для `useCategoryFilter` и `findCategoryName`
  - Тесты для `cartState` и `favoritesState`

- **Documentation**: Обновлена документация
  - Переименован файл `07-api-guide.md` → `05-api-guide.md`
  - Обновлены все ссылки на документацию
  - Добавлена документация для новых компонентов

### Changed
- **FSD Architecture**: Рефакторинг для соответствия принципам FSD
  - Перемещение бизнес-логики из entities в features
  - Использование slots для композиции компонентов
  - Разделение ответственности между слоями
  - Улучшена структура зависимостей между слоями

- **Product card refactoring**: Рефакторинг карточки товара
  - Разделение на `ProductCardView` (entity) и features
  - Использование slots для передачи features
  - Централизация сборки в `products-catalog` widget

- **Cart item refactoring**: Рефакторинг элемента корзины
  - Использование slots в `CartItemView`
  - Разделение на отдельные features (`remove-from-cart`, `toggle-favorite`)
  - Улучшенная структура компонента

- **State management**: Улучшение управления состоянием
  - Удалено использование `localStorage` из Redux slices
  - Упрощена логика состояния
  - Переименованы `slice.ts` → `cartState.ts` и `favoritesState.ts`

### Fixed
- Исправлены ошибки линтера
- Исправлены ошибки TypeScript
- Исправлены проблемы с гидратацией
- Исправлены ошибки в тестах

## [0.1.0] - 2024-01-11

### Added
- Базовая структура проекта на Next.js
- Feature-Sliced Design архитектура
- Интеграция с API для получения товаров и категорий
- Система роутинга
- Базовые компоненты UI
- Redux store для управления состоянием
- React Query для управления данными
- Dependency Injection контейнер
- Система тестирования (Jest)
- Storybook для документирования компонентов
