import styles from './ScoreCard.module.css'
import type { ScoringBreakdown } from '@/lib/scoring/types'

interface ScoreCardProps {
  breakdown: ScoringBreakdown
}

export function ScoreCard({ breakdown }: ScoreCardProps) {
  const monsterScore = Math.round(
    ((breakdown.consequentialist + breakdown.deontological + breakdown.virtue + breakdown.care) / 4) * 100
  )
  const artScore = Math.round(breakdown.art_merit * 100)

  return (
    <div className={styles.card}>
      <div className={styles.scores}>
        <div className={styles.scoreItem}>
          <div className={styles.scoreNumber} data-variant="monster">{monsterScore}</div>
          <div className={styles.scoreLabel}>The Monster</div>
          <div className={styles.scoreDesc}>Composite ethical score across four lenses</div>
        </div>
        <div className={styles.divider} />
        <div className={styles.scoreItem}>
          <div className={styles.scoreNumber} data-variant="art">{artScore}</div>
          <div className={styles.scoreLabel}>The Art</div>
          <div className={styles.scoreDesc}>Significance, influence, and irreplaceability</div>
        </div>
      </div>
    </div>
  )
}
