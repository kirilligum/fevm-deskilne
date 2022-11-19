import Footer from './footer'
import styles from '../styles/Home.module.css'
import Navbar from './navbar'

export default function Layout(props: { children: JSX.Element }) {
  return (
    <div className={styles.container}>
      <Navbar />
      <main>{props.children}</main>
      <Footer />
    </div>
  )
}
