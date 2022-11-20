import { create, IPFSHTTPClient } from "ipfs-http-client";
import { useState } from "react";
import { Web3Storage } from "web3.storage";
import Layout from "../components/layout";
import { Resume, ResumeForm } from "../components/ResumeForm";
import styles from '../styles/Home.module.css';


function makeFileObjects(obj: Object): File[] {
  const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' })
  const files = [
    new File([blob], 'resume.json'),
    new File(['contents-of-file-1'], 'plain-utf8.txt')
  ]
  return files
}


export default function MyResume(): JSX.Element {
  const [urlArr, setUrlArr] = useState([] as string[]);
  const WEB3_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEUwNzY0ZkMzMkM5ZTQwQjIyMkQwNjE1NzBkMTJkODlENzMxMDcyNkQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2Njc3MTMzMDQwMzksIm5hbWUiOiJldGhnbG9iYWwifQ.aeOrkh_4IAx4SwMjWDotoZYlWwB-HcODQqSLBRp3X0A'

  const web3Client = new Web3Storage({ token: WEB3_TOKEN })

  // const infuraUrl = 'https://ipfs.infura.io:5001/api/v0';
  // const client: IPFSHTTPClient = create({ url: infuraUrl });

  const handleResumeUpload = async (r: Resume) => {
    try {
      // todo here upload
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

