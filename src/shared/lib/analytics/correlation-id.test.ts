/**
 * Correlation ID Utility Tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { CorrelationIdUtil } from '@/shared/lib/analytics/correlation-id';

describe('CorrelationIdUtil', () => {
  afterEach(() => {
    // Clean up session storage
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.clear();
    }
  });

  describe('generate', () => {
    it('should generate a correlation ID', () => {
      const id = CorrelationIdUtil.generate();

      expect(id).toBeDefined();
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });

    it('should generate different IDs on each call', () => {
      const id1 = CorrelationIdUtil.generate();
      const id2 = CorrelationIdUtil.generate();

      expect(id1).not.toBe(id2);
    });
  });

  describe('set and getOrGenerate', () => {
    it('should set and retrieve correlation ID from session storage', () => {
      const testId = 'test-correlation-id-123';
      CorrelationIdUtil.set(testId);

      const retrieved = CorrelationIdUtil.getOrGenerate();

      expect(retrieved).toBe(testId);
    });

    it('should generate new ID if not set in session', () => {
      const id = CorrelationIdUtil.getOrGenerate();

      expect(id).toBeDefined();
      expect(typeof id).toBe('string');
    });

    it('should return same ID on subsequent calls if set', () => {
      const testId = 'persistent-id-456';
      CorrelationIdUtil.set(testId);

      const id1 = CorrelationIdUtil.getOrGenerate();
      const id2 = CorrelationIdUtil.getOrGenerate();

      expect(id1).toBe(id2);
      expect(id1).toBe(testId);
    });
  });
});
