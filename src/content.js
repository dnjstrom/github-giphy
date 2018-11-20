import "@babel/polyfill"
import { bind, htmlToElement, insertText, getSelected, randomN } from "./util"
import { giphyButtonHtml } from "./util/constants"

const sendMessage = (message, handler) => {
  chrome.runtime.sendMessage(message, handler)
}

const clickListener = evt => {
  evt.preventDefault()

  const form = evt.target.closest("form")
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
