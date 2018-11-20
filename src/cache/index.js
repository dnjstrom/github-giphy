const eightHours = 8 * 60 * 60 * 1000 // 8 hours

export class MemCache {
  constructor(options = {}) {
    this.store = new Map()
    this.cacheDurationInMillis = options.cacheDurationInMillis || eightHours
    this.maxCacheSize = options.maxCacheSize || 200
  }

  get size() {
    return this.store.size
  }

  entries() {
    return this.store.entries()
  }

  get(key) {
    const entry = this.store.get(key)

    if (!entry) {
      return undefined
    } else if (entry.expire <= Date.now()) {
      this.store.delete(key)
      return undefined
    }

    return entry.data
  }

  set(key, value) {
    this.store.set(key, {
      expire: Date.now() + this.cacheDurationInMillis,
      data: value,
    })

    if (this.store.size > this.maxCacheSize) {
      // Delete half the cache when the max cache size is reached starting from the oldest addition
      const keys = this.store.keys()
      for (let i = 0; i < this.maxCacheSize / 2; i += 1) {
        const entry = keys.next()
        this.store.delete(entry.value)
      }
    }

    return value
  }
}
