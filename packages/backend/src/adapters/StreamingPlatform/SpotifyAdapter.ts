import { StreamingPlatform } from "@/core/ports/StreamingPlatform.port"
import { chunkArray } from "@/core/utils/utility.functions"

import { BATCH_ADD_TRACKS_TO_PLAYLIST_LIMIT, SpotifyApi } from "./SpotifyApi"
import { SpotifySearchTracksResponse } from "./SpotifyTypes"

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

  async addTracksToPlaylist(playlistId: string, trackIds: string[]): Promise<void> {
    const trackIdsChunks = chunkArray(trackIds, BATCH_ADD_TRACKS_TO_PLAYLIST_LIMIT)

    for (const trackIdsChunk of trackIdsChunks) {
      await this.callApi({
        url: `/playlists/${playlistId}/tracks`,
        method: "post",
        data: {
          uris: trackIdsChunk,
        },
      })
    }
  }
}
