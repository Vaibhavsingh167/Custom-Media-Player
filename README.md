# Custom Media Player (Spotify Clone)

![HTML5](https://img.shields.io/badge/HTML5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

A highly polished, static-deployable media player that faithfully recreates the Spotify web player aesthetic. Built entirely with **pure HTML5, CSS3, and Vanilla JavaScript** — no frameworks, no libraries, no build tools.

---

## Features

### UI / UX
- **Spotify Dark Theme** — `#121212` background, `#181818` surfaces, `#1DB954` accent
- **Full-screen layout** — `100vh` with a large centered album display and a fixed bottom player bar
- **Micro-interactions** — hover scaling on album art, thumb reveals on progress/volume bars, smooth transitions
- **Responsive** — adapts from desktop to mobile with CSS media queries
- **Google Font** — Inter for clean, modern typography

### Playback Controls
- Play / Pause with swapping FontAwesome icons
- Next / Previous track navigation
- Shuffle mode (randomized track order)
- Repeat modes: Off → Repeat All → Repeat One

### Progress Bar (Scrubber)
- Smooth updates via **`requestAnimationFrame`** (not `setInterval`)
- Click-to-seek anywhere on the bar
- Click-and-drag scrubbing with visual thumb indicator
- Real-time `MM:SS` timestamp display (current time / total duration)
- Touch support for mobile devices

### Volume Control
- Click-and-drag volume slider
- Mute/unmute toggle via the volume icon
- Dynamic icon changes: high → low → muted
- Touch support for mobile

### Keyboard Shortcuts
| Key | Action |
|-----|--------|
| `Space` | Play / Pause |
| `→` | Skip forward 5s |
| `←` | Skip backward 5s |
| `↑` | Volume up |
| `↓` | Volume down |
| `M` | Mute / Unmute |
| `N` | Next track |
| `P` | Previous track |

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **HTML5** | Semantic markup, `<audio>` element via the `HTMLAudioElement` API |
| **CSS3** | CSS Custom Properties (variables), Flexbox layout, `@keyframes` animations, `::selection` styling, media queries |
| **Vanilla JS** | DOM manipulation, event handling, `requestAnimationFrame`, touch events, keyboard shortcuts |
| **FontAwesome 6** | Icon library (CDN) |
| **Google Fonts** | Inter typeface (CDN) |

---

## Project Structure

```
Custom-Media-Player/
├── index.html      # Semantic HTML markup
├── style.css       # All styling, CSS variables, responsive rules
├── script.js       # Player logic and state management
└── README.md       # This file
```

---

## Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/Vaibhavsingh167/Custom-Media-Player.git
   cd Custom-Media-Player
   ```

2. **Open in browser**
   ```bash
   # Option A: just open the file
   open index.html        # macOS
   xdg-open index.html    # Linux

   # Option B: use a local server (recommended for audio CORS)
   npx serve .
   # or
   python3 -m http.server 8000
   ```

3. **No build step required** — it's pure HTML/CSS/JS.

---

## Core Vanilla JS Concepts

### `HTMLAudioElement` API
The native `<audio>` element provides a full playback API without any plugins:
```js
const audio = document.getElementById("audio");
audio.src = "song.mp3";
audio.play();
audio.pause();
audio.currentTime = 30; // seek to 30 seconds
audio.volume = 0.5;     // 50% volume
```

Key events used:
- `loadedmetadata` — fires when duration becomes available
- `ended` — fires when a track finishes playing

### `requestAnimationFrame` for Progress Updates
Instead of `setInterval` (which runs at fixed intervals regardless of frame rate and causes visual stutter), `requestAnimationFrame` synchronizes updates with the browser's repaint cycle (~60fps):

```js
function startProgressLoop() {
    function update() {
        const pct = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = pct + "%";
        animFrameId = requestAnimationFrame(update);
    }
    animFrameId = requestAnimationFrame(update);
}
```

Benefits:
- **Buttery-smooth** visual updates synced to the display refresh rate
- **Battery-friendly** — automatically pauses when the tab is hidden
- **No drift** — unlike `setInterval`, it doesn't accumulate timing errors

### Custom Drag-to-Seek
Progress and volume bars use a `mousedown` → `mousemove` → `mouseup` pattern with pointer capture on `document` to allow dragging outside the bar element:

```js
progressTrack.addEventListener("mousedown", (e) => {
    // Calculate position, update UI
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
});
```

---

## Deployment

All asset paths are relative, making this project deployable on any static host:

- **GitHub Pages** — push to `main` and enable Pages in repo settings
- **Netlify** — drag-and-drop the project folder
- **Vercel** — import the repo directly

---

## License

This project is open source and available under the [MIT License](LICENSE).
