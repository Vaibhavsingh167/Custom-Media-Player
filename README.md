# 🎵 Custom Media Player (Spotify Clone)

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

A highly polished, static-deployable media player mimicking the Spotify web player UI. Built entirely from scratch using pure HTML5, CSS3, and Vanilla JavaScript to demonstrate foundational frontend architecture and UI/UX implementation.

**[🚀 View Live Demo Here](#) *(Replace with your live link, e.g., GitHub Pages or Vercel)***

---

## 📸 Preview

*(Add a screenshot or a GIF of your working player here showing the progress bar moving and hover states)*
`![App Preview](./assets/preview.gif)`

---

## ✨ Features

### UI/UX Design
- **Spotify Aesthetic**: A flawless dark mode implementation (`#121212` background) with the iconic Spotify green accent (`#1DB954`).
- **Responsive Layout**: A full-screen canvas with a persistent, fixed-bottom control bar that adapts to different screen sizes.
- **Micro-interactions**: Smooth hover states, custom track scrubbers, and pill-shaped interactive elements.

### Core Functionality
- **Custom Scrubber**: Uses `requestAnimationFrame` for buttery-smooth progress bar updates, eliminating the visual stuttering caused by traditional `setInterval` approaches.
- **Audio Controls**: Play, Pause, Next, Previous, and dynamic seeking functionality (clicking or dragging the progress bar).
- **Volume Control**: Click and drag to adjust volume dynamically.
- **State Management**: Real-time updates for `MM:SS` formatted timestamps and track metadata swapping.

---

## 🛠️ Tech Stack

- **HTML5**: Semantic markup and the native `HTMLAudioElement` API.
- **CSS3**: CSS Variables (Custom Properties) for a scalable design system, Flexbox for layout management, and custom pseudo-element styling for range sliders.
- **Vanilla JavaScript**: DOM manipulation, event delegation, and asynchronous browser APIs. No React, no jQuery, no frameworks.
- **Assets**: FontAwesome (Icons) and Google Fonts (Inter).

---

## 📂 Project Structure
```text
├── assets/
│   ├── audio/          # MP3 files
│   ├── images/         # Album covers
├── index.html          # Main HTML structure
├── style.css           # Global styles and custom UI overrides
├── script.js           # Audio playback logic and DOM updates
└── README.md