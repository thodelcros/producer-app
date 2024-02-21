import { Configuration } from "@/core/domain/Configuration"
import { ConfigurationsRepository } from "@/core/ports/ConfigurationsRepository.port"
import { MusicDatabase } from "@/core/ports/MusicDatabase.port"
import { StreamingPlatform } from "@/core/ports/StreamingPlatform.port"
import { UsersRepository } from "@/core/ports/UsersRepository.port"

type SyncTracksDependencies = {
  musicDatabase: MusicDatabase
  streamingPlatform: StreamingPlatform
  userRepository: UsersRepository
  configurationRepository: ConfigurationsRepository
}

export class SyncTracks {
  constructor(private dependencies: SyncTracksDependencies) {}

  async execute() {
    const { configurationRepository } = this.dependencies

    const configurations = await configurationRepository.getAllConfigurations()

    await Promise.all(
      configurations.map((configuration) => this.processConfiguration(configuration)),
    )
  }

  private async processConfiguration(configuration: Configuration) {
    const { musicDatabase, streamingPlatform, userRepository } = this.dependencies

    const tracks = await musicDatabase.getTrackNamesByArtistId(configuration.musicDatabaseArtistId)

    const user = await userRepository.findById(configuration.userId)

    if (!user) {
      throw new Error("user not found")
    }

    const streamingPlatformTrackIds: (string | null)[] = []

    for (const { trackName, artistName } of tracks) {
      const trackId = await this.getTrackStreamingPlatformId(trackName, artistName)

      streamingPlatformTrackIds.push(trackId)
    }

    const foundTracks = streamingPlatformTrackIds.filter(Boolean) as string[]

    await streamingPlatform.addTracksToUserPlaylist(
      configuration.streamingPlatformPlaylistId,
      foundTracks,
      user.streamingPlatformAuthRefreshToken,
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
