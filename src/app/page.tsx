'use client';

import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Bem-vindo ao GitHub User Search</h1>
        <p className={styles.description}>
          Clique abaixo para iniciar sua busca por usuários no github
        </p>
        <Link href="/search" className={styles.button}>
          Buscar
        </Link>
      </div>
    </main>
  );
}
