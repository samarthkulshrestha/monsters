import { loadAllArtists } from '@/lib/data'
import { SearchBar } from '@/components/SearchBar/SearchBar'
import { ArtistCard } from '@/components/ArtistCard/ArtistCard'
import styles from './page.module.css'

export default function Home() {
  const artists = loadAllArtists()

  return (
    <div className={styles.page}>
      <section className={styles.heroSection}>
        <h1 className={styles.hero}>
          Should you consume the art of <em>terrible people</em>?
        </h1>
        <p className={styles.subhero}>
          We reduced the entirety of human ethics to a JavaScript function so you don&apos;t have to.
        </p>
        <SearchBar artists={artists.map((a) => ({ id: a.id, name: a.name, domain: a.domain }))} />
      </section>

      <section className={styles.gridSection}>
        <h2 className={styles.gridHeading}>All Assessments</h2>
        <div className={styles.grid}>
          {artists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </section>
    </div>
  )
}
