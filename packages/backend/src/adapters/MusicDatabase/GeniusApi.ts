import axios, { AxiosInstance, AxiosRequestConfig } from "axios"

import { ArrayKey } from "@/core/utils/utility.types"

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

  async callApi<TResponse extends Record<string, unknown>>({ url, params }: AxiosRequestConfig) {
    try {
      const response = await this.client.request<GeniusApiResponse<TResponse>>({ url, params })

      return response
    } catch (error) {
      this.handleError(error)
    }
  }

  getPaginatedFetcher<TResponse extends Record<string, unknown>>({
    url,
    params,
  }: AxiosRequestConfig) {
    const fetcher = async <TKey extends ArrayKey<TResponse>>(
      key: TKey,
    ): Promise<TResponse[TKey]> => {
      let page = 1
      let hasMore = true

      const items = []

      while (hasMore) {
        const response = await this.callApi<TResponse>({ url, params: { ...params, page } })

        const batchItems = response.data.response[key]

        if (!Array.isArray(batchItems)) {
          throw Error(`Provided key ${String(key)} has no array value`)
        }

        items.push(...batchItems)

        if (!response.data.response.next_page) {
          hasMore = false
        } else {
          page++
        }
      }

      return items as TResponse[TKey]
    }

    return fetcher.bind(this)
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
