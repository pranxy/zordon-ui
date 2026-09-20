import { expect, test } from './fixtures/accessibility';

test.beforeEach(async ({ page }) => {
  await page.goto('/__zordon-tests__/modal');
});
test('Modal native focus, Escape, form close, nesting and scroll lock', async ({
  page,
  runAxeScan,
}) => {
  const opener = page.getByRole('button', { name: 'Open native', exact: true });
  await opener.focus();
  await opener.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'Editor', exact: true });
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveJSProperty('open', true);
  await expect(dialog.getByRole('textbox')).toBeFocused();
  await expect(page.locator('html')).toHaveClass(/cdk-global-scrollblock/);
  expect((await runAxeScan()).violations).toEqual([]);
  await dialog.getByRole('button', { name: 'Native submit' }).focus();
  await page.keyboard.press('Tab');
  expect(
    await page.evaluate(
      () => document.activeElement === document.body || !!document.activeElement?.closest('dialog'),
    ),
  ).toBe(true);
  await dialog.getByRole('button', { name: 'Open nested' }).click();
  const nested = page.getByRole('dialog', { name: 'Nested confirmation' });
  await expect(nested).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(nested).toHaveCount(0);
  await expect(dialog).toBeVisible();
  await expect(page.locator('html')).toHaveClass(/cdk-global-scrollblock/);
  await dialog.getByRole('button', { name: 'Native submit' }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole('status')).toHaveText('submit:none');
  await expect(opener).toBeFocused();
  await expect(page.locator('html')).not.toHaveClass(/cdk-global-scrollblock/);
});
test('Modal overlay mode composes Dropdown and traps focus with top-only Escape', async ({
  page,
  runAxeScan,
}) => {
  await page.getByRole('button', { name: 'Open overlay', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Editor', exact: true });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'More actions' }).click();
  await expect(page.getByRole('menu')).toBeVisible();
  await expect(page.getByRole('menuitem')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menu')).toHaveCount(0);
  await expect(dialog).toBeVisible();
  expect((await runAxeScan()).violations).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(page.locator('.cdk-overlay-pane')).toHaveCount(0);
});
test('Modal guards, controlled requests, destruction and async retry', async ({ page }) => {
  await page.getByRole('button', { name: 'Toggle guard' }).click();
  await page.getByRole('button', { name: 'Open native', exact: true }).click();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeVisible();
  // Reload destroys the guarded owner without interpreting a rejected request as acceptance.
  await page.reload();
  await page.getByRole('button', { name: 'Open declarative' }).click();
  await page.getByRole('button', { name: 'Request close', exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText('Requested: false');
  await page.getByRole('button', { name: 'Accept close' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('status')).toHaveText('close');
  await page.getByRole('button', { name: 'Open declarative' }).click();
  await page.getByRole('button', { name: 'Destroy owner' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.locator('html')).not.toHaveClass(/cdk-global-scrollblock/);
  await page.getByRole('button', { name: 'Async confirm' }).click();
  await page.getByRole('button', { name: 'Confirm', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Please try again');
  await page.getByRole('button', { name: 'Confirm', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('status')).toHaveText('confirmed');
});
test('Modal queue, backdrop and responsive placement', async ({ page }) => {
  await page.getByRole('button', { name: 'Queue dialogs' }).click();
  await expect(page.getByRole('dialog', { name: 'First queued' })).toBeVisible();
  await page.getByRole('button', { name: 'Confirm', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Second queued' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('button', { name: 'Bottom placement' }).click();
  await page.getByRole('button', { name: 'Small', exact: true }).click();
  await page.getByRole('button', { name: 'Open overlay', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveAttribute('data-placement', 'bottom');
  await page.locator('.zd-modal-backdrop').click({ position: { x: 5, y: 5 } });
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('button', { name: 'Start placement' }).click();
  await page.getByRole('button', { name: 'Open overlay', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveAttribute('data-placement', 'start');
  expect((await page.getByRole('dialog').boundingBox())!.x).toBeLessThan(20);
  await page.getByRole('button', { name: 'Flip direction' }).click();
  await expect(page.locator('.zd-modal-pane')).toHaveCSS('direction', 'rtl');
  const shifted = (await page.getByRole('dialog').boundingBox())!;
  expect(shifted.x + shifted.width).toBeGreaterThan(1250);
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Fullscreen' }).click();
  await page.getByRole('button', { name: 'Open native', exact: true }).click();
  await page.setViewportSize({ width: 360, height: 740 });
  await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });
  await expect(page.getByRole('dialog')).toHaveCSS('width', '360px');
  await expect(page.getByRole('dialog')).toHaveCSS('height', '740px');
  const full = (await page.getByRole('dialog').boundingBox())!;
  expect(full.x).toBe(0);
  expect(full.y).toBe(0);
});
