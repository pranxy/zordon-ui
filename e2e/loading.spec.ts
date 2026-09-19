import { expect, test } from './fixtures/accessibility';

test('Loading delays status text, cancels short work and leaves application busy state immediate', async ({
  page,
  runAxeScan,
}) => {
  await page.goto('/__zordon-tests__/loading');
  await page.clock.install();
  const loader = page.getByTestId('loading-delayed');
  await expect(loader).toHaveAttribute('role', 'status');
  await expect(loader.locator('.zd-loading-status')).toHaveText('');
  await page.getByRole('button', { name: 'Start work' }).click();
  await expect(page.getByRole('region', { name: 'Results' })).toHaveAttribute('aria-busy', 'true');
  await expect(loader).toHaveAttribute('data-zd-loading-visible', 'false');
  await page.clock.runFor(200);
  await page.getByRole('button', { name: 'Finish work' }).click();
  await page.clock.runFor(1000);
  await expect(loader.locator('.zd-loading-status')).toHaveText('');
  await page.getByRole('button', { name: 'Start work' }).click();
  await page.clock.runFor(600);
  await expect(loader.locator('.zd-loading-status')).toHaveText('Loading results');
  await expect(loader.locator('.zd-loading-label')).toBeVisible();
  await page.getByRole('button', { name: 'Finish work' }).click();
  await expect(loader).toHaveAttribute('data-zd-loading-visible', 'false');
  await expect(page.getByRole('region', { name: 'Results' })).toHaveAttribute('aria-busy', 'false');
  expect((await runAxeScan()).violations).toEqual([]);
});

test('Loading renders all mask families and sizes while overlays remain non-blocking', async ({
  page,
}) => {
  await page.goto('/__zordon-tests__/loading');
  for (const variant of ['spinner', 'dots', 'ring', 'ball', 'bars', 'infinity']) {
    const glyphs = page.getByTestId('loading-matrix').locator('.loading-' + variant);
    expect(await glyphs.count()).toBeGreaterThanOrEqual(5);
    const mask = await glyphs.first().evaluate(element => getComputedStyle(element).maskImage);
    expect(mask).toContain('data:image/svg+xml');
  }
  const widths = await page
    .getByTestId('loading-matrix')
    .locator('section')
    .first()
    .locator('.zd-loading-animated')
    .evaluateAll(elements => elements.map(element => element.getBoundingClientRect().width));
  expect(widths).toEqual([16, 20, 24, 28, 32]);
  await page.getByRole('button', { name: 'Start work' }).click();
  await expect(page.getByTestId('loading-overlay')).toHaveAttribute(
    'data-zd-loading-visible',
    'true',
  );
  await page.getByRole('button', { name: 'Overlay action' }).click();
  await expect(page.getByText('Actions: 1', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Overlay action' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByText('Actions: 2', { exact: true })).toBeVisible();
  await expect(page.getByTestId('loading-custom').locator('.zd-loading-custom')).toBeVisible();
});

test('Loading switches animated and custom artwork to static reduced-motion and forced-color feedback', async ({
  page,
  runAxeScan,
}) => {
  await page.setViewportSize({ width: 360, height: 1100 });
  await page.goto('/__zordon-tests__/loading');
  await page.getByRole('button', { name: 'Toggle direction' }).click();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const custom = page.getByTestId('loading-custom');
  await expect(custom.locator('.zd-loading-custom')).toBeHidden();
  await expect(custom.locator('.zd-loading-static')).toBeVisible();
  await expect(
    page.getByTestId('loading-matrix').locator('.zd-loading-animated').first(),
  ).toBeHidden();
  await page.emulateMedia({ reducedMotion: 'no-preference', forcedColors: 'active' });
  await expect(custom.locator('.zd-loading-static')).toBeVisible();
  await expect(page.getByTestId('loading-fixture')).toHaveAttribute('dir', 'rtl');
  expect(
    await page
      .getByTestId('loading-fixture')
      .evaluate(element => element.scrollWidth <= element.clientWidth),
  ).toBe(true);
  expect((await runAxeScan()).violations).toEqual([]);
  await page.emulateMedia({ forcedColors: 'none' });
  await expect(custom.locator('.zd-loading-custom')).toBeVisible();
});
