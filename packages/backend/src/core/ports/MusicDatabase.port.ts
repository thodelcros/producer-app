import { Artist } from "../domain/Artist"

export interface MusicDatabase {
  getTrackNamesByArtistId(id: string): Promise<string[]> // track names to map them into streaming platform
  autocompleteArtists(query: string): Promise<Artist[]>
}
