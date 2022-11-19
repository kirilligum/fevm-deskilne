import Layout from '../components/layout'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from 'wagmi'

export default function Profile() {
  return (
    <Layout>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Your profile
        </h1>
        <div className={`${styles.grid} border-4 border-indigo-400`}>
          <button className={styles.button}>
            <h2>connect wallet &rarr;</h2>
          </button>
          <div className={styles.card}>
            <button className={styles.button}>
              <h2>Set fee to connect to you &rarr;</h2>
            </button>
          </div>  </div>
        <div className={styles.card}>
          <button className={styles.button}>
            <h2>remove my resume &rarr;</h2>
          </button>
        </div>
        <div className={styles.card}>
          <button className={styles.button}>
            <h2>input resume &rarr;</h2>
          </button>
        </div>

        <div className={styles.card}>
          <NewProfile />
        </div>
      </main>
    </Layout>
  )
}



export function NewProfile() {
  const { address, connector, isConnected } = useAccount()
  const { data: ensAvatar } = useEnsAvatar({ address })
  const { data: ensName } = useEnsName({ address })
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected) {
    return (
      <div>
        <Image src={ensAvatar ?? ''} alt="ENS Avatar" />
        <div>{ensName ? `${ensName} (${address})` : address}</div>
        <div>Connected to {connector!.name}</div>
        <button onClick={() => disconnect()}>Disconnect</button>
      </div>
    )
  }

  return (
    <div>
      {connectors.map((connector) => (
        <button
          disabled={!connector.ready}
          key={connector.id}
          onClick={() => connect({ connector })}
        >
          Current connection provider: {connector.name}
          {!connector.ready && ' (unsupported)'}
          {isLoading &&
            connector.id === pendingConnector?.id &&
            ' (connecting)'}
        </button>
      ))}

      {error && <div>{error.message}</div>}
    </div>
  )
}
