export interface StreamingPlatform {
  findTrackByNameAndArtist(
    trackName: string,
    artistName: string,
    accessToken: string,
  ): Promise<string | null> // track uri to add to playlist
  addTracksToPlaylist(playlistId: string, trackIds: string[], accessToken: string): Promise<void>
  getUserDetails(accessToken: string): Promise<{ email: string; id: string }>
}
