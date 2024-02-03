import axios, { AxiosInstance, AxiosRequestConfig } from "axios"

import { SpotifyError } from "./SpotifyErrors"

const BASE_URL = "https://api.spotify.com/v1"

export class SpotifyApi {
  client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      headers: {
        Authorization: `Bearer ${process.env.SPOTIFY_API_ACCESS_TOKEN}`,
      },
    })
  }

  async callApi<TResponse>({ url, params, method, data }: AxiosRequestConfig) {
    try {
      const response = await this.client.request<TResponse>({ url, params, method, data })

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
