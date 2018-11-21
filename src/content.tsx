import "@babel/polyfill"
import { render, h } from "preact"
import {
  bind,
  htmlToElement,
  insertText,
  getSelected,
  randomN,
} from "./util/index"
import { giphyButtonHtml } from "./util/constants"
import { GifList } from "./gif-list"

const sendMessage = (message: QueryMessage, handler: SearchCallback) => {
  chrome.runtime.sendMessage(message, handler)
}

const clickListener = (evt: Event) => {}

// document.querySelectorAll(".toolbar-group:last-child").forEach(element => {
//   const giphyButton = htmlToElement(giphyButtonHtml)
//   giphyButton.addEventListener("click", clickListener)
//   element.append(giphyButton)
// })

document.querySelectorAll(".write-content").forEach(element => {
  const root = document.createElement("div")
  render(
    <GifList
      onSelection={image => {
        const form = element.closest("form")

        if (!form) {
          throw new Error("Couldn't find a parent form of click target")
        }

        const textAreas = form.querySelectorAll("textarea")

        if (textAreas.length === 0) {
          throw new Error("Couldn't find corresponding text area!")
        }

        const textArea = textAreas[0]

        const selected = getSelected(textArea)

        textAreas.forEach(bind(insertText, `![${image.title}](${image.src})`))
      }}
      onFetchMore={(query, offset) => {
        console.log(query, offset)
        return new Promise((resolve, reject) => {
          sendMessage({ query }, images => {
            resolve(images)
          })
        })
      }}
    />,
    root
  )
  element.append(root)
  console.log(root)
})
