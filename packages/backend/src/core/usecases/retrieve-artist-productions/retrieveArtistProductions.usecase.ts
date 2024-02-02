import { MusicDatabaseApi } from "@/core/ports/MusicDatabaseApi.port"

export const retrieveArtistProductions =
  ({ trackRepository }: { trackRepository: MusicDatabaseApi }) =>
  ({ artistId }: { artistId: string }) => {
    return trackRepository.getTracksByArtistId(artistId)
  }
