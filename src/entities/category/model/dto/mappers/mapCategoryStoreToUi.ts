/**
 * Маппер: Category Store DTO → UI DTO
 */
import type { ICategoryStoreDto, ICategoryUiDto } from '../types';

export function mapCategoryStoreToUi(storeDto: ICategoryStoreDto): ICategoryUiDto {
  return {
    uuid: storeDto.uuid,
    name: storeDto.name,
    slug: storeDto.slug,
    description: storeDto.description,
    children: storeDto.children?.map(mapCategoryStoreToUi),
  };
}
