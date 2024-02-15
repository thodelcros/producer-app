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
    const paginatedSongsFetcher = this.getPaginatedFetcher<GeniusGetArtistSongsResponseBody>({
      url: `/api/artists/${id}/songs`,
      params: { sort: "release_date" },
    })

    const songs = await paginatedSongsFetcher("songs")

    const producedSongs = songs.filter((song) => {
      const isPrimaryArtist = song.primary_artist.id.toString() === id
      const isFeaturedArtist = song.featured_artists.some(
        ({ id: featuredArtistId }) => featuredArtistId.toString() === id,
      )

      return !isPrimaryArtist && !isFeaturedArtist // useful filtering for artists that are producer AND singer
    })

    return producedSongs.map((song) => ({
      trackName: song.title,
      artistName: song.primary_artist.name,
    }))
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
