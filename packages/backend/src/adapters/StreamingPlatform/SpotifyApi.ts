import axios, { AxiosInstance, AxiosRequestConfig } from "axios"

import { SpotifyError } from "./SpotifyErrors"

const BASE_URL = "https://api.spotify.com/v1"
export const BATCH_ADD_TRACKS_TO_PLAYLIST_LIMIT = 100

export class SpotifyApi {
  client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
    })
  }

  async callApi<TResponse>({ url, params, method, data, headers }: AxiosRequestConfig) {
    try {
      const response = await this.client.request<TResponse>({ url, params, method, data, headers })

      return response
    } catch (error) {
      this.handleError(error)
    }
  }

  private handleError(error: unknown): never {
    if (axios.isAxiosError(error)) {
      const { message } = error

      throw new SpotifyError(message, error.toJSON() as Record<string, unknown>)
    }

    throw error
  }
}
