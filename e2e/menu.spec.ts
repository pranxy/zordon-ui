import { expect, test } from './fixtures/accessibility';
test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1100 });
  await page.goto('/__zordon-tests__/menu');
});

test('Menu native links track Router state and preserve nested disclosure, names and Tab behavior', async ({
  page,
  runAxeScan,
}) => {
  const nav = page.getByRole('navigation', { name: 'Workspace navigation' });
  const home = nav.getByRole('link', { name: 'Home', exact: true });
  await expect(home).toHaveAttribute('aria-current', 'page');
  await home.focus();
  await page.keyboard.press('Tab');
  await expect(nav.getByRole('link', { name: 'Inbox, 3 unread messages' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/section=inbox/);
  await expect(nav.getByRole('link', { name: 'Inbox, 3 unread messages' })).toHaveAttribute(
    'aria-current',
    'page',
  );
  const group = nav.getByRole('button', { name: 'Resources', exact: true });
  await group.click();
  await expect(nav.getByRole('link', { name: 'Guide', exact: true })).toBeHidden();
  await page.getByRole('button', { name: 'Toggle navigation group' }).click();
  await expect(nav.getByRole('link', { name: 'Guide', exact: true })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'Settings unavailable' })).not.toHaveAttribute('href');
  await page.getByRole('button', { name: 'Toggle manual active' }).click();
  await expect(nav.getByRole('link', { name: 'Guide', exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  );
  expect((await runAxeScan()).violations).toEqual([]);
});

test('Menu Aria Tree supports expansion, disabled skipping, typeahead and controlled selection', async ({
  page,
  runAxeScan,
}) => {
  const tree = page.getByRole('tree', { name: 'Project files' });
  const projects = tree.getByRole('treeitem', { name: 'Projects', exact: true });
  await expect(projects).toHaveAttribute('tabindex', '0');
  await projects.focus();
  await page.keyboard.press('ArrowRight');
  await expect(projects).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('ArrowDown');
  const alpha = tree.getByRole('treeitem', { name: 'Alpha, No issues', exact: true });
  await expect(alpha).toBeFocused();
  await page.keyboard.press('Space');
  await expect(page.getByLabel('Selected files')).toHaveText('alpha');
  await page.keyboard.press('ArrowDown');
  await expect(tree.getByRole('treeitem', { name: 'Beta', exact: true })).toBeFocused();
  await page.keyboard.press('End');
  await expect(tree.getByRole('treeitem', { name: 'Archive', exact: true })).toBeFocused();
  await page.keyboard.press('Home');
  await page.keyboard.press('b');
  await expect(tree.getByRole('treeitem', { name: 'Beta', exact: true })).toBeFocused();
  expect((await runAxeScan()).violations).toEqual([]);
  await page.getByRole('button', { name: 'Toggle multiple selection' }).click();
  await tree.getByRole('treeitem', { name: 'Beta', exact: true }).click();
  await expect(page.getByLabel('Selected files')).toContainText('beta');
  await page.getByRole('button', { name: 'Toggle tree group' }).click();
  await expect(alpha).toHaveCount(0);
  await tree.getByRole('button', { name: 'Toggle Projects' }).click();
  await expect(alpha).toBeVisible();
  await expect(projects).toBeFocused();
});

test('Menu sizes, horizontal layout and RTL tree expansion remain contained with reduced motion', async ({
  page,
}) => {
  const nav = page.getByRole('navigation', { name: 'Workspace navigation' });
  for (const size of ['xs', 'sm', 'md', 'lg', 'xl']) {
    await page.getByRole('combobox', { name: 'Size', exact: true }).selectOption(size);
    await expect(nav.locator('ul').first()).toHaveClass(new RegExp(`menu-${size}`));
    expect(
      (await nav.getByRole('link', { name: 'Home', exact: true }).boundingBox())!.height,
    ).toBeGreaterThanOrEqual(24);
  }
  await page.getByRole('button', { name: 'Toggle direction' }).click();
  await expect(page.getByTestId('menu-fixture')).toHaveAttribute('dir', 'rtl');
  const projects = page.getByRole('treeitem', { name: 'Projects', exact: true });
  await projects.focus();
  await page.keyboard.press('Home');
  await page.keyboard.press('ArrowLeft');
  await expect(projects).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('ArrowRight');
  await expect(projects).toHaveAttribute('aria-expanded', 'false');
  await page.getByRole('button', { name: 'Toggle orientation' }).click();
  await expect(nav.locator('ul').first()).toHaveAttribute('data-orientation', 'horizontal');
  await page.setViewportSize({ width: 360, height: 1200 });
  expect(
    await page.getByTestId('menu-fixture').evaluate(el => el.scrollWidth <= el.clientWidth),
  ).toBe(true);
  await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });
  await nav.getByRole('link', { name: 'Home', exact: true }).focus();
  await page.keyboard.press('Tab');
  expect(
    await nav
      .getByRole('link', { name: 'Inbox, 3 unread messages' })
      .evaluate(el => getComputedStyle(el).outlineStyle),
  ).toBe('solid');
});

test('Menu command composition retains Aria submenu navigation, disabled actions and Escape ownership', async ({
  page,
  runAxeScan,
}) => {
  const trigger = page.getByRole('button', { name: 'File commands', exact: true });
  await trigger.click();
  await expect(page.getByRole('menuitem', { name: 'Copy' })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(page.getByLabel('Last command')).toHaveText('none');
  await page.keyboard.press('End');
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('menuitem', { name: 'PDF', exact: true })).toBeFocused();
  expect((await runAxeScan()).violations).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menuitem', { name: 'Export', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
});
