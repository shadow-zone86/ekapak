/**
 * Маппер: Category API → Store DTO
 */
import type { Category } from '../../types';
import type { ICategoryStoreDto } from '../types';

export function mapCategoryApiToStore(apiDto: Category): ICategoryStoreDto {
  return {
    uuid: apiDto.uuid,
    name: apiDto.name,
    slug: apiDto.slug,
    description: apiDto.description ?? undefined,
    parents: apiDto.parents?.map(mapCategoryApiToStore),
    children: apiDto.children?.map(mapCategoryApiToStore),
    createdAt: apiDto.created_at,
    updatedAt: apiDto.updated_at,
  };
}
