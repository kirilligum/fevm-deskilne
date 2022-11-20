import { create, IPFSHTTPClient } from "ipfs-http-client";
import { useState } from "react";
import Layout from "../components/layout";
import { Resume, ResumeForm } from "../components/ResumeForm";
import styles from '../styles/Home.module.css';

const infuraUrl = 'https://ipfs.infura.io:5001/api/v0';
const client: IPFSHTTPClient = create({ url: infuraUrl });

export default function MyResume(): JSX.Element {
  const [urlArr, setUrlArr] = useState([]);

  const handleResumeUpload = async (r: Resume) => {
    try {
      const j: string = JSON.stringify(r);
      // todo here upload
    } catch (error) {
      console.log(error);
    };
  }
  return <Layout>
    <div className={styles.container}>

      <h3>current location of your resume on IPFS: {urlArr}</h3>
      <ResumeForm callback={handleResumeUpload} />

    </div>
  </Layout >
}

