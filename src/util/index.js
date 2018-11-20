const bind = (f, ...params) => f.bind(null, ...params)

const htmlToElement = html => {
  const template = document.createElement("template")
  template.innerHTML = html
  return template.content.firstChild
}

const getSelected = textArea => {
  const { selectionStart, selectionEnd, value } = textArea
  return value.substring(selectionStart, selectionEnd).trim()
}

const insertText = (text, textArea) => {
  const { selectionStart, selectionEnd, value } = textArea

  const before = value.substring(0, selectionStart)
  const after = value.substring(selectionEnd)
  textArea.value = before + text + after

  const cursorPos = selectionStart + text.length
  textArea.selectionStart = cursorPos
  textArea.selectionEnd = cursorPos

  textArea.focus()
}

const randomN = n => Math.floor(Math.random() * n)

const times = n => Array.from(new Array(n))

module.exports = {
  bind,
  htmlToElement,
  getSelected,
  insertText,
  randomN,
  times,
}
