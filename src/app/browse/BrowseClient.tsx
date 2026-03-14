'use client'

import { useState, useMemo } from 'react'
import { ArtistCard } from '@/components/ArtistCard/ArtistCard'
import styles from './page.module.css'
import type { Artist } from '@/lib/scoring/types'

type SortOption = 'score-desc' | 'score-asc' | 'alpha'

interface BrowseClientProps {
  artists: Artist[]
}

export function BrowseClient({ artists }: BrowseClientProps) {
  const [domain, setDomain] = useState<string>('all')
  const [sort, setSort] = useState<SortOption>('score-desc')

  const domains = useMemo(() => {
    const d = new Set(artists.map((a) => a.domain))
    return ['all', ...Array.from(d).sort()]
  }, [artists])

  const filtered = useMemo(() => {
    let list = domain === 'all' ? artists : artists.filter((a) => a.domain === domain)
    list = [...list].sort((a, b) => {
      if (sort === 'alpha') return a.name.localeCompare(b.name)
      const sa = a.verdict.score ?? 0
      const sb = b.verdict.score ?? 0
      return sort === 'score-desc' ? sb - sa : sa - sb
    })
    return list
  }, [artists, domain, sort])

  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <h1 className={styles.title}>Browse All</h1>
        <p className={styles.count}>{filtered.length} assessment{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      <div className={styles.controls}>
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Domain</span>
          <div className={styles.filters}>
            {domains.map((d) => (
              <button
                key={d}
                className={`${styles.filterBtn} ${domain === d ? styles.active : ''}`}
                onClick={() => setDomain(d)}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Sort</span>
          <div className={styles.filters}>
            <button
              className={`${styles.filterBtn} ${sort === 'score-desc' ? styles.active : ''}`}
              onClick={() => setSort('score-desc')}
            >
              Score ↓
            </button>
            <button
              className={`${styles.filterBtn} ${sort === 'score-asc' ? styles.active : ''}`}
              onClick={() => setSort('score-asc')}
            >
              Score ↑
            </button>
            <button
              className={`${styles.filterBtn} ${sort === 'alpha' ? styles.active : ''}`}
              onClick={() => setSort('alpha')}
            >
              A–Z
            </button>
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        {filtered.map((artist) => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className={styles.empty}>No assessments found for this domain.</div>
      )}
    </div>
  )
}
