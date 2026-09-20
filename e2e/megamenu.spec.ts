import { expect, test } from './fixtures/accessibility';

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1000 });
  await page.goto('/__zordon-tests__/megamenu');
  await expect(page.locator('[zdMegamenu]').first()).toHaveAttribute(
    'data-zd-dropdown-ready',
    'true',
  );
});

test('Megamenu preserves native navigation, current route, panel tab order and Escape restoration', async ({
  page,
  runAxeScan,
}) => {
  const trigger = page.getByRole('button', { name: 'Explore', exact: true });
  await trigger.focus();
  await page.keyboard.press('ArrowDown');
  const panel = page.getByRole('region', { name: 'Explore destinations' });
  await expect(panel.getByRole('link', { name: 'Components', exact: true })).toBeFocused();
  expect((await runAxeScan()).violations).toEqual([]);
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/section=components/);
  await expect(panel).toHaveCount(0);
  await expect(page.getByLabel('Last close')).toHaveText('navigation');
  await trigger.click();
  await expect(panel.getByRole('link', { name: 'Components', exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await expect(page.getByRole('link', { name: 'Upcoming tools' })).not.toHaveAttribute('href');
  await page.getByRole('searchbox', { name: 'Search resources' }).focus();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Apply search' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(panel).toHaveCount(0);
});

test('Megamenu click, hover, focus and manual policies share outside dismissal and teardown', async ({
  page,
}) => {
  const trigger = page.getByRole('button', { name: 'Explore', exact: true });
  const panel = page.getByRole('region', { name: 'Explore destinations' });
  const policy = page.getByRole('combobox', { name: 'Opening policy' });
  await policy.selectOption('hover');
  await trigger.hover();
  await expect(panel).toBeVisible();
  await panel.hover();
  await expect(panel).toBeVisible();
  await page.getByRole('heading', { name: 'Megamenu', exact: true }).hover();
  await expect(panel).toHaveCount(0);
  await policy.selectOption('focus');
  await trigger.focus();
  await expect(panel).toBeVisible();
  await page.getByRole('button', { name: 'After navigation' }).click();
  await expect(panel).toHaveCount(0);
  await policy.selectOption('manual');
  await trigger.click();
  await expect(panel).toHaveCount(0);
  await page.getByRole('button', { name: 'Open externally' }).click();
  await expect(panel).toBeVisible();
  await page.getByRole('button', { name: 'Toggle presence' }).click();
  await expect(panel).toHaveCount(0);
  await expect(page.locator('.cdk-overlay-pane')).toHaveCount(0);
});

test('Megamenu command bar delegates horizontal RTL navigation and menu activation to Aria', async ({
  page,
  runAxeScan,
}) => {
  const file = page.getByRole('menuitem', { name: 'File', exact: true });
  const edit = page.getByRole('menuitem', { name: 'Edit', exact: true });
  await file.focus();
  await page.keyboard.press('ArrowRight');
  await expect(edit).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: 'Copy', exact: true })).toBeFocused();
  expect((await runAxeScan()).violations).toEqual([]);
  await page.keyboard.press('Enter');
  await expect(page.getByLabel('Last action')).toHaveText('copy');
  await expect(edit).toBeFocused();
  await page.getByRole('button', { name: 'Toggle direction' }).click();
  await file.focus();
  await page.keyboard.press('Home');
  await page.keyboard.press('ArrowLeft');
  await expect(edit).toBeFocused();
  await page.keyboard.press('Home');
  await expect(file).toBeFocused();
  await page.keyboard.press('e');
  await expect(edit).toBeFocused();
});

test('Megamenu full-width and mobile single-column panels stay inside the viewport in RTL', async ({
  page,
  nativeLinkTab,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('button', { name: 'Toggle full width' }).click();
  await page.getByRole('button', { name: 'Explore', exact: true }).click();
  const panel = page.locator('zd-megamenu-panel');
  await expect
    .poll(async () => Math.round((await panel.boundingBox())!.width))
    .toBe(page.viewportSize()!.width - 32);
  await page.keyboard.press('Escape');
  await page.setViewportSize({ width: 360, height: 800 });
  await page.getByRole('button', { name: 'Toggle direction' }).click();
  await page.getByRole('button', { name: 'Explore', exact: true }).click();
  await expect(panel).toBeVisible();
  const box = (await panel.boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(360);
  expect(
    await panel.evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length),
  ).toBe(1);
  expect(await panel.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
  await page.emulateMedia({ forcedColors: 'active' });
  await page.keyboard.press('Tab');
  if (!nativeLinkTab)
    await expect(panel.getByRole('searchbox', { name: 'Search resources' })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  if (!nativeLinkTab) {
    await expect(panel).toHaveCount(0);
    const trigger = page.getByRole('button', { name: 'Explore', exact: true });
    await expect(page.getByRole('button', { name: 'After navigation' })).toBeFocused();
    await trigger.focus();
    await trigger.press('ArrowDown');
  }
  await expect(panel.getByRole('link', { name: 'Components', exact: true })).toBeFocused();
  expect(
    await panel
      .getByRole('link', { name: 'Components', exact: true })
      .evaluate(el => getComputedStyle(el).outlineStyle),
  ).toBe('solid');
});
