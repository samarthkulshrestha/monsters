import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <span>Based on the framework by Jon Ronson &amp; the Dederer Doctrine</span>
      <span>&copy; {new Date().getFullYear()} Monsters Calculator</span>
    </footer>
  )
}
