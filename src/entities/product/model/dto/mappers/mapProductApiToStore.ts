/**
 * Маппер: Product API → Store DTO
 */
import type { Offer, Product } from '../../types';
import type { IProductStoreDto, IOfferStoreDto } from '../types';

export function mapOfferApiToStore(apiDto: Offer): IOfferStoreDto {
  return {
    uuid: apiDto.uuid,
    externalId: '', // API не возвращает external_id в offers
    name: '', // API не возвращает name в offers
    unitName: apiDto.unit,
    unitAbbr: apiDto.unit,
    article: '', // article на уровне продукта
    barcode: undefined,
    priceType: '', // API не возвращает price_type_name
    price: parseFloat(apiDto.price) || 0, // Преобразуем строку в число
    currency: apiDto.currency,
    priceDisplay: undefined,
    quantity: apiDto.quantity,
  };
}

export function mapProductApiToStore(apiDto: Product): IProductStoreDto {
  // Получаем первое изображение из массива images
  const firstImage = apiDto.images && apiDto.images.length > 0
    ? apiDto.images[0].card_url || apiDto.images[0].original_url
    : undefined;

  // Извлекаем dimensions из properties если они есть
  const properties = apiDto.properties || {};
  const dimensions = properties['Толщина, мкм'] ||
                     properties['Ширина, мм'] ||
                     properties['Длина, мм'] ||
                     properties['Высота, мм'] ||
                     properties['Объем, л'] ||
                     properties['Вес пакета, г']
    ? {
        thickness: properties['Толщина, мкм'] ? parseFloat(properties['Толщина, мкм']) : undefined,
        width: properties['Ширина, мм'] ? parseFloat(properties['Ширина, мм']) : undefined,
        height: properties['Длина, мм'] ? parseFloat(properties['Длина, мм']) : undefined,
        volume: properties['Объем, л'] ? parseFloat(properties['Объем, л']) : undefined,
        weight: properties['Вес пакета, г'] ? parseFloat(properties['Вес пакета, г']) : undefined,
      }
    : undefined;

  return {
    uuid: apiDto.uuid,
    externalId: undefined,
    name: apiDto.name,
    sku: apiDto.article || '', // Используем article как sku
    description: apiDto.description ?? undefined,
    slug: apiDto.slug,
    image: firstImage,
    categoryUuid: apiDto.category_uuid,
    dimensions,
    offers: (apiDto.offers || []).map(mapOfferApiToStore),
    createdAt: '', // API не возвращает created_at
    updatedAt: '', // API не возвращает updated_at
  };
}
