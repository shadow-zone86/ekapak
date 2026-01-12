import { useFormatBadge } from './useFormatBadge';

describe('useFormatBadge', () => {
  it('should return undefined for count <= 0', () => {
    expect(useFormatBadge(0)).toBeUndefined();
    expect(useFormatBadge(-1)).toBeUndefined();
    expect(useFormatBadge(-100)).toBeUndefined();
  });

  it('should return the number for count between 1 and 99', () => {
    expect(useFormatBadge(1)).toBe(1);
    expect(useFormatBadge(50)).toBe(50);
    expect(useFormatBadge(99)).toBe(99);
  });

  it('should return "99+" for count > 99', () => {
    expect(useFormatBadge(100)).toBe('99+');
    expect(useFormatBadge(150)).toBe('99+');
    expect(useFormatBadge(1000)).toBe('99+');
  });
});
