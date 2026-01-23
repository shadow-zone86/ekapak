# Changelog

Все значимые изменения в проекте будут документироваться в этом файле.

Формат основан на [Keep a Changelog](https://keepachangelog.com/ru/1.0.0/),
и этот проект придерживается [Semantic Versioning](https://semver.org/lang/ru/).

## [Unreleased]

### Added
- **Type-check command**: Добавлена команда для проверки типов TypeScript
  - Команда `npm run type-check` для проверки типов без генерации файлов
  - Используется в pre-commit hook для предотвращения коммитов с ошибками типов

- **Pre-commit hook enhancements**: Расширены проверки в pre-commit hook
  - Добавлена проверка типов TypeScript (`type-check`) перед коммитом
  - Добавлена проверка сборки проекта (`build`) перед коммитом
  - Сохранены существующие проверки: `lint-staged` (lint + тесты для измененных файлов)
  - Коммит блокируется, если любая проверка не проходит

- **Currency utility**: Добавлена утилита для работы с валютами
  - Функция `getCurrencySymbol` в `shared/lib/currency.ts` для централизованного преобразования кодов валют в символы
  - Преобразование `RUB` → `₽` вынесено в единое место
  - Покрыта тестами (32 теста, 100% покрытие)

- **Test coverage**: Расширено тестовое покрытие Redux slices и утилит
  - Тесты для `cartState` (33 теста, 100% покрытие)
  - Тесты для `profileState` (26 тестов, 100% покрытие)
  - Тесты для `currency.ts` (32 теста, 100% покрытие)
  - Все тесты проходят успешно (431 тест)

### Changed
- **Currency handling refactoring**: Рефакторинг обработки валют для устранения дублирования
  - Добавлено поле `currencySymbol` в тип `CartItem` для хранения символа валюты
  - Убраны дублирующие проверки `currency === 'RUB' ? '₽'` из UI компонентов
  - Компоненты `order-summary`, `cart-sidebar`, `cart-item` теперь используют `currencySymbol` из данных
  - Маппер `mapProductStoreToUi` использует утилиту `getCurrencySymbol` вместо локальной функции
  - Улучшена консистентность и поддерживаемость кода

- **Profile types refactoring**: Рефакторинг типов профиля
  - Типы `ProfilePersonalData`, `ProfileCompanyData`, `ProfileState` вынесены в `profile/model/types.ts`
  - Улучшена организация кода и переиспользуемость типов

- **State management structure**: Улучшена структура Redux slices
  - Redux slices перемещены в подпапку `store/` для лучшей организации
  - `cartState.ts` → `cart/model/store/cartState.ts`
  - `favoritesState.ts` → `favorites/model/store/favoritesState.ts`
  - `profileState.ts` → `profile/model/store/profileState.ts`
  - Обновлены импорты во всех тестах и компонентах

### Fixed
- Исправлены пути в тестах после рефакторинга структуры Redux slices
- Исправлены импорты в тестах `useAddToCart`, `useRemoveFromCart`, `useToggleFavorite`
- Исправлены ошибки TypeScript в тестах (типизация моков для `useAppSelector`, `useAppDispatch`, `useSearchParams`)
- Исправлены предупреждения линтера о неиспользуемых переменных в тестах

### Added (continued)
- **PageLoader component**: Добавлен компонент загрузки страницы с анимацией прогресса
  - Компонент `PageLoader` в `shared/ui/page-loader`
  - Анимация закрашивания логотипа слева направо (0% → 75% → 100%)
  - Автоматическое скрытие после полной загрузки страницы
  - Использует логотип из `/public/logo.svg`
  - Интегрирован в `app/layout.tsx` для отображения при загрузке приложения
  - Storybook stories и README документация

- **Order sample form refactoring**: Рефакторинг функциональности заказа образца
  - Логика валидации вынесена в `lib/validateOrderSampleForm.ts`
  - Хук управления формой `useOrderSampleForm` в `lib/useOrderSampleForm.ts`
  - Форма `OrderSampleForm` перемещена из `entities/orders` в `features/order-sample-form`
  - Состояние модального окна вынесено в `entities/orders/lib/useOrderSampleModal.ts`
  - Улучшена тестируемость и переиспользуемость компонентов

### Changed
- **Currency handling refactoring**: Рефакторинг обработки валют для устранения дублирования
  - Добавлено поле `currencySymbol` в тип `CartItem` для хранения символа валюты
  - Убраны дублирующие проверки `currency === 'RUB' ? '₽'` из UI компонентов
  - Компоненты `order-summary`, `cart-sidebar`, `cart-item` теперь используют `currencySymbol` из данных
  - Маппер `mapProductStoreToUi` использует утилиту `getCurrencySymbol` вместо локальной функции
  - Улучшена консистентность и поддерживаемость кода

- **Profile types refactoring**: Рефакторинг типов профиля
  - Типы `ProfilePersonalData`, `ProfileCompanyData`, `ProfileState` вынесены в `profile/model/types.ts`
  - Улучшена организация кода и переиспользуемость типов

- **State management structure**: Улучшена структура Redux slices
  - Redux slices перемещены в подпапку `store/` для лучшей организации
  - `cartState.ts` → `cart/model/store/cartState.ts`
  - `favoritesState.ts` → `favorites/model/store/favoritesState.ts`
  - `profileState.ts` → `profile/model/store/profileState.ts`
  - Обновлены импорты во всех тестах и компонентах

- **Animations**: Рефакторинг анимаций - отказ от библиотеки AOS
  - Удалена зависимость `aos` и `@types/aos`
  - Удален `AOSProvider` компонент
  - Все анимации теперь используют существующий `ScrollAnimateWrapper` компонент
  - `PromoBanner` обернут в `ScrollAnimateWrapper` для анимации появления
  - `ProductsCatalog` обернут в `ScrollAnimateWrapper` с задержкой 100ms
  - Упрощена архитектура анимаций, устранены проблемы с гидратацией

- **Modal API**: Упрощен API компонента Modal
  - Удалены компоненты `ModalHeader`, `ModalBody`, `ModalFooter`
  - Добавлен опциональный проп `title` в компонент `Modal`
  - Заголовок с кнопкой закрытия рендерится автоматически при наличии `title`
  - Контент имеет автоматические отступы (p-6)
  - Упрощено использование модальных окон во всем приложении

- **Modal architecture (FSD compliance)**: Рефакторинг модальных окон для соответствия FSD принципам
  - Модальные окна профиля перемещены из `features` в `entities/profile/ui`
    - `ProfileEditPersonalModal` → `entities/profile/ui/profile-edit-personal-modal`
    - `ProfileEditCompanyModal` → `entities/profile/ui/profile-edit-company-modal`
  - Модальное окно заказа образца перемещено из `features` в `entities/orders/ui/order-sample-modal`
  - Все модальные окна используют render prop pattern (слоты) для приема форм из features
  - Формы остались в features слое (не нарушают FSD)
  - Widgets композируют entities и features, передавая формы через слоты
  - Состояние модального окна заказа образца вынесено в `entities/orders/lib/useOrderSampleModal.ts`
  - Форма заказа образца перемещена из `entities/orders` в `features/order-sample-form` (соответствие FSD)

### Added
- **Cart entities**: Рефакторинг `order-summary` на отдельные entities
  - Entity `CartDiscountInfo` для отображения информации о скидке
  - Entity `CartUrgentOrder` для переключателя срочного заказа
  - Entity `CartItemsSummary` для отображения итогов по товарам
  - Entity `CartDiscount` для отображения общей скидки
  - Entity `CartTotal` для отображения итоговой суммы
  - Entity `CartTerms` для чекбокса согласия на обработку данных
  - Улучшена модульность и переиспользуемость компонентов

- **useFormatBadge hook**: Добавлен переиспользуемый hook для форматирования бейджей
  - Hook `useFormatBadge` в `shared/lib/hooks`
  - Покрыт тестами
  - Используется для бейджей корзины и избранного

- **Page headers**: Добавлены заголовки страниц с breadcrumbs
  - Header для страницы корзины (`/cart`) с breadcrumbs и кнопкой возврата
  - Header для страницы избранного (`/favorites`) с breadcrumbs и кнопкой возврата
  - Header для страницы товара (`/product/[slug]`) с breadcrumbs и кнопкой возврата
  - Адаптивная верстка: 3 колонки на десктопе, 1 колонка на мобильных
  - Условное отображение: header скрывается, если корзина или избранное пусты

- **CardAvailability withBackground**: Добавлен prop `withBackground` для фона у текста доступности
  - Используется для карточек в корзине
  - Цвета фона: синий для "Под заказ", зеленый для "В наличии"
  - Отступы: 10px padding, 6px border-radius

- **Order Summary styling**: Улучшена стилизация блоков order-summary
  - Стилизация блока "Срочный заказ" с границей и фоном
  - Добавлен заголовок "Ваш заказ" в order-summary
  - Улучшена визуальная иерархия элементов

- **Profile page**: Добавлена страница профиля пользователя
  - Страница профиля (`/profile`) с отображением личных данных и данных компании
  - Entity `ProfilePersonalData` для отображения персональных данных
  - Entity `ProfileCompanyData` для отображения данных компании
  - Entity `ProfileStats` для отображения статистики (включая реальное количество избранных товаров)
  - Entity `ProfileQuickActions` для быстрых действий (корзина, избранное)
  - Redux slice `profileState` для управления данными профиля
  - Виджет `ProfileContent` для композиции entities и features

### Changed
- **FSD Architecture**: Исправлено нарушение FSD принципов
  - Store конфигурация перенесена из `shared/config/store.ts` в `app/providers/store.ts`
  - `shared` слой больше не зависит от `entities` слоя
  - Обновлены импорты в `store-hooks.ts` и `store-provider.tsx`

- **Cart badge logic**: Изменена логика отображения бейджа корзины
  - Отображается количество уникальных товаров вместо общего количества
  - Синхронизировано с логикой бейджа избранного

- **Cart navigation**: Изменено поведение иконки корзины в навигации
  - Иконка корзины ведет на страницу `/cart` вместо открытия sidebar
  - Улучшена навигация пользователя

- **Navigation bar layout**: Улучшена структура навигационной панели
  - Объединены desktop-compact и desktop-full блоки в один адаптивный блок
  - Логотип, каталог и поиск слева, иконки и кнопка справа
  - Иконки и кнопка на десктопе в одной строке без лишних оберток

- **Promo banner**: Добавлен отступ сверху 50px

### Fixed
- Исправлены пути в тестах после рефакторинга структуры Redux slices
- Исправлены импорты в тестах `useAddToCart`, `useRemoveFromCart`, `useToggleFavorite`
- Исправлены нарушения FSD архитектуры
- Улучшена консистентность использования hooks
- Исправлены ошибки TypeScript в `PageLoader` (явная типизация переменной `e`)
- Исправлены ошибки линтера в Storybook stories (вынесены хуки в отдельные компоненты)

## [0.1.1] - 2025-01-12

### Added
- **Product sorting**: Добавлена сортировка товаров в каталоге
  - Feature `product-sort` с поддержкой сортировки по имени (А-Я, Я-А) и цене (возрастание, убывание)
  - UI компонент с кнопкой и выпадающим меню для выбора сортировки
  - Синхронизация параметра сортировки с URL
  - Клиентская сортировка товаров с сохранением состояния в URL

- **Product detail page**: Добавлена страница детализации товара
  - Динамический маршрут `/product/[slug]` для просмотра детальной информации о товаре
  - Виджет `product-card` для отображения полной информации о товаре
  - Hook `useProductBySlug` для получения данных товара по slug
  - SSR и генерация метаданных для SEO
  - Кликабельное изображение товара в карточке для перехода на страницу детализации

- **Test coverage**: Расширено тестовое покрытие
  - Тесты для `useProductBySlug` hook
  - Тесты для `useFavoriteProducts` hook
  - Тесты для `useCartProducts` hook
  - Все тесты проходят успешно (353 теста)

- **Product search in navigation**: Поиск товаров перенесен в навигационную панель
  - Интеграция поиска в `navigation-bar` widget
  - Синхронизация поискового запроса с URL параметрами
  - Удален отдельный компонент поиска из каталога товаров

### Changed
- **Product card image**: Изображение товара в карточке теперь кликабельно и ведет на страницу детализации
- **Favorite button positioning**: Улучшено позиционирование кнопки избранного на странице детализации товара

### Fixed
- Исправлены ошибки и предупреждения при сборке проекта
- Удалена устаревшая конфигурация `experimental.turbo` из `next.config.ts`
- Удалены `console.warn` из продакшн кода
- Исправлены ошибки линтера во всех файлах
- Исправлены проблемы с позиционированием кнопки избранного в карточке товара

## [0.1.0] - 2024-01-11

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
