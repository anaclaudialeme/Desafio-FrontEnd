/**
 * Analytics Adapter Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AnalyticsAdapter } from '@/shared/lib/api/analytics-adapter';
import { SearchEventFactory } from '@/shared/lib/analytics/factory';

describe('AnalyticsAdapter', () => {
  let adapter: AnalyticsAdapter;

  beforeEach(() => {
    adapter = new AnalyticsAdapter();
    global.fetch = vi.fn();
  });

  describe('sendEvent', () => {
    it('should send event successfully', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({ success: true, eventId: '123' }),
      };
      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      const event = SearchEventFactory.createSearchEvent('test', 5, true);
      const dto = SearchEventFactory.toDTO(event);

      const result = await adapter.sendEvent(dto);

      expect(result.success).toBe(true);
    });

    it('should handle API errors gracefully', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      };
      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      const event = SearchEventFactory.createSearchEvent('test', 5, true);
      const dto = SearchEventFactory.toDTO(event);

      const result = await adapter.sendEvent(dto);

      expect(result.success).toBe(true);
      expect(result.error).toBeDefined();
    });

    it('should handle network errors gracefully', async () => {
      (global.fetch as any).mockRejectedValueOnce(
        new Error('Network error'),
      );

      const event = SearchEventFactory.createSearchEvent('test', 5, true);
      const dto = SearchEventFactory.toDTO(event);

      const result = await adapter.sendEvent(dto);

      expect(result.success).toBe(true);
      expect(result.error).toBeDefined();
    });

    it('should return success when feature toggle is disabled', async () => {
      // Mock config to return false for toggle
      vi.stubEnv('NEXT_PUBLIC_FEATURE_SEND_ANALYTICS', 'false');

      const event = SearchEventFactory.createSearchEvent('test', 5, true);
      const dto = SearchEventFactory.toDTO(event);

      const result = await adapter.sendEvent(dto);

      expect(result.success).toBe(true);
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });
});
