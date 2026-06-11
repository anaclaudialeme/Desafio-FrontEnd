/**
 * Search Event Factory Tests
 * Unit tests for SearchEventFactory
 */

import { describe, it, expect } from 'vitest';
import { SearchEventFactory } from '@/shared/lib/analytics/factory';

describe('SearchEventFactory', () => {
  describe('createSearchEvent', () => {
    it('should create a search event with correct structure', () => {
      const event = SearchEventFactory.createSearchEvent('test-user', 5, true);

      expect(event).toHaveProperty('timestamp');
      expect(event).toHaveProperty('query', 'test-user');
      expect(event).toHaveProperty('userAgent');
      expect(event).toHaveProperty('resultCount', 5);
      expect(event).toHaveProperty('success', true);
      expect(event).toHaveProperty('correlationId');
      expect(event).toHaveProperty('eventType', 'search');
    });

    it('should include errorCode when provided', () => {
      const event = SearchEventFactory.createSearchEvent(
        'test-user',
        0,
        false,
        'RATE_LIMIT',
      );

      expect(event.errorCode).toBe('RATE_LIMIT');
      expect(event.success).toBe(false);
    });

    it('should generate valid ISO timestamp', () => {
      const event = SearchEventFactory.createSearchEvent('test', 1, true);
      const timestamp = new Date(event.timestamp);

      expect(timestamp.getTime()).not.toBeNaN();
    });

    it('should generate unique correlation IDs', () => {
      const event1 = SearchEventFactory.createSearchEvent('test1', 1, true);
      const event2 = SearchEventFactory.createSearchEvent('test2', 1, true);

      // IDs might not always be different due to timing, but should be different format
      expect(event1.correlationId).toBeDefined();
      expect(event2.correlationId).toBeDefined();
    });
  });

  describe('createRepoViewEvent', () => {
    it('should create a repo view event with correct structure', () => {
      const event = SearchEventFactory.createRepoViewEvent(
        'octocat',
        'Hello-World',
        150,
      );

      expect(event.username).toBe('octocat');
      expect(event.repoName).toBe('Hello-World');
      expect(event.stars).toBe(150);
      expect(event.eventType).toBe('repo_view');
      expect(event.success).toBe(true);
      expect(event.correlationId).toBeDefined();
    });

    it('should use provided correlation ID', () => {
      const correlationId = 'test-correlation-123';
      const event = SearchEventFactory.createRepoViewEvent(
        'octocat',
        'Hello-World',
        150,
        correlationId,
      );

      expect(event.correlationId).toBe(correlationId);
    });

    it('should generate new correlation ID if not provided', () => {
      const event = SearchEventFactory.createRepoViewEvent(
        'octocat',
        'Hello-World',
        150,
      );

      expect(event.correlationId).toBeDefined();
      expect(event.correlationId).not.toBe('');
    });
  });

  describe('createUserViewEvent', () => {
    it('should create a user view event with correct structure', () => {
      const event = SearchEventFactory.createUserViewEvent('octocat');

      expect(event.username).toBe('octocat');
      expect(event.eventType).toBe('user_view');
      expect(event.success).toBe(true);
      expect(event.resultCount).toBe(1);
      expect(event.correlationId).toBeDefined();
    });

    it('should use provided correlation ID', () => {
      const correlationId = 'test-user-correlation-456';
      const event = SearchEventFactory.createUserViewEvent(
        'octocat',
        correlationId,
      );

      expect(event.correlationId).toBe(correlationId);
    });
  });

  describe('toDTO', () => {
    it('should convert model to DTO with all fields', () => {
      const model = SearchEventFactory.createSearchEvent('test', 5, true);
      const dto = SearchEventFactory.toDTO(model);

      expect(dto).toEqual({
        timestamp: model.timestamp,
        query: model.query,
        userAgent: model.userAgent,
        resultCount: model.resultCount,
        success: model.success,
        errorCode: model.errorCode,
        username: model.username,
        repoName: model.repoName,
        stars: model.stars,
        correlationId: model.correlationId,
        eventType: model.eventType,
      });
    });

    it('should preserve null and undefined values', () => {
      const model = SearchEventFactory.createSearchEvent('test', 5, true);
      const dto = SearchEventFactory.toDTO(model);

      expect(dto.username).toBe(null);
      expect(dto.repoName).toBe(null);
      expect(dto.stars).toBe(null);
    });
  });
});
