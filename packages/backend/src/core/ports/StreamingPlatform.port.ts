export interface StreamingPlatform {
  findTrackByNameAndArtist(trackName: string, artistName: string): Promise<string | null> // track uri to add to playlist
  addTracksToUserPlaylist(
    playlistId: string,
    trackIds: string[],
    refreshToken: string,
  ): Promise<void>
  getUserDetails(accessToken: string): Promise<{ email: string; id: string }>
  getUserPlaylists(
    refreshToken: string,
    userStreamingPlatfomId: string,
  ): Promise<{ name: string; id: string }[]>
}
