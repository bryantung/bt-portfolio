# Bryan Tung's Portfolio (bt-portfolio)

A personal portfolio website featuring a hybrid static/SSR (Server-Side Rendering) architecture, dynamic theming, and a unique **"Winamp Classic"** aesthetic interface.

## 🚀 Features

- **Hybrid Rendering Architecture:** Can be dynamically served via Node.js/Express or compiled into a static site.
- **HTMX Integration:** Seamless page transitions and dynamic content loading without full page reloads.
- **Dynamic Theming System:**
  - Premium Dark Mode (Default) with liquid glassmorphism.
  - Clean Light Mode.
  - **Winamp Classic Mode:** A deeply customized retro theme mimicking the classic media player, including track playlists for work experiences and jewel case album art.
- **Responsive Design:** Ensures smooth viewing across desktop and mobile devices.

## 🛠️ Technology Stack

- **Backend:** Node.js, Express.js
- **Frontend:** HTML5, Vanilla CSS, HTMX
- **Build Tool:** Custom Node build script (`build.js`)

## 📁 Project Structure

```text
bt-portfolio/
├── dist/            # Generated static files (created after build)
├── public/          # Static assets (CSS, JavaScript, Images)
│   └── css/         # Contains styles.css with theming logic
├── views/           # Application views
│   ├── index.html   # Main layout template
│   └── partials/    # Fragment HTML pages (e.g., home, experiences, contact)
├── build.js         # Static site generator script
├── server.js        # Express server (handles HTMX partial requests & full layouts)
└── package.json     # Project metadata and dependencies
```

## ⚙️ Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone this repository or navigate to the project directory.
2. Install the dependencies:
   ```bash
   npm install
   ```

### Running Locally (Development & SSR)
To start the Express server which serves dynamic pages and handles HTMX requests natively:
```bash
npm start
```
*Note: This will also automatically trigger the build script (`npm run prestart`) and serve the application on `http://localhost:3000`.*

### Building a Static Version
If you want to generate a standalone static site that can be hosted on any static file server (like GitHub Pages, Netlify, or Vercel):
```bash
npm run build
```
This will compile the layouts, partials, and public assets into the `/dist` directory.

## 🎨 Theming

The application utilizes CSS variables to manage themes. The site features three distinct modes configured in `/public/css/styles.css`:

1. **Default/Dark (`:root`)**: Premium aesthetic with liquid floating blobs and glassmorphic UI.
2. **Light (`[data-theme="light"]`)**: Clean, high-contrast, professional look.
3. **Winamp (`[data-theme="winamp"]`)**: A nostalgic throwback UI that replaces the standard timeline with an interactive track playlist view and pixel-fonts.

## 📜 License

ISC License

---
*✨ P.S. Every single line of code in this project was conjured up entirely through the magic of AI prompts! Who knew talking to computers could build something this cool? 🤖🪄*
