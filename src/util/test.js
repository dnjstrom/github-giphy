const {
  bind,
  htmlToElement,
  insertText,
  getSelected,
  randomN,
  times,
} = require(".")

const getTextArea = text => {
  const txtArea = document.createElement("textarea")
  txtArea.value = text
  return txtArea
}

describe("bind", () => {
  const f = (a, b, c) => a + b + c

  test("Returns a function", () => {
    const g = bind(f, 1, 2)
    expect(g).toBeInstanceOf(Function)
    expect(g.length).toBe(1)
  })

  test("Returned function can be invoked", () => {
    const g = bind(f, 1, 2)
    const result = g(3)
    expect(result).toBe(6)
  })
})

describe("htmlToElement", () => {
  test("Returns a node with the same outer html", () => {
    const html = '<div class="foo">bar</div>'
    const result = htmlToElement(html)
    expect(result.outerHTML).toEqual(html)
  })
})

describe("TextArea: getSelected", () => {
  test("Returns empty string when no selection", () => {
    const txtArea = getTextArea("foobar")
    const selection = getSelected(txtArea)
    expect(selection).toEqual("")
  })

  test("Returns selected text", () => {
    const txtArea = getTextArea("foobar")
    txtArea.selectionEnd = 3
    const selection = getSelected(txtArea)
    expect(selection).toEqual("foo")
  })
})

describe("TextArea: insertText", () => {
  test("Inserts text in textarea", () => {
    const txtArea = getTextArea("")
    insertText("foobar", txtArea)
    expect(txtArea.value).toEqual("foobar")
  })

  test("Inserts text at cursor pos", () => {
    const txtArea = getTextArea("foobaz")
    txtArea.selectionStart = 3
    txtArea.selectionEnd = 3
    insertText("bar", txtArea)
    expect(txtArea.value).toEqual("foobarbaz")
  })

  test("Replaces selected text", () => {
    const txtArea = getTextArea("fooXXXbaz")
    txtArea.selectionStart = 3
    txtArea.selectionEnd = 6
    insertText("bar", txtArea)
    expect(txtArea.value).toEqual("foobarbaz")
  })
})

describe("randomN", () => {
  test("Returns values in the range [0 <= x < n]", () => {
    const range = 3
    times(10)
      .map(() => randomN(range))
      .forEach(value => {
        expect(value).toBeGreaterThanOrEqual(0)
        expect(value).toBeLessThan(range)
      })
  })
})
