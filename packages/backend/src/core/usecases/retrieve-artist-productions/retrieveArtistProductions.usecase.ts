import { MusicDatabase } from "@/core/ports/MusicDatabase.port"

interface RetrieveArtistProducedTracksDependencies {
  musicDatabase: MusicDatabase
}

interface RetrieveArtistProducedTracksArgs {
  artistId: string
}

export const retrieveArtistProducedTracks =
  ({ musicDatabase }: RetrieveArtistProducedTracksDependencies) =>
  ({ artistId }: RetrieveArtistProducedTracksArgs) => {
    return musicDatabase.getTrackNamesByArtistId(artistId)
  }
