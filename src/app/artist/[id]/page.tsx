import { loadArtist, loadAllArtists, getArtistBreakdown } from '@/lib/data'
import { Mugshot } from '@/components/Mugshot/Mugshot'
import { ScoreCard } from '@/components/ScoreCard/ScoreCard'
import { VerdictBar } from '@/components/VerdictBar/VerdictBar'
import { FactorBreakdown } from '@/components/FactorBreakdown/FactorBreakdown'
import styles from './page.module.css'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  const artists = loadAllArtists()
  return artists.map((artist) => ({ id: artist.id }))
}

export default async function ArtistPage({ params }: PageProps) {
  const { id } = await params
  const artist = loadArtist(id)
  const breakdown = getArtistBreakdown(id)

  const artistIndex = loadAllArtists().findIndex((a) => a.id === id) + 1
  const score = artist.verdict.score ?? breakdown.final_score

  return (
    <div className={styles.page}>
      {/* Section label bar */}
      <div className={styles.labelBar}>
        <span className={styles.labelLeft}>Artist Assessment</span>
        <span className={styles.labelRight}>No. {String(artistIndex).padStart(3, '0')}</span>
      </div>

      {/* Artist header */}
      <div className={styles.header}>
        <Mugshot
          src={`/portraits/${artist.portrait}`}
          alt={artist.name}
          number={artistIndex}
        />
        <div className={styles.info}>
          <div className={styles.domain}>{artist.domain} / {artist.sub_domain}</div>
          <h1 className={styles.name}>{artist.name.toUpperCase()}</h1>
          <p className={styles.summary}>{artist.behavior_summary}</p>
          <div className={styles.meta}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Primary works</span>
              <span className={styles.metaValue}>{artist.art.notable_works.join(', ')}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Art</span>
              <span className={styles.metaValue}>{artist.art.summary}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Score components */}
      <ScoreCard breakdown={breakdown} />
      <VerdictBar score={score} blurb={artist.verdict.blurb} />
      <FactorBreakdown breakdown={breakdown} />

      {/* Sources */}
      {artist.sources.length > 0 && (
        <div className={styles.sources}>
          <h3 className={styles.sourcesHeading}>Sources</h3>
          <ul className={styles.sourcesList}>
            {artist.sources.map((src, i) => (
              <li key={i}>
                <a href={src} target="_blank" rel="noopener noreferrer" className={styles.sourceLink}>
                  {src}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
