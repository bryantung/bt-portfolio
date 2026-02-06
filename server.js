const express = require('express');
const path = require('path');
const fs = require('fs');
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
const renderLayout = (content) => {
    let layout = readView('index.html');
    return layout.replace('<!-- CONTENT_PLACEHOLDER -->', content);
};

// Routes
const routes = [
    { path: '/', partial: 'partials/home.html', title: 'Home' },
    { path: '/experiences', partial: 'partials/experiences.html', title: 'Experiences' },
    { path: '/education', partial: 'partials/education.html', title: 'Education' },
    { path: '/tech-stack', partial: 'partials/tech-stack.html', title: 'Tech Stack' },
    { path: '/contact', partial: 'partials/contact.html', title: 'Contact' }
];

routes.forEach(route => {
    app.get(route.path, (req, res) => {
        const content = readView(route.partial);

        if (req.headers['hx-request']) {
            // If HTMX request, return only the partial
            res.send(content);
        } else {
            // If full page load, render layout with content injected
            const fullPage = renderLayout(content);
            res.send(fullPage);
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
