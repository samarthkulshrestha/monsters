import { loadAllArtists } from '@/lib/data'
import { BrowseClient } from './BrowseClient'

export default function BrowsePage() {
  const artists = loadAllArtists()
  return <BrowseClient artists={artists} />
}
