import { OrderByPipe } from './orderBy.pipe';
import { describe, it, expect, beforeEach } from 'vitest';

describe('OrderByPipe', () => {
  let pipe: OrderByPipe;

  beforeEach(() => {
    pipe = new OrderByPipe();
  });

  // Helper data
  const users = [
    { id: 3, name: 'Charlie', age: 30 },
    { id: 1, name: 'alice', age: 25 }, // lowercase to test case-insensitivity
    { id: 2, name: 'Bob', age: 25 },
  ];

  describe('Basic Array Sorting', () => {
    it('should sort a simple string array alphabetically', () => {
      const input = ['banana', 'apple', 'cherry'];
      const result = pipe.transform(input, ['+']);
      expect(result).toEqual(['apple', 'banana', 'cherry']);
    });

    it('should reverse a simple array when "-" is provided', () => {
      const input = [1, 3, 2];
      const result = pipe.transform(input, ['-']);
      expect(result).toEqual([3, 2, 1]);
    });
  });

  describe('Object Property Sorting', () => {
    it('should sort by a single property ascending', () => {
      const result = pipe.transform(users, ['id']);
      expect(result[0].id).toBe(1);
      expect(result[2].id).toBe(3);
    });

    it('should sort by a single property descending using "-" prefix', () => {
      const result = pipe.transform(users, ['-id']);
      expect(result[0].id).toBe(3);
      expect(result[2].id).toBe(1);
    });

    it('should handle case-insensitive string sorting', () => {
      const result = pipe.transform(users, ['+name']);
      // 'alice' (lowercase) should come first because of toLowerCase() in comparator
      expect(result[0].name).toBe('alice');
      expect(result[1].name).toBe('Bob');
    });
  });

  describe('Edge Cases & Immutability', () => {
    it('should return input if it is not an array', () => {
      const input = 'not an array' as any;
      expect(pipe.transform(input, ['+'])).toBe(input);
    });

    it('should not mutate the original array', () => {
      const input = [3, 1, 2];
      const inputCopy = [...input];
      pipe.transform(input, ['+']);

      expect(input).toEqual(inputCopy); // Original remains [3, 1, 2]
    });

    it('should handle numeric strings correctly', () => {
      const items = [{ val: '10' }, { val: '2' }];
      const result = pipe.transform(items, ['val']);
      // Without parseFloat, '10' < '2' (string sort).
      // With your comparator, 2 < 10 (numeric sort).
      expect(result[0].val).toBe('2');
    });
  });
});