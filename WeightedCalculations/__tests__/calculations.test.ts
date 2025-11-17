import { calculateRowSum, calculateTotal } from '../lib/calculations';

describe('Calculation Functions', () => {
  describe('calculateRowSum', () => {
    it('should multiply two positive numbers', () => {
      expect(calculateRowSum('5', '3')).toBe(15);
    });

    it('should multiply two negative numbers', () => {
      expect(calculateRowSum('-4', '-2')).toBe(8);
    });

    it('should handle decimal numbers', () => {
      expect(calculateRowSum('2.5', '4')).toBe(10);
    });

    it('should handle mixed positive and negative', () => {
      expect(calculateRowSum('5', '-3')).toBe(-15);
    });

    it('should treat empty string as 0', () => {
      expect(calculateRowSum('', '5')).toBe(0);
      expect(calculateRowSum('5', '')).toBe(0);
      expect(calculateRowSum('', '')).toBe(0);
    });

    it('should treat invalid strings as 0', () => {
      expect(calculateRowSum('abc', '5')).toBe(0);
      expect(calculateRowSum('5', 'xyz')).toBe(0);
    });

    it('should handle zero', () => {
      expect(calculateRowSum('0', '5')).toBe(0);
      expect(calculateRowSum('5', '0')).toBe(0);
    });

    it('should handle very small decimals', () => {
      expect(calculateRowSum('0.1', '0.2')).toBeCloseTo(0.02);
    });
  });

  describe('calculateTotal', () => {
    it('should sum single row', () => {
      const rows = [{ x: '5', y: '3' }];
      expect(calculateTotal(rows)).toBe(15);
    });

    it('should sum multiple rows', () => {
      const rows = [
        { x: '2', y: '3' },  // 6
        { x: '4', y: '5' },  // 20
        { x: '1', y: '2' },  // 2
      ];
      expect(calculateTotal(rows)).toBe(28);
    });

    it('should handle empty rows array', () => {
      expect(calculateTotal([])).toBe(0);
    });

    it('should handle rows with empty values', () => {
      const rows = [
        { x: '5', y: '3' },  // 15
        { x: '', y: '' },    // 0
        { x: '2', y: '4' },  // 8
      ];
      expect(calculateTotal(rows)).toBe(23);
    });

    it('should handle rows with invalid values', () => {
      const rows = [
        { x: '5', y: '3' },   // 15
        { x: 'abc', y: 'def' }, // 0
        { x: '2', y: '4' },   // 8
      ];
      expect(calculateTotal(rows)).toBe(23);
    });

    it('should handle negative sums', () => {
      const rows = [
        { x: '5', y: '-3' },  // -15
        { x: '4', y: '-5' },  // -20
      ];
      expect(calculateTotal(rows)).toBe(-35);
    });

    it('should handle decimal values', () => {
      const rows = [
        { x: '2.5', y: '2' }, // 5
        { x: '1.5', y: '4' }, // 6
      ];
      expect(calculateTotal(rows)).toBe(11);
    });
  });
});
