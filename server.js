const express = require('express');
const path = require('path');
const fs = require('fs');
const { renderExperiences } = require('./render-experiences');
const { PAGE_METADATA, renderSeoMetadata } = require('./seo');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

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
    let layout = readView('index.html');
    return layout
        .replace('<!-- SEO_METADATA -->', renderSeoMetadata(metadata))
        .replace('<!-- CONTENT_PLACEHOLDER -->', content);
};

// Routes
const routes = [
    { path: '/', partial: 'partials/home.html', metadata: PAGE_METADATA.home },
    { path: '/experiences', partial: 'partials/experiences.html', metadata: PAGE_METADATA.experiences },
    { path: '/education', partial: 'partials/education.html', metadata: PAGE_METADATA.education },
    { path: '/tech-stack', partial: 'partials/tech-stack.html', metadata: PAGE_METADATA.techStack },
    { path: '/contact', partial: 'partials/contact.html', metadata: PAGE_METADATA.contact }
];

routes.forEach(route => {
    app.get(route.path, (req, res) => {
        let content = readView(route.partial);
        if (route.partial === 'partials/experiences.html') {
            content = renderExperiences(content);
        }

        if (req.headers['hx-request']) {
            // If HTMX request, return only the partial
            res.send(content);
        } else {
            // If full page load, render layout with content injected
            const fullPage = renderLayout(content, route.metadata);
            res.send(fullPage);
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
