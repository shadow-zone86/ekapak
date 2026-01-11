/**
 * Маппер: Category API → UI DTO
 */
import type { Category } from '../../types';
import type { ICategoryUiDto } from '../types';

export function mapCategoryApiToUi(apiDto: Category): ICategoryUiDto {
  return {
    uuid: apiDto.uuid,
    name: apiDto.name,
    slug: apiDto.slug,
    description: apiDto.description ?? undefined,
    children: apiDto.children?.map(mapCategoryApiToUi),
  };
}
