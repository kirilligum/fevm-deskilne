import { useWeb3Modal, Web3Button } from '@web3modal/react'
import Link from 'next/link'
import { useAccount } from 'wagmi'
import Layout from '../components/layout'
import { LiquidAnimation } from '../components/LiquidAnimation'
import styles from '../styles/Home.module.css'

export default function Home() {
  const { isConnected } = useAccount()
  const { open } = useWeb3Modal()
  return (
    <Layout>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Sw/.tch
        </h1>

        <div className={`${styles.grid} border-4 border-indigo-400`}>
          <a href="https://github.com/kirilligum/fevm-deskilne" className={styles.card}>
            <h2>What is Sw/.tch? &rarr;</h2>
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
          <LiquidAnimation />
        </div>
      </main>
    </Layout>
  )
}
