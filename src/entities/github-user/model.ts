/**
 * GitHub User Entity
 * Represents a GitHub user retrieved from GitHub API
 */
export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string;
  location: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

/**
 * Search Results User (simplified for list view)
 * Contains essential info + primary repo data
 */
export interface SearchResultUser extends Omit<GitHubUser, 'url' | 'html_url' | 'company' | 'blog' | 'public_repos' | 'created_at' | 'updated_at'> {
  primaryRepository?: {
    name: string;
    stars: number;
  };
}

export interface SearchUsersResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubUser[];
}
