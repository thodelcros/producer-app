export interface StreamingPlatform {
  findTrackByNameAndArtist(trackName: string, artistName: string): Promise<string | null> // track uri to add to playlist
  addTracksToPlaylist(playlistId: string, trackIds: string[]): Promise<void>
}
