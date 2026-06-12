'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUserRepositories } from '@/shared/lib/hooks/useUserRepositories';
import { analyticsAdapter } from '@/shared/lib/api/analytics-adapter';
import { SearchEventFactory } from '@/shared/lib/analytics/factory';
import { gitHubAdapter } from '@/shared/lib/api/github-adapter';
import { GitHubUser } from '@/entities/github-user/model';
import styles from './page.module.scss';

interface UserPageProps {
  params: {
    username: string;
  };
}

export default function UserPage({ params }: UserPageProps) {
  const { username } = params;
  const [user, setUser] = useState<GitHubUser | null>(null);
  const {
    repositories,
    loading,
    error,
    sortBy,
    sortOrder,
    setSortBy,
    setSortOrder,
    fetchRepositories,
    getSortedRepositories,
  } = useUserRepositories();

  useEffect(() => {
    const loadUserAndRepos = async () => {
      try {
        const userData = await gitHubAdapter.getUserDetails(username);
        setUser(userData);
        await fetchRepositories(username);

        // Send analytics event
        const event = SearchEventFactory.createUserViewEvent(username);
        await analyticsAdapter.sendEvent(SearchEventFactory.toDTO(event));
      } catch (err) {
        console.error('Failed to load user:', err);
      }
    };

    loadUserAndRepos();
  }, [username, fetchRepositories]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as 'stars' | 'name');
  };

  const handleOrderToggle = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const sortedRepos = getSortedRepositories();

  return (
    <div className={styles.container}>
      <Link href="/results" className={styles.backButton}>
        ← Voltar aos resultados
      </Link>

      {user && (
        <div className={styles.userCard}>
          <Image
            src={user.avatar_url}
            alt={user.login}
            width={100}
            height={100}
            className={styles.avatar}
          />
          <div className={styles.userInfo}>
            <h1 className={styles.userName}>{user.name || user.login}</h1>
            <p className={styles.userLogin}>@{user.login}</p>
            {user.bio && <p className={styles.bio}>{user.bio}</p>}
            {user.location && <p className={styles.location}>📍 {user.location}</p>}
            <div className={styles.stats}>
              <div>
                <span className={styles.statLabel}>Followers</span>
                <p className={styles.statValue}>{user.followers}</p>
              </div>
              <div>
                <span className={styles.statLabel}>Following</span>
                <p className={styles.statValue}>{user.following}</p>
              </div>
              <div>
                <span className={styles.statLabel}>Public Repos</span>
                <p className={styles.statValue}>{user.public_repos}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={styles.reposHeader}>
        <h2>Repositories</h2>
        <div className={styles.controls}>
          <select value={sortBy} onChange={handleSortChange} className={styles.select}>
            <option value="stars">Sort by Stars</option>
            <option value="name">Sort by Name</option>
          </select>
          <button onClick={handleOrderToggle} className={styles.orderButton}>
            {sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
          </button>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}
      {loading && <div className={styles.loading}>Loading repositories...</div>}

      {!loading && !error && sortedRepos.length === 0 && (
        <p className={styles.noRepos}>No repositories found.</p>
      )}

      {!loading && !error && sortedRepos.length > 0 && (
        <div className={styles.reposList}>
          {sortedRepos.map((repo) => (
            <a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.repoCard}
            >
              <h3 className={styles.repoName}>{repo.name}</h3>
              {repo.description && <p className={styles.repoDescription}>{repo.description}</p>}
              <div className={styles.repoMeta}>
                <span className={styles.language}>{repo.language || 'N/A'}</span>
                <span className={styles.stars}>⭐ {repo.stargazers_count}</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
