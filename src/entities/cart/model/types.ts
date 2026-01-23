// Товар в корзине - сохраняем offer для цены
export interface CartItem {
  id: string; // Уникальный ID элемента корзины
  productUuid: string;
  productName: string;
  productImage?: string | null;
  offerUuid: string;
  offerName: string;
  price: number;
  currency: string;
  currencySymbol: string; // Символ валюты для отображения (например, '₽' для RUB)
  quantity: number;
  unit: string; // Единица измерения
  article?: string;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}
