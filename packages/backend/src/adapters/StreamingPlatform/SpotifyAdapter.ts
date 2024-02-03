import { StreamingPlatform } from "@/core/ports/StreamingPlatform.port"

import { SpotifyApi } from "./SpotifyApi"
import { SpotifySearchTracksResponse } from "./SpotifyTypes"

export class SpotifyAdapter extends SpotifyApi implements StreamingPlatform {
  async findTrackByName(name: string) {
    const response = await this.callApi<SpotifySearchTracksResponse>({
      url: "/search",
      params: { q: name, type: "track" },
    })

    if (!response.data.tracks.items[0]) {
      return null
    }

    return response.data.tracks.items[0].uri
  }

  async addTracksToPlaylist(playlistId: string, trackIds: string[]): Promise<void> {
    await this.callApi({
      url: `/playlists/${playlistId}/tracks`,
      method: "post",
      data: {
        uris: trackIds,
      },
    })
  }
}
