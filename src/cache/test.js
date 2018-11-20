import { MemCache } from "."
import { times } from "../util"

test("Cache items can be set and get", () => {
  const cache = new MemCache({ cacheDurationInMillis: Infinity })
  cache.set("foo", 42)
  expect(cache.get("foo")).toBe(42)
})

test("Cache items expire past their ttl", () => {
  const nowFunc = Date.now
  Date.now = jest
    .fn()
    .mockReturnValueOnce(0)
    .mockReturnValueOnce(Infinity)

  const cache = new MemCache({ cacheDurationInMillis: 0 })
  cache.set("foo", 42)
  expect(cache.get("foo")).toBeUndefined()

  Date.now = nowFunc
})

test("Cache items are removed if the cache grows too big", () => {
  const cache = new MemCache({
    cacheDurationInMillis: Infinity,
    maxCacheSize: 20,
  })

  times(20).forEach((_, i) => {
    cache.set(i, i)
  })

  expect(cache.size).toBe(20)

  cache.set(21, 21)

  expect(cache.size).toBe(11)
})
