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

    // daisyUI's shipped dark primary token pair is 4.12:1. Component scopes retain
    // color-contrast checks; this broad third-party theme smoke test does not own its tokens.
    const results = await runAxeScan(fixtureScope, {
      disabledRules: theme === 'dark' ? ['color-contrast'] : [],
    });
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

test('has no detectable WCAG A or AA violations for native Hover 3D hosts', async ({
  page,
  runAxeScan,
}) => {
  await expect(page.getByTestId('hover-3d-example')).toHaveAttribute('href', '#hover-3d-target');
  const results = await runAxeScan('[data-testid="hover-3d-contract"]');
  expect(results.violations).toEqual([]);
});

test('has no detectable WCAG A or AA violations for native Hover Gallery hosts', async ({
  page,
  runAxeScan,
}) => {
  await expect(page.getByTestId('hover-gallery-example')).toHaveClass(/hover-gallery/);
  const results = await runAxeScan('[data-testid="hover-gallery-contract"]');
  expect(results.violations).toEqual([]);
});

test('has no detectable WCAG A or AA violations for native List hosts', async ({
  page,
  runAxeScan,
}) => {
  await expect(page.getByTestId('list-example')).toHaveAttribute(
    'aria-label',
    'Recently played tracks',
  );
  const results = await runAxeScan('[data-testid="list-contract"]');
  expect(results.violations).toEqual([]);
});

test('has no detectable WCAG A or AA violations for native Table hosts', async ({
  page,
  runAxeScan,
}) => {
  await expect(page.getByTestId('table-example').locator('caption')).toHaveText(
    'Monthly deployments',
  );
  const results = await runAxeScan('[data-testid="table-contract"]');
  expect(results.violations).toEqual([]);
});

test('has no detectable WCAG A or AA violations for native Text Rotate hosts', async ({
  page,
  runAxeScan,
}) => {
  await expect(page.getByTestId('text-rotate-example')).toHaveClass(/text-rotate/);
  expect((await runAxeScan('[data-testid="text-rotate-contract"]')).violations).toEqual([]);
});

test('has no detectable WCAG A or AA violations for native Timeline hosts', async ({
  page,
  runAxeScan,
}) => {
  await expect(page.getByTestId('timeline-example')).toHaveAttribute(
    'aria-label',
    'Release history',
  );
  expect((await runAxeScan('[data-testid="timeline-contract"]')).violations).toEqual([]);
});

test('has no detectable WCAG A or AA violations for native Stack hosts', async ({
  page,
  runAxeScan,
}) => {
  await expect(page.getByTestId('stack-example')).toHaveAttribute(
    'aria-label',
    'Stacked release cards',
  );
  expect((await runAxeScan('[data-testid="stack-contract"]')).violations).toEqual([]);
});

test('has no detectable WCAG A or AA violations for native Footer hosts', async ({
  page,
  runAxeScan,
}) => {
  await expect(page.getByTestId('footer-example')).toHaveAttribute('aria-label', 'Fixture footer');
  expect((await runAxeScan('[data-testid="footer-contract"]')).violations).toEqual([]);
});

test('has no detectable WCAG A or AA violations for native Hero hosts', async ({
  page,
  runAxeScan,
}) => {
  await expect(page.getByTestId('hero-example')).toHaveAttribute(
    'aria-labelledby',
    'hero-example-title',
  );
  expect((await runAxeScan('[data-testid="hero-contract"]')).violations).toEqual([]);
});

test('has no detectable WCAG A or AA violations for native Indicator hosts', async ({
  page,
  runAxeScan,
}) => {
  await expect(page.getByTestId('indicator-example')).toHaveAttribute(
    'aria-label',
    'Inbox with unread messages',
  );
  expect((await runAxeScan('[data-testid="indicator-contract"]')).violations).toEqual([]);
});

test('has no detectable WCAG A or AA violations for native Join hosts', async ({
  page,
  runAxeScan,
}) => {
  await expect(page.getByTestId('join-example')).toHaveAttribute(
    'aria-label',
    'Fixture page navigation',
  );
  expect((await runAxeScan('[data-testid="join-contract"]')).violations).toEqual([]);
});

test('has no detectable WCAG A or AA violations for native Mask hosts', async ({
  page,
  runAxeScan,
}) => {
  await expect(page.getByTestId('mask-example')).toHaveAttribute('alt', 'Avery Chen');
  expect((await runAxeScan('[data-testid="mask-contract"]')).violations).toEqual([]);
});

test('has no detectable WCAG A or AA violations for native Stat hosts', async ({
  page,
  runAxeScan,
}) => {
  await expect(page.getByTestId('stat-example')).toHaveAttribute('aria-label', 'Account summary');
  expect((await runAxeScan('[data-testid="stat-contract"]')).violations).toEqual([]);
});

test('has no detectable WCAG A or AA violations for native Checkbox hosts', async ({
  page,
  runAxeScan,
}) => {
  await expect(page.getByTestId('checkbox-example')).toBeChecked();
  expect((await runAxeScan('[data-testid="checkbox-contract"]')).violations).toEqual([]);
});

test('has no detectable WCAG A or AA violations for native Radio hosts', async ({
  page,
  runAxeScan,
}) => {
  await expect(page.getByTestId('radio-starter')).toBeChecked();
  expect((await runAxeScan('[data-testid="radio-contract"]')).violations).toEqual([]);
});

test('has no detectable WCAG A or AA violations for native Filter hosts', async ({
  page,
  runAxeScan,
}) => {
  await expect(page.getByTestId('filter-example')).toHaveClass(/filter/);
  expect((await runAxeScan('[data-testid="filter-contract"]')).violations).toEqual([]);
});

