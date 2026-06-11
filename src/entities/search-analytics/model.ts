/**
 * Search Analytics Event Model
 * Represents an analytics event for search operations
 */
export interface SearchEventModel {
  timestamp: string;
  query: string;
  userAgent: string;
  resultCount: number;
  success: boolean;
  errorCode?: string | null;
  username?: string | null;
  repoName?: string | null;
  stars?: number | null;
  correlationId: string;
  eventType: 'search' | 'repo_view' | 'user_view';
}

/**
 * Analytics Event DTO for API serialization
 */
export interface SearchEventDTO {
  timestamp: string;
  query: string;
  userAgent: string;
  resultCount: number;
  success: boolean;
  errorCode?: string | null;
  username?: string | null;
  repoName?: string | null;
  stars?: number | null;
  correlationId: string;
  eventType: 'search' | 'repo_view' | 'user_view';
}

/**
 * Analytics API Response
 */
export interface AnalyticsResponse {
  success: boolean;
  eventId?: string;
  error?: string;
}
