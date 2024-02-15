import { Synchronization } from "@/core/domain/Synchronization"
import { MusicDatabase } from "@/core/ports/MusicDatabase.port"
import { StreamingPlatform } from "@/core/ports/StreamingPlatform.port"
import { SynchronizationRepository } from "@/core/ports/SynchronizationRepository.port"

type SyncTracksDependencies = {
  musicDatabase: MusicDatabase
  streamingPlatform: StreamingPlatform
  synchronizationRepository: SynchronizationRepository
}

export class SyncTracks {
  constructor(private dependencies: SyncTracksDependencies) {}

  async execute() {
    const { synchronizationRepository } = this.dependencies

    const synchronizations = await synchronizationRepository.getAllSynchronizations()

    await Promise.all(
      synchronizations.map((synchronization) => this.processSynchronization(synchronization)),
    )
  }

  private async processSynchronization(synchronization: Synchronization) {
    const { musicDatabase, streamingPlatform } = this.dependencies

    const tracks = await musicDatabase.getTrackNamesByArtistId(
      synchronization.musicDatabaseArtistId,
    )

    console.log({ producedTracks: tracks.length })

    const streamingPlatformTrackIds: (string | null)[] = []

    for (const { trackName, artistName } of tracks) {
      console.log("Fetching track on spotify : ", { trackName, artistName })
      const trackId = await this.getTrackStreamingPlatformId(trackName, artistName)

      streamingPlatformTrackIds.push(trackId)
    }

    const foundTracks = streamingPlatformTrackIds.filter(Boolean) as string[]

    await streamingPlatform.addTracksToPlaylist(
      synchronization.streamingPlatformPlaylistId,
      foundTracks,
    )
  }

  private async getTrackStreamingPlatformId(trackName: string, artistName: string) {
    const { streamingPlatform } = this.dependencies

    const streamingPlatformTrack = await streamingPlatform.findTrackByNameAndArtist(
      trackName,
      artistName,
    )

    return streamingPlatformTrack
  }
}
