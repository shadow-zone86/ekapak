/**
 * Цветовая палитра проекта EKAPAK
 */
export const colors = {
  blue: {
    DEFAULT: '#00B0FF',
    active: '#43C5FF',
  },
  black: '#2C2C2C',
  gray: '#9A9A9A',
  stroke: '#D4D4D4',
  background: '#F5F7FB',
  white: '#FFFFFF',
} as const;

export type Colors = typeof colors;
