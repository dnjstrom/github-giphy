export const gifListParentPath = ".js-suggester-container"
export const gifButtonParentPath =
  ".toolbar-commenting .toolbar-group:last-child"

export const gifListRootClass = "github-giphy-gif-list-root"
export const gifButtonClass = "js-giphy-btn"

export const giphyButtonHtml = `
<button type="button" class="${gifButtonClass} toolbar-item tooltipped tooltipped-nw" aria-label="Add a GIF" tabindex="-1" data-ga-click="Giphy">
  <svg aria-hidden="true" class="octicon octicon-file-media" height="16" role="img" version="1.1" viewBox="0 0 16 16" width="16">
    <path d="M6 5h2v2H6V5z m6-0.5v9.5c0 0.55-0.45 1-1 1H1c-0.55 0-1-0.45-1-1V2c0-0.55 0.45-1 1-1h7.5l3.5 3.5z m-1 0.5L8 2H1v11l3-5 2 4 2-2 3 3V5z" />
  </svg>
</button>
`.trim()
