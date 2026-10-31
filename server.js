const express = require('express');
const path = require('path');
const fs = require('fs');
const { renderExperiences } = require('./render-experiences');
const { SITE_PATH, PAGE_METADATA, renderSeoMetadata } = require('./seo');
const app = express();
app.enable('strict routing');
const portfolio = express.Router();
const PORT = process.env.PORT || 3000;

// Serve static files
portfolio.use(express.static(path.join(__dirname, 'public')));
for (const filename of ['robots.txt', 'googledf9283629b14cba5.html']) {
    app.get(`/${filename}`, (req, res) => res.sendFile(path.join(__dirname, 'public', filename)));
}
app.get('/', (req, res) =>
    res.redirect(302, SITE_PATH + new URL(req.originalUrl, 'http://localhost').search),
);
app.get(SITE_PATH.slice(0, -1), (req, res) =>
    res.redirect(302, SITE_PATH + new URL(req.originalUrl, 'http://localhost').search),
);

// Helper to read partials
const readView = (viewName) => {
    const viewPath = path.join(__dirname, 'views', viewName);
    if (fs.existsSync(viewPath)) {
        return fs.readFileSync(viewPath, 'utf8');
    }
    return '<h1>404 Not Found</h1>';
};

// Helper to render layout with content
const renderLayout = (content, metadata) => {
    const layout = readView('index.html');
    return layout
        .replace('<!-- SEO_METADATA -->', renderSeoMetadata(metadata))
        .replace('<!-- CONTENT_PLACEHOLDER -->', content);
};

// Routes
const routes = [
    { path: '/', partial: 'partials/home.html', metadata: PAGE_METADATA.home },
    {
        path: '/experiences',
        partial: 'partials/experiences.html',
        metadata: PAGE_METADATA.experiences,
    },
    { path: '/education', partial: 'partials/education.html', metadata: PAGE_METADATA.education },
    { path: '/tech-stack', partial: 'partials/tech-stack.html', metadata: PAGE_METADATA.techStack },
    { path: '/contact', partial: 'partials/contact.html', metadata: PAGE_METADATA.contact },
];

routes.forEach((route) => {
    portfolio.get([route.path, `/${route.metadata.filename}`], (req, res) => {
        let content = readView(route.partial);
        if (route.partial === 'partials/experiences.html') {
            content = renderExperiences(content);
        }

        if (req.headers['hx-request'] && !req.path.endsWith('.html')) {
            // If HTMX request, return only the partial
            res.send(content);
        } else {
            // If full page load, render layout with content injected
            const fullPage = renderLayout(content, route.metadata);
            res.send(fullPage);
        }
    });
    // Keep bookmarks to the previous root-level pages working.
    app.get(
        [`/${route.metadata.filename}`, ...(route.path === '/' ? [] : [route.path])],
        (req, res) =>
            res.redirect(
                302,
                SITE_PATH +
                    route.metadata.canonicalPath +
                    new URL(req.originalUrl, 'http://localhost').search,
            ),
    );
});

app.use(SITE_PATH, portfolio);

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}${SITE_PATH}`);
    });
}

module.exports = app;
