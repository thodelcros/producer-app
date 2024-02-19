import { Configuration } from "../domain/Configuration"

export interface ConfigurationsRepository {
  getAllConfigurations(): Promise<Configuration[]>
  createConfiguration(
    id: string,
    userId: string,
    musicDatabaseArtistId: string,
    streamingPlatformPlaylistId: string,
  ): Promise<Configuration>
}
