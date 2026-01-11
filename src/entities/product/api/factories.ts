import GetProductsService from './getProductsService';
import GetProductByUuidService from './getProductByUuidService';
import GetProductBySlugService from './getProductBySlugService';

export const createGetProductsService = () => new GetProductsService();
export const createGetProductByUuidService = () => new GetProductByUuidService();
export const createGetProductBySlugService = () => new GetProductBySlugService();
