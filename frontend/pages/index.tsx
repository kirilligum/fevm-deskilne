import Link from 'next/link'
import { useWeb3Modal, Web3Button } from '@web3modal/react'
import Layout from '../components/layout'
import styles from '../styles/Home.module.css'
import { useAccount } from 'wagmi'

export default function Home() {
  const { isConnected } = useAccount()
  const { open } = useWeb3Modal()
  return (
    <Layout>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Deskilne
        </h1>
     
        <div className={styles.grid}>
          <a href="https://github.com/kirilligum/fevm-deskilne" className={styles.card}>
            <h2>What is Deskilne? &rarr;</h2>
            <p>Decentralized professional networking tool</p>
            <p>You own your data</p>
          </a>
          <Web3Button />
          {/* {!isConnected && (
            <>
              <p>--- or ---</p>
              <button onClick={() => open()}>Custom Button</button>
            </>
          )} */}
          <div className={styles.card}>
            <Link href="/Profile">Create a profile!</Link>
          </div>
        </div>
      </main>
    </Layout>
  )
}
