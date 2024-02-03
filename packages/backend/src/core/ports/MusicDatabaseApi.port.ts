import { Artist } from "../domain/Artist"
import { Track } from "../domain/Track"

export interface MusicDatabaseApi {
  getTracksByArtistId(id: string): Promise<Track[]>
  autocompleteArtists(query: string): Promise<Artist[]>
}
