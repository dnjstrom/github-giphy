import "@babel/polyfill"
import {
  bind,
  htmlToElement,
  insertText,
  getSelected,
  randomN,
} from "./util/index"
import { giphyButtonHtml } from "./util/constants"

const sendMessage = (message: QueryMessage, handler: SearchCallback) => {
  chrome.runtime.sendMessage(message, handler)
}

const clickListener = (evt: Event) => {
  evt.preventDefault()
  const target = evt.target

  if (!target) {
    throw new Error("Click listener called with no target")
  }

  const form = (target as HTMLElement).closest("form")

  if (!form) {
    throw new Error("Couldn't find a parent form of click target")
  }

  const textAreas = form.querySelectorAll("textarea")

  if (textAreas.length === 0) {
    throw new Error("Couldn't find corresponding text area!")
  }

  const textArea = textAreas[0]

  const selected = getSelected(textArea)

  sendMessage({ query: selected || "approved" }, images => {
    if (images && images.length) {
      const image = images[randomN(images.length)]
      textAreas.forEach(bind(insertText, `![${image.title}](${image.src})`))
    }
  })
}

document.querySelectorAll(".toolbar-group:last-child").forEach(element => {
  const giphyButton = htmlToElement(giphyButtonHtml)
  giphyButton.addEventListener("click", clickListener)
  element.append(giphyButton)
})
