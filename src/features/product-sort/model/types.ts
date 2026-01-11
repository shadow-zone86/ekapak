export type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'default';

export interface ISortOptions {
  value: SortOption
  label: string
}
