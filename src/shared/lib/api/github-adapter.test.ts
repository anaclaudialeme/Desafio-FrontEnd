/**
 * GitHub Adapter Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GitHubAdapter } from '@/shared/lib/api/github-adapter';

describe('GitHubAdapter', () => {
  let adapter: GitHubAdapter;

  beforeEach(() => {
    adapter = new GitHubAdapter();
    // Mock fetch globally
    global.fetch = vi.fn();
  });

  describe('searchUsers', () => {
    it('should throw error if query is empty', async () => {
      await expect(adapter.searchUsers('')).rejects.toThrow(
        'Search query cannot be empty',
      );
    });

    it('should call fetch with correct URL', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({ items: [], total_count: 0 }),
      };
      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      await adapter.searchUsers('octocat');

      expect(global.fetch).toHaveBeenCalled();
      const callUrl = (global.fetch as any).mock.calls[0][0];
      expect(callUrl).toContain('/search/users');
      expect(callUrl).toContain('q=octocat');
    });

    it('should throw error on API failure', async () => {
      const mockResponse = {
        ok: false,
        status: 403,
        statusText: 'Forbidden',
      };
      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      await expect(adapter.searchUsers('test')).rejects.toThrow(
        'API error: 403 Forbidden',
      );
    });
  });

  describe('getUserDetails', () => {
    it('should throw error if username is empty', async () => {
      await expect(adapter.getUserDetails('')).rejects.toThrow(
        'Username cannot be empty',
      );
    });

    it('should call fetch with correct URL', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({ login: 'octocat' }),
      };
      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      await adapter.getUserDetails('octocat');

      expect(global.fetch).toHaveBeenCalled();
      const callUrl = (global.fetch as any).mock.calls[0][0];
      expect(callUrl).toContain('/users/octocat');
    });
  });

  describe('getUserRepositories', () => {
    it('should throw error if username is empty', async () => {
      await expect(adapter.getUserRepositories('')).rejects.toThrow(
        'Username cannot be empty',
      );
    });

    it('should call fetch with sort parameters', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue([]),
      };
      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      await adapter.getUserRepositories('octocat');

      expect(global.fetch).toHaveBeenCalled();
      const callUrl = (global.fetch as any).mock.calls[0][0];
      expect(callUrl).toContain('sort=stars');
      expect(callUrl).toContain('direction=desc');
    });
  });

  describe('getRepositoryDetails', () => {
    it('should throw error if owner or repo is empty', async () => {
      await expect(adapter.getRepositoryDetails('', 'repo')).rejects.toThrow(
        'Owner and repository name are required',
      );
      await expect(adapter.getRepositoryDetails('owner', '')).rejects.toThrow(
        'Owner and repository name are required',
      );
    });

    it('should call fetch with correct URL', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({ name: 'Hello-World' }),
      };
      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      await adapter.getRepositoryDetails('octocat', 'Hello-World');

      expect(global.fetch).toHaveBeenCalled();
      const callUrl = (global.fetch as any).mock.calls[0][0];
      expect(callUrl).toContain('/repos/octocat/Hello-World');
    });
  });
});
