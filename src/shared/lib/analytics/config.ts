/**
 * Search Analytics Configuration
 * Manages environment-based configuration for analytics
 */

class SearchAnalyticsConfig {
  private analyticsKey: string;
  private analyticsEndpoint: string;
  private isToggleEnabled: boolean;

  constructor() {
    this.analyticsKey = process.env.ANALYTICS_KEY || 'default-key';
    this.analyticsEndpoint = process.env.NEXT_PUBLIC_ANALYTICS_API_BASE_URL || 'http://localhost:3001';
    this.isToggleEnabled = process.env.NEXT_PUBLIC_FEATURE_SEND_ANALYTICS === 'true';
  }

  /**
   * Get Analytics API Key
   */
  getApiKey(): string {
    return this.analyticsKey;
  }

  /**
   * Get Analytics Endpoint URL
   */
  getEndpointUrl(): string {
    return this.analyticsEndpoint;
  }

  /**
   * Check if feature toggle is enabled
   */
  isFeatureEnabled(): boolean {
    return this.isToggleEnabled;
  }

  /**
   * Get full event endpoint
   */
  getEventEndpoint(): string {
    return `${this.getEndpointUrl()}/analytics/search-events`;
  }

  /**
   * Log configuration status (development only)
   */
  logConfig(): void {
    if (process.env.NODE_ENV === 'development') {
      console.log('[SearchAnalyticsConfig]', {
        endpoint: this.analyticsEndpoint,
        toggleEnabled: this.isToggleEnabled,
        environment: process.env.NODE_ENV,
      });
    }
  }
}

export const searchAnalyticsConfig = new SearchAnalyticsConfig();
