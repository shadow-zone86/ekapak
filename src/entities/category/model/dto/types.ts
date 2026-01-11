/**
 * DTO (Data Transfer Objects) для Category
 * Разделение типов по слоям: API → Store → UI
 */

// ================ REQUEST DTOs ================

export interface IGetCategoryRequestDto {
  uuid: string;
}

export interface IGetCategoryBySlugRequestDto {
  slug: string;
}

// ================ API DTOs (ответы от API) ================

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

export interface ICategoryUiDto {
  uuid: string;
  name: string;
  slug: string;
  description?: string;
  children?: ICategoryUiDto[];
}
