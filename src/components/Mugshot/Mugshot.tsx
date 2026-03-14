import Image from 'next/image'
import styles from './Mugshot.module.css'

interface MugshotProps {
  src: string
  alt: string
  number: number
}

export function Mugshot({ src, alt, number }: MugshotProps) {
  return (
    <div className={styles.mugshot}>
      <div className={styles.overlay} />
      <Image src={src} alt={alt} fill className={styles.image} sizes="280px" />
      <div className={styles.markers}>
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} className={styles.marker} />
        ))}
      </div>
      <div className={styles.plaque}>No. {String(number).padStart(3, '0')}</div>
    </div>
  )
}
