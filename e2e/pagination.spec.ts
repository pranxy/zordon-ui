import { expect, test } from './fixtures/accessibility';

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1200 });
  await page.goto('/__zordon-tests__/pagination');
});

test('Pagination native keyboard requests wait for acceptance and size changes reset to the first page', async ({
  page,
  runAxeScan,
}) => {
  const nav = page.getByRole('navigation', { name: 'Result pages' });
  await expect(nav.getByRole('button', { name: 'Page 5', exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await page.getByRole('button', { name: 'Toggle acceptance' }).click();
  const next = nav.getByRole('button', { name: 'Next page' });
  await next.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByLabel('Requested paging')).toHaveText('6:10');
  await expect(nav.locator('[aria-current]')).toHaveText('5');
  await page.getByRole('button', { name: 'Toggle acceptance' }).click();
  await next.focus();
  await page.keyboard.press('Space');
  await expect(nav.locator('[aria-current]')).toHaveText('6');
  await expect(next).toBeFocused();
  await nav.getByRole('combobox', { name: 'Items per page' }).selectOption('25');
  await expect(page.getByLabel('Requested paging')).toHaveText('1:25');
  await expect(nav.locator('[aria-current]')).toHaveText('1');
  await expect(nav.getByRole('button', { name: 'First page' })).toBeDisabled();
  await nav.getByRole('button', { name: 'Last page' }).click();
  await expect(nav.locator('[aria-current]')).toHaveText('8');
  await expect(next).toBeDisabled();
  expect((await runAxeScan()).violations).toEqual([]);
});

test('Pagination Router destinations merge state, preserve fragments, support history and native modified clicks', async ({
  page,
  runAxeScan,
}) => {
  await page.goto('/__zordon-tests__/pagination?page=5&limit=10&filter=active#results');
  const nav = page.getByRole('navigation', { name: 'URL pages' });
  const next = nav.getByRole('link', { name: 'Next page' });
  await expect(next).toHaveAttribute(
    'href',
    '/__zordon-tests__/pagination?page=6&limit=10&filter=active#results',
  );
  const popupPromise = page.context().waitForEvent('page');
  await next.click({ modifiers: ['Control'] });
  const popup = await popupPromise;
  await popup.waitForURL(/page=6/);
  await popup.close();
  await expect(page).toHaveURL(/page=5/);
  await next.click();
  await expect(page).toHaveURL(/page=6&limit=10&filter=active#results/);
  await expect(nav.locator('[aria-current]')).toHaveText('6');
  await nav.getByRole('combobox', { name: 'Items per page' }).selectOption('25');
  await expect(page).toHaveURL(/page=1&limit=25&filter=active#results/);
  await page.goBack();
  await expect(nav.locator('[aria-current]')).toHaveText('6');
  await expect(nav.getByRole('combobox')).toHaveValue('10');
  await page.goForward();
  await expect(nav.locator('[aria-current]')).toHaveText('1');
  expect((await runAxeScan()).violations).toEqual([]);
});

test('Pagination loading, disabled, empty and unknown-total states expose honest boundaries', async ({
  page,
  runAxeScan,
}) => {
  const result = page.getByRole('navigation', { name: 'Result pages' });
  const url = page.getByRole('navigation', { name: 'URL pages' });
  const stream = page.getByRole('navigation', { name: 'Stream pages' });
  await expect(stream.getByRole('button', { name: 'Last page' })).toHaveCount(0);
  await expect(stream.getByRole('button', { name: 'Next page' })).toBeDisabled();
  await page.getByRole('button', { name: 'Toggle more results' }).click();
  await stream.getByRole('button', { name: 'Next page' }).click();
  await expect(stream.locator('[aria-current]')).toHaveText('4');
  await page.getByRole('button', { name: 'Toggle loading' }).click();
  await expect(result).toHaveAttribute('aria-busy', 'true');
  await expect(result.getByRole('button', { name: 'Next page' })).toBeDisabled();
  await expect(url.getByRole('link', { name: 'Next page' })).not.toHaveAttribute('href');
  await expect(url.getByRole('link', { name: 'Next page' })).toHaveAttribute(
    'aria-disabled',
    'true',
  );
  await expect(page.getByRole('status').filter({ hasText: 'Loading results' })).toHaveCount(2);
  await page.getByRole('button', { name: 'Toggle loading' }).click();
  await page.getByRole('button', { name: 'Toggle disabled' }).click();
  await expect(result.getByRole('combobox')).toBeDisabled();
  await page.getByRole('button', { name: 'Toggle disabled' }).click();
  await page.getByRole('button', { name: 'Toggle empty results' }).click();
  await expect(result.locator('[aria-current]')).toHaveCount(0);
  await expect(page.getByRole('status').filter({ hasText: 'No results' })).toBeVisible();
  expect((await runAxeScan()).violations).toEqual([]);
});

test('Pagination wraps at 360px in RTL and preserves forced-color keyboard focus', async ({
  page,
  runAxeScan,
}) => {
  await page.setViewportSize({ width: 360, height: 1500 });
  await page.getByRole('button', { name: 'Toggle direction' }).click();
  const nav = page.getByRole('navigation', { name: 'Result pages' });
  await expect(nav).toHaveCSS('direction', 'rtl');
  for (const size of ['xs', 'sm', 'md', 'lg', 'xl']) {
    await page.getByRole('combobox', { name: 'Control size' }).selectOption(size);
    await expect(nav.locator('.btn-' + size).first()).toBeVisible();
    expect(await nav.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
  }
  await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
  await nav.getByRole('button', { name: 'First page' }).focus();
  await page.keyboard.press('Tab');
  const previous = nav.getByRole('button', { name: 'Previous page' });
  await expect(previous).toBeFocused();
  await expect(previous).toHaveCSS('outline-style', 'solid');
  await page.keyboard.press('Enter');
  await expect(nav.locator('[aria-current]')).toHaveText('4');
  expect((await runAxeScan()).violations).toEqual([]);
});
