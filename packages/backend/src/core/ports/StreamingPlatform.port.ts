export interface StreamingPlatform {
  findTrackByName(name: string): Promise<string | null> // track uri to add to playlist
  addTracksToPlaylist(playlistId: string, trackIds: string[]): Promise<void>
}
