import { h, Component } from "preact"

interface SearchList {
  [query: string]: Set<Image> | undefined
}

interface GifListState {
  query: string
  searches: SearchList
  isLoading: boolean
}

interface GifListProps {
  isVisible: boolean
  onSelection: (image: Image) => void
  onFetchMore: (query: string, offset: number) => Promise<Image[]>
}

const DEBOUNCE_DURATION = 300

export class GifList extends Component<GifListProps, GifListState> {
  state = {
    query: "approved",
    searches: {} as SearchList,
    isLoading: false,
  }

  lastTimer: any

  possiblyFetchMore = async () => {
    if (!this.state.query) {
      return
    }

    const images = this.state.searches[this.state.query] || new Set()

    if (images.size) {
      return
    }

    this.setState({ isLoading: true }, async () => {
      const newImages = await this.props.onFetchMore(
        this.state.query,
        images.size
      )

      this.setState(({ query, searches }: GifListState) => {
        const oldImageSet = searches[query] || new Set()

        const newImageSet = new Set(oldImageSet.values())
        newImages.forEach(newImageSet.add.bind(newImageSet))

        return {
          isLoading: false,
          query,
          searches: {
            ...searches,
            [query]: newImageSet,
          },
        }
      })
    })
  }

  onImageClick = (img: Image) => (event: MouseEvent) => {
    this.props.onSelection(img)
  }

  onInput = (event: any) => {
    if (!event.target) {
      return
    }

    this.setState({ query: event.target.value }, () => {
      clearTimeout(this.lastTimer)
      this.lastTimer = setTimeout(this.possiblyFetchMore, DEBOUNCE_DURATION)
    })
  }

  componentDidMount = this.possiblyFetchMore

  render() {
    const { query, searches } = this.state
    const gifs = searches[query] || []

    if (!this.props.isVisible) {
      return null
    }

    return (
      <div>
        <div
          style={{
            display: "flex",
            "overflow-x": "auto",
            background: "#fafbfc",
            padding: "8px",
            margin: "8px",
            border: "1px solid lightgrey",
            "border-radius": "3px",
            "min-height": "200px",
          }}
        >
          {this.state.isLoading ? (
            <div>Loading...</div>
          ) : (
            Array.from(gifs.values()).map((img: Image) => (
              <img
                style={{ "margin-right": "10px" }}
                src={img.preview}
                onClick={this.onImageClick(img)}
              />
            ))
          )}
        </div>
        <input
          type="text"
          autofocus
          value={this.state.query}
          onInput={this.onInput}
          onSubmit={evt => {
            evt.preventDefault()
          }}
          style={{
            margin: "0 8px 8px",
            padding: "8px",
          }}
        />
      </div>
    )
  }
}
