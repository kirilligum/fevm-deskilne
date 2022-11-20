import { useState } from "react";
import { Web3Storage } from "web3.storage";
import Layout from "../components/layout";
import { Resume, ResumeForm } from "../components/ResumeForm";
import styles from '../styles/Home.module.css';
import { makeFileObjects } from "./makeFileObjects";

export default function MyResume(): JSX.Element {
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
    } catch (error) {
      console.log(error);
    };
  }
  return <Layout>
    <div className={styles.container}>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h3>current location of your resume on IPFS: {urlArr}</h3>
        </div>
        <div className={styles.card}>
          <ResumeForm callback={(r) => handleResumeUpload(r)} />
        </div>
      </div>
    </div>
  </Layout >
}

