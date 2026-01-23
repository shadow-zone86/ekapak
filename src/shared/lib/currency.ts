/**
 * Утилиты для работы с валютами
 */

/**
 * Преобразует код валюты в символ для отображения
 * @param currency - код валюты (например, 'RUB', 'USD')
 * @returns символ валюты для отображения (например, '₽', 'USD')
 */
export function getCurrencySymbol(currency: string): string {
  const normalizedCurrency = currency.trim().toUpperCase();
  if (normalizedCurrency === 'RUB') {
    return '₽';
  }
  return normalizedCurrency;
}
