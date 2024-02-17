export interface StreamingPlatform {
  findTrackByNameAndArtist(trackName: string, artistName: string): Promise<string | null> // track uri to add to playlist
  addTracksToUserPlaylist(
    playlistId: string,
    trackIds: string[],
    refreshToken: string,
  ): Promise<void>
  getUserDetails(refreshToken: string): Promise<{ email: string; id: string }>
}
