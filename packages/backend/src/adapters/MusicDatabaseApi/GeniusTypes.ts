export type GeniusApiResponse<TResponse> = {
  meta: {
    status: number
  }
  response: TResponse
}

export type GeniusSong = {
  id: number
  title: string
  artist_names: string
  release_date_components: {
    year: 2017
    month: 10
    day: 27
  } | null
  song_art_image_thumbnail_url: string
}
