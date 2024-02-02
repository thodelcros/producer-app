export type SpotifyTokenResponse = {
  // An access token that can be provided in subsequent calls, for example to Spotify Web API services.
  access_token: string
  // How the access token may be used: always "Bearer".
  token_type: string
  // A space-separated list of scopes which have been granted for this access_token
  scope: string
  // The time period (in seconds) for which the access token is valid (1h)
  expires_in: number
  refresh_token: string
}
