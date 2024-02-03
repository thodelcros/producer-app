import axios, { AxiosInstance } from "axios"

import { SpotifyTokenResponse } from "./SpotifyTypes"

const BASE_URL = "https://accounts.spotify.com/api"

export const REDIRECT_URI = `${process.env.SPOTIFY_AUTH_CALLBACK_BASE_URL}/spotify-auth/callback`
export const PERMISSION_SCOPES = [
  "playlist-read-private",
  "playlist-read-collaborative",
  "playlist-modify-private",
  "playlist-modify-public",
].join(" ")

const SPOTIFY_API_CLIENT_ID = process.env.SPOTIFY_API_CLIENT_ID
const SPOTIFY_API_CLIENT_SECRET = process.env.SPOTIFY_API_CLIENT_SECRET

export class SpotifyAuthAdapter {
  #client: AxiosInstance

  constructor() {
    this.#client = axios.create({
      baseURL: BASE_URL,
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(SPOTIFY_API_CLIENT_ID + ":" + SPOTIFY_API_CLIENT_SECRET).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
  }

  async getAccessToken(code: string) {
    const response = await this.#client.post<SpotifyTokenResponse>("/token", {
      code,
      grant_type: "authorization_code",
      redirect_uri: REDIRECT_URI,
    })

    const { access_token, refresh_token } = response.data

    return { accessToken: access_token, refreshToken: refresh_token }
  }

  async refreshAccessToken(refreshToken: string) {
    const response = await this.#client.post<SpotifyTokenResponse>("/token", {
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    })

    const { access_token, refresh_token } = response.data

    return { accessToken: access_token, refreshToken: refresh_token }
  }
}
