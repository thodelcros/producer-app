export type SpotifyTokenResponse = {
  access_token: string
  token_type: string
  expires_in: number
}

export type SpotifyPersonalTokenResponse = SpotifyTokenResponse & {
  scope: string
  refresh_token: string
}
