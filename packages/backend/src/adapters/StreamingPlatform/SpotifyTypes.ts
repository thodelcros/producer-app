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

export type SpotifyPlaylist = {
  id: string
  name: string
  public: boolean
  owner: {
    type: "user"
    id: string
  }
}

export type SpotifyUserProfileDetailsResponse = {
  id: string
  email: string
}

export type SpotifySearchTracksResponse = {
  tracks: {
    items: SpotifyTrack[]
  }
}

export type SpotifyGetPlaylistsResponse = {
  items: SpotifyPlaylist[]
}
