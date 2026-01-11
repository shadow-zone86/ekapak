/**
 * DTO (Data Transfer Objects) для Product
 * Разделение типов по слоям: API → Store → UI
 */

// ================ REQUEST DTOs ================

export interface IGetProductsRequestDto {
  page?: number;
  per_page?: number;
  category?: string; // category UUID
}

export interface IGetProductRequestDto {
  uuid: string;
}

// ================ API DTOs (ответы от API) ================

export interface IProductImageApiDto {
  original_url: string;
  card_url: string;
}

export interface IOfferApiDto {
  uuid: string;
  price: string; // API возвращает строку
  currency: string;
  unit: string;
  quantity: number;
}

export interface IProductApiDto {
  uuid: string;
  name: string;
  description?: string | null;
  slug: string;
  category_uuid?: string;
  offers_min_price?: string;
  offers: IOfferApiDto[];
  seo_description?: string;
  'Мин. покупка, шт.'?: string;
  Наличие?: string;
  article?: string;
  images?: IProductImageApiDto[];
  properties?: Record<string, string>;
}

export interface IGetProductsResponseDto {
  data: IProductApiDto[];
  meta?: {
    total?: number;
    page?: number;
    per_page?: number;
    last_page?: number;
  };
}

export interface ICategoryApiDto {
  uuid: string;
  name: string;
  slug: string;
  description?: string | null;
  parents?: ICategoryApiDto[];
  children?: ICategoryApiDto[];
  created_at: string;
  updated_at: string;
}

export type ICategoriesResponseDto = ICategoryApiDto[];

// ================ STORE DTOs (данные в Redux Store) ================

export interface IOfferStoreDto {
  uuid: string;
  externalId: string;
  name: string;
  unitName: string;
  unitAbbr: string;
  article: string;
  barcode?: string;
  priceType: string;
  price: number;
  currency: string;
  priceDisplay?: string;
  quantity: number;
}

export interface IProductStoreDto {
  uuid: string;
  externalId?: string;
  name: string;
  sku: string;
  description?: string;
  slug: string;
  image?: string;
  categoryUuid?: string;
  dimensions?: {
    thickness?: number;
    width?: number;
    height?: number;
    volume?: number;
    weight?: number;
  };
  offers: IOfferStoreDto[];
  createdAt: string;
  updatedAt: string;
}

export interface ICategoryStoreDto {
  uuid: string;
  name: string;
  slug: string;
  description?: string;
  parents?: ICategoryStoreDto[];
  children?: ICategoryStoreDto[];
  createdAt: string;
  updatedAt: string;
}

// ================ UI DTOs (данные для компонентов) ================

export interface IOfferUiDto {
  uuid: string;
  name: string;
  price: number;
  currency: string;
  currencySymbol: string;
  formattedPrice: string;
  unit: string;
  quantity: number;
  minPurchase: number;
  isAvailable: boolean;
  priceType: string;
}

export interface IProductUiDto {
  uuid: string;
  name: string;
  sku: string;
  description?: string;
  image?: string;
  slug: string;
  defaultOffer?: IOfferUiDto;
  offers: IOfferUiDto[];
  hasMultipleOffers: boolean;
  isInStock: boolean;
  availability: string;
  availabilityColor: string;
}

export interface ICategoryUiDto {
  uuid: string;
  name: string;
  slug: string;
  description?: string;
  children?: ICategoryUiDto[];
}

// ================ Response DTOs для useQuery ================

export interface IProductsUiResponseDto {
  data: IProductUiDto[];
  meta?: {
    total?: number;
    page?: number;
    per_page?: number;
    last_page?: number;
  };
}
