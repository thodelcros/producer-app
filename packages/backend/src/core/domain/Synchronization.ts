export interface User {
  id: string
  email: string
  streamingPlatformAuthRefreshToken: string | null
}

export interface Synchronization {
  id: string
  userId: string // User
  streamingPlatformPlaylistId: string
  musicDatabaseArtistId: string
  active: boolean
}
