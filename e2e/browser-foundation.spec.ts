import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/__zordon-tests__/browser');
  await expect(page.getByRole('heading', { name: 'Browser integration fixture' })).toBeVisible();
});

test('boots the Angular fixture without page errors', async ({ page }) => {
  const pageErrors: Error[] = [];
  page.on('pageerror', error => pageErrors.push(error));

  await page.reload();
  await expect(page.getByTestId('browser-test-fixture')).toBeVisible();
  expect(pageErrors).toEqual([]);
});

test('moves focus in deterministic keyboard order', async ({ page }) => {
  const first = page.getByTestId('focus-first');
  const second = page.getByTestId('focus-second');

  await first.click();
  await expect(first).toBeFocused();

  await page.keyboard.press('Tab');
  await expect(second).toBeFocused();
  expect(await second.evaluate(element => element.matches(':focus-visible'))).toBe(true);
});

test('captures, wraps, monitors, and restores focus with supported CDK primitives', async ({
  page,
}) => {
  const trigger = page.getByRole('button', { name: 'Open focus region' });
  const region = page.getByTestId('focus-trap-region');
  const first = page.getByTestId('focus-trap-first');
  const initial = page.getByTestId('focus-trap-initial');
  const add = page.getByTestId('focus-trap-add');
  const dynamic = page.getByTestId('focus-trap-dynamic');
  const disable = page.getByTestId('focus-trap-disable');
  const close = page.getByTestId('focus-trap-close');

  await trigger.click();
  await expect(region).toBeVisible();
  await expect(initial).toBeFocused();
  await expect(initial).toHaveClass(/cdk-program-focused/);

  await page.keyboard.press('Shift+Tab');
  await expect(first).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(close).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(first).toBeFocused();

  await initial.click();
  await expect(initial).toHaveClass(/cdk-mouse-focused/);

  await add.click();
  await expect(dynamic).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(dynamic).toBeFocused();

  await disable.click();
  await expect(dynamic).toBeDisabled();
  await add.focus();
  await page.keyboard.press('Tab');
  await expect(disable).toBeFocused();

  await close.click();
  await expect(region).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByLabel('Test name')).toBeFocused();
});

test('closes an overlay with Escape and restores trigger focus', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'Open test dialog' });
  const dialog = page.getByRole('dialog', { name: 'Test dialog' });

  await trigger.click();
  await expect(dialog).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close test dialog' })).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test('honors native form validation and submits a value', async ({ page }) => {
  const input = page.getByLabel('Test name');
  const submit = page.getByRole('button', { name: 'Submit test form' });

  await submit.click();
  await expect(input).toBeFocused();
  expect(await input.evaluate((element: HTMLInputElement) => element.validity.valueMissing)).toBe(
    true,
  );

  await input.fill('Zordon');
  await submit.click();
  await expect(page.getByTestId('submitted-name')).toHaveText('Zordon');
});

test('applies compiled daisyUI variables to nested and per-element theme scopes', async ({
  page,
}) => {
  const outer = page.getByTestId('theme-contract');
  const nested = page.getByTestId('nested-theme');
  const component = page.getByTestId('component-theme');

  await expect(outer).toHaveAttribute('data-theme', 'corporate');
  await expect(nested).toHaveAttribute('data-theme', 'cupcake');
  await expect(component).toHaveAttribute('data-theme', 'zordon-visual');

  const radii = await Promise.all(
    [outer, nested, component].map(locator =>
      locator.evaluate(element =>
        getComputedStyle(element).getPropertyValue('--radius-box').trim(),
      ),
    ),
  );
  const [outerRadius, nestedRadius, customRadius] = radii;
  expect(nestedRadius).not.toBe(outerRadius);
  expect(customRadius).toBe('1.25rem');

  await page
    .getByTestId('clear-nested-theme')
    .evaluate((element: HTMLButtonElement) => element.click());
  await expect(nested).not.toHaveAttribute('data-theme');
  await expect
    .poll(() =>
      nested.evaluate(element => getComputedStyle(element).getPropertyValue('--radius-box').trim()),
    )
    .toBe(outerRadius);
});

test('uses preferred dark only when an explicit theme boundary is absent', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.evaluate(() => document.documentElement.removeAttribute('data-theme'));
  await expect(page.locator('html')).not.toHaveAttribute('data-theme');
  const systemScope = page.getByTestId('system-theme');

  const readBaseColor = () =>
    systemScope.evaluate(element =>
      getComputedStyle(element).getPropertyValue('--color-base-100').trim(),
    );
  const preferredDarkColor = await readBaseColor();

  await page
    .getByTestId('set-system-light')
    .evaluate((element: HTMLButtonElement) => element.click());
  await expect(systemScope).toHaveAttribute('data-theme', 'light');
  const explicitLightColor = await readBaseColor();
  expect(explicitLightColor).not.toBe(preferredDarkColor);

  await page
    .getByTestId('clear-system-theme')
    .evaluate((element: HTMLButtonElement) => element.click());
  await expect(systemScope).not.toHaveAttribute('data-theme');
  await expect.poll(readBaseColor).toBe(preferredDarkColor);
});
