import { redirect } from 'next/dist/server/api-utils'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { ConnectionStatusCard } from '../components/ConnectionStatusCard'
import Layout from '../components/layout'
import { MintNFTForm } from '../components/MintNFTForm'
import { SignMessage } from '../components/SignMessage'
import { MintNft } from '../components/WagmiMint'
import styles from '../styles/Home.module.css'


const remoteContractUrl: string = 'https://explorer.glif.io/tx/0x94c2663f8bc3e2ebaba3975ad091aefb2cae0ed51364997143aba771aed8621f/?network=wallabynet';
// https://github.com/NftTopBest/example-chat-react-gitcoin-hackathon 

export default function Profile() {
  const { isConnected } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect()
  const { disconnect } = useDisconnect()
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
            <MintNFTForm adddress='' />
            {isConnected && <SignMessage />}
          </div>
        </div>
      </main>
    </Layout>
  )
}


