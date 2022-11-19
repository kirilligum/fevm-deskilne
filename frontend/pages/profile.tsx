import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import styles from '../styles/Home.module.css'

export default function Profile() {
  const [isConnected, setisConnected] = useState(false);
  return (
    <div className={styles.container}>
      <Head>
        <title>Deskilne</title>
        <meta name="description" content="Decentralized networking" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Your profile
        </h1>
        <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.tsx</code>
        </p>

        <div className={styles.grid}>
          <button className={styles.button}>
            <h2>connect wallet &rarr;</h2>
          </button>
         <div className={styles.grid}>
          <button className={styles.button}>
            <h2>Set fee to connect to you &rarr;</h2>
          </button>
        </div>  </div>
        <div className={styles.grid}>
          <button className={styles.button}>
            <h2>remove my resume &rarr;</h2>
          </button>
        </div>
        <div className={styles.grid}>
          <button className={styles.button}>
            <h2>input resume &rarr;</h2>
          </button>
        </div>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
