/**
 * GitHub API Adapter
 * Handles all interactions with GitHub REST API
 */

import { GitHubUser, SearchUsersResponse } from '@/entities/github-user/model';
import { GitHubRepository } from '@/entities/github-repo/model';

export class GitHubAdapter {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_GITHUB_API_BASE_URL || 'https://api.github.com';
    this.apiKey = process.env.GITHUB_API_KEY || '';
  }

  /**
   * Search for GitHub users
   */
  async searchUsers(query: string, perPage: number = 30): Promise<SearchUsersResponse> {
    if (!query.trim()) {
      throw new Error('Search query cannot be empty');
    }

    const url = new URL(`${this.baseUrl}/search/users`);
    url.searchParams.append('q', query);
    url.searchParams.append('per_page', perPage.toString());

    const response = await fetch(url.toString(), {
      headers: this.getHeaders(),
      signal: this.getAbortSignal(),
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get user details
   */
  async getUserDetails(username: string): Promise<GitHubUser> {
    if (!username.trim()) {
      throw new Error('Username cannot be empty');
    }

    const url = `${this.baseUrl}/users/${username}`;
    const response = await fetch(url, {
      headers: this.getHeaders(),
      signal: this.getAbortSignal(),
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get user repositories
   */
  async getUserRepositories(username: string, perPage: number = 100): Promise<GitHubRepository[]> {
    if (!username.trim()) {
      throw new Error('Username cannot be empty');
    }

    const url = new URL(`${this.baseUrl}/users/${username}/repos`);
    url.searchParams.append('per_page', perPage.toString());
    url.searchParams.append('sort', 'stars');
    url.searchParams.append('direction', 'desc');

    const response = await fetch(url.toString(), {
      headers: this.getHeaders(),
      signal: this.getAbortSignal(),
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get repository details
   */
  async getRepositoryDetails(owner: string, repo: string): Promise<GitHubRepository> {
    if (!owner.trim() || !repo.trim()) {
      throw new Error('Owner and repository name are required');
    }

    const url = `${this.baseUrl}/repos/${owner}/${repo}`;
    const response = await fetch(url, {
      headers: this.getHeaders(),
      signal: this.getAbortSignal(),
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get request headers with authorization if available
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      headers['Authorization'] = `token ${this.apiKey}`;
    }

    return headers;
  }

  /**
   * Get abort signal for request timeout (30 seconds)
   */
  private getAbortSignal(): AbortSignal {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    // This is a simplified approach; in production, cleanup should be handled differently
    return controller.signal;
  }
}

export const gitHubAdapter = new GitHubAdapter();
