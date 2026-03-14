import Link from 'next/link'
import styles from './ArtistCard.module.css'
import type { Artist } from '@/lib/scoring/types'

interface ArtistCardProps {
  artist: Pick<Artist, 'id' | 'name' | 'domain' | 'verdict'>
}

export function ArtistCard({ artist }: ArtistCardProps) {
  const score = artist.verdict.score != null ? Math.round(artist.verdict.score) : '—'
  return (
    <Link href={`/artist/${artist.id}`} className={styles.card}>
      <div className={styles.domain}>{artist.domain}</div>
      <div className={styles.name}>{artist.name.toUpperCase()}</div>
      <div className={styles.score}>{score}</div>
    </Link>
  )
}
