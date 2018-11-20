import "isomorphic-fetch"
import { Fetcher } from "."

describe("Fetcher", () => {
  beforeEach(() => {
    window.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve("foobar"),
    })
  })

  test("Only touches network the first time", async () => {
    const fetcher = new Fetcher()
    const response = await fetcher.fetch("/foobar")
    expect(response).toEqual("foobar")
    const response2 = await fetcher.fetch("/foobar")
    expect(response2).toEqual("foobar")
    expect(fetch).toHaveBeenCalledTimes(1)
  })
})
