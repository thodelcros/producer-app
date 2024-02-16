import { Configuration } from "@/core/domain/Configuration"
import { ConfigurationsRepository } from "@/core/ports/ConfigurationsRepository.port"
import { MusicDatabase } from "@/core/ports/MusicDatabase.port"
import { StreamingPlatform } from "@/core/ports/StreamingPlatform.port"
import { StreamingPlatformAuthAdapter } from "@/core/ports/StreamingPlatformAuthAdapter.port"
import { UserRepository } from "@/core/ports/UserRepository.port"

type SyncTracksDependencies = {
  musicDatabase: MusicDatabase
  streamingPlatform: StreamingPlatform
  streamingPlatformAuthAdapter: StreamingPlatformAuthAdapter
  userRepository: UserRepository
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
    const { musicDatabase, streamingPlatform, userRepository, streamingPlatformAuthAdapter } =
      this.dependencies

    const tracks = await musicDatabase.getTrackNamesByArtistId(configuration.musicDatabaseArtistId)

    console.log({ producedTracks: tracks.length })

    const user = await userRepository.findById(configuration.userId)

    if (!user) {
      throw new Error("user not found")
    }

    const { accessToken } = await streamingPlatformAuthAdapter.refreshAccessToken(
      user.streamingPlatformAuthRefreshToken,
    )

    const streamingPlatformTrackIds: (string | null)[] = []

    for (const { trackName, artistName } of tracks) {
      const trackId = await this.getTrackStreamingPlatformId(trackName, artistName, accessToken)

      console.log("Track fetched on spotify : ", { trackName, artistName, trackId })

      streamingPlatformTrackIds.push(trackId)
    }

    const foundTracks = streamingPlatformTrackIds.filter(Boolean) as string[]

    await streamingPlatform.addTracksToPlaylist(
      configuration.streamingPlatformPlaylistId,
      foundTracks,
      accessToken,
    )
  }

  private async getTrackStreamingPlatformId(
    trackName: string,
    artistName: string,
    accessToken: string,
  ) {
    const { streamingPlatform } = this.dependencies

    const streamingPlatformTrack = await streamingPlatform.findTrackByNameAndArtist(
      trackName,
      artistName,
      accessToken,
    )

    return streamingPlatformTrack
  }
}
