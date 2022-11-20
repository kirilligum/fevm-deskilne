import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

export default function Navbar() {
  return <div className={`${styles.container} bg-white border-gray-200 rounded dark:bg-gray-900 h-100`} >
    <Head>
      <title>Deskilne</title>
      <meta name="description" content="Decentralized networking" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <nav className='container flex flex-wrap items-center justify-between mx-auto'>
      <Link className='self-center text-xl font-semibold whitespace-nowrap dark:text-white' href={'/'}>Home</Link>
      <Link className='self-center text-xl font-semibold whitespace-nowrap dark:text-white' href={'/Profile'}> Profile </Link>
      <Link className='self-center text-xl font-semibold whitespace-nowrap dark:text-white' href={'/Connections'}> Connections</Link>
    </nav>
  </div>
}
