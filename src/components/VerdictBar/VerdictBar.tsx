import styles from './VerdictBar.module.css'

interface VerdictBarProps {
  score: number
  blurb: string
}

export function VerdictBar({ score, blurb }: VerdictBarProps) {
  return (
    <div className={styles.verdict}>
      <div className={styles.left}>
        <div className={styles.label}>Consumability Index</div>
        <p className={styles.blurb}>{blurb}</p>
      </div>
      <div className={styles.scoreNumber}>{Math.round(score)}</div>
    </div>
  )
}
