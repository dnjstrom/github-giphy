import "isomorphic-fetch"

import { MemCache } from "../cache/index"

export class Fetcher {
  reponseCache: MemCache<string, any>
  pendingRequests: Map<String, Promise<Response>>

  constructor() {
    this.reponseCache = new MemCache()
    this.pendingRequests = new Map()
  }

  async fetch(uri: string) {
    const cached = this.reponseCache.get(uri)

    if (cached) {
      return cached
    }

    let jsonResponse
    const pendingRequest = this.pendingRequests.get(uri)

    if (pendingRequest) {
      return pendingRequest
    }

    const request = fetch(uri).then(response => {
      if (!response.ok) {
        throw new Error(`Fetch error for url "${uri}"`)
      }

      return response.json()
    })

    this.pendingRequests.set(uri, request)
    jsonResponse = await request
    this.pendingRequests.delete(uri)

    return this.reponseCache.set(uri, jsonResponse)
  }
}
