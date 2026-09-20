import { expect, test } from './fixtures/accessibility';
test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1200 });
  await page.goto('/__zordon-tests__/drawer');
  await expect(page.getByRole('combobox', { name: 'Mode' })).toBeEnabled();
});
test('Drawer composes Navbar toggle, modal isolation, rejection, focus and nested Escape', async ({
  page,
  runAxeScan,
}) => {
  await page.getByLabel('Accept requests').uncheck();
  const trigger = page.getByRole('button', { name: 'Navigation drawer' });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Project navigation' });
  await expect(dialog).toBeVisible();
  await expect(page.locator('html')).toHaveClass(/cdk-global-scrollblock/);
  await expect(page.locator('docs-root')).toHaveAttribute('inert', '');
  await expect(dialog.getByRole('button', { name: 'Close drawer', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeVisible();
  expect((await runAxeScan()).violations).toEqual([]);
  await page.bringToFront();
  await dialog.getByRole('button', { name: 'Open nested drawer' }).click();
  const nested = page.getByRole('dialog', { name: 'Nested tools' });
  await expect(nested.getByRole('button', { name: 'Close nested tools' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(nested).toHaveCount(0);
  await expect(page.locator('html')).toHaveClass(/cdk-global-scrollblock/);
  await expect(dialog.getByRole('button', { name: 'Open nested drawer' })).toBeFocused();
});
test('Drawer accepts backdrop and navigation close and restores the trigger', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'Navigation drawer' });
  await trigger.click();
  await expect(page.getByRole('dialog', { name: 'Project navigation' })).toBeVisible();
  await page.locator('.zd-modal-backdrop').click({ position: { x: 1000, y: 300 } });
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.locator('html')).not.toHaveClass(/cdk-global-scrollblock/);
  await expect(page.locator('docs-root')).not.toHaveAttribute('inert');
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.getByRole('link', { name: 'Settings destination' }).click();
  await expect(page).toHaveURL(/section=settings/);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(trigger).toBeFocused();
});
test('Drawer supports responsive persistent and push layouts and logical RTL placement', async ({
  page,
  runAxeScan,
}) => {
  await page.getByRole('combobox', { name: 'Mode' }).selectOption('responsive');
  await page.getByRole('button', { name: 'Navigation drawer' }).click();
  await expect(page.getByRole('complementary', { name: 'Project navigation' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Workspace action' })).toBeEnabled();
  await page.setViewportSize({ width: 360, height: 1200 });
  await expect(page.getByRole('dialog', { name: 'Project navigation' })).toBeVisible();
  await page.keyboard.press('Escape');
  await page.setViewportSize({ width: 1280, height: 1200 });
  await page.getByRole('combobox', { name: 'Mode' }).selectOption('push');
  await page.getByRole('button', { name: 'Toggle direction' }).click();
  await expect(page.getByTestId('drawer-fixture')).toHaveAttribute('dir', 'rtl');
  await page.getByRole('button', { name: 'Navigation drawer' }).click();
  const aside = page.getByRole('complementary', { name: 'Project navigation' });
  const main = page.getByRole('heading', { name: 'Project workspace' });
  expect((await aside.boundingBox())!.x).toBeGreaterThan((await main.boundingBox())!.x);
  expect((await runAxeScan()).violations).toEqual([]);
});

test('Drawer touch handle ignores inward drags and requests one outward swipe close', async ({
  page,
}) => {
  await page.getByLabel('Accept requests').uncheck();
  await page.getByRole('button', { name: 'Navigation drawer' }).click();
  const dialog = page.getByRole('dialog', { name: 'Project navigation' });
  const handle = dialog.getByRole('button', { name: 'Close drawer', exact: true });
  await expect(handle).toBeFocused();
  const box = (await handle.boundingBox())!;
  const cdp = await page.context().newCDPSession(page);
  const swipe = async (from: number, to: number) => {
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x: from, y: box.y + box.height / 2 }],
    });
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x: to, y: box.y + box.height / 2 }],
    });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  };
  await swipe(box.x + 40, box.x + 140);
  await expect(page.getByTestId('drawer-fixture').locator('[role="status"]')).toContainText('none');
  await swipe(box.x + 180, box.x + 60);
  await expect(page.getByTestId('drawer-fixture').locator('[role="status"]')).toContainText(
    'swipe',
  );
  await expect(dialog).toBeVisible();
  await cdp.detach();
});
