import { expect, test } from '@playwright/test';
import { indexableSitePages } from '../projects/docs/src/app/site-catalog';

const canonicalOrigin = 'https://docs.example.test';

test('delivers route-specific documentation HTML before JavaScript runs', async ({
  browser,
  request,
}) => {
  const response = await request.get('/docs/getting-started');
  const html = await response.text();

  expect(response.ok()).toBe(true);
  expect(html).toContain('Get started with Zordon UI');
  expect(html).toContain(
    'Install Zordon UI in an Angular application configured with Tailwind CSS 4 and daisyUI 5',
  );
  expect(html).toContain('<title>Get started with Zordon UI</title>');
  expect(html).toContain('name="description" content="Install and configure Zordon UI');
  expect(html).toMatch(
    /<meta[^>]+name="robots"[^>]+content="index,follow"|<meta[^>]+content="index,follow"[^>]+name="robots"/,
  );
  expect(html).toMatch(
    new RegExp(
      `<link(?=[^>]*rel="canonical")(?=[^>]*href="${canonicalOrigin}/docs/getting-started")[^>]*>`,
    ),
  );
  expect(html).toMatch(
    /<meta(?=[^>]*property="og:title")(?=[^>]*content="Get started with Zordon UI")[^>]*>/,
  );
  expect(html).toMatch(
    /<meta(?=[^>]*property="og:description")(?=[^>]*content="Install and configure Zordon UI)[^>]*>/,
  );
  expect(html).toMatch(
    new RegExp(
      `<meta(?=[^>]*property="og:url")(?=[^>]*content="${canonicalOrigin}/docs/getting-started")[^>]*>`,
    ),
  );
  expect(html).toMatch(/ngh="\d+"/);

  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/docs/getting-started');
  await expect(page.getByRole('heading', { name: 'Get started with Zordon UI' })).toBeVisible();
  await context.close();
});

test('hydrates the server-rendered documentation without console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', error => errors.push(error.message));

  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Zordon UI' })).toBeVisible();
  await page.getByLabel('Primary navigation').getByRole('link', { name: 'Get started' }).click();
  await expect(page.getByRole('heading', { name: 'Get started with Zordon UI' })).toBeVisible();

  expect(errors).toEqual([]);
});

test('publishes robots and sitemap output from the indexable catalogue', async ({ request }) => {
  const robots = await request.get('/robots.txt');
  const sitemap = await request.get('/sitemap.xml');

  expect(robots.ok()).toBe(true);
  expect(await robots.text()).toBe(
    `User-agent: *\nAllow: /\nSitemap: ${canonicalOrigin}/sitemap.xml\n`,
  );
  expect(sitemap.ok()).toBe(true);

  const sitemapText = await sitemap.text();
  const locations = [...sitemapText.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
  const expectedLocations = indexableSitePages().map(page => `${canonicalOrigin}${page.path}`);

  expect(locations).toEqual(expectedLocations);
  expect(new Set(locations).size).toBe(locations.length);
  expect(sitemapText).not.toContain(`${canonicalOrigin}/404`);
});

test('returns an HTTP 404 with noindex metadata for an unknown route', async ({ request }) => {
  const response = await request.get('/definitely-not-a-documentation-page');
  const html = await response.text();

  expect(response.status()).toBe(404);
  expect(html).toContain('<title>Page not found | Zordon UI</title>');
  expect(html).toMatch(
    /<meta[^>]+name="robots"[^>]+content="noindex,nofollow"|<meta[^>]+content="noindex,nofollow"[^>]+name="robots"/,
  );
  expect(html).not.toContain('rel="canonical"');
  expect(html).not.toContain('property="og:url"');
});
