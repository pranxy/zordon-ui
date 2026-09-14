import { expect, test } from './fixtures/accessibility';

test.beforeEach(async ({ page }) => {
  await page.goto('/__zordon-tests__/dropdown');
  await expect(page.getByTestId('dropdown-menu-root')).toHaveAttribute(
    'data-zd-dropdown-ready',
    'true',
  );
});

test('Dropdown hover and focus policies stay usable with keyboard and cancel on leaving', async ({
  page,
}) => {
  const help = page.getByRole('button', { name: 'Help', exact: true });
  await help.hover();
  await expect(page.getByText('Keyboard and pointer help', { exact: true })).toBeVisible();
  await page.getByText('Keyboard and pointer help', { exact: true }).hover();
  await expect(help).toHaveAttribute('aria-expanded', 'true');
  await page.getByRole('heading', { name: 'Dropdown', exact: true }).hover();
  await expect(help).toHaveAttribute('aria-expanded', 'false');
  const focus = page.getByRole('button', { name: 'Focus details', exact: true });
  await focus.focus();
  await expect(page.getByRole('link', { name: 'Read details', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'After menu', exact: true }).focus();
  await expect(focus).toHaveAttribute('aria-expanded', 'false');
  await page.getByRole('button', { name: 'Toggle disabled', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Actions', exact: true })).toBeDisabled();
});

test('Dropdown flips at viewport edges, forwards the theme and suppresses motion', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 640 });
  await page
    .getByRole('region', { name: 'Dropdown examples' })
    .evaluate(element => element.setAttribute('data-theme', 'dark'));
  await page.getByTestId('dropdown-menu-root').evaluate(element => {
    Object.assign((element as HTMLElement).style, {
      position: 'fixed',
      right: '8px',
      bottom: '8px',
    });
  });
  await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });
  const trigger = page.getByRole('button', { name: 'Actions', exact: true });
  await trigger.click();
  const pane = page.locator('.cdk-overlay-pane');
  await expect(pane).toHaveAttribute('data-theme', 'dark');
  await expect(page.getByRole('menuitem', { name: 'Edit', exact: true })).toHaveCSS(
    'transition-duration',
    '0s',
  );
  await expect
    .poll(async () => {
      const origin = (await trigger.boundingBox())!;
      const panel = (await pane.boundingBox())!;
      return panel.y + panel.height <= origin.y;
    })
    .toBe(true);
  const bounds = (await pane.boundingBox())!;
  expect(bounds.x).toBeGreaterThanOrEqual(7);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(353);
});

test('Dropdown owns root state, soft-disabled actions, last-item focus, typeahead and Tab order', async ({
  page,
  runAxeScan,
}) => {
  const trigger = page.getByRole('button', { name: 'Actions', exact: true });
  await trigger.focus();
  await page.keyboard.press('ArrowUp');
  await expect(page.getByRole('menuitem', { name: 'More', exact: true })).toBeFocused();
  await page.keyboard.press('Home');
  await expect(page.getByRole('menuitem', { name: 'Edit', exact: true })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: 'Delete', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status')).toHaveText('none');
  await page.keyboard.press('e');
  await expect(page.getByRole('menuitem', { name: 'Edit', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status')).toHaveText('edit');
  await expect(trigger).toBeFocused();
  await trigger.click();
  await expect(page.getByRole('menu', { name: 'Actions', exact: true })).toBeVisible();
  await expect(page.getByRole('menuitem', { name: 'Edit', exact: true })).toBeFocused();
  expect((await runAxeScan()).violations).toEqual([]);
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'After menu' })).toBeFocused();
  await expect(page.getByRole('menu')).toHaveCount(0);
});

test('Dropdown supports recursive nested menus, RTL, top-only Escape and teardown', async ({
  page,
}) => {
  const trigger = page.getByRole('button', { name: 'Actions', exact: true });
  await page.getByRole('button', { name: 'Toggle direction' }).click();
  await trigger.click();
  await expect(page.getByRole('menu', { name: 'Actions', exact: true })).toBeVisible();
  await expect(page.getByRole('menuitem', { name: 'Edit', exact: true })).toBeFocused();
  await page.keyboard.press('End');
  await page.keyboard.press('ArrowLeft');
  await expect(page.getByRole('menuitem', { name: 'Archive', exact: true })).toBeFocused();
  await page.keyboard.press('End');
  await page.keyboard.press('ArrowLeft');
  await expect(page.getByRole('menuitem', { name: 'PDF', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menuitem', { name: 'Export', exact: true })).toBeFocused();
  await expect(page.getByRole('menu')).toHaveCount(2);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menuitem', { name: 'More', exact: true })).toBeFocused();
  await expect(page.getByRole('menu')).toHaveCount(1);
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.getByRole('button', { name: 'Toggle presence' }).click();
  await expect(page.locator('.cdk-overlay-pane')).toHaveCount(0);
});

test('Dropdown keeps arbitrary form content, controlled state and close policies separate from menus', async ({
  page,
}) => {
  await page.getByRole('button', { name: 'Toggle preferences externally' }).click();
  await expect(page.getByRole('textbox', { name: 'Display name' })).toBeFocused();
  await expect(page.getByRole('menu')).toHaveCount(0);
  await page.getByRole('textbox', { name: 'Display name' }).fill('Pedro');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.getByRole('form', { name: 'Preferences' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Toggle locked menu' }).click();
  await expect(page.getByRole('menu', { name: 'Locked', exact: true })).toBeVisible();
  await page.getByRole('menuitem', { name: 'Locked action' }).focus();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menu', { name: 'Locked', exact: true })).toBeVisible();
  await page.getByRole('heading', { name: 'Dropdown', exact: true }).click();
  await expect(page.getByRole('menu', { name: 'Locked', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Toggle locked menu' }).click();
  await expect(page.locator('.cdk-overlay-pane')).toHaveCount(0);
});
