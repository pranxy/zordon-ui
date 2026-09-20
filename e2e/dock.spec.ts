import { expect, test } from './fixtures/accessibility';
test('Dock follows Router navigation, manual overrides and native keyboard order while skipping unavailable links', async ({
  page,
  nativeLinkTab,
}) => {
  await page.goto('/__zordon-tests__/dock');
  const nav = page.getByRole('navigation', { name: 'Workspace destinations' });
  const home = nav.getByRole('link', { name: 'Home', exact: true });
  const search = nav.getByRole('link', { name: 'Search', exact: true });
  const messages = nav.getByRole('link', { name: 'Messages, 3 unread messages', exact: true });
  await expect(home).toHaveAttribute('aria-current', 'page');
  await home.focus();
  await page.keyboard.press('Tab');
  if (!nativeLinkTab) {
    await expect(page.getByRole('button', { name: 'Outside action' })).toBeFocused();
    await search.focus();
  }
  await expect(search).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/section=search/);
  await expect(search).toHaveAttribute('aria-current', 'page');
  await expect(home).not.toHaveAttribute('aria-current');
  await expect(nav.getByRole('link', { name: 'Settings unavailable' })).toBeDisabled();
  await expect(nav.getByRole('link', { name: 'Settings unavailable' })).not.toHaveAttribute('href');
  await messages.focus();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Outside action' })).toBeFocused();
  await page.getByRole('button', { name: 'Toggle manual active' }).click();
  await expect(messages).toHaveAttribute('aria-current', 'page');
  await page.getByRole('button', { name: 'Toggle manual active' }).click();
  await expect(search).toHaveAttribute('aria-current', 'page');
});
test('Dock sizes, fixed placement, safe-area space and sticky containing-block behavior match their contracts', async ({
  page,
}) => {
  await page.goto('/__zordon-tests__/dock');
  const nav = page.getByRole('navigation', { name: 'Workspace destinations' });
  for (const [size, height] of [
    ['xs', 48],
    ['sm', 56],
    ['md', 64],
    ['lg', 72],
    ['xl', 80],
  ] as const) {
    await page.getByRole('combobox', { name: 'Size', exact: true }).selectOption(size);
    await expect.poll(async () => (await nav.boundingBox())!.height).toBe(height);
    expect(
      (await nav.getByRole('link', { name: 'Home', exact: true }).boundingBox())!.height,
    ).toBeGreaterThanOrEqual(24);
  }
  await page.getByRole('combobox', { name: 'Size', exact: true }).selectOption('md');
  await page.getByRole('combobox', { name: 'Position', exact: true }).selectOption('fixed');
  await page
    .locator('zd-dock')
    .evaluate(el => (el as HTMLElement).style.setProperty('--zd-dock-safe-bottom', '24px'));
  await expect.poll(async () => (await nav.boundingBox())!.height).toBe(88);
  const box = (await nav.boundingBox())!;
  expect(Math.round(box.y + box.height)).toBe(page.viewportSize()!.height);
  expect(await nav.evaluate(el => getComputedStyle(el).paddingBottom)).toBe('28px');
  expect((await page.locator('zd-dock').boundingBox())!.height).toBe(88);
  await page.getByRole('button', { name: 'Toggle reserved space' }).click();
  await expect.poll(async () => (await page.locator('zd-dock').boundingBox())!.height).toBe(0);
  await page
    .locator('zd-dock')
    .evaluate(el => (el as HTMLElement).style.removeProperty('--zd-dock-safe-bottom'));
  await page.getByRole('combobox', { name: 'Position', exact: true }).selectOption('sticky');
  await expect(page.locator('zd-dock')).toHaveAttribute('data-position', 'sticky');
  const stage = page.getByTestId('dock-stage');
  await stage.evaluate(el => (el.scrollTop = 200));
  const stageBox = (await stage.boundingBox())!;
  const sticky = (await nav.boundingBox())!;
  expect(sticky.y).toBeGreaterThanOrEqual(stageBox.y);
  expect(sticky.y + sticky.height).toBeLessThanOrEqual(stageBox.y + stageBox.height + 1);
});
test('Dock responsive visibility, compact labels and native horizontal overflow stay usable in RTL', async ({
  page,
}) => {
  await page.goto('/__zordon-tests__/dock');
  const nav = page.getByRole('navigation', { name: 'Workspace destinations' });
  await page.getByRole('combobox', { name: 'Visibility', exact: true }).selectOption('mobile');
  await expect(page.locator('zd-dock')).toBeHidden();
  await page.setViewportSize({ width: 360, height: 1100 });
  await expect(nav).toBeVisible();
  await page.getByRole('combobox', { name: 'Labels', exact: true }).selectOption('compact');
  await expect(nav.locator('.zd-label').first()).toBeHidden();
  await expect(nav.getByRole('link', { name: 'Home', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Toggle extra items' }).click();
  await page.getByRole('button', { name: 'Toggle direction' }).click();
  expect(await nav.evaluate(el => el.scrollWidth > el.clientWidth)).toBe(true);
  await nav.focus();
  await page.keyboard.press('ArrowLeft');
  await expect.poll(() => nav.evaluate(el => Math.abs(el.scrollLeft))).toBeGreaterThan(0);
  const last = nav.getByRole('link', { name: 'Destination 6', exact: true });
  await last.focus();
  await expect(last).toBeInViewport();
  expect(
    await page.getByTestId('dock-fixture').evaluate(el => el.scrollWidth <= el.clientWidth),
  ).toBe(true);
  await page.getByRole('combobox', { name: 'Visibility', exact: true }).selectOption('desktop');
  await expect(page.locator('zd-dock')).toBeHidden();
  await page.setViewportSize({ width: 1024, height: 1100 });
  await expect(nav).toBeVisible();
});
test('Dock passes axe and preserves active/focus indicators with reduced motion and forced colors', async ({
  page,
  nativeLinkTab,
  runAxeScan,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/__zordon-tests__/dock');
  const nav = page.getByRole('navigation', { name: 'Workspace destinations' });
  expect((await runAxeScan()).violations).toEqual([]);
  const home = nav.getByRole('link', { name: 'Home', exact: true });
  expect(await home.evaluate(el => getComputedStyle(el).transitionDuration)).toBe('0s');
  await page.emulateMedia({ forcedColors: 'active' });
  await nav.focus();
  await page.keyboard.press('Tab');
  if (!nativeLinkTab) {
    await expect(page.getByRole('button', { name: 'Outside action' })).toBeFocused();
    await home.focus();
  }
  await expect(home).toBeFocused();
  expect(await home.evaluate(el => getComputedStyle(el).outlineStyle)).toBe('solid');
});
