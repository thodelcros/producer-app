import { ConfigurationsRepository } from "@/core/ports/ConfigurationsRepository.port"
import { IdAdapter } from "@/core/ports/IdAdapter.port"

interface CreateConfigurationDependencies {
  configurationsRepository: ConfigurationsRepository
  idGenerator: IdAdapter
}

interface CreateConfigurationArgs {
  userId: string
  musicDatabaseArtistId: string
  streamingPlatformPlaylistId: string
}

export const createConfiguration =
  ({ configurationsRepository, idGenerator }: CreateConfigurationDependencies) =>
  async ({
    userId,
    musicDatabaseArtistId,
    streamingPlatformPlaylistId,
  }: CreateConfigurationArgs) => {
    return configurationsRepository.createConfiguration(
      idGenerator.generate(),
      userId,
      musicDatabaseArtistId,
      streamingPlatformPlaylistId,
    )
  }
