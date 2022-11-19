
import Head from 'next/head'
import Layout from '../components/layout'
import styles from '../styles/Home.module.css'
import { Connection } from '../types/Connection'

export default function ConnectionsList() {
  const connections: Connection[] = [];
  return (
    <Layout>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Your connections
        </h1>
        <p className={styles.description}>
          Here you can add new connections and browse existing ones
        </p>
        <div className={`${styles.grid} border-4 border-indigo-400`}>
          <ul>
            {
              connections.map((v: Connection, i) => {
                return <li key={`connection-${i}`}>
                  address: {v.recipientAddress}
                  stake: {v.stake}
                </li>
              })
            }
          </ul>
        </div>
      </main>
    </Layout>
  )
}
