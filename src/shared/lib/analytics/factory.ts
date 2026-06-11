/**
 * Search Event Factory
 * Creates standardized search event objects
 */

import { SearchEventModel, SearchEventDTO } from '@/entities/search-analytics/model';
import { CorrelationIdUtil } from './correlation-id';

export class SearchEventFactory {
  /**
   * Create a search event
   */
  static createSearchEvent(
    query: string,
    resultCount: number,
    success: boolean,
    errorCode?: string,
  ): SearchEventModel {
    return {
      timestamp: new Date().toISOString(),
      query,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
      resultCount,
      success,
      errorCode: errorCode || null,
      correlationId: CorrelationIdUtil.getOrGenerate(),
      eventType: 'search',
    };
  }

  /**
   * Create a repository view event
   */
  static createRepoViewEvent(
    username: string,
    repoName: string,
    stars: number,
    correlationId?: string,
  ): SearchEventModel {
    return {
      timestamp: new Date().toISOString(),
      query: `${username}/${repoName}`,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
      resultCount: 1,
      success: true,
      username,
      repoName,
      stars,
      correlationId: correlationId || CorrelationIdUtil.getOrGenerate(),
      eventType: 'repo_view',
    };
  }

  /**
   * Create a user view event
   */
  static createUserViewEvent(
    username: string,
    correlationId?: string,
  ): SearchEventModel {
    return {
      timestamp: new Date().toISOString(),
      query: username,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
      resultCount: 1,
      success: true,
      username,
      correlationId: correlationId || CorrelationIdUtil.getOrGenerate(),
      eventType: 'user_view',
    };
  }

  /**
   * Convert model to DTO
   */
  static toDTO(model: SearchEventModel): SearchEventDTO {
    return {
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
    };
  }
}
