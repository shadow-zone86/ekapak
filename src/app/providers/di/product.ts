import { container } from '@/shared/lib/di/container';
import { PRODUCT_TOKENS } from '@/entities/product/api/tokens';
import {
  createGetProductsService,
  createGetProductByUuidService,
  createGetProductBySlugService,
} from '@/entities/product/api/factories';

export function registerProductDependencies(): void {
  container.registerFactory(PRODUCT_TOKENS.GetProductsService, createGetProductsService);
  container.registerFactory(PRODUCT_TOKENS.GetProductByUuidService, createGetProductByUuidService);
  container.registerFactory(PRODUCT_TOKENS.GetProductBySlugService, createGetProductBySlugService);
}
