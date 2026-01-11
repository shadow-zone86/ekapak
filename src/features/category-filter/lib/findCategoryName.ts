import type { ICategoryUiDto } from '@/entities/category/model/dto/types';

/**
 * Вспомогательная функция для поиска названия категории по UUID
 * Рекурсивно обходит дерево категорий
 */
export function findCategoryName(
  categories: ICategoryUiDto[],
  uuid: string
): string | null {
  for (const category of categories) {
    if (category.uuid === uuid) {
      return category.name;
    }
    if (category.children) {
      const found = findCategoryName(category.children, uuid);
      if (found) return found;
    }
  }
  return null;
}
