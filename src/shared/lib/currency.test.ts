import { getCurrencySymbol } from './currency';

describe('currency utilities', () => {
  describe('getCurrencySymbol', () => {
    it('should convert RUB to ₽', () => {
      expect(getCurrencySymbol('RUB')).toBe('₽');
    });

    it('should convert rub to ₽ (lowercase)', () => {
      expect(getCurrencySymbol('rub')).toBe('₽');
    });

    it('should convert Rub to ₽ (mixed case)', () => {
      expect(getCurrencySymbol('Rub')).toBe('₽');
    });

    it('should convert RUB with spaces to ₽', () => {
      expect(getCurrencySymbol('  RUB  ')).toBe('₽');
    });

    it('should convert rub with spaces to ₽', () => {
      expect(getCurrencySymbol('  rub  ')).toBe('₽');
    });

    it('should return USD for USD currency', () => {
      expect(getCurrencySymbol('USD')).toBe('USD');
    });

    it('should return USD for usd (lowercase)', () => {
      expect(getCurrencySymbol('usd')).toBe('USD');
    });

    it('should return USD for Usd (mixed case)', () => {
      expect(getCurrencySymbol('Usd')).toBe('USD');
    });

    it('should return USD for USD with spaces', () => {
      expect(getCurrencySymbol('  USD  ')).toBe('USD');
    });

    it('should return EUR for EUR currency', () => {
      expect(getCurrencySymbol('EUR')).toBe('EUR');
    });

    it('should return EUR for eur (lowercase)', () => {
      expect(getCurrencySymbol('eur')).toBe('EUR');
    });

    it('should return EUR for EUR with spaces', () => {
      expect(getCurrencySymbol('  EUR  ')).toBe('EUR');
    });

    it('should return GBP for GBP currency', () => {
      expect(getCurrencySymbol('GBP')).toBe('GBP');
    });

    it('should return GBP for gbp (lowercase)', () => {
      expect(getCurrencySymbol('gbp')).toBe('GBP');
    });

    it('should return JPY for JPY currency', () => {
      expect(getCurrencySymbol('JPY')).toBe('JPY');
    });

    it('should return CNY for CNY currency', () => {
      expect(getCurrencySymbol('CNY')).toBe('CNY');
    });

    it('should handle empty string', () => {
      expect(getCurrencySymbol('')).toBe('');
    });

    it('should handle string with only spaces', () => {
      expect(getCurrencySymbol('   ')).toBe('');
    });

    it('should handle string with leading spaces', () => {
      expect(getCurrencySymbol('  RUB')).toBe('₽');
    });

    it('should handle string with trailing spaces', () => {
      expect(getCurrencySymbol('RUB  ')).toBe('₽');
    });

    it('should handle string with spaces in the middle (should not trim middle spaces)', () => {
      // Note: trim() only removes leading/trailing spaces
      expect(getCurrencySymbol('R U B')).toBe('R U B');
    });

    it('should return uppercase for unknown currency codes', () => {
      expect(getCurrencySymbol('xyz')).toBe('XYZ');
    });

    it('should return uppercase for unknown currency codes with spaces', () => {
      expect(getCurrencySymbol('  xyz  ')).toBe('XYZ');
    });

    it('should handle single character currency code', () => {
      expect(getCurrencySymbol('a')).toBe('A');
    });

    it('should handle very long currency code', () => {
      const longCode = 'VERYLONGCURRENCYCODE';
      expect(getCurrencySymbol(longCode)).toBe('VERYLONGCURRENCYCODE');
    });

    it('should handle currency code with numbers', () => {
      expect(getCurrencySymbol('ABC123')).toBe('ABC123');
    });

    it('should handle currency code with special characters', () => {
      expect(getCurrencySymbol('ABC-DEF')).toBe('ABC-DEF');
    });

    it('should handle currency code with underscores', () => {
      expect(getCurrencySymbol('abc_def')).toBe('ABC_DEF');
    });

    it('should normalize mixed case currency codes', () => {
      expect(getCurrencySymbol('UsD')).toBe('USD');
      expect(getCurrencySymbol('EuR')).toBe('EUR');
      expect(getCurrencySymbol('GbP')).toBe('GBP');
    });

    it('should handle tab characters', () => {
      expect(getCurrencySymbol('\tRUB\t')).toBe('₽');
    });

    it('should handle newline characters', () => {
      expect(getCurrencySymbol('\nRUB\n')).toBe('₽');
    });

    it('should handle multiple whitespace characters', () => {
      expect(getCurrencySymbol('  \t  RUB  \t  ')).toBe('₽');
    });
  });
});
