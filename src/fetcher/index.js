import "isomorphic-fetch"

import { MemCache } from "../cache"

export class Fetcher {
  constructor() {
    this.cache = new MemCache()
  }

  async fetch(uri) {
    const cached = this.cache.get(uri)

    if (cached) {
      return cached
    }

    const response = await fetch(uri)

    if (!response.ok) {
      throw new Error(`Fetch error - ${response.ok}`)
    }

    const json = await response.json()

    return this.cache.set(uri, json)
  }
}
