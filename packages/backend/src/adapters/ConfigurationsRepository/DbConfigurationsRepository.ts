import { Configuration } from "@/core/domain/Configuration"
import { ConfigurationsRepository } from "@/core/ports/ConfigurationsRepository.port"

import { db } from "../database"
import { DbConfiguration } from "../database/types"

export class DbConfigurationsRepository implements ConfigurationsRepository {
  async getAllConfigurations() {
    const configurations = await db.selectFrom("configurations").selectAll().execute()

    return configurations.map((configuration) => this.mapConfiguration(configuration))
  }

  async createConfiguration(
    id: string,
    userId: string,
    musicDatabaseArtistId: string,
    streamingPlatformPlaylistId: string,
  ) {
    const createdConfiguration = await db
      .insertInto("configurations")
      .values({
        id,
        user_id: userId,
        music_database_artist_id: musicDatabaseArtistId,
        streaming_platform_playlist_id: streamingPlatformPlaylistId,
        // TODO : remove
        next_sync_runs_at: new Date(),
      })
      .returningAll()
      .executeTakeFirstOrThrow()

    return this.mapConfiguration(createdConfiguration)
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
