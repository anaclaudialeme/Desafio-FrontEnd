'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.scss';

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
        <p className={styles.subtitle}>Encontre os usuários no GitHub e explore seus repositórios</p>

        <form onSubmit={handleSearch} className={styles.form}>
          <input
            type="text"
            placeholder="Digite o usuário GitHub..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.input}
            autoFocus
          />
          <button type="submit" className={styles.button}>
            Pesquisar
          </button>
        </form>
      </div>
    </div>
  );
}
