import { Artist } from "@/core/domain/Artist"
import { Track } from "@/core/domain/Track"
import { MusicDatabaseApi } from "@/core/ports/MusicDatabaseApi.port"

import { GeniusApi } from "./GeniusApi"
import {
  GeniusArtist,
  GeniusGetArtistAutocompletionResponseBody,
  GeniusGetArtistSongsResponseBody,
  GeniusSong,
} from "./GeniusTypes"

export class GeniusAdapter extends GeniusApi implements MusicDatabaseApi {
  async getTracksByArtistId(id: string) {
    const response = await this.callApi<GeniusGetArtistSongsResponseBody>({
      url: `/api/artists/${id}/songs`,
      // TODO : handle pagination
      params: { page: 1, sort: "release_date" },
    })

    return response.data.response.songs.map((song) => this.mapTrack(song))
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

  private mapTrack(song: GeniusSong): Track {
    return {
      id: song.id.toString(),
      title: song.title,
      artist: song.artist_names,
      releaseYear: song.release_date_components?.year || null,
      coverUrl: song.song_art_image_thumbnail_url,
    }
  }

  private mapArtist(artist: GeniusArtist): Artist {
    return {
      id: artist.id.toString(),
      name: artist.name,
      imageUrl: artist.image_url,
    }
  }
}
