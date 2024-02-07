import { Artist } from "../domain/Artist"

export interface MusicDatabase {
  getTrackNamesByArtistId(id: string): Promise<{ trackName: string; artistName: string }[]>
  autocompleteArtists(query: string): Promise<Artist[]>
}
