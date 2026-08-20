import { expect, test, type Page } from '@playwright/test';

const canonicalOrigin = 'https://docs.example.test';

const routeMatrix = [
  { path: '/', heading: 'Zordon UI', status: 200 },
  { path: '/docs/getting-started', heading: 'Get started with Zordon UI', status: 200 },
  { path: '/components/button', heading: 'Button', status: 200 },
  {
    path: '/foundations/typed-vocabularies',
    heading: 'Typed foundation vocabularies',
    status: 200,
  },
  { path: '/resources', heading: 'Resources', status: 200 },
  { path: '/not-a-public-documentation-route', heading: 'Page not found', status: 404 },
] as const;

const metadataRoutes = [
  {
    path: '/',
    title: 'Zordon UI',
    description: 'Zordon UI is an Angular component library built on daisyUI.',
  },
  {
    path: '/docs/getting-started',
    title: 'Get started with Zordon UI',
    description:
      'Install and configure Zordon UI for an Angular application using Tailwind CSS and daisyUI.',
  },
  {
    path: '/components/button',
    title: 'Button | Zordon UI',
    description: 'Button applies daisyUI appearance to a native action element.',
  },
  {
    path: '/foundations/typed-vocabularies',
    title: 'Typed foundation vocabularies | Zordon UI',
    description: 'Shared type-only vocabularies keep Zordon UI component APIs consistent.',
  },
  {
    path: '/resources',
    title: 'Resources | Zordon UI',
    description: 'Find Zordon UI roadmap, release, contribution, and upstream resources.',
  },
] as const;

async function metaContent(page: Page, selector: string): Promise<string | null> {
  return page.locator(selector).getAttribute('content');
}

test('explicit public route matrix delivers meaningful HTML without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  try {
    for (const route of routeMatrix) {
      await test.step(route.path, async () => {
        const response = await page.goto(route.path);
        expect(response?.status()).toBe(route.status);
        await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
        await expect(page.getByRole('heading', { level: 1, name: route.heading })).toBeVisible();
        await expect(page.locator('main')).not.toBeEmpty();
      });
    }
  } finally {
    await context.close();
  }
});

test('canonical pages deliver complete social metadata and truthful structured data', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  try {
    for (const route of metadataRoutes) {
      await test.step(route.path, async () => {
        await page.goto(route.path);
        const canonicalUrl = `${canonicalOrigin}${route.path}`;

        await expect(page).toHaveTitle(route.title);
        expect(await metaContent(page, 'meta[name="description"]')).toBe(route.description);
        expect(await metaContent(page, 'meta[name="robots"]')).toBe('index,follow');
        expect(await metaContent(page, 'meta[property="og:title"]')).toBe(route.title);
        expect(await metaContent(page, 'meta[property="og:description"]')).toBe(route.description);
        expect(await metaContent(page, 'meta[property="og:url"]')).toBe(canonicalUrl);
        expect(await metaContent(page, 'meta[name="twitter:card"]')).toBe('summary');
        expect(await metaContent(page, 'meta[name="twitter:title"]')).toBe(route.title);
        expect(await metaContent(page, 'meta[name="twitter:description"]')).toBe(route.description);
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonicalUrl);

        const structuredData = JSON.parse(
          (await page.locator('script#docs-structured-data').textContent()) ?? '',
        ) as Record<string, unknown>;
        expect(structuredData['@context']).toBe('https://schema.org');

        if (route.path === '/') {
          expect(structuredData['@type']).toBe('SoftwareApplication');
          expect(structuredData['name']).toBe('Zordon UI');
          expect(structuredData['url']).toBe(canonicalUrl);
          expect(structuredData).not.toHaveProperty('aggregateRating');
          expect(structuredData).not.toHaveProperty('offers');
        } else {
          expect(structuredData['@type']).toBe('BreadcrumbList');
          const items = structuredData['itemListElement'] as Array<Record<string, unknown>>;
          expect(items.length).toBeGreaterThanOrEqual(2);
          expect(items.map(item => item['position'])).toEqual(items.map((_, index) => index + 1));
          expect(items[0]?.['item']).toBe(`${canonicalOrigin}/`);
          expect(items.at(-1)?.['item']).toBe(canonicalUrl);
        }
      });
    }
  } finally {
    await context.close();
  }
});

test('unknown routes omit canonical, social URL, and structured data', async ({ request }) => {
  const response = await request.get('/not-a-public-documentation-route');
  const html = await response.text();

  expect(response.status()).toBe(404);
  expect(html).toMatch(/<meta(?=[^>]*name="robots")(?=[^>]*content="noindex,nofollow")[^>]*>/);
  expect(html).not.toContain('rel="canonical"');
  expect(html).not.toContain('property="og:url"');
  expect(html).not.toContain('id="docs-structured-data"');
});

test('SSR HTML and hydration state remain within conservative response boundaries', async ({
  request,
}) => {
  const response = await request.get('/');
  const html = await response.text();
  const state = html.match(
    /<script(?=[^>]*type="application\/json")(?=[^>]*id="[^"]+-state")[^>]*>([\s\S]*?)<\/script>/,
  );

  expect(response.ok()).toBe(true);
  expect(Buffer.byteLength(html), 'SSR home HTML should stay below 200 KiB').toBeLessThanOrEqual(
    200 * 1024,
  );
  expect(state, 'the canonical origin hydration state should be present').not.toBeNull();
  expect(
    Buffer.byteLength(state?.[1] ?? ''),
    'serialized hydration state should stay below 4 KiB',
  ).toBeLessThanOrEqual(4 * 1024);
});

test('home does not request the Button reference page chunk until navigation', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Zordon UI' })).toBeVisible();

  const homeScripts = await page.evaluate(() =>
    performance
      .getEntriesByType('resource')
      .map(entry => new URL(entry.name).pathname)
      .filter(path => path.endsWith('.js')),
  );

  await page.locator('a[href="/components/button"]').first().click();
  await expect(page.getByRole('heading', { level: 1, name: 'Button' })).toBeVisible();

  const afterNavigationScripts = await page.evaluate(() =>
    performance
      .getEntriesByType('resource')
      .map(entry => new URL(entry.name).pathname)
      .filter(path => path.endsWith('.js')),
  );
  const buttonOnlyScripts = afterNavigationScripts.filter(path => !homeScripts.includes(path));

  expect(
    buttonOnlyScripts,
    'navigating to Button should fetch at least one route-specific lazy chunk',
  ).not.toEqual([]);
});
