/**
 * Use User Repositories Hook
 * Handles fetching and managing user repositories
 */

'use client';

import { useState, useCallback } from 'react';
import { GitHubRepository } from '@/entities/github-repo/model';
import { gitHubAdapter } from '@/shared/lib/api/github-adapter';

export type SortBy = 'stars' | 'name';
export type SortOrder = 'asc' | 'desc';

interface UseUserRepositoriesReturn {
  repositories: GitHubRepository[];
  loading: boolean;
  error: string | null;
  sortBy: SortBy;
  sortOrder: SortOrder;
  setSortBy: (sort: SortBy) => void;
  setSortOrder: (order: SortOrder) => void;
  fetchRepositories: (username: string) => Promise<void>;
  getSortedRepositories: () => GitHubRepository[];
}

/**
 * Hook for managing user repositories with sorting
 */
export function useUserRepositories(): UseUserRepositoriesReturn {
  const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>('stars');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const fetchRepositories = useCallback(async (username: string) => {
    if (!username.trim()) {
      setRepositories([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const repos = await gitHubAdapter.getUserRepositories(username, 100);
      setRepositories(repos);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setRepositories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const getSortedRepositories = useCallback((): GitHubRepository[] => {
    const sorted = [...repositories];

    sorted.sort((a, b) => {
      let compareValue = 0;

      if (sortBy === 'stars') {
        compareValue = a.stargazers_count - b.stargazers_count;
      } else if (sortBy === 'name') {
        compareValue = a.name.localeCompare(b.name);
      }

      return sortOrder === 'asc' ? compareValue : -compareValue;
    });

    return sorted;
  }, [repositories, sortBy, sortOrder]);

  return {
    repositories,
    loading,
    error,
    sortBy,
    sortOrder,
    setSortBy,
    setSortOrder,
    fetchRepositories,
    getSortedRepositories,
  };
}
