export type GeniusApiResponse<TResponse> = {
  meta: {
    status: number
  }
  response: TResponse & { next_page: number | null }
}

export type GeniusSong = {
  id: number
  title: string
  artist_names: string
  full_title: string
  release_date_components: {
    year: 2017
    month: 10
    day: 27
  } | null
  song_art_image_thumbnail_url: string
  primary_artist: GeniusArtist
  featured_artists: GeniusArtist[]
}

export type GeniusGetArtistSongsResponseBody = {
  songs: GeniusSong[]
  artists: GeniusArtist[]
  toto: 42
}

export type GeniusArtist = {
  id: number
  image_url: string
  name: string
}

export type GeniusSearchResult = {
  type: "artist"
  result: GeniusArtist
}

export type GeniusGetArtistAutocompletionResponseBody = {
  sections: [
    {
      type: "artist"
      hits: GeniusSearchResult[]
    },
  ]
}
