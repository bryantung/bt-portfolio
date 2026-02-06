const fs = require('fs');
const path = require('path');

// Configuration
const DIST_DIR = path.join(__dirname, 'dist');
const VIEWS_DIR = path.join(__dirname, 'views');
const PARTIALS_DIR = path.join(VIEWS_DIR, 'partials');
const PUBLIC_DIR = path.join(__dirname, 'public');

// Ensure dist directory exists
if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR, { recursive: true });
}

// Helper to copy directory recursively
function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// 1. Copy Public Assets
console.log('Copying public assets...');
copyDir(PUBLIC_DIR, DIST_DIR);

// 2. Read Layout Template
const layout = fs.readFileSync(path.join(VIEWS_DIR, 'index.html'), 'utf8');

// 3. Define Pages
const pages = [
    { filename: 'index.html', partial: 'home.html' },
    { filename: 'experiences.html', partial: 'experiences.html' },
    { filename: 'education.html', partial: 'education.html' },
    { filename: 'tech-stack.html', partial: 'tech-stack.html' },
    { filename: 'contact.html', partial: 'contact.html' }
];

// 4. Generate Pages
console.log('Generating HTML pages...');
pages.forEach(page => {
    const partialPath = path.join(PARTIALS_DIR, page.partial);
    let content = '';

    if (fs.existsSync(partialPath)) {
        content = fs.readFileSync(partialPath, 'utf8');
    } else {
        console.warn(`Warning: Partial ${page.partial} not found.`);
    }

    // Inject content into layout
    // Note: We need to handle the active state in nav strings if we want perfection,
    // but for now we just inject the content.
    const fullHtml = layout.replace('<!-- CONTENT_PLACEHOLDER -->', content);

    fs.writeFileSync(path.join(DIST_DIR, page.filename), fullHtml);
    console.log(`Generated ${page.filename}`);
});

console.log('Build complete! Static site generated in /dist');
