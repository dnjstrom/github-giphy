import "@babel/polyfill"
import { render, h } from "preact"
import {
  bind,
  htmlToElement,
  insertText,
  getSelected,
  randomN,
  sequence,
} from "./util/index"
import {
  giphyButtonHtml,
  gifListRootClass,
  gifButtonClass,
  gifButtonParentPath,
  gifListParentPath,
} from "./util/constants"
import { GifList } from "./gif-list"

const sendMessage = (message: QueryMessage, handler: SearchCallback) => {
  chrome.runtime.sendMessage(message, handler)
}

let shouldShowGifList = false

const renderGifList = (parent: Element) => {
  const root = document.createElement("div")
  root.classList.add(gifListRootClass)

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
        return new Promise((resolve, reject) => {
          sendMessage({ query }, images => {
            resolve(images)
          })
        })
      }}
    />,
    root
  )

  parent.append(root)
}

const renderGifButtons = () => {
  const buttonParents = document.querySelectorAll(gifButtonParentPath)

  for (let toolbar of buttonParents) {
    const giphyButton = htmlToElement(giphyButtonHtml)

    giphyButton.addEventListener("click", () => {
      shouldShowGifList = !shouldShowGifList

      const form = toolbar.closest("form")

      if (!form) {
        throw new Error("Couldn't find form parent of gif button")
      }

      const gifList = form.querySelector(`.${gifListRootClass}`)

      if (gifList) {
        gifList.remove()
      }

      const gifListParent = form.querySelector(gifListParentPath)

      if (!gifListParent) {
        throw new Error("Couldn't find Gif list parent element")
      }

      renderGifList(gifListParent)

      const input = shouldShowGifList
        ? form.querySelector(`.${gifListRootClass} input`)
        : form.querySelector("textarea.comment-form-textarea")

      if (!input) {
        throw new Error("Couldn't find input of gif list")
      }

      ;(input as HTMLElement).focus()
    })

    toolbar.appendChild(giphyButton)
  }
}

const removeGifButtons = () => {
  for (const button of document.querySelectorAll(`.${gifButtonClass}`)) {
    button.remove()
  }
}

const removeGifLists = () => {
  let roots = document.querySelectorAll(`.${gifListRootClass}`)

  for (const list of roots) {
    list.remove()
  }
}

const resetState = () => {
  shouldShowGifList = false
}

const renderUi = sequence(
  resetState,
  removeGifButtons,
  removeGifLists,
  renderGifButtons
)

renderUi()

document.addEventListener(
  "pjax:start",
  sequence(resetState, removeGifButtons, removeGifLists)
)

new MutationObserver(renderUi).observe(document.body, {
  attributes: true,
  childList: true,
  characterData: true,
})
