'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchUsers } from '@/shared/lib/hooks/useSearchUsers';
import { SearchResultUser } from '@/entities/github-user/model';
import { SortBy, SortOrder } from '@/shared/lib/hooks/useUserRepositories';
import styles from './page.module.scss';

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const { users, loading, error, search } = useSearchUsers();
  const [sortBy, setSortBy] = useState<SortBy>('stars');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  useEffect(() => {
    if (query) {
      search(query);
    }
  }, [query, search]);

  const sortedUsers = [...users].sort((a, b) => {
    let compareValue = 0;

    if (sortBy === 'stars') {
      const aStars = a.primaryRepository?.stars ?? 0;
      const bStars = b.primaryRepository?.stars ?? 0;
      compareValue = aStars - bStars;
    } else if (sortBy === 'name') {
      const aName = a.primaryRepository?.name ?? '';
      const bName = b.primaryRepository?.name ?? '';
      compareValue = aName.localeCompare(bName);
    }

    return sortOrder === 'asc' ? compareValue : -compareValue;
  });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/search" className={styles.backButton}>
          ← Voltar a pesquisa
        </Link>
        <h1 className={styles.title}>Resultado da pesquisa</h1>
        <p className={styles.query}>Resultado para: <strong>{query}</strong></p>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          <p>Error: {error}</p>
          <button onClick={() => search(query)} className={styles.retryButton}>
            Tentar novamente
          </button>
        </div>
      )}

      {loading && (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <p>Loading...</p>
        </div>
      )}

      {!loading && !error && users.length === 0 && (
        <div className={styles.emptyState}>
          <p>Nenhum usuário encontrado. Tente um nome diferente no campo de pesquisa.</p>
        </div>
      )}

      {!loading && !error && users.length > 0 && (
        <>
          <div className={styles.controls}>
            <div className={styles.sortGroup}>
              <label>Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className={styles.select}
              >
                <option value="stars">Stars</option>
                <option value="name">Repository Name</option>
              </select>
              <button
                onClick={toggleSortOrder}
                className={styles.orderButton}
                title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              >
                {sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
              </button>
            </div>
            <p className={styles.resultCount}>{users.length} usuários encontrados</p>
          </div>

          <div className={styles.usersList}>
            {sortedUsers.map((user) => (
              <Link
                key={user.id}
                href={`/user/${user.login}`}
                className={styles.userCard}
              >
                <div className={styles.userHeader}>
                  <Image
                    src={user.avatar_url}
                    alt={user.login}
                    width={64}
                    height={64}
                    className={styles.avatar}
                  />
                  <div className={styles.userInfo}>
                    <h2 className={styles.userName}>{user.name || user.login}</h2>
                    <p className={styles.userLogin}>@{user.login}</p>
                  </div>
                </div>

                {user.bio && <p className={styles.userBio}>{user.bio}</p>}

                <div className={styles.userStats}>
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>Followers</span>
                    <span className={styles.statValue}>{user.followers}</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>Following</span>
                    <span className={styles.statValue}>{user.following}</span>
                  </div>
                  {user.primaryRepository && (
                    <div className={styles.stat}>
                      <span className={styles.statLabel}>Top Repo Stars</span>
                      <span className={styles.statValue}>{user.primaryRepository.stars}</span>
                    </div>
                  )}
                </div>

                {user.location && (
                  <p className={styles.userLocation}>📍 {user.location}</p>
                )}

                {user.primaryRepository && (
                  <div className={styles.primaryRepo}>
                    <span className={styles.repoLabel}>Top Repository</span>
                    <p className={styles.repoName}>{user.primaryRepository.name}</p>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
