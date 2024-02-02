import { Track } from "@/core/domain/Track"
import { MusicDatabaseApi } from "@/core/ports/MusicDatabaseApi.port"

import { GeniusApi } from "./GeniusApi"
import { GeniusSong } from "./GeniusTypes"

const PONKO_ID = "645480"

export class GeniusAdapter extends GeniusApi implements MusicDatabaseApi {
  async getTracksByArtistId(id: string) {
    const response = await this.callApi<{ songs: GeniusSong[] }>({
      url: `/artists/${PONKO_ID}/songs`,
      // TODO : handle pagination
      params: { page: 1 },
    })

    return response.data.response.songs.map((song) => this.mapTrack(song))
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
}
