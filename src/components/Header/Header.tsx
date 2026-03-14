import Link from 'next/link'
import styles from './Header.module.css'

export function Header() {
  return (
    <header>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>MONSTERS</Link>
        <div className={styles.links}>
          <Link href="/browse">Browse</Link>
          <Link href="/about">About</Link>
        </div>
      </nav>
    </header>
  )
}
