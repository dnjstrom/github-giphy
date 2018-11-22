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

const gifListRootClass = "github-giphy-gif-list-root"
let shouldShowGifList = false

const renderGifList = (root: Element) =>
  render(
    <GifList
      isVisible={shouldShowGifList}
      onSelection={image => {
        const form = root.closest("form")

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

const replaceGifList = () => {
  let roots = Array.from(document.querySelectorAll(`.${gifListRootClass}`))

  if (!roots.length) {
    roots = Array.from(document.querySelectorAll(".write-content")).map(
      element => {
        const root = document.createElement("div")
        root.classList.add(gifListRootClass)
        element.append(root)
        return root as Element
      }
    )
  }

  roots.forEach(root => {
    root.innerHTML = ""
  })

  roots.forEach(renderGifList)
}

const renderGifButtons = () => {
  document.querySelectorAll(".toolbar-group:last-child").forEach(element => {
    const giphyButton = htmlToElement(giphyButtonHtml)
    giphyButton.addEventListener("click", () => {
      shouldShowGifList = !shouldShowGifList

      replaceGifList()

      const form = element.closest("form")

      if (!form) {
        throw new Error("Couldn't find form parent of gif button")
      }

      const input = shouldShowGifList
        ? form.querySelector(`.${gifListRootClass} input`)
        : form.querySelector("textarea.comment-form-textarea")

      if (!input) {
        throw new Error("Couldn't find input of gif list")
      }

      ;(input as HTMLElement).focus()
    })
    element.append(giphyButton)
  })
}

renderGifButtons()
