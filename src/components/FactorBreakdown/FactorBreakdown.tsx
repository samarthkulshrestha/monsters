import styles from './FactorBreakdown.module.css'
import type { ScoringBreakdown } from '@/lib/scoring/types'

interface FactorBreakdownProps {
  breakdown: ScoringBreakdown
}

const FACTORS: { key: keyof ScoringBreakdown; label: string }[] = [
  { key: 'consequentialist', label: 'Consequentialist' },
  { key: 'deontological', label: 'Deontological' },
  { key: 'virtue', label: 'Virtue Ethics' },
  { key: 'care', label: 'Care Ethics' },
  { key: 'temporal_factor', label: 'Temporal Factor' },
  { key: 'accountability_factor', label: 'Accountability' },
]

export function FactorBreakdown({ breakdown }: FactorBreakdownProps) {
  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>Factor Breakdown</h3>
      <div className={styles.list}>
        {FACTORS.map(({ key, label }) => {
          const value = breakdown[key] as number
          const pct = Math.round(value * 100)
          return (
            <div key={key} className={styles.row}>
              <span className={styles.name}>{label}</span>
              <div className={styles.barTrack}>
                <div className={styles.bar} style={{ width: `${pct}%` }} />
              </div>
              <span className={styles.value}>{pct}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
