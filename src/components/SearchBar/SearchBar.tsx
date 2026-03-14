'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './SearchBar.module.css'
import type { Artist } from '@/lib/scoring/types'

interface SearchBarProps {
  artists: Pick<Artist, 'id' | 'name' | 'domain'>[]
}

export function SearchBar({ artists }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)

  const results = query.trim().length > 0
    ? artists.filter((a) =>
        a.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : []

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSelect(id: string) {
    router.push(`/artist/${id}`)
    setQuery('')
    setOpen(false)
  }

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.inputWrapper}>
        <span className={styles.icon}>&#x2315;</span>
        <input
          type="text"
          className={styles.input}
          placeholder="Search artists..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
        />
      </div>
      {open && results.length > 0 && (
        <div className={styles.dropdown}>
          {results.map((artist) => (
            <button
              key={artist.id}
              className={styles.result}
              onClick={() => handleSelect(artist.id)}
            >
              <span className={styles.resultDomain}>{artist.domain}</span>
              <span className={styles.resultName}>{artist.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
