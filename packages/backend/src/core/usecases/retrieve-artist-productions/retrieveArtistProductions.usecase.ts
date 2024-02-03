import { MusicDatabaseApi } from "@/core/ports/MusicDatabaseApi.port"

interface RetrieveArtistProducedTracksDependencies {
  musicDatabase: MusicDatabaseApi
}

interface RetrieveArtistProducedTracksArgs {
  artistId: string
}

export const retrieveArtistProducedTracks =
  ({ musicDatabase }: RetrieveArtistProducedTracksDependencies) =>
  ({ artistId }: RetrieveArtistProducedTracksArgs) => {
    return musicDatabase.getTracksByArtistId(artistId)
  }
