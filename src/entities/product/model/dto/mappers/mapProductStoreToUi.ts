/**
 * Маппер: Product Store DTO → UI DTO
 */
import type {
  IProductStoreDto,
  IProductUiDto,
  IOfferStoreDto,
  IOfferUiDto,
} from '../types';

function getCurrencySymbol(currency: string): string {
  const normalizedCurrency = currency.trim().toUpperCase();
  if (normalizedCurrency === 'RUB') {
    return '₽';
  }
  return normalizedCurrency;
}

function formatPrice(price: number, currencySymbol: string): string {
  return `${price.toFixed(2)} ${currencySymbol}`;
}

export function mapOfferStoreToUi(storeDto: IOfferStoreDto): IOfferUiDto {
  const currencySymbol = getCurrencySymbol(storeDto.currency);
  const minPurchase = storeDto.quantity > 0 ? Math.min(storeDto.quantity, 100) : 100;

  return {
    uuid: storeDto.uuid,
    name: storeDto.name,
    price: storeDto.price,
    currency: storeDto.currency,
    currencySymbol,
    formattedPrice: formatPrice(storeDto.price, currencySymbol),
    unit: storeDto.unitName,
    quantity: storeDto.quantity,
    minPurchase,
    isAvailable: storeDto.quantity > 0,
    priceType: storeDto.priceType,
  };
}

export function mapProductStoreToUi(storeDto: IProductStoreDto): IProductUiDto {
  const offers = storeDto.offers.map(mapOfferStoreToUi);
  const defaultOffer = offers[0];
  const isInStock = offers.some((offer) => offer.isAvailable);
  const availability = isInStock ? 'В наличии' : 'Под заказ';
  const availabilityColor = isInStock ? '#2AC84D' : '#00B0FF';

  return {
    uuid: storeDto.uuid,
    name: storeDto.name,
    sku: storeDto.sku,
    description: storeDto.description,
    image: storeDto.image,
    slug: storeDto.slug,
    defaultOffer,
    offers,
    hasMultipleOffers: offers.length > 1,
    isInStock,
    availability,
    availabilityColor,
  };
}
