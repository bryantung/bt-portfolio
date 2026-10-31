const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');
const { renderRedirect } = require('../utils/redirect');
const app = require('../server');

test('static artifact serves the portfolio from its directory and keeps domain files at root', () => {
    const root = path.join(__dirname, '..');
    execFileSync(process.execPath, ['build.js'], { cwd: root });
    const read = (filename) => fs.readFileSync(path.join(root, 'dist', filename), 'utf8');

    for (const filename of ['index', 'experiences', 'education', 'tech-stack', 'contact']) {
        assert.match(read(`portfolio/${filename}.html`), /<main id="main-content">/);
        assert.doesNotMatch(read(`${filename}.html`), /<main id="main-content">/);
    }
    assert.match(read('portfolio/index.html'), /href="https:\/\/bryantung.dev\/portfolio\/"/);
    assert.match(
        read('portfolio/index.html'),
        /https:\/\/bryantung.dev\/portfolio\/assets\/og-preview-personalized.png/,
    );
    assert.match(read('robots.txt'), /Sitemap: https:\/\/bryantung.dev\/portfolio\/sitemap.xml/);
    assert.match(read('portfolio/sitemap.xml'), /<loc>https:\/\/bryantung.dev\/portfolio\/<\/loc>/);
    assert.match(read('googledf9283629b14cba5.html'), /google-site-verification/);
    assert.ok(read('portfolio/css/styles.css').length > 0);

    const { experiences: jobs } = require('../data/experiences.json');
    const experience = read('portfolio/experiences.html');
    assert.equal((experience.match(/class="timeline-item"/g) || []).length, jobs.length);
    assert.equal((experience.match(/class="track-row(?:\s|"|$)/g) || []).length, jobs.length);
});

test('redirect fallbacks retain theme links and fragments on both hosting origins', () => {
    for (const origin of ['https://bryantung.dev/', 'https://bryantung.github.io/bt-portfolio/']) {
        const html = renderRedirect('portfolio/');
        let destination;
        vm.runInNewContext(html.match(/<script>([\s\S]*?)<\/script>/)[1], {
            window: {
                location: {
                    search: '?theme=winamp',
                    hash: '#experience',
                    replace: (value) => {
                        destination = new URL(value, origin).href;
                    },
                },
            },
        });
        assert.equal(destination, `${origin}portfolio/?theme=winamp#experience`);
    }
});

test('Express matches static navigation paths and redirects only the bare directory', async (t) => {
    const server = app.listen(0, '127.0.0.1');
    await new Promise((resolve) => server.once('listening', resolve));
    t.after(() => new Promise((resolve) => server.close(resolve)));
    const base = `http://127.0.0.1:${server.address().port}`;
    for (const pathname of ['/', '/portfolio', '/index.html']) {
        const response = await fetch(`${base}${pathname}?theme=winamp`, { redirect: 'manual' });
        assert.equal(response.status, 302);
        assert.equal(response.headers.get('location'), '/portfolio/?theme=winamp');
    }
    for (const pathname of [
        '/portfolio/',
        '/portfolio/index.html',
        '/portfolio/experiences.html',
    ]) {
        const response = await fetch(`${base}${pathname}`, {
            headers: pathname.endsWith('.html') ? { 'HX-Request': 'true' } : {},
            redirect: 'manual',
        });
        assert.equal(response.status, 200);
        assert.match(await response.text(), /<main id="main-content">/);
    }
    const partial = await fetch(`${base}/portfolio/experiences`, {
        headers: { 'HX-Request': 'true' },
    });
    assert.equal(partial.status, 200);
    assert.doesNotMatch(await partial.text(), /<!doctype html>/);
});
