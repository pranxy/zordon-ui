import { expect, test } from './fixtures/accessibility';

test('Alert projects native details and actions, exposes live semantics and honors controlled close', async ({
  page,
  runAxeScan,
}) => {
  await page.goto('/__zordon-tests__/alert');
  const alert = page.getByTestId('alert-interactive');
  await expect(alert).toHaveAttribute('role', 'status');
  await expect(alert).toHaveAttribute('aria-atomic', 'true');
  await alert.getByText('Release details', { exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(alert.locator('details')).toHaveJSProperty('open', true);
  await alert.getByRole('button', { name: 'Install later' }).click();
  await expect(page.getByTestId('alert-event')).toContainText('actions: 1');
  await alert.getByRole('button', { name: 'Close update' }).focus();
  await page.keyboard.press('Space');
  await expect(alert).toBeVisible();
  await expect(page.getByTestId('alert-event')).toContainText('close-button');
  await expect(alert.getByRole('button', { name: 'Close update' })).toBeFocused();
  expect((await runAxeScan('[data-testid="alert-interactive"]')).violations).toEqual([]);
  // Reset a rejected request through a new timer configuration, then accept the next request.
  await page.getByRole('button', { name: 'Accept close: false' }).click();
  await page.getByRole('button', { name: 'Toggle timer' }).click();
  await alert.getByRole('button', { name: 'Close update' }).click();
  await expect(alert).toBeHidden();
  await expect(alert).toHaveAttribute('inert', '');
  await page.getByRole('button', { name: 'Show message' }).click();
  await expect(alert).toBeVisible();
});

test('Alert auto-dismiss pauses for pointer and keyboard interaction and resumes remaining time', async ({
  page,
}) => {
  await page.goto('/__zordon-tests__/alert');
  await page.clock.install();
  const alert = page.getByTestId('alert-interactive');
  await page.getByRole('button', { name: 'Accept close: false' }).click();
  await page.getByRole('button', { name: 'Toggle timer' }).click();
  await alert.hover();
  await page.clock.runFor(3000);
  await expect(alert).toBeVisible();
  await alert.getByRole('button', { name: 'Install later' }).focus();
  await page.mouse.move(0, 0);
  await page.clock.runFor(3000);
  await expect(alert).toBeVisible();
  await page.getByRole('button', { name: 'Show message' }).focus();
  await page.clock.runFor(1600);
  await expect(alert).toBeHidden();
  await expect(page.getByTestId('alert-event')).toContainText('timeout');
});

test('Alert variants retain responsive layout and narrow RTL forced-color interaction', async ({
  page,
  runAxeScan,
}) => {
  await page.setViewportSize({ width: 1280, height: 1000 });
  await page.goto('/__zordon-tests__/alert');
  const alert = page.getByTestId('alert-interactive');
  await expect(alert).toHaveCSS('flex-direction', 'row');
  await expect(page.getByTestId('alert-matrix').locator('zd-alert')).toHaveCount(17);
  await page.setViewportSize({ width: 360, height: 1000 });
  await page.getByRole('button', { name: 'Toggle direction' }).click();
  await page.emulateMedia({ colorScheme: 'dark', forcedColors: 'active', reducedMotion: 'reduce' });
  await expect(alert).toHaveCSS('flex-direction', 'column');
  await expect(page.getByTestId('alert-fixture')).toHaveAttribute('dir', 'rtl');
  expect(await alert.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
  expect((await runAxeScan('[data-testid="alert-interactive"]')).violations).toEqual([]);
});
