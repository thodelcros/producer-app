import { MusicDatabase } from "@/core/ports/MusicDatabase.port"

interface RetrieveArtistProducedTracksDependencies {
  musicDatabase: MusicDatabase
}

interface RetrieveArtistProducedTracksArgs {
  query: string
}

export const autocompleteArtists =
  ({ musicDatabase }: RetrieveArtistProducedTracksDependencies) =>
  ({ query }: RetrieveArtistProducedTracksArgs) => {
    return musicDatabase.autocompleteArtists(query)
  }
