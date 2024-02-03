import { Artist } from "@/core/domain/Artist"
import { MusicDatabase } from "@/core/ports/MusicDatabase.port"

import { GeniusApi } from "./GeniusApi"
import {
  GeniusArtist,
  GeniusGetArtistAutocompletionResponseBody,
  GeniusGetArtistSongsResponseBody,
} from "./GeniusTypes"

export class GeniusAdapter extends GeniusApi implements MusicDatabase {
  async getTrackNamesByArtistId(id: string) {
    const response = await this.callApi<GeniusGetArtistSongsResponseBody>({
      url: `/api/artists/${id}/songs`,
      // TODO : handle pagination
      params: { page: 1, sort: "release_date" },
    })

    return response.data.response.songs.map((song) => song.full_title)
  }

  async autocompleteArtists(query: string) {
    const response = await this.callApi<GeniusGetArtistAutocompletionResponseBody>({
      url: `/api/search/artists`,
      params: { q: query },
    })

    return response.data.response.sections[0].hits.map((searchResult) =>
      this.mapArtist(searchResult.result),
    )
  }

  private mapArtist(artist: GeniusArtist): Artist {
    return {
      id: artist.id.toString(),
      name: artist.name,
      imageUrl: artist.image_url,
    }
  }
}
