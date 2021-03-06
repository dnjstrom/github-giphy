export const bind = (f: Function, ...params: any[]) => f.bind(null, ...params)

export const sequence = (...fs: Function[]) => () => fs.forEach(f => f())

export const htmlToElement = (html: string): any => {
  const template = document.createElement("template")
  template.innerHTML = html
  const child = template.content.firstChild

  if (!child) {
    throw new Error(`Couldn't create template from "${html}".`)
  }

  return child
}

export const getSelected = (textArea: HTMLTextAreaElement) => {
  const { selectionStart, selectionEnd, value } = textArea
  return value.substring(selectionStart, selectionEnd).trim()
}

export const insertText = (text: string, textArea: HTMLTextAreaElement) => {
  const { selectionStart, selectionEnd, value } = textArea

  const before = value.substring(0, selectionStart)
  const after = value.substring(selectionEnd)
  textArea.value = before + text + after

  textArea.selectionStart = selectionStart
  textArea.selectionEnd = selectionStart + text.length

  textArea.focus()
}

export const randomN = (n: number) => Math.floor(Math.random() * n)

export const pickRandom = (list: any[]) => list[randomN(list.length)]

export const times = (n: number) => Array.from(new Array(n))
