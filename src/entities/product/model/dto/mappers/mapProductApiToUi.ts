/**
 * Маппер: Product API → UI DTO
 * Композиция: API → Store → UI
 */
import type { Product } from '../../types';
import type { IProductUiDto } from '../types';
import { mapProductApiToStore } from './mapProductApiToStore';
import { mapProductStoreToUi } from './mapProductStoreToUi';

export function mapProductApiToUi(apiDto: Product): IProductUiDto {
  const storeDto = mapProductApiToStore(apiDto);
  return mapProductStoreToUi(storeDto);
}
