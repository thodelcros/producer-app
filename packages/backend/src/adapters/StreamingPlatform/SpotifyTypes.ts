type SpotifyCoverImage = {
  height: number
  width: number
  url: string
}

type SpotifyAlbum = {
  id: string
  name: string
  images: [SpotifyCoverImage, SpotifyCoverImage, SpotifyCoverImage]
}

type SpotifyArtist = {
  id: string
  name: string
}

export type SpotifyTrack = {
  id: string
  name: string
  uri: string // used to batch add tracks to playlist
  album: SpotifyAlbum
  artists: [SpotifyArtist, ...SpotifyArtist[]]
}

export type SpotifySearchTracksResponse = {
  tracks: {
    items: SpotifyTrack[]
  }
}
