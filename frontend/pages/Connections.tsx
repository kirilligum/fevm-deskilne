import { useAccount } from 'wagmi';
import Layout from '../components/layout';
import { SendTransactionForm } from '../components/TransactionForm';
import styles from '../styles/Home.module.css';
import { Connection } from '../types/Connection';

export default function ConnectionsList() {
  const { isConnected } = useAccount()
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
          {isConnected && <SendTransactionForm />}
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
