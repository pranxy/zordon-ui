import assert from 'node:assert/strict';
import test from 'node:test';
import { internalLinks, sitemapPaths } from './check-docs-links.mjs';

test('extracts sitemap paths without coupling requests to the canonical host', () => {
  assert.deepEqual(
    sitemapPaths(
      '<urlset><url><loc>https://docs.example.test/</loc></url><url><loc>https://docs.example.test/components/button</loc></url></urlset>',
    ),
    ['/', '/components/button'],
  );
});

test('keeps same-origin document links and ignores external or non-HTTP actions', () => {
  const links = internalLinks(
    '<a href="/components/button#api">Button</a><a href="https://example.com">External</a><a href="mailto:test@example.com">Mail</a>',
    'http://127.0.0.1:4310/docs/getting-started',
  );

  assert.deepEqual(links, ['/components/button#api']);
});
