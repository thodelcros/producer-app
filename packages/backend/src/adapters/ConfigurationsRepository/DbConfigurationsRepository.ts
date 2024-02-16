import { Configuration } from "@/core/domain/Configuration"
import { ConfigurationsRepository } from "@/core/ports/ConfigurationsRepository.port"

import { db } from "../database"
import { DbConfiguration } from "../database/types"

export class DbConfigurationsRepository implements ConfigurationsRepository {
  async getAllConfigurations(): Promise<Configuration[]> {
    const configurations = await db.selectFrom("configurations").selectAll().execute()

    return configurations.map((configuration) => this.mapConfiguration(configuration))
  }

  private mapConfiguration(dbConfiguration: DbConfiguration): Configuration {
    return {
      id: dbConfiguration.id,
      musicDatabaseArtistId: dbConfiguration.music_database_artist_id,
      streamingPlatformPlaylistId: dbConfiguration.streaming_platform_playlist_id,
      userId: dbConfiguration.user_id,
    }
  }
}
