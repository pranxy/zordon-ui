import { expect, test } from './fixtures/accessibility';

test('skip link moves keyboard focus to the main documentation content', async ({ page }) => {
  await page.goto('/docs/getting-started');

  await page.keyboard.press('Tab');
  const skipLink = page.getByRole('link', { name: 'Skip to content' });
  await expect(skipLink).toBeFocused();
  await skipLink.press('Enter');

  await expect(page.locator('main')).toBeFocused();
});

test('desktop primary navigation exposes and updates the current page', async ({ page }) => {
  await page.goto('/');

  const primaryNavigation = page.getByRole('navigation', { name: 'Primary navigation' });
  const getStartedLink = primaryNavigation.getByRole('link', { name: 'Get started' });
  await expect(getStartedLink).toBeVisible();

  await getStartedLink.click();

  await expect(page).toHaveURL('/docs/getting-started');
  await expect(getStartedLink).toHaveAttribute('aria-current', 'page');
});

test('mobile navigation disclosure reaches the getting-started page', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');

  const disclosure = page.locator('summary').filter({ hasText: 'Navigation menu' });
  await expect(disclosure).toBeVisible();
  await disclosure.click();

  const mobileNavigation = page.getByRole('navigation', { name: 'Mobile navigation' });
  await mobileNavigation.getByRole('link', { name: 'Get started' }).click();

  await expect(page).toHaveURL('/docs/getting-started');
  await expect(page.getByRole('heading', { name: 'Get started with Zordon UI' })).toBeVisible();

  await disclosure.click();
  await expect(mobileNavigation.getByRole('link', { name: 'Get started' })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await disclosure.click();

  const inlineTableOfContents = page.locator('main details').filter({ hasText: 'On this page' });
  const tableOfContentsDisclosure = inlineTableOfContents
    .locator('summary')
    .filter({ hasText: 'On this page' });
  await expect(tableOfContentsDisclosure).toBeVisible();
  await tableOfContentsDisclosure.click();
  await expect(
    inlineTableOfContents
      .getByRole('navigation', { name: 'On this page' })
      .getByRole('link', { name: 'What comes next' }),
  ).toBeVisible();
});

test('getting-started exposes breadcrumb and in-page navigation', async ({ page }) => {
  await page.goto('/docs/getting-started');

  const breadcrumb = page.getByRole('navigation', { name: 'Breadcrumb' });
  await expect(breadcrumb.getByRole('link', { name: 'Home' })).toBeVisible();
  await expect(breadcrumb).toContainText('Get started');

  const tableOfContents = page.getByRole('navigation', { name: 'On this page' });
  const sectionLink = tableOfContents.getByRole('link', { name: 'What comes next' });
  await expect(sectionLink).toBeVisible();
  await sectionLink.click();
  await expect(page).toHaveURL('/docs/getting-started#what-comes-next');
  await expect(page.getByRole('heading', { name: 'What comes next' })).toBeVisible();
});

test('search filters catalogue links and restores trigger focus when dismissed', async ({
  page,
}) => {
  await page.goto('/');

  const trigger = page.getByRole('button', { name: 'Search documentation' });
  await trigger.click();

  const dialog = page.getByRole('dialog', { name: 'Search documentation' });
  await expect(dialog).toBeVisible();
  const search = dialog.getByRole('searchbox', { name: 'Search documentation' });
  await expect(search).toBeFocused();

  await search.fill('get started');
  const results = dialog.getByRole('navigation', { name: 'Search results' }).getByRole('link');
  await expect(results).toHaveCount(1);
  await expect(results.first()).toHaveAttribute('href', '/docs/getting-started');

  await search.fill('no catalogue result has these words');
  await expect(dialog.getByRole('link')).toHaveCount(0);

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('theme selection persists across reload without hydration errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', error => errors.push(error.message));

  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  const root = page.locator('html');
  await expect(root).toHaveAttribute('data-theme', 'light');
  const lightBaseColor = await root.evaluate(element =>
    getComputedStyle(element).getPropertyValue('--color-base-100').trim(),
  );
  expect(lightBaseColor).not.toBe('');

  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  await expect(root).toHaveAttribute('data-theme', 'dark');
  const darkBaseColor = await root.evaluate(element =>
    getComputedStyle(element).getPropertyValue('--color-base-100').trim(),
  );
  expect(darkBaseColor).not.toBe('');
  expect(darkBaseColor).not.toBe(lightBaseColor);

  await page.reload();

  await expect(root).toHaveAttribute('data-theme', 'dark');
  await expect
    .poll(() =>
      root.evaluate(element =>
        getComputedStyle(element).getPropertyValue('--color-base-100').trim(),
      ),
    )
    .toBe(darkBaseColor);
  await expect(page.getByRole('button', { name: 'Switch to light theme' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('has no critical or serious accessibility violations at desktop and mobile widths', async ({
  page,
  runAxeScan,
}) => {
  for (const viewport of [
    { width: 1280, height: 900 },
    { width: 375, height: 812 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/docs/getting-started');

    const results = await runAxeScan();
    const materialViolations = results.violations.filter(
      violation => violation.impact === 'critical' || violation.impact === 'serious',
    );

    expect(materialViolations).toEqual([]);
  }
});
