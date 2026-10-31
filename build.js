const fs = require('fs');
const path = require('path');
const { renderExperiences } = require('./render-experiences');
const { SITE_PATH, PAGE_METADATA, renderSeoMetadata } = require('./seo');
const { renderRedirect } = require('./utils/redirect');

// Configuration
const DIST_DIR = path.join(__dirname, 'dist');
const VIEWS_DIR = path.join(__dirname, 'views');
const PARTIALS_DIR = path.join(VIEWS_DIR, 'partials');
const PUBLIC_DIR = path.join(__dirname, 'public');
const PORTFOLIO_DIR = path.join(DIST_DIR, SITE_PATH);

// Remove files left by the previous root-level build before changing the layout.
fs.rmSync(DIST_DIR, { recursive: true, force: true });
fs.mkdirSync(PORTFOLIO_DIR, { recursive: true });

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
copyDir(PUBLIC_DIR, PORTFOLIO_DIR);
// Crawlers and domain verification request these files at the domain root.
for (const filename of ['robots.txt', 'googledf9283629b14cba5.html']) {
    fs.copyFileSync(path.join(PUBLIC_DIR, filename), path.join(DIST_DIR, filename));
}

// 2. Read Layout Template
const layout = fs.readFileSync(path.join(VIEWS_DIR, 'index.html'), 'utf8');

// 3. Define Pages
const pages = [
    { metadata: PAGE_METADATA.home, partial: 'home.html' },
    { metadata: PAGE_METADATA.experiences, partial: 'experiences.html' },
    { metadata: PAGE_METADATA.education, partial: 'education.html' },
    { metadata: PAGE_METADATA.techStack, partial: 'tech-stack.html' },
    { metadata: PAGE_METADATA.contact, partial: 'contact.html' },
];

// 4. Generate Pages
console.log('Generating HTML pages...');
pages.forEach((page) => {
    const partialPath = path.join(PARTIALS_DIR, page.partial);
    let content = '';

    if (fs.existsSync(partialPath)) {
        content = fs.readFileSync(partialPath, 'utf8');
        if (page.partial === 'experiences.html') {
            content = renderExperiences(content);
        }
    } else {
        console.warn(`Warning: Partial ${page.partial} not found.`);
    }

    // Inject content into layout
    // Note: We need to handle the active state in nav strings if we want perfection,
    // but for now we just inject the content.
    const fullHtml = layout
        .replace('<!-- SEO_METADATA -->', renderSeoMetadata(page.metadata))
        .replace('<!-- CONTENT_PLACEHOLDER -->', content);

    fs.writeFileSync(path.join(PORTFOLIO_DIR, page.metadata.filename), fullHtml);
    const destination = `${SITE_PATH.slice(1)}${page.metadata.canonicalPath}`;
    fs.writeFileSync(path.join(DIST_DIR, page.metadata.filename), renderRedirect(destination));
    console.log(`Generated ${page.metadata.filename}`);
});

console.log('Build complete! Static site generated in /dist');
