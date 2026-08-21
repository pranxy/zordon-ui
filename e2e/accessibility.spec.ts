import { expect, test } from './fixtures/accessibility';

const fixtureScope = '[data-testid="browser-test-fixture"]';

test.beforeEach(async ({ page }) => {
  await page.goto('/__zordon-tests__/browser');
  await expect(page.getByRole('heading', { name: 'Browser integration fixture' })).toBeVisible();
});

for (const theme of ['light', 'dark']) {
  test(`has no detectable WCAG A or AA violations in the ${theme} theme`, async ({
    page,
    runAxeScan,
  }) => {
    await page
      .locator('html')
      .evaluate((element, value) => element.setAttribute('data-theme', value), theme);

    const results = await runAxeScan(fixtureScope);
    expect(results.violations).toEqual([]);
  });
}

test('has no detectable WCAG A or AA violations with the dialog open', async ({
  page,
  runAxeScan,
}) => {
  await page.getByRole('button', { name: 'Open test dialog' }).click();
  await expect(page.getByRole('dialog', { name: 'Test dialog' })).toBeVisible();

  const results = await runAxeScan('dialog[open]');
  expect(results.violations).toEqual([]);
});

test('has no detectable WCAG A or AA violations for guarded Button states', async ({
  page,
  runAxeScan,
}) => {
  await page.getByTestId('button-toggle-loading').click();
  await expect(page.getByTestId('button-loading')).toHaveAttribute('aria-disabled', 'true');

  const results = await runAxeScan('[data-testid="button-contract"]');
  expect(results.violations).toEqual([]);
});

test('has no detectable WCAG A or AA violations for native Link states', async ({
  page,
  runAxeScan,
}) => {
  await expect(page.getByTestId('link-disabled')).toHaveAttribute('aria-disabled', 'true');

  const results = await runAxeScan('[data-testid="link-contract"]');
  expect(results.violations).toEqual([]);
});
