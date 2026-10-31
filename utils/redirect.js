const { escapeHtml } = require('./html');

// GitHub Pages cannot return a configurable HTTP 302. Cloudflare handles that
// in production; this fallback also works on local previews and the Pages URL.
function renderRedirect(destination) {
    return `<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Bryan Tung's portfolio</title>
        <meta name="robots" content="noindex, follow" />
        <script>
            window.location.replace(${JSON.stringify(destination)} + window.location.search + window.location.hash);
        </script>
        <meta http-equiv="refresh" content="0; url=${escapeHtml(destination)}" />
    </head>
    <body>
        <p><a href="${escapeHtml(destination)}">Visit Bryan Tung's portfolio</a></p>
    </body>
</html>
`;
}

module.exports = { renderRedirect };
