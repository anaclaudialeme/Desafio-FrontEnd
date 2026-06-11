/**
 * Use Search Users Hook
 * Handles GitHub user search with analytics
 */

'use client';

import { useState, useCallback } from 'react';
import { GitHubUser, SearchResultUser } from '@/entities/github-user/model';
import { GitHubRepository } from '@/entities/github-repo/model';
import { gitHubAdapter } from '@/shared/lib/api/github-adapter';
import { analyticsAdapter } from '@/shared/lib/api/analytics-adapter';
import { SearchEventFactory } from '@/shared/lib/analytics/factory';
import { CorrelationIdUtil } from '@/shared/lib/analytics/correlation-id';

interface UseSearchUsersReturn {
  users: SearchResultUser[];
  loading: boolean;
  error: string | null;
  search: (query: string) => Promise<void>;
  correlationId: string;
}

/**
 * Hook for searching GitHub users
 */
export function useSearchUsers(): UseSearchUsersReturn {
  const [users, setUsers] = useState<SearchResultUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const correlationId = CorrelationIdUtil.getOrGenerate();

  const search = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setUsers([]);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await gitHubAdapter.searchUsers(query, 30);

        // Fetch primary repository for each user
        const enrichedUsers: SearchResultUser[] = await Promise.all(
          result.items.map(async (user: GitHubUser) => {
            try {
              const repos = await gitHubAdapter.getUserRepositories(user.login, 1);
              const primaryRepo = repos[0];

              return {
                ...user,
                primaryRepository: primaryRepo
                  ? {
                      name: primaryRepo.name,
                      stars: primaryRepo.stargazers_count,
                    }
                  : undefined,
              };
            } catch {
              return user as SearchResultUser;
            }
          }),
        );

        setUsers(enrichedUsers);

        // Send analytics event
        const event = SearchEventFactory.createSearchEvent(
          query,
          enrichedUsers.length,
          true,
        );
        await analyticsAdapter.sendEvent(
          SearchEventFactory.toDTO(event),
        );
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        setUsers([]);

        // Send error analytics event
        const event = SearchEventFactory.createSearchEvent(
          query,
          0,
          false,
          errorMessage,
        );
        await analyticsAdapter.sendEvent(
          SearchEventFactory.toDTO(event),
        );
      } finally {
        setLoading(false);
      }
    },
    [correlationId],
  );

  return { users, loading, error, search, correlationId };
}
