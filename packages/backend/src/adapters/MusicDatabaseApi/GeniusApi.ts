import axios, { AxiosInstance, AxiosRequestConfig } from "axios"

import { GeniusApiError } from "./GeniusErrors"
import { GeniusApiResponse } from "./GeniusTypes"

const BASE_URL = "https://genius.com"

export class GeniusApi {
  client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
    })
  }

  async callApi<TResponse>({ url, params }: AxiosRequestConfig) {
    try {
      const response = await this.client.request<GeniusApiResponse<TResponse>>({ url, params })

      return response
    } catch (error) {
      this.handleError(error)
    }
  }

  private handleError(error: unknown): never {
    if (axios.isAxiosError(error)) {
      const { message } = error

      throw new GeniusApiError(message, error.toJSON() as Record<string, unknown>)
    } else {
      throw error
    }
  }
}
