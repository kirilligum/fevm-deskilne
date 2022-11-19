import Layout from '../components/layout'
import styles from '../styles/Home.module.css'

export default function Profile() {
  return (
    <Layout>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Your profile
        </h1>
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
    </Layout>
  )
}
