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

  await first.focus();
  await expect(first).toBeFocused();

  await page.keyboard.press('Tab');
  await expect(second).toBeFocused();
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
