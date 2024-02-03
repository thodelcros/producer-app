import { MusicDatabaseApi } from "@/core/ports/MusicDatabaseApi.port"

interface RetrieveArtistProducedTracksDependencies {
  musicDatabase: MusicDatabaseApi
}

interface RetrieveArtistProducedTracksArgs {
  query: string
}

export const autocompleteArtists =
  ({ musicDatabase }: RetrieveArtistProducedTracksDependencies) =>
  ({ query }: RetrieveArtistProducedTracksArgs) => {
    return musicDatabase.autocompleteArtists(query)
  }
