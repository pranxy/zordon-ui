import { expect, test } from './fixtures/accessibility';

test.beforeEach(async ({ page }) => {
  await page.goto('/__zordon-tests__/tooltip');
  await expect(page.getByTestId('tooltip-plain')).toHaveAttribute('data-zd-tooltip-ready', 'true');
});

test('Tooltip preserves descriptions and focus, supports hover grace and disabled-trigger wrappers', async ({
  page,
  runAxeScan,
}) => {
  const origin = page.getByRole('button', { name: 'Save draft', exact: true });
  await origin.focus();
  const tip = page.getByRole('tooltip');
  await expect(tip).toHaveText('Saves your current draft.');
  await expect(origin).toHaveAccessibleDescription('Existing help. Saves your current draft.');
  await expect(origin).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(tip).toHaveCount(0);
  await expect(origin).toHaveAccessibleDescription('Existing help.');
  await page.getByRole('button', { name: 'Hover help', exact: true }).hover();
  await expect(tip).toContainText('Rich help');
  await tip.hover();
  await expect(tip).toBeVisible();
  await page.getByTestId('tooltip-outside').hover();
  await expect(tip).toHaveCount(0);
  await page.getByRole('group', { name: 'Unavailable deletion' }).focus();
  await expect(tip).toHaveText('You need edit access to delete this draft.');
  expect((await runAxeScan()).violations).toEqual([]);
});

test('Tooltip interactive help supports F2, native fields, Tab exit and Escape restoration', async ({
  page,
  runAxeScan,
}) => {
  const origin = page.getByRole('button', { name: 'Draft settings', exact: true });
  await origin.focus();
  await expect(page.getByRole('dialog', { name: 'Draft settings' })).toBeVisible();
  await expect(origin).toBeFocused();
  await page.keyboard.press('F2');
  const input = page.getByRole('textbox', { name: 'Draft name' });
  await expect(input).toBeFocused();
  await input.fill('Updated draft');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Apply settings' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(origin).toBeFocused();
  await origin.click();
  await expect(input).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(origin).toBeFocused();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await origin.click();
  await expect(input).toBeFocused();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Touch help' })).toBeFocused();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  expect((await runAxeScan()).violations).toEqual([]);
});

test('Tooltip and Dropdown share top-only Escape, logical focus boundaries and parent teardown', async ({
  page,
}) => {
  const trigger = page.getByRole('button', { name: 'Menu with help' });
  await trigger.click();
  const item = page.getByRole('menuitem', { name: 'Edit settings' });
  await expect(item).toBeFocused();
  await expect(page.getByRole('dialog', { name: 'Menu help' })).toBeVisible();
  await page.keyboard.press('F2');
  await expect(page.getByRole('textbox', { name: 'Draft name' })).toBeFocused();
  await expect(page.getByRole('menu', { name: 'Draft actions' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(item).toBeFocused();
  await expect(page.getByRole('menu')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.cdk-overlay-pane')).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await trigger.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  // Activate lifecycle teardown without hit-testing or moving focus away from the open overlays.
  await page
    .getByRole('button', { name: 'Toggle presence' })
    .evaluate(button => (button as HTMLButtonElement).click());
  await expect(trigger).not.toBeAttached();
  await expect(page.locator('.cdk-overlay-pane')).toHaveCount(0);
});

test('Tooltip reports collision placement and shifted arrow geometry with live RTL and reduced motion', async ({
  page,
}) => {
  const origin = page.getByTestId('tooltip-edge');
  await origin.hover();
  const tip = page.getByRole('tooltip');
  await expect(tip).toHaveAttribute('data-zd-tooltip-side', 'bottom');
  const rect = await tip.boundingBox();
  const anchor = await origin.boundingBox();
  expect(rect!.y).toBeGreaterThanOrEqual(anchor!.y + anchor!.height);
  expect(rect!.x + rect!.width).toBeLessThanOrEqual(page.viewportSize()!.width - 7);
  const arrowX = await tip.evaluate(element =>
    parseFloat((element as HTMLElement).style.getPropertyValue('--zd-tooltip-arrow-x')),
  );
  expect(arrowX).toBeGreaterThanOrEqual(8);
  expect(arrowX).toBeLessThanOrEqual(rect!.width - 8);
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Toggle direction' }).click();
  await page.getByRole('button', { name: 'Place at start' }).click();
  const plain = page.getByTestId('tooltip-plain');
  await plain.focus();
  await expect(tip).toBeVisible();
  await expect(tip).toHaveAttribute('data-zd-tooltip-side', 'start');
  expect((await tip.boundingBox())!.x).toBeGreaterThanOrEqual(
    (await plain.boundingBox())!.x + (await plain.boundingBox())!.width,
  );
  await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });
  await expect(tip).toBeVisible();
  expect(await tip.evaluate(element => getComputedStyle(element).animationName)).toBe('none');
  expect(await tip.evaluate(element => getComputedStyle(element).borderTopStyle)).toBe('solid');
});

test('Tooltip touch gestures preserve short taps, cancel scrolling, suppress long-press activation and expire', async ({
  page,
}) => {
  const origin = page.getByTestId('tooltip-touch');
  await origin.dispatchEvent('pointerdown', { pointerType: 'touch', clientX: 1, clientY: 1 });
  await origin.dispatchEvent('pointermove', { pointerType: 'touch', clientX: 30, clientY: 1 });
  await origin.dispatchEvent('pointerup', { pointerType: 'touch' });
  await expect(page.getByRole('tooltip')).toHaveCount(0);
  await origin.dispatchEvent('pointerdown', { pointerType: 'touch', clientX: 1, clientY: 1 });
  await expect(page.getByRole('tooltip')).toHaveText('Long-press help.');
  await origin.dispatchEvent('pointerup', { pointerType: 'touch' });
  await origin.dispatchEvent('click');
  await expect(page.getByRole('status')).toHaveText('0 / 0');
  await expect(page.getByRole('tooltip')).toHaveCount(0);
  await origin.dispatchEvent('pointerdown', { pointerType: 'touch' });
  await origin.dispatchEvent('pointerup', { pointerType: 'touch' });
  await origin.dispatchEvent('click');
  await expect(page.getByRole('status')).toHaveText('1 / 0');
});

test('Tooltip controlled close requests preserve the visible pane until accepted', async ({
  page,
}) => {
  await page.getByRole('button', { name: 'Toggle controlled help' }).click();
  await expect(page.getByRole('tooltip')).toHaveText('Consumer-controlled help.');
  await page.getByTestId('tooltip-controlled').focus();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('tooltip')).toBeVisible();
  await expect(page.getByRole('status')).toHaveText('0 / 1');
  await page.getByTestId('tooltip-outside').click();
  await expect(page.getByRole('tooltip')).toBeVisible();
  await page.getByRole('button', { name: 'Toggle controlled help' }).click();
  await expect(page.getByRole('tooltip')).toHaveCount(0);
});
