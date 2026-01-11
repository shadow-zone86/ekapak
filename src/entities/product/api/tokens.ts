import { createToken } from '@/shared/lib/di/container';

export const PRODUCT_TOKENS = {
  GetProductsService: createToken('Product.GetProductsService'),
  GetProductByUuidService: createToken('Product.GetProductByUuidService'),
  GetProductBySlugService: createToken('Product.GetProductBySlugService'),
};
