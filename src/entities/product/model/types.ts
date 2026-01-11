// Product Image
export interface ProductImage {
  original_url: string;
  card_url: string;
}

// Offer - торговое предложение
export interface Offer {
  uuid: string;
  price: string; // API возвращает строку
  currency: string;
  unit: string; // "шт.", "м", "кг" и т.д.
  quantity: number;
}

// Product - товар
export interface Product {
  uuid: string;
  name: string;
  description?: string | null;
  slug: string;
  category_uuid?: string;
  offers_min_price?: string;
  offers: Offer[];
  seo_description?: string;
  'Мин. покупка, шт.'?: string;
  Наличие?: string;
  article?: string;
  images?: ProductImage[];
  properties?: Record<string, string>;
}

// Ответ API для списка товаров
export interface ProductsResponse {
  data: Product[];
  meta?: {
    total?: number;
    page?: number;
    per_page?: number;
    last_page?: number;
  };
}
