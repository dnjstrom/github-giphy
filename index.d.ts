type url = string

interface Image {
  src: url
  preview: url
  title: string
}

interface QueryMessage {
  query: string
}

type SearchCallback = (images: Image[]) => any | null | undefined

type MessageListener = (
  data: any,
  sender: any,
  callback: any
) => any | null | undefined

interface Chrome {
  runtime: {
    sendMessage: (message: any, handler: Function) => undefined
    onMessage: {
      addListener: (cb: MessageListener) => undefined
    }
  }
}

declare const chrome: Chrome
