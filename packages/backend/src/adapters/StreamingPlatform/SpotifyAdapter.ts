import { StreamingPlatform } from "@/core/ports/StreamingPlatform.port"
import { chunkArray } from "@/core/utils/utility.functions"

import { BATCH_ADD_TRACKS_TO_PLAYLIST_LIMIT, SpotifyApi } from "./SpotifyApi"
import { SpotifySearchTracksResponse, SpotifyUserProfileDetailsResponse } from "./SpotifyTypes"

export class SpotifyAdapter extends SpotifyApi implements StreamingPlatform {
  async findTrackByNameAndArtist(trackName: string, artistName: string, accessToken: string) {
    const response = await this.callApi<SpotifySearchTracksResponse>({
      url: "/search",
      params: {
        q: `${trackName} artist:${artistName}`,
        type: "track",
        limit: 1,
        offset: 0,
        market: "FR",
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.data.tracks.items[0]) {
      return null
    }

    return response.data.tracks.items[0].uri
  }

  async addTracksToPlaylist(
    playlistId: string,
    trackIds: string[],
    accessToken: string,
  ): Promise<void> {
    const trackIdsChunks = chunkArray(trackIds, BATCH_ADD_TRACKS_TO_PLAYLIST_LIMIT)

    for (const trackIdsChunk of trackIdsChunks) {
      await this.callApi({
        url: `/playlists/${playlistId}/tracks`,
        method: "post",
        data: {
          uris: trackIdsChunk,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    }
  }

  async getUserDetails(accessToken: string): Promise<{ email: string; id: string }> {
    const response = await this.callApi<SpotifyUserProfileDetailsResponse>({
      url: "/me",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    return { email: response.data.email, id: response.data.id }
  }
}