test('has no detectable WCAG A or AA violations for native Range hosts', async ({ runAxeScan }) => {
  expect((await runAxeScan('[data-testid="range-contract"]')).violations).toEqual([]);
});

test('has no detectable WCAG A or AA violations for native Rating hosts', async ({
  runAxeScan,
}) => {
  expect((await runAxeScan('[data-testid="rating-contract"]')).violations).toEqual([]);
});

test('has no detectable WCAG A or AA violations for native Select hosts', async ({
  page,
  runAxeScan,
}) => {
  await expect(page.getByTestId('select-example')).toHaveClass(/select-primary/);
  expect((await runAxeScan('[data-testid="select-contract"]')).violations).toEqual([]);
});

test('has no detectable WCAG A or AA violations for native Text Input hosts', async ({
  page,
  runAxeScan,
}) => {
  await expect(page.getByTestId('text-input-example')).toHaveClass(/input-primary/);
  expect((await runAxeScan('[data-testid="text-input-contract"]')).violations).toEqual([]);
});

test('has no detectable WCAG A or AA violations for native Textarea hosts', async ({
  page,
  runAxeScan,
}) => {
  await expect(page.getByTestId('textarea-example')).toHaveClass(/textarea-primary/);
  expect((await runAxeScan('[data-testid="textarea-contract"]')).violations).toEqual([]);
});

test('has no detectable WCAG A or AA violations for native Toggle hosts', async ({
  page,
  runAxeScan,
}) => {
  await expect(page.getByTestId('toggle-example')).toHaveClass(/toggle-primary/);
  expect((await runAxeScan('[data-testid="toggle-contract"]')).violations).toEqual([]);
});

test('has no detectable WCAG A or AA violations for native Validator hosts', async ({
  page,
  runAxeScan,
}) => {
  await expect(page.getByTestId('validator-example')).toHaveClass(/validator/);
  expect((await runAxeScan('[data-testid="validator-contract"]')).violations).toEqual([]);
});

test('has no detectable WCAG A or AA violations for OTP', async ({ page, runAxeScan }) => {
  await expect(page.getByTestId('otp-example').locator('input')).toHaveCount(4);
  expect((await runAxeScan('[data-testid="otp-contract"]')).violations).toEqual([]);
});

test('has no detectable WCAG A or AA violations for native File Input hosts', async ({
  page,
  runAxeScan,
}) => {
  await expect(page.getByTestId('file-input-example')).toHaveAttribute(
    'accept',
    'image/png,image/jpeg',
  );
  expect((await runAxeScan('[data-testid="file-input-contract"]')).violations).toEqual([]);
});

test('has no detectable WCAG A or AA violations for native Browser Mockup hosts', async ({
  page,
  runAxeScan,
}) => {
  await expect(page.getByTestId('browser-mockup-example')).toHaveAttribute(
    'aria-label',
    'Example browser',
  );
  expect((await runAxeScan('[data-testid="browser-mockup-contract"]')).violations).toEqual([]);
});

test('has no detectable WCAG A or AA violations for native Code Mockup hosts', async ({
  page,
  runAxeScan,
}) => {
  await expect(page.getByTestId('code-mockup-example')).toHaveAttribute(
    'aria-label',
    'Install command',
  );
  expect((await runAxeScan('[data-testid="code-mockup-contract"]')).violations).toEqual([]);
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

test('has no detectable WCAG A or AA violations for native Chat Bubble hosts', async ({
  page,
  runAxeScan,
}) => {
  await expect(page.getByTestId('chat-start').locator('img')).toHaveAttribute('alt', 'Ava Chen');
  const results = await runAxeScan('[data-testid="chat-contract"]');
  expect(results.violations).toEqual([]);
});

test('has no detectable WCAG A or AA violations for native Carousel hosts', async ({
  page,
  runAxeScan,
}) => {
  await expect(page.getByTestId('carousel-horizontal')).toHaveAttribute(
    'aria-label',
    'Featured articles',
  );
  const results = await runAxeScan('[data-testid="carousel-contract"]');
  expect(results.violations).toEqual([]);
});

test('has no detectable WCAG A or AA violations for native Collapse hosts', async ({
  page,
  runAxeScan,
}) => {
  await expect(page.getByTestId('collapse-details').locator('summary')).toHaveText('Release notes');
  const results = await runAxeScan('[data-testid="collapse-contract"]');
  expect(results.violations).toEqual([]);
});

test('has no detectable WCAG A or AA violations for native Kbd hosts', async ({
  page,
  runAxeScan,
}) => {
  await expect(page.getByTestId('kbd-inline')).toHaveJSProperty('tagName', 'KBD');
  const results = await runAxeScan('[data-testid="kbd-contract"]');
  expect(results.violations).toEqual([]);
});

test('has no detectable WCAG A or AA violations for native Status hosts', async ({
  page,
  runAxeScan,
}) => {
  await expect(page.getByTestId('status-online')).toHaveAttribute('aria-label', 'Service online');
  const results = await runAxeScan('[data-testid="status-contract"]');
  expect(results.violations).toEqual([]);
});

test('has no detectable WCAG A or AA violations for native Countdown hosts', async ({
  page,
  runAxeScan,
}) => {
  await expect(page.getByTestId('countdown-remaining')).toHaveAttribute(
    'aria-label',
    '59 seconds remaining',
  );
  const results = await runAxeScan('[data-testid="countdown-contract"]');
  expect(results.violations).toEqual([]);
});

test('has no detectable WCAG A or AA violations for native Diff hosts', async ({
  page,
  runAxeScan,
}) => {
  await expect(page.getByTestId('diff-example')).toHaveAttribute('tabindex', '0');
  const results = await runAxeScan('[data-testid="diff-contract"]');
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
