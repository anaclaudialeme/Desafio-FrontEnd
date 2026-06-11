/**
 * Analytics Adapter
 * Handles all interactions with Analytics API
 */

import { SearchEventDTO, AnalyticsResponse } from '@/entities/search-analytics/model';
import { searchAnalyticsConfig } from '../analytics/config';
import { SEARCH_ANALYTICS_CONSTANTS } from '../analytics/constants';

export class AnalyticsAdapter {
  /**
   * Send search event to analytics endpoint
   */
  async sendEvent(event: SearchEventDTO): Promise<AnalyticsResponse> {
    // Check if feature is enabled
    if (!searchAnalyticsConfig.isFeatureEnabled()) {
      console.log('[AnalyticsAdapter] Feature toggle disabled, skipping event send');
      return { success: true };
    }

    try {
      const url = searchAnalyticsConfig.getEventEndpoint();
      const headers = this.buildHeaders();

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(event),
        signal: this.getAbortSignal(),
      });

      if (!response.ok) {
        throw new Error(
          `Analytics API error: ${response.status} ${response.statusText}`,
        );
      }

      const result: AnalyticsResponse = await response.json();
      this.log('info', 'Event sent successfully', { eventId: result.eventId });
      return result;
    } catch (error) {
      this.log('error', 'Failed to send event', {
        error: error instanceof Error ? error.message : String(error),
        event,
      });

      // Do not throw - ensure this never breaks the main flow
      return { success: false, error: String(error) };
    }
  }

  /**
   * Build request headers
   */
  private buildHeaders(): HeadersInit {
    return {
      [SEARCH_ANALYTICS_CONSTANTS.HEADERS.CONTENT_TYPE]:
        SEARCH_ANALYTICS_CONSTANTS.CONTENT_TYPES.JSON,
      [SEARCH_ANALYTICS_CONSTANTS.HEADERS.AUTHORIZATION]:
        `Bearer ${searchAnalyticsConfig.getApiKey()}`,
    };
  }

  /**
   * Get abort signal for request timeout (10 seconds)
   */
  private getAbortSignal(): AbortSignal {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 10000);
    return controller.signal;
  }

  /**
   * Log analytics events
   */
  private log(
    level: 'info' | 'warn' | 'error',
    message: string,
    context?: Record<string, any>,
  ): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[AnalyticsAdapter:${level}] ${message}`, context);
    }
  }
}

export const analyticsAdapter = new AnalyticsAdapter();
