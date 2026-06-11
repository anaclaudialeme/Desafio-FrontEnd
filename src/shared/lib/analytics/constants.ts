/**
 * Search Analytics Constants
 * Centralized constants for analytics operations
 */
export const SEARCH_ANALYTICS_CONSTANTS = {
  HEADERS: {
    AUTHORIZATION: 'Authorization',
    CORRELATION_ID: 'X-Correlation-Id',
    CONTENT_TYPE: 'Content-Type',
  },
  CONTENT_TYPES: {
    JSON: 'application/json',
  },
  EVENT_TYPES: {
    SEARCH: 'search',
    REPO_VIEW: 'repo_view',
    USER_VIEW: 'user_view',
  },
  ENDPOINTS: {
    SEARCH_EVENTS: '/analytics/search-events',
  },
  LOG_LEVELS: {
    INFO: 'info',
    WARN: 'warn',
    ERROR: 'error',
  },
  CACHE_KEYS: {
    USER_SEARCH: 'github:user:search',
    USER_DETAIL: 'github:user:detail',
    USER_REPOS: 'github:user:repos',
  },
} as const;
