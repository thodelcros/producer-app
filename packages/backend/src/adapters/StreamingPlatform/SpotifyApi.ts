import axios, { AxiosInstance, AxiosRequestConfig } from "axios"

import { SpotifyAuthAdapter } from "../SpotifyAuthAdapter/SpotifyAuthAdapter"
import { SpotifyError } from "./SpotifyErrors"

const BASE_URL = "https://api.spotify.com/v1"
export const BATCH_ADD_TRACKS_TO_PLAYLIST_LIMIT = 100

const NON_PERSONAL_ROUTES = ["/search"]

export class SpotifyApi {
  client: AxiosInstance
  #authAdapter: SpotifyAuthAdapter

  constructor() {
    this.#authAdapter = new SpotifyAuthAdapter()

    this.client = axios.create({
      baseURL: BASE_URL,
    })

    this.client.interceptors.request.use(async (config) => {
      if (config.url && NON_PERSONAL_ROUTES.includes(config.url)) {
        const accessToken = await this.#authAdapter.getAppAccessToken()

        config.headers.Authorization = `Bearer ${accessToken}`
      } else if (!config.headers.Authorization) {
        const { refreshToken } = config.params

        const { accessToken } = await this.#authAdapter.refreshPersonalAccessToken(refreshToken)

        delete config.params.refreshToken

        config.headers.Authorization = `Bearer ${accessToken}`
      }

      return config
    })
  }

  async callApi<TResponse>({ url, params, method, data, headers, auth }: AxiosRequestConfig) {
    try {
      const response = await this.client.request<TResponse>({
        url,
        params,
        method,
        data,
        headers,
        auth,
      })

      return response
    } catch (error) {
      this.handleError(error)
    }
  }

  private handleError(error: unknown): never {
    if (axios.isAxiosError(error)) {
      const { message } = error

      console.error(error.toJSON())

      throw new SpotifyError(message, error.toJSON() as Record<string, unknown>)
    }

    throw error
  }
}
