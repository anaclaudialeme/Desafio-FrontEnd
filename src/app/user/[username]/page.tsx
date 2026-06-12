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
import { useSearchParams } from 'next/navigation';

interface UserPageProps {
  params: {
    username: string;
  };
}

export default function UserPage({ params }: UserPageProps) {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const { username } = params;
  const [user, setUser] = useState<GitHubUser | null>(null);
  const {
    fetchRepositories,
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

  return (
    <div className={styles.container}>
      <Link
        href={query ? `/results?q=${encodeURIComponent(query)}` : '/results'}
        className={styles.backButton}
      >
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
    </div>
  );
}
