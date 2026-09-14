import { expect, test } from './fixtures/accessibility';

test.beforeEach(async ({ page }) => {
  await page.goto('/__zordon-tests__/swap');
});

test('Swap preserves native keyboard, Forms, controlled requests and stable names', async ({
  page,
  runAxeScan,
}) => {
  const checkbox = page.getByRole('checkbox', { name: 'Notifications' });
  const wrapper = page.getByTestId('swap-checkbox');
  await expect(wrapper.locator('[zdSwapOff]')).toBeVisible();
  await checkbox.focus();
  await page.keyboard.press('Space');
  await expect(checkbox).toBeChecked();
  await expect(wrapper.locator('[zdSwapOn]')).toBeVisible();
  await expect(wrapper.locator('[zdSwapOff]')).toBeHidden();
  await page.keyboard.press('Tab');
  const toggle = page.getByRole('button', { name: 'Mute', exact: true });
  await expect(toggle).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('Space');
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await expect(toggle).toHaveAccessibleName('Mute');
  await page.getByRole('button', { name: 'Controlled veto' }).click();
  await expect(page.getByTestId('swap-veto')).toHaveAttribute('aria-pressed', 'false');
  await expect(page.getByRole('status')).toHaveText('true / false / 1');
  await page.getByRole('button', { name: 'Reset checkbox' }).click();
  await expect(checkbox).not.toBeChecked();
  expect((await runAxeScan()).violations).toEqual([]);
});

test('Swap handles mixed, disabled, read-only and manual state without hidden focus stops', async ({
  page,
}) => {
  const checkbox = page.getByRole('checkbox', { name: 'Notifications' });
  const wrapper = page.getByTestId('swap-checkbox');
  await page.getByRole('button', { name: 'Toggle mixed' }).click();
  await expect(checkbox).toHaveJSProperty('indeterminate', true);
  await expect(wrapper.locator('[zdSwapIndeterminate]')).toBeVisible();
  await checkbox.click();
  await expect(checkbox).toHaveJSProperty('indeterminate', false);
  await expect(wrapper.locator('[zdSwapOn]')).toBeVisible();
  await page.getByRole('button', { name: 'Toggle read only' }).click();
  await checkbox.focus();
  await page.keyboard.press('Space');
  await expect(checkbox).toBeChecked();
  await expect(checkbox).toHaveAttribute('aria-readonly', 'true');
  await page.getByRole('button', { name: 'Mute', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('swap-toggle')).toHaveAttribute('aria-pressed', 'false');
  await page.getByRole('button', { name: 'Toggle disabled' }).click();
  await expect(checkbox).toBeDisabled();
  await expect(page.getByTestId('swap-toggle')).toBeDisabled();
  await page.getByRole('button', { name: 'Toggle manual' }).click();
  await expect(page.getByTestId('swap-manual').locator('[zdSwapOn]')).toBeVisible();
  await expect(page.getByTestId('swap-manual')).not.toHaveAttribute('role');
  await expect(page.locator('[zdSwapOn]').first()).toHaveAttribute('inert', '');
});

test('Swap removes live reduced motion and retains visible state and forced-color focus', async ({
  page,
}) => {
  const toggle = page.getByTestId('swap-toggle');
  await toggle.click();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const on = toggle.locator('[zdSwapOn]');
  await expect(on).toBeVisible();
  expect(
    await on.evaluate(element => {
      const style = getComputedStyle(element);
      return [style.transitionDuration, style.animationName, style.transform, style.rotate];
    }),
  ).toEqual(['0s', 'none', 'none', 'none']);
  await page.emulateMedia({ forcedColors: 'active' });
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  await expect(toggle).toBeFocused();
  expect(await toggle.evaluate(element => getComputedStyle(element).outlineStyle)).toBe('solid');
});
