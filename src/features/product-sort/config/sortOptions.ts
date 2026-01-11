import type { ISortOptions } from '../model/types';

export const sortOptions: ISortOptions[] = [
  { value: 'default', label: 'По умолчанию' },
  { value: 'name-asc', label: 'По имени (А-Я)' },
  { value: 'name-desc', label: 'По имени (Я-А)' },
  { value: 'price-asc', label: 'По цене (возрастание)' },
  { value: 'price-desc', label: 'По цене (убывание)' },
];
