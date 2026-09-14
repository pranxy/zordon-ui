import { expect, test } from './fixtures/accessibility';

test.beforeEach(async ({ page }) => {
  await page.goto('/__zordon-tests__/dropdown-probe');
});

test('Angular 21 menu composes with lazy CDK overlays, keyboard, disabled items and cleanup', async ({
  page,
  runAxeScan,
}) => {
  const trigger = page.getByRole('button', { name: 'Open actions' });
  await trigger.focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menu', { name: 'Actions', exact: true })).toBeVisible();
  await expect(page.getByRole('menuitem', { name: 'Edit', exact: true })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: 'Delete' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status')).toHaveText('none');
  await page.keyboard.press('Home');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status')).toHaveText('edit');
  await expect(trigger).toBeFocused();
  await expect(page.getByRole('menu')).toHaveCount(0);
  await trigger.click();
  expect((await runAxeScan()).violations).toEqual([]);
  await page.getByRole('button', { name: 'Toggle presence' }).click();
  await expect(page.locator('.cdk-overlay-pane')).toHaveCount(0);
  await page.getByRole('button', { name: 'Toggle presence' }).click();
  await page.getByRole('button', { name: 'Toggle disabled' }).click();
  await expect(trigger).toBeDisabled();
});

test('adapts portaled focus boundaries and top-only Escape and supports RTL submenu arrows', async ({
  page,
}) => {
  const trigger = page.getByRole('button', { name: 'Open actions' });
  await trigger.click();
  await expect(page.getByRole('menuitem', { name: 'Edit', exact: true })).toBeFocused();
  await page.keyboard.press('End');
  await expect(page.getByRole('menuitem', { name: 'More', exact: true })).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('menu', { name: 'More actions' })).toBeVisible();
  await expect(page.getByRole('menuitem', { name: 'Archive' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menu', { name: 'More actions' })).toHaveCount(0);
  await expect(page.getByRole('menuitem', { name: 'More', exact: true })).toBeFocused();
  await expect(page.getByRole('menu', { name: 'Actions', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menu')).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await page.getByRole('button', { name: 'Toggle direction' }).click();
  await trigger.click();
  await expect(page.getByRole('menuitem', { name: 'Edit', exact: true })).toBeFocused();
  await page.keyboard.press('End');
  await expect(page.getByRole('menuitem', { name: 'More', exact: true })).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await expect(page.getByRole('menuitem', { name: 'Archive' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status')).toHaveText('archive');
  await expect(page.getByRole('menu')).toHaveCount(0);
});
