# Bryan Tung's Portfolio (bt-portfolio)

A personal portfolio website featuring a hybrid static/SSR (Server-Side Rendering) architecture, dynamic theming, and a unique **"Winamp Classic"** aesthetic interface.

🔗 **[Live Site](https://bryantung.dev/portfolio/)**

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
├── dist/            # Domain root, redirect pages, robots.txt, verification file
│   └── portfolio/   # Generated portfolio pages and static assets
├── public/          # Static assets (CSS, JavaScript, Images)
│   └── css/         # Contains styles.css with theming logic
├── data/            # Editable structured content used by the build
│   └── experiences.json
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

To build and serve the static site:

```bash
npm start
```

_Note: This also triggers the build script (`npm run prestart`). Open `http://localhost:3000/portfolio/`. The root page redirects there._

For the optional Express renderer, run `node server.js` and open the same path. It supports the same `.html` navigation URLs as the static build, as well as extensionless routes for partial requests.

### Building a Static Version

If you want to generate a standalone static site that can be hosted on any static file server (like GitHub Pages, Netlify, or Vercel):

```bash
npm run build
```

This compiles the layouts, partials, and public assets into `dist/portfolio/`. The artifact root includes fallback redirects for `/` and the previous root-level page URLs, plus `robots.txt` and the Google verification file. Each build removes the previous `dist/` first so old root-level content cannot remain published.

## Custom domain: bryantung.dev

GitHub Pages remains the host. The build publishes a real `portfolio/` directory, so the custom domain serves it at `https://bryantung.dev/portfolio/`. Keep the trailing slash so relative navigation and asset URLs resolve inside that directory. No Worker, repository rename, or additional hosting service is needed.

Set this up in the following order:

1. Deploy this build to GitHub Pages using the existing workflow. The artifact upload path stays `./dist`. Before attaching the domain, check `https://bryantung.github.io/bt-portfolio/portfolio/`.
2. In your GitHub account's **Settings → Pages**, verify `bryantung.dev` using GitHub's provided TXT record in Cloudflare DNS. Keep this record after verification.
3. In this repository's **Settings → Pages → Custom domain**, enter `bryantung.dev` (only the hostname). This project uses GitHub Actions deployment, so GitHub does not require or use a `CNAME` file in the artifact.
4. In Cloudflare **DNS → Records**, add these four `A` records for `@`, initially **DNS only**. Replace conflicting apex web records, preserving email and verification records:

    | Type | Name | Content         |
    | ---- | ---- | --------------- |
    | A    | @    | 185.199.108.153 |
    | A    | @    | 185.199.109.153 |
    | A    | @    | 185.199.110.153 |
    | A    | @    | 185.199.111.153 |

5. Wait for GitHub's DNS check and HTTPS certificate, then enable **Enforce HTTPS**. Confirm `https://bryantung.dev/portfolio/` loads correctly while the DNS records are still DNS only.
6. In Cloudflare, set **SSL/TLS → Overview → Full (strict)**, ensure its edge certificate is active, and switch the four apex records to **Proxied**. Cloudflare redirect rules require proxied traffic.
7. Under Cloudflare **Rules → Redirect Rules**, create a Single Redirect with a **Custom filter expression**:

    ```text
    (http.host eq "bryantung.dev" and http.request.uri.path eq "/")
    ```

    Set the target type to **Static**, target URL to `https://bryantung.dev/portfolio/`, status to **302**, and enable **Preserve query string**. Deploy the rule. Match only `/`, so portfolio pages do not redirect back to themselves. The 302 can be removed when the root gets its own homepage.

GitHub Pages adds the directory slash when visiting `/portfolio`. The generated root HTML is a client-side redirect fallback for local previews and DNS-only access; the Cloudflare rule supplies the actual HTTP 302. The fallback preserves query strings and fragments when JavaScript is enabled. The no-JavaScript fallback still reaches the portfolio.

Verify after setup:

```bash
curl -I 'https://bryantung.dev/?theme=winamp'
# Expect 302 with Location: https://bryantung.dev/portfolio/?theme=winamp
curl -I https://bryantung.dev/portfolio/
# Expect 200
curl -I https://bryantung.dev/portfolio/experiences.html
# Expect 200
curl -I https://bryantung.dev/portfolio/css/styles.css
# Expect 200
curl https://bryantung.dev/robots.txt
# Expect Sitemap: https://bryantung.dev/portfolio/sitemap.xml
```

Also check navigation, refresh a nested page, and view all three themes at desktop and mobile sizes. Adding a custom domain makes GitHub redirect the original `github.io` site to the custom domain; it remains the hosting origin, rather than a separate public URL.

References: [GitHub custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site), [domain verification](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages), and [Cloudflare redirect rules](https://developers.cloudflare.com/rules/url-forwarding/single-redirects/create-dashboard/).

### Code Quality

Run the full local quality gate before opening a pull request:

```bash
npm test
```

This checks JavaScript with ESLint, CSS with Stylelint, HTML and source formatting with Prettier, runs unit tests, and verifies the static build. Use `npm run lint:fix` to apply safe lint and formatting fixes.

## 🎨 Theming

The application utilizes CSS variables to manage themes. The site features three distinct modes configured in `/public/css/styles.css`:

1. **Default/Dark (`:root`)**: Premium aesthetic with liquid floating blobs and glassmorphic UI.
2. **Light (`[data-theme="light"]`)**: Clean, high-contrast, professional look.
3. **Winamp (`[data-theme="winamp"]`)**: A nostalgic throwback UI that replaces the standard timeline with an interactive track playlist view and pixel-fonts.

## ✍️ Updating work experience

Work experience is maintained as structured JSON, not duplicated HTML. For local development, edit `data/experiences.json` and run `npm run build`.

For the published GitHub Pages site, edit `data/experiences.json` directly in GitHub's file editor and commit the change to `main`. The deployment workflow runs automatically. The build validates the JSON and produces both the standard timeline and Winamp playlist from the same entries.

## 📜 License

ISC License

---

_✨ P.S. Every single line of code in this project was conjured up entirely through the magic of AI prompts! Who knew talking to computers could build something this cool? 🤖🪄_
