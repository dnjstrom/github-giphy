import "@babel/polyfill"
import { Fetcher } from "./fetcher/index"

const apiBase = "https://api.giphy.com/v1"
const apiKey = "dc6zaTOxFJmzC"
const fetcher = new Fetcher()

const performSearch = async (term: string): Promise<Image[]> => {
  const encodedTerm = encodeURIComponent(`${term}`.trim())
  const uri = `${apiBase}/gifs/search?q=${encodedTerm}&api_key=${apiKey}`

  try {
    const json = await fetcher.fetch(uri)
    return json.data.map((image: any) => ({
      src: image.images.original.webp,
      preview: image.images.fixed_height.webp,
      title: image.title || image.slug,
    }))
  } catch (err) {
    console.warn(err)
    return []
  }
}

const messageListener = (
  data: QueryMessage,
  sender: any,
  cb: SearchCallback
) => {
  performSearch(data.query)
    .then(cb)
    .catch(err => {
      console.error("Github Giphy extension error", err)
    })
  // return true to indicate async response to page
  return true
}

chrome.runtime.onMessage.addListener(messageListener)
