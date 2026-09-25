I think the new name of this project would be something like "Blobz" and it's an alternative to scrolling, and more akin to exploring, scrolling is a prison, blobz is a topology to traverse, and the goal is to inherently transform humxns' relationship with information and free them from the algorithms.

---

## Embedding Post-Pipe

Post-Pipe (Blobz) can be compiled into a single, highly-configurable, self-contained Javascript and CSS bundle that you can drop onto any webpage. This "Embed Mode" allows you to integrate the viewer into your own sites without needing a build step on the host site.

### 1. Build the Embed Bundle

To generate the embeddable files, run the following command in the `post-pipe` directory:

```bash
npm run build:embed
```

This will create two files in the `dist-embed/` directory:
- `post-pipe.embed.js` (contains React, D3, and all components)
- `post-pipe.embed.css` (contains all styles)

### 2. Add to Your Webpage

You need three things on your host webpage to embed the viewer:
1. A container `<div>` with an ID.
2. The CSS and JS bundle files included via `<link>` and `<script>`.
3. A small script block calling `PostPipe.init()`.

Here is a minimal example:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My Site with Post-Pipe</title>
  
  <!-- 1. Include the Post-Pipe CSS -->
  <link rel="stylesheet" href="path/to/dist-embed/post-pipe.embed.css">
  
  <style>
    /* Give the container some dimensions */
    #my-viewer {
      width: 100vw;
      height: 100vh;
    }
  </style>
</head>
<body>

  <!-- 2. The container -->
  <div id="my-viewer"></div>

  <!-- 3. Include the Post-Pipe JS and the TTS engine -->
  <script src="path/to/dist-embed/post-pipe.embed.js"></script>
  <script src="path/to/tts.js"></script> <!-- Optional: if you want text-to-speech -->

  <!-- 4. Initialize the Viewer -->
  <script>
    PostPipe.init('#my-viewer', {
      feed: './my-data.json' // Required: path to your JSON/RSS feed data
    });
  </script>

</body>
</html>
```

### 3. Configuration & Feature Toggles

The `PostPipe.init()` function accepts an optional configuration object that lets you turn features on or off, change colors, and control persistence.

The easiest way to configure the embed is to use the **Config Panel** in the UI:
1. Load your embed page in a browser.
2. Click the `⚡` (lightning bolt) icon in the bottom corner to open the Config Panel.
3. Toggle features and tweak colors to your liking.
4. Click **Show Embed Snippet** to copy the exact `PostPipe.init()` code for your settings, and paste it into your HTML file.

#### Configuration Object API

If you prefer to configure it manually, here are the available options:

```javascript
PostPipe.init('#my-viewer', {
  // Required: Where the data lives.
  feed: './feed.json',

  // Optional: Toggle individual features on/off. All default to true.
  features: {
    readerPanel:      true,   // Click-to-read article panel
    tts:              true,   // Text-to-speech toolbar in the reader
    feedBar:          true,   // Feed source pills along the top
    addFeed:          true,   // The + button to add new feeds
    layoutControls:   true,   // Cluster / ring layout picker
    dimensions:       true,   // Time / narrative overlays
    undoRedo:         true,   // Undo / redo buttons
    colorSettings:    true,   // Color scheme gear icon
    configPanel:      true,   // The ⚡ configuration panel itself
    keyboardShortcuts: true,  // Cmd+Z undo, Escape to close, etc.
  },

  // Optional: Theme colors. Omit to use defaults.
  theme: {
    bg:          '#1a1a2e',
    surface:     '#0a0e1a',
    accent:      '#64ffda',
    text:        '#a8b2d1',
    text_bright: '#ccd6f6',
  },

  // Optional: How the viewer remembers the reader's arrangement (dragged nodes, layout).
  // Options: 'localStorage' (default, persists across reloads) | 'memory' (session only) | 'none'
  persistence: 'localStorage',
});
```

### Demo

A complete, working demo page is automatically generated during the embed build at `_site/embed.html`. You can open this file in your browser (via a local web server) to see all configuration options in action.
