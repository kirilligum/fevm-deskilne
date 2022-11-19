

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import { Connection } from '../types/Connection'

export default function Messages() {
  // get connections from api
  const connections: Connection[] = [];
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Your message history
        </h1>
        <div className={styles.grid}>
          <ul>
            {
              connections.map((v: Connection, i) => {
                return <li key={`connection-${i}`}>
                  address: {v.recipientAddress}
                  stake: {v.stake}
                  <button onClick={() => console.log('will send message')}>
                    Send them a message
                  </button>
                </li>
              })
            }
          </ul>
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
