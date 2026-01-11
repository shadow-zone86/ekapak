// Category - категория с иерархией
export interface Category {
  uuid: string;
  name: string;
  slug: string;
  description?: string | null;
  parents?: Category[];
  children?: Category[];
  created_at: string;
  updated_at: string;
}

// Ответ API для списка категорий
export type CategoriesResponse = Category[];
