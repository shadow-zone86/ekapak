/**
 * Хук для форматирования числа в бейдж
 * @param count - количество для форматирования
 * @returns отформатированное значение для бейджа: undefined если count <= 0, '99+' если > 99, иначе число
 */
export function useFormatBadge(count: number): number | string | undefined {
  if (count <= 0) return undefined;
  return count > 99 ? '99+' : count;
}
