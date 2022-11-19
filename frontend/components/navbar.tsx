
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import styles from '../styles/Home.module.css'

export default function Navbar() {
  return <div className={styles.container}>
    <Head>
      <title>Deskilne</title>
      <meta name="description" content="Decentralized networking" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <nav>
      <p> some option</p>
      <Link href={'/ConnectionTest'}>
        check wallet connection
      </Link>
    </nav>
  </div>
}
