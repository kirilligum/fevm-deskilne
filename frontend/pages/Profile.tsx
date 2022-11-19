import Layout from '../components/layout'
import styles from '../styles/Home.module.css'
import { ConnectionStatusCard } from '../components/ConnectionStatusCard'

export default function Profile() {
  return (
    <Layout>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Your profile
        </h1>
        <div className={`${styles.grid} border-4 border-indigo-400`}>
          <div className={styles.card}>
            <button className={styles.button}>
              <h2>Set fee to connect to you &rarr;</h2>
            </button>
          </div>
          <div className={styles.card}>
            <button className={styles.button}>
              <h2>input resume &rarr;</h2>
            </button>
            <button className={styles.button}>
              <h2>remove my resume &rarr;</h2>
            </button>
          </div>
          <div className={styles.card}>
            <ConnectionStatusCard />
          </div>
        </div>
      </main>
    </Layout>
  )
}


