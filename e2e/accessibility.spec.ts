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

test('has no detectable WCAG A or AA violations for native Divider hosts', async ({
  page,
  runAxeScan,
}) => {
  await expect(page.getByTestId('divider-hr')).toHaveJSProperty('tagName', 'HR');
  await expect(page.getByTestId('divider-decorative')).toHaveAttribute('aria-hidden', 'true');

  const results = await runAxeScan('[data-testid="divider-contract"]');
  expect(results.violations).toEqual([]);
});

test('has no detectable WCAG A or AA violations for native Label hosts', async ({
  page,
  runAxeScan,
}) => {
  await expect(page.getByTestId('label-explicit')).toHaveAttribute('for', 'label-email');
  const results = await runAxeScan('[data-testid="label-contract"]');
  expect(results.violations).toEqual([]);
});

test('has no detectable WCAG A or AA violations for native Fieldset hosts', async ({
  page,
  runAxeScan,
}) => {
  await expect(page.getByTestId('fieldset-native')).toHaveAttribute('disabled', '');
  const results = await runAxeScan('[data-testid="fieldset-contract"]');
  expect(results.violations).toEqual([]);
});

test('has no detectable WCAG A or AA violations for native Aura hosts', async ({
  page,
  runAxeScan,
}) => {
  await expect(page.getByTestId('aura-rainbow')).toHaveAttribute('data-zd-aura', 'true');
  const results = await runAxeScan('[data-testid="aura-contract"]');
  expect(results.violations).toEqual([]);
});

test('has no detectable WCAG A or AA violations for native Badge hosts', async ({
  page,
  runAxeScan,
}) => {
  await expect(page.getByTestId('badge-status')).toHaveAttribute('role', 'status');
  const results = await runAxeScan('[data-testid="badge-contract"]');
  expect(results.violations).toEqual([]);
});

test('has no detectable WCAG A or AA violations for native Card hosts', async ({
  page,
  runAxeScan,
}) => {
  await expect(page.getByTestId('card-article').getByRole('heading')).toBeVisible();
  const results = await runAxeScan('[data-testid="card-contract"]');
  expect(results.violations).toEqual([]);
});

test('has no detectable WCAG A or AA violations for native Chat Bubble hosts', async ({ page, runAxeScan }) => {
  await expect(page.getByTestId('chat-start').locator('img')).toHaveAttribute('alt', 'Ava Chen');
  const results = await runAxeScan('[data-testid="chat-contract"]');
  expect(results.violations).toEqual([]);
});

test('has no detectable WCAG A or AA violations for native Avatar hosts', async ({
  page,
  runAxeScan,
}) => {
  await expect(page.getByTestId('avatar-online').locator('img')).toHaveAttribute(
    'alt',
    'Avery Chen',
  );
  const results = await runAxeScan('[data-testid="avatar-contract"]');
  expect(results.violations).toEqual([]);
});
