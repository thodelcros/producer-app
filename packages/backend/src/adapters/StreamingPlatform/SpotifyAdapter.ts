import { StreamingPlatform } from "@/core/ports/StreamingPlatform.port"
import { chunkArray } from "@/core/utils/utility.functions"

import { BATCH_ADD_TRACKS_TO_PLAYLIST_LIMIT, SpotifyApi } from "./SpotifyApi"
import { SpotifySearchTracksResponse, SpotifyUserProfileDetailsResponse } from "./SpotifyTypes"

export class SpotifyAdapter extends SpotifyApi implements StreamingPlatform {
  async findTrackByNameAndArtist(trackName: string, artistName: string) {
    const response = await this.callApi<SpotifySearchTracksResponse>({
      url: "/search",
      params: {
        q: `${trackName} artist:${artistName}`,
        type: "track",
        limit: 1,
        offset: 0,
        market: "FR",
      },
    })

    if (!response.data.tracks.items[0]) {
      return null
    }

    return response.data.tracks.items[0].uri
  }

  async addTracksToUserPlaylist(
    playlistId: string,
    trackIds: string[],
    refreshToken: string,
  ): Promise<void> {
    const trackIdsChunks = chunkArray(trackIds, BATCH_ADD_TRACKS_TO_PLAYLIST_LIMIT)

    for (const trackIdsChunk of trackIdsChunks) {
      await this.callApi({
        url: `/playlists/${playlistId}/tracks`,
        method: "post",
        data: {
          uris: trackIdsChunk,
        },
        params: { refreshToken },
      })
    }
  }

  async getUserDetails(refreshToken: string): Promise<{ email: string; id: string }> {
    const response = await this.callApi<SpotifyUserProfileDetailsResponse>({
      url: "/me",
      params: { refreshToken },
    })

    return { email: response.data.email, id: response.data.id }
  }
}
