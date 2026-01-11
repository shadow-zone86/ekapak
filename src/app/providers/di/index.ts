import { registerProductDependencies } from './product';
import { registerCategoryDependencies } from './category';

/**
 * Регистрация всех зависимостей через DI контейнер
 */
export function registerAllDependencies(): void {
  registerProductDependencies();
  registerCategoryDependencies();
}
