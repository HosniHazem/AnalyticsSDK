import { describe, it, expect } from 'vitest';
import { validateEvent, validateUser, sanitizeProperties } from '../src/utils/validator';
import { Event, User } from '../src/types';

describe('Validator', () => {
  describe('validateEvent', () => {
    it('should validate correct event', () => {
      const event: Event = {
        name: 'test_event',
        properties: { key: 'value' },
        timestamp: Date.now(),
      };
      expect(validateEvent(event)).toBe(true);
    });

    it('should reject event without name', () => {
      const event = { properties: {} } as Event;
      expect(validateEvent(event)).toBe(false);
    });

    it('should reject event with empty name', () => {
      const event: Event = { name: '  ' };
      expect(validateEvent(event)).toBe(false);
    });

    it('should reject event with invalid properties', () => {
      const event = {
        name: 'test',
        properties: 'invalid',
      } as any;
      expect(validateEvent(event)).toBe(false);
    });

    it('should accept event without properties', () => {
      const event: Event = { name: 'test_event' };
      expect(validateEvent(event)).toBe(true);
    });
  });

  describe('validateUser', () => {
    it('should validate correct user', () => {
      const user: User = {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
      };
      expect(validateUser(user)).toBe(true);
    });

    it('should reject user without id', () => {
      const user = { email: 'test@example.com' } as User;
      expect(validateUser(user)).toBe(false);
    });

    it('should reject user with empty id', () => {
      const user: User = { id: '  ' };
      expect(validateUser(user)).toBe(false);
    });

    it('should accept user with only id', () => {
      const user: User = { id: 'user123' };
      expect(validateUser(user)).toBe(true);
    });
  });

  describe('sanitizeProperties', () => {
    it('should remove undefined values', () => {
      const props = {
        key1: 'value1',
        key2: undefined,
        key3: 'value3',
      };
      const result = sanitizeProperties(props);
      expect(result).toEqual({
        key1: 'value1',
        key3: 'value3',
      });
    });

    it('should remove null values', () => {
      const props = {
        key1: 'value1',
        key2: null,
      };
      const result = sanitizeProperties(props);
      expect(result).toEqual({
        key1: 'value1',
      });
    });

    it('should return empty object for undefined input', () => {
      expect(sanitizeProperties(undefined)).toEqual({});
    });

    it('should keep falsy values except undefined and null', () => {
      const props = {
        zero: 0,
        empty: '',
        falseBool: false,
      };
      const result = sanitizeProperties(props);
      expect(result).toEqual(props);
    });
  });
});
