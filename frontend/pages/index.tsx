import Link from 'next/link'
import Layout from '../components/layout'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <Layout>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Deskilne
        </h1>
        <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.tsx</code>
        </p>
        <div className={styles.grid}>
          <a href="https://github.com/kirilligum/fevm-deskilne" className={styles.card}>
            <h2>What is Deskilne? &rarr;</h2>
            <p>Decentralized professional networking tool</p>
            <p>You own your data</p>
          </a>
          <div className={styles.card}>
            <Link href="/profile">Create a profile!</Link>
          </div>
        </div>
      </main>
    </Layout>
  )
}
