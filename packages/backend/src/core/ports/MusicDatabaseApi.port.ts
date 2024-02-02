import { Track } from "../domain/Track"

export interface MusicDatabaseApi {
  getTracksByArtistId(id: string): Promise<Track[]>
}
