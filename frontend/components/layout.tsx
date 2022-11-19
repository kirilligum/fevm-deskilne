import Footer from './footer'
import styles from '../styles/Home.module.css'
import Navbar from './navbar'

export default function Layout(props: { children: JSX.Element }) {
  return (
    <div className={`${styles.container} bg-white text-white  dark:bg-gray-700 h-100`}>
      <Navbar />
      <main>{props.children}</main>
      <Footer />
    </div>
  )
}
