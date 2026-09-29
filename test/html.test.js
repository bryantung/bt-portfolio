const assert = require('node:assert/strict');
const test = require('node:test');
const { escapeHtml } = require('../utils/html');

test('escapeHtml safely escapes text for HTML content and attributes', () => {
    assert.equal(escapeHtml(`&<>'"`), '&amp;&lt;&gt;&#39;&quot;');
});

test('escapeHtml coerces non-string values consistently', () => {
    assert.equal(escapeHtml(42), '42');
});
