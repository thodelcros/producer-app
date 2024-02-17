import axios, { AxiosInstance } from "axios"

import { SpotifyAuthError } from "./SpotifyAuthErrors"
import { SpotifyPersonalTokenResponse, SpotifyTokenResponse } from "./SpotifyAuthTypes"

const BASE_URL = "https://accounts.spotify.com/api"

export const REDIRECT_URI = `${process.env.SPOTIFY_AUTH_CALLBACK_BASE_URL}/spotify-auth/callback`
export const PERMISSION_SCOPES = [
  "user-read-email",
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

  async getAppAccessToken() {
    try {
      const response = await this.#client.post<SpotifyTokenResponse>("/token", {
        grant_type: "client_credentials",
      })

      return response.data.access_token
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { data, status } = error.response

        if (status === 400 && data.error === "invalid_client") {
          throw new SpotifyAuthError(
            "invalid_credentials",
            error.toJSON() as Record<string, unknown>,
          )
        }
      }

      throw error
    }
  }

  async getPersonalAccessToken(code: string) {
    const response = await this.#client.post<SpotifyPersonalTokenResponse>("/token", {
      code,
      grant_type: "authorization_code",
      redirect_uri: REDIRECT_URI,
    })

    const { access_token, refresh_token } = response.data

    return { accessToken: access_token, refreshToken: refresh_token }
  }

  async refreshPersonalAccessToken(refreshToken: string) {
    try {
      const response = await this.#client.post<SpotifyPersonalTokenResponse>("/token", {
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      })

      return response.data.access_token
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { data, status } = error.response
        if (
          status === 400 &&
          data.error === "invalid_grant" &&
          data.error_description === "Invalid refresh token"
        ) {
          throw new SpotifyAuthError(
            "invalid_refresh_token",
            error.toJSON() as Record<string, unknown>,
          )
        }
      }

      throw error
    }
  }
}
