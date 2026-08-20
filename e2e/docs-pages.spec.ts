import { expect, test } from '@playwright/test';

const publicRoutes = [
  { path: '/', heading: 'Zordon UI', body: /Angular component library/i },
  {
    path: '/docs/getting-started',
    heading: 'Get started with Zordon UI',
    body: /Tailwind CSS 4/i,
  },
  { path: '/components', heading: 'Components', body: /component catalogue/i },
  { path: '/components/button', heading: 'Button', body: /native action element/i },
  {
    path: '/foundations/typed-vocabularies',
    heading: 'Typed foundation vocabularies',
    body: /shared type-only vocabularies/i,
  },
  {
    path: '/guides/styling-and-theming',
    heading: 'Styling and theming',
    body: /daisyUI themes/i,
  },
  { path: '/resources', heading: 'Resources', body: /repository/i },
] as const;

test('representative public routes deliver unique, meaningful documents without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  const titles = new Map<string, string>();

  try {
    for (const route of publicRoutes) {
      await test.step(route.path, async () => {
        const response = await page.goto(route.path);

        expect(response?.status(), `${route.path} should respond successfully`).toBe(200);
        await expect(page.locator('main')).toContainText(route.body);
        await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
        await expect(page.getByRole('heading', { level: 1, name: route.heading })).toBeVisible();

        const title = await page.title();
        expect(title.trim(), `${route.path} should have a document title`).not.toBe('');
        titles.set(route.path, title);
      });
    }
  } finally {
    await context.close();
  }

  expect(
    new Set(titles.values()).size,
    'every representative route should have a unique title',
  ).toBe(publicRoutes.length);
});

test('Button reference exposes its planned contract in server-rendered HTML', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  try {
    const response = await page.goto('/components/button');

    expect(response?.status()).toBe(200);
    await expect(page.getByText('planned', { exact: true }).first()).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Install and import' })).toBeVisible();
    await expect(
      page.locator('pre code').filter({ hasText: '@pranxy/zordon-ui/button' }).first(),
    ).toBeVisible();

    const apiSection = page.locator('section').filter({
      has: page.getByRole('heading', { level: 2, name: 'API', exact: true }),
    });
    await expect(apiSection.getByRole('table')).toBeVisible();
    await expect(apiSection.getByRole('columnheader', { name: 'Input' })).toBeVisible();
    await expect(apiSection.getByRole('columnheader', { name: 'Type' })).toBeVisible();
    await expect(apiSection.getByRole('rowheader')).toHaveText([
      'color',
      'variant',
      'size',
      'layout',
      'active',
      'pressed',
      'loading',
      'zdDisabled',
    ]);

    for (const section of ['Accessibility', 'Customization', 'SSR', 'Related']) {
      await expect(
        page.getByRole('heading', { level: 2, name: section, exact: true }),
      ).toBeVisible();
    }
  } finally {
    await context.close();
  }
});

test('representative templates expose their distinguishing content without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  try {
    await page.goto('/');
    const representativePreview = page.getByRole('region', {
      name: 'Native semantics, daisyUI presentation',
    });
    await expect(
      representativePreview.getByText('Representative preview', { exact: true }),
    ).toBeVisible();
    await expect(representativePreview.getByRole('button', { name: 'Save changes' })).toBeVisible();
    await expect(page.getByText(/Coverage status:/)).toBeVisible();

    await page.goto('/docs/getting-started');
    for (const heading of [
      'Prerequisites',
      'Configure the application',
      'Use your first component',
    ]) {
      await expect(
        page.getByRole('heading', { level: 2, name: heading, exact: true }),
      ).toBeVisible();
    }

    await page.goto('/components');
    await expect(page.getByRole('heading', { name: 'Actions', exact: true })).toBeVisible();

    await page.goto('/resources');
    for (const link of ['Roadmap and status', 'Changelog and releases', 'Contributing']) {
      await expect(page.getByRole('link', { name: link, exact: true })).toBeVisible();
    }
  } finally {
    await context.close();
  }
});

test('Button code copy reports success after hydration', async ({ context, page }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/components/button');

  await page.getByRole('button', { name: 'Copy import code' }).click();

  await expect(page.getByRole('status')).toContainText(/Copied/i);
});

test('Button playground resets changed controls to their initial state', async ({ page }) => {
  await page.goto('/components/button');

  const color = page.getByRole('combobox', { name: 'Button color' });
  const variant = page.getByRole('combobox', { name: 'Button variant' });
  const initialColor = await color.inputValue();
  const initialVariant = await variant.inputValue();

  await color.selectOption({ label: 'Primary' });
  await variant.selectOption({ label: 'Outline' });
  await expect(color).not.toHaveValue(initialColor);
  await expect(variant).not.toHaveValue(initialVariant);

  await page.getByRole('button', { name: 'Reset playground' }).click();

  await expect(color).toHaveValue(initialColor);
  await expect(variant).toHaveValue(initialVariant);
});

test('Button enhancement reserves its layout at desktop and mobile widths', async ({ browser }) => {
  for (const viewport of [
    { width: 1280, height: 900 },
    { width: 375, height: 812 },
  ]) {
    await test.step(`${viewport.width}px`, async () => {
      const staticContext = await browser.newContext({ javaScriptEnabled: false, viewport });
      const hydratedContext = await browser.newContext({ viewport });
      const staticPage = await staticContext.newPage();
      const hydratedPage = await hydratedContext.newPage();

      try {
        await staticPage.goto('/components/button');
        await hydratedPage.goto('/components/button');
        await expect(hydratedPage.getByRole('combobox', { name: 'Button color' })).toBeVisible();

        const staticApiPosition = await staticPage
          .getByRole('heading', { level: 2, name: 'API', exact: true })
          .boundingBox();
        const hydratedApiPosition = await hydratedPage
          .getByRole('heading', { level: 2, name: 'API', exact: true })
          .boundingBox();

        expect(
          staticApiPosition,
          'the server-rendered API heading should have a layout box',
        ).not.toBeNull();
        expect(
          hydratedApiPosition,
          'the hydrated API heading should have a layout box',
        ).not.toBeNull();
        expect(
          Math.abs((staticApiPosition?.y ?? 0) - (hydratedApiPosition?.y ?? 0)),
          `hydration should not move the API heading at ${viewport.width}px`,
        ).toBeLessThanOrEqual(2);
      } finally {
        await staticContext.close();
        await hydratedContext.close();
      }
    });
  }
});

test('an unknown route remains a server-rendered, recoverable noindex 404', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  try {
    const response = await page.goto('/definitely-not-a-documentation-page');

    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(page.getByRole('heading', { level: 1, name: 'Page not found' })).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex,nofollow',
    );
    await expect(page.getByRole('link', { name: 'Return home' })).toHaveAttribute('href', '/');
    await expect(page.getByRole('link', { name: 'Browse components' })).toHaveAttribute(
      'href',
      '/components',
    );
  } finally {
    await context.close();
  }
});
