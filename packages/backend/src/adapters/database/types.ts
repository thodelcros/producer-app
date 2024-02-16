import { ColumnType, Generated, JSONColumnType, Selectable } from "kysely"

export interface Database {
  users: UsersTable
  configurations: ConfigurationsTable
  synchronizations: SynchronizationsTable
}

export interface UsersTable {
  id: string
  email: string
  streaming_platform_refresh_token: string
  streaming_platform_id: string
  created_at: Generated<ColumnType<Date, Date, never>>
}

export type DbUser = Selectable<UsersTable>

export interface ConfigurationsTable {
  id: string
  user_id: string
  streaming_platform_playlist_id: string
  music_database_artist_id: string
  created_at: Generated<ColumnType<Date, Date, never>>
  next_sync_runs_at: ColumnType<Date>
}

export type DbConfiguration = Selectable<ConfigurationsTable>

export interface SynchronizationsTable {
  id: string
  configuration_id: string
  started_at: ColumnType<Date>
  ended_at: ColumnType<Date>
  streaming_platform_tracks_ids: JSONColumnType<string[]>
}
