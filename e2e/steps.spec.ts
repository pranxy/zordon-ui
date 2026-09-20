import { expect, test } from './fixtures/accessibility';

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1200 });
  await page.goto('/__zordon-tests__/steps');
});

test('Steps preserves list semantics, explicit states and owner-controlled native requests', async ({
  page,
  runAxeScan,
}) => {
  const wizard = page.getByRole('list', { name: 'Checkout progress' });
  const display = page.getByRole('list', { name: 'Deployment progress' });
  await expect(display.getByRole('button')).toHaveCount(0);
  await expect(display.locator('[aria-current="step"]')).toContainText('Error · Current');
  await expect(display).toContainText('Upcoming · Unavailable');
  await expect(wizard.locator('[aria-current="step"]')).toContainText('Details');
  await page.getByRole('button', { name: 'Toggle linear', exact: true }).click();
  await page.getByRole('button', { name: 'Toggle acceptance' }).click();
  const delivery = wizard.getByRole('button', { name: /^Delivery/ });
  await delivery.focus();
  await page.keyboard.press('Space');
  await expect(page.getByLabel('Requested step')).toHaveText('delivery');
  await expect(wizard.locator('[aria-current]')).toContainText('Details');
  await expect(delivery).toBeFocused();
  await page.getByRole('button', { name: 'Toggle acceptance' }).click();
  await delivery.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Delivery address' })).toBeFocused();
  await expect(delivery).toHaveAttribute('aria-controls', 'delivery-panel');
  await expect(page.getByRole('heading', { name: 'Your details' })).toBeHidden();
  await page.getByRole('button', { name: 'Toggle disabled' }).click();
  for (const button of await wizard.getByRole('button').all()) await expect(button).toBeDisabled();
  expect((await runAxeScan()).violations).toEqual([]);
});

test('Steps linear wizard waits for owner validation and keeps earlier steps available', async ({
  page,
  runAxeScan,
}) => {
  const wizard = page.getByRole('list', { name: 'Checkout progress' });
  const delivery = wizard.getByRole('button', { name: /^Delivery/ });
  const review = wizard.getByRole('button', { name: /^Review/ });
  await expect(delivery).toBeDisabled();
  await expect(review).toBeDisabled();
  await page.getByRole('button', { name: 'Continue to delivery' }).click();
  await expect(wizard.locator('[aria-current]')).toContainText('Details');
  await expect(page.getByRole('textbox', { name: 'Name', exact: true })).toBeFocused();
  await page.getByRole('textbox', { name: 'Name', exact: true }).fill('Ada');
  await page.getByRole('button', { name: 'Continue to delivery' }).click();
  await expect(page.getByRole('heading', { name: 'Delivery address' })).toBeFocused();
  await expect(wizard.getByRole('button', { name: /^Details/ })).toContainText('Completed');
  await expect(review).toBeDisabled();
  await page.getByRole('textbox', { name: 'Address' }).fill('10 Example Street');
  await page.getByRole('button', { name: 'Continue to review' }).click();
  await expect(page.getByRole('heading', { name: 'Review your order' })).toBeFocused();
  await wizard.getByRole('button', { name: /^Details/ }).click();
  await expect(page.getByRole('heading', { name: 'Your details' })).toBeFocused();
  await expect(review).toBeEnabled();
  expect((await runAxeScan()).violations).toEqual([]);
});

test('Steps retains native Tab behavior and exposes current errors independently of color', async ({
  page,
  runAxeScan,
}) => {
  const wizard = page.getByRole('list', { name: 'Checkout progress' });
  await wizard.getByRole('button', { name: /^Details/ }).focus();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('textbox', { name: 'Name', exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'Toggle linear', exact: true }).click();
  await wizard.getByRole('button', { name: /^Delivery/ }).click();
  for (const color of [
    'neutral',
    'primary',
    'secondary',
    'accent',
    'info',
    'success',
    'warning',
    'error',
  ]) {
    await page.getByRole('combobox', { name: 'Current color' }).selectOption(color);
    await expect(wizard.locator('[aria-current]')).toHaveClass(new RegExp('step-' + color));
  }
  await page.getByRole('button', { name: 'Toggle delivery error' }).click();
  await expect(wizard.locator('[aria-current]')).toHaveAttribute('data-state', 'error');
  await expect(wizard.locator('[aria-current]')).toContainText('Error · Current');
  await expect(wizard.locator('[aria-current] .zd-marker')).toHaveText('!');
  await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
  await wizard.getByRole('button', { name: /^Details/ }).focus();
  await page.keyboard.press('Tab');
  await expect(wizard.getByRole('button', { name: /^Delivery/ })).toBeFocused();
  await expect(wizard.getByRole('button', { name: /^Delivery/ })).toHaveCSS(
    'outline-style',
    'solid',
  );
  expect((await runAxeScan()).violations).toEqual([]);
});

test('Steps changes to vertical on mobile and preserves explicit horizontal scrolling in RTL', async ({
  page,
  runAxeScan,
}) => {
  const wizard = page.getByRole('list', { name: 'Checkout progress' });
  const steps = wizard.getByRole('listitem');
  expect((await steps.nth(1).boundingBox())!.x).toBeGreaterThan(
    (await steps.nth(0).boundingBox())!.x,
  );
  await page.setViewportSize({ width: 360, height: 1700 });
  await expect(wizard).toHaveCSS('grid-auto-flow', 'row');
  expect((await steps.nth(1).boundingBox())!.y).toBeGreaterThan(
    (await steps.nth(0).boundingBox())!.y,
  );
  expect(await wizard.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
  await page.getByRole('button', { name: 'Toggle direction' }).click();
  await expect(wizard).toHaveCSS('direction', 'rtl');
  expect(await wizard.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
  expect((await runAxeScan()).violations).toEqual([]);
  await page.getByRole('button', { name: 'Toggle responsive' }).click();
  await expect(wizard).toHaveCSS('grid-auto-flow', 'column');
  await expect(wizard).toHaveAttribute('tabindex', '0');
  expect(await wizard.evaluate(element => element.scrollWidth > element.clientWidth)).toBe(true);
  await page.getByRole('button', { name: 'Toggle orientation' }).click();
  await expect(wizard).toHaveCSS('grid-auto-flow', 'row');
  await expect(wizard).not.toHaveAttribute('tabindex');
});
