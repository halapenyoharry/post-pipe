# T10 Report: Bookmarks and Hash Routing (Parts 3 and 4)

## Files and Functions Changed

1. **`src/components/ReaderPanel/ReaderPanel.jsx`**
   - **`toggleBookmark`**: Computes the `persistentId` for the current article and checks `viewState.bookmarks()`. If bookmarked, it removes the bookmark. If not, it finds the top visible paragraph using `findTopVisibleParagraph()` and adds the bookmark via `viewState.addBookmark()`.
   - **`findTopVisibleParagraph`**: Scans all `<p>` tags within `bodyRef.current` and returns the index of the first paragraph whose `rect.bottom` is strictly below `containerRect.top + 10`. Returns `null` if none are found.
   - **`handleCopyLinkToHere`**: Generates a URL for the current article with `#read=<id>&p=<topVisibleParagraphIndex>`.
   - **`jumpToParagraph`**: Given a paragraph index, calculates its offset relative to `bodyRef.current` and adjusts the container's `scrollTop` to scroll it smoothly into view.
   - **`handleCopyBookmarkLink`**: Used in the Marks List to copy a link targeting a specific bookmark's paragraph.
   - **`useEffect` for scrolling**: Added a new effect watching `[contentHtml, targetParagraph]` that uses `setTimeout` to call `jumpToParagraph` after `dangerouslySetInnerHTML` injects the content.
   - **`useEffect` for ribbons**: Added an effect that watches `[contentHtml, viewState ? viewState.bookmarks() : null, article]`. It clears existing ribbons and appends a div with class `bookmarkRibbon` inside the `<p>` element at the bookmarked index.
   - **Toolbar Updates**: Added buttons for bookmark toggling (using `bookmarkFilledIcon` / `bookmarkIcon`), marks list toggling (`marksIcon`), and "Copy link to here" (`copyIcon`).
   - **Marks List Panel**: Added UI beneath the article header that displays all bookmarks stored in `viewState`, allows editing of optional notes via `viewState.setBookmarkNote()`, jumping to the paragraph, copying the link, or removing the bookmark.
   - **Icon Imports**: Updated imports to use the `ICONS` object correctly instead of attempting to import individual icons.

2. **`generate-index.js`**
   - **`App()` component**: 
     - Added `targetParagraph` state hook.
     - Added a `useEffect` to listen to `hashchange` events on `window`. When `#read=<id>&p=<n>` is encountered, it sets `selectedArticle` (which `ReaderPanel` uses) and `targetParagraph`, passing both down to `ReaderPanel`. It also records the item as "seen" in `viewState`.

3. **`src/embed.jsx`**
   - **`EmbedApp()` component**: 
     - Replicated the `hashchange` listener logic from `generate-index.js`, mapping `#read=<id>&p=<n>` to `selectedArticle` and `targetParagraph` and passing them down to `ReaderPanel`.

4. **Scripts run**: `npm test`, `npm run build`, `npm run build:lib`, `npm run build:embed`, and `node generate-index.js`. All tests and builds completed successfully.

## How the Top Visible Paragraph is Found

The `findTopVisibleParagraph` function is triggered when a user clicks the Bookmark button or "Copy link to here" button. It grabs all `<p>` elements nested under the container (`bodyRef.current`). It calculates the bounding rect for the container and then iterates through each paragraph's bounding rect. It returns the index of the first paragraph where `rect.bottom > containerRect.top + 10`. This effectively finds the first paragraph that is at least partially visible below the top edge of the reading panel.

## How Link Opening Waits for the Text

The routing logic in `generate-index.js` and `src/embed.jsx` updates both `selectedArticle` and `targetParagraph`. In `ReaderPanel.jsx`, the content fetch (`fetchContent()`) is asynchronous. When the fetch resolves, `setContentHtml` is called, which updates the `contentHtml` state and re-renders the component with `dangerouslySetInnerHTML`. A `useEffect` explicitly watches the `contentHtml` and `targetParagraph` dependencies. Once `contentHtml` is set, a 50ms `setTimeout` gives the browser enough time to actually paint the injected DOM elements before `jumpToParagraph` runs to query the `<p>` elements and modify `scrollTop`.

## Anything Unsure

- **Bookmark Ribbon Positioning**: The margin ribbon is appended inside the `<p>` element and positioned absolutely (`left: -30px`). If the article has minimal padding on the left, this could get cut off or overflow depending on the parent container's styling. The CSS injected matches the basic layout, but it might need tweaking for specific embed setups.
- **Node Selection from Hash**: The `hashchange` listener pulls raw `item` objects from the feed rather than fully decorated `GraphViewer` nodes. `ReaderPanel` expects the raw item properties, but doesn't get `originalItem`, so I used a fallback lookup `(item.originalItem && item.originalItem.id) || item.id || item.url`. This correctly defaults to the item ID and works for both routing and saving states.
