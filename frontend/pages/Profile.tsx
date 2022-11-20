import { redirect } from 'next/dist/server/api-utils'
import { useState } from 'react'
import Swal from 'sweetalert2'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Web3Storage } from 'web3.storage'
import { ConnectionStatusCard } from '../components/ConnectionStatusCard'
import Layout from '../components/layout'
import { MintNFTForm } from '../components/MintNFTForm'
import { Resume, ResumeForm } from '../components/ResumeForm'
import { SignMessage } from '../components/SignMessage'
import { MintNft } from '../components/WagmiMint'
import styles from '../styles/Home.module.css'
import { makeFileObjects } from './makeFileObjects'


const remoteContractUrl: string = 'https://explorer.glif.io/tx/0x94c2663f8bc3e2ebaba3975ad091aefb2cae0ed51364997143aba771aed8621f/?network=wallabynet';
// https://github.com/NftTopBest/example-chat-react-gitcoin-hackathon 

export default function Profile() {
  const { isConnected } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect()
  const { disconnect } = useDisconnect()

  const [urlArr, setUrlArr] = useState([] as string[]);
  const WEB3_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEUwNzY0ZkMzMkM5ZTQwQjIyMkQwNjE1NzBkMTJkODlENzMxMDcyNkQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2Njc3MTMzMDQwMzksIm5hbWUiOiJldGhnbG9iYWwifQ.aeOrkh_4IAx4SwMjWDotoZYlWwB-HcODQqSLBRp3X0A'

  const web3Client = new Web3Storage({ token: WEB3_TOKEN })
  const handleResumeUpload = async (r: Resume) => {
    try {
      const files = makeFileObjects(r)
      const resumeFile: File = files[0];
      const cid = await web3Client.put([resumeFile], { maxRetries: 1, })
      let url = `https://ipfs.io/ipfs/${cid}/${resumeFile.name}`
      setUrlArr([url]);
      Swal.fire(
        'Success!',
        `your resume is available at ${url}`,
        'success'
      )
    } catch (error) {
      console.log(error);
      Swal.fire(
        'failed!',
        `Could not upload your resume`,
        'error'
      )
    };
  }

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
            <h3>current location of your resume on IPFS: {urlArr}</h3>
          </div>
          <div className={styles.card}>
            <ResumeForm callback={(r) => handleResumeUpload(r)} />
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


