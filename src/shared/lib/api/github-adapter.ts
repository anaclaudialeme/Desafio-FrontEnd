/**
 * GitHub API Adapter
 * Handles all interactions with GitHub REST API through backend proxy
 */

import { GitHubUser, SearchUsersResponse } from '@/entities/github-user/model';
import { GitHubRepository } from '@/entities/github-repo/model';

export class GitHubAdapter {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_GITHUB_API_BASE_URL || 'http://localhost:3000/api';
  }

  /**
   * Search for GitHub users
   */
  async searchUsers(query: string, perPage: number = 30): Promise<SearchUsersResponse> {
    if (!query.trim()) {
      throw new Error('Search query cannot be empty');
    }

    const params = new URLSearchParams({
      q: query,
      per_page: perPage.toString(),
    });

    try {
      const response = await fetch(`${this.baseUrl}/search/users?${params.toString()}`, {
        method: 'GET',
        signal: this.getAbortSignal(),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  /**
   * Get user details
   */
  async getUserDetails(username: string): Promise<GitHubUser> {
    if (!username.trim()) {
      throw new Error('Username cannot be empty');
    }

    try {
      const response = await fetch(`${this.baseUrl}/users/${username}`, {
        method: 'GET',
        signal: this.getAbortSignal(),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  /**
   * Get user repositories
   */
  async getUserRepositories(username: string, perPage: number = 100): Promise<GitHubRepository[]> {
    if (!username.trim()) {
      throw new Error('Username cannot be empty');
    }

    const params = new URLSearchParams({
      per_page: perPage.toString(),
      sort: 'stars',
      direction: 'desc',
    });

    try {
      const response = await fetch(`${this.baseUrl}/users/${username}/repos?${params.toString()}`, {
        method: 'GET',
        signal: this.getAbortSignal(),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  /**
   * Get repository details
   */
  async getRepositoryDetails(owner: string, repo: string): Promise<GitHubRepository> {
    if (!owner.trim() || !repo.trim()) {
      throw new Error('Owner and repository name are required');
    }

    try {
      const response = await fetch(`${this.baseUrl}/repos/${owner}/${repo}`, {
        method: 'GET',
        signal: this.getAbortSignal(),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  /**
   * Get abort signal for request timeout (10 seconds)
   */
  private getAbortSignal(): AbortSignal {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    return controller.signal;
  }
}

export const gitHubAdapter = new GitHubAdapter();
