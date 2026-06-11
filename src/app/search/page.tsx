'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/results?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>GitHub User Search</h1>
        <p className={styles.subtitle}>Find GitHub users and explore their repositories</p>

        <form onSubmit={handleSearch} className={styles.form}>
          <input
            type="text"
            placeholder="Enter GitHub username..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.input}
            autoFocus
          />
          <button type="submit" className={styles.button}>
            Search
          </button>
        </form>
      </div>
    </div>
  );
}
