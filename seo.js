const SITE_URL = 'https://bryantung.github.io/bt-portfolio/';
const SOCIAL_PREVIEW_URL = `${SITE_URL}assets/og-preview-personalized.png`;

const PAGE_METADATA = {
    home: {
        filename: 'index.html',
        canonicalPath: '',
        title: 'Bryan Tung — Tech Lead & Software Engineer',
        description: 'Bryan Tung is a Tech Lead and Software Engineer in Kuala Lumpur, focused on web engineering, team leadership, legacy modernization, and scalable applications.',
        robots: 'index, follow',
        social: true
    },
    experiences: {
        filename: 'experiences.html',
        canonicalPath: 'experiences.html',
        title: 'Professional Experience | Bryan Tung',
        description: 'Selected professional experience from Bryan Tung’s portfolio.',
        robots: 'noindex, follow'
    },
    education: {
        filename: 'education.html',
        canonicalPath: 'education.html',
        title: 'Education | Bryan Tung',
        description: 'Education details from Bryan Tung’s portfolio.',
        robots: 'noindex, follow'
    },
    techStack: {
        filename: 'tech-stack.html',
        canonicalPath: 'tech-stack.html',
        title: 'Technical Skills | Bryan Tung',
        description: 'Technical skills from Bryan Tung’s portfolio.',
        robots: 'noindex, follow'
    },
    contact: {
        filename: 'contact.html',
        canonicalPath: 'contact.html',
        title: 'Contact | Bryan Tung',
        description: 'Contact Bryan Tung through this portfolio.',
        robots: 'noindex, follow'
    }
};

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function canonicalUrl(page) {
    return `${SITE_URL}${page.canonicalPath}`;
}

function renderSeoMetadata(page) {
    const canonical = canonicalUrl(page);
    const metadata = [
        `<title>${escapeHtml(page.title)}</title>`,
        `<meta name="description" content="${escapeHtml(page.description)}">`,
        `<meta name="robots" content="${page.robots}">`,
        `<link rel="canonical" href="${canonical}">`
    ];

    if (page.social) {
        metadata.push(
            `<meta property="og:type" content="website">`,
            `<meta property="og:site_name" content="BT Portfolio">`,
            `<meta property="og:title" content="${escapeHtml(page.title)}">`,
            `<meta property="og:description" content="${escapeHtml(page.description)}">`,
            `<meta property="og:url" content="${canonical}">`,
            `<meta property="og:image" content="${SOCIAL_PREVIEW_URL}">`,
            `<meta property="og:image:width" content="1726">`,
            `<meta property="og:image:height" content="911">`,
            `<meta name="twitter:card" content="summary_large_image">`,
            `<meta name="twitter:title" content="${escapeHtml(page.title)}">`,
            `<meta name="twitter:description" content="${escapeHtml(page.description)}">`,
            `<meta name="twitter:image" content="${SOCIAL_PREVIEW_URL}">`
        );

        const person = {
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Bryan Tung',
            url: SITE_URL,
            image: `${SITE_URL}assets/profile.png`,
            jobTitle: ['Tech Lead', 'Software Engineer'],
            address: {
                '@type': 'PostalAddress',
                addressLocality: 'Kuala Lumpur',
                addressCountry: 'MY'
            },
            knowsAbout: ['Web engineering', 'Team leadership', 'Legacy modernization', 'Scalable applications'],
            sameAs: [
                'https://github.com/bryantung',
                'https://www.linkedin.com/in/bryantung'
            ]
        };
        metadata.push(`<script type="application/ld+json">${JSON.stringify(person).replace(/</g, '\\u003c')}</script>`);
    }

    return metadata.join('\n    ');
}

module.exports = { PAGE_METADATA, renderSeoMetadata };
