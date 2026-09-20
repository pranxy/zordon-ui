import { expect, test } from './fixtures/accessibility';

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1100 });
  await page.goto('/__zordon-tests__/navbar');
});

test('Navbar preserves native Tab order, Router links and landmark names', async ({
  page,
  nativeLinkTab,
  runAxeScan,
}) => {
  const nav = page.getByRole('navigation', { name: 'Workspace navigation' });
  const overview = nav.getByRole('link', { name: 'Overview' });
  await expect(overview).toHaveAttribute('aria-current', 'page');
  await nav.getByRole('link', { name: 'Zordon' }).focus();
  await page.keyboard.press('Tab');
  if (nativeLinkTab) {
    await expect(overview).toBeFocused();
    await page.keyboard.press('Tab');
  } else {
    expect(await nav.evaluate(el => el.contains(document.activeElement))).toBe(false);
    await overview.focus();
    await expect(overview).toBeFocused();
    await nav.getByRole('link', { name: 'Projects' }).focus();
  }
  await expect(nav.getByRole('link', { name: 'Projects' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/section=projects/);
  await expect(nav.getByRole('link', { name: 'Projects' })).toHaveAttribute('aria-current', 'page');
  await expect(overview).not.toHaveAttribute('aria-current');
  await expect(nav.getByRole('button', { name: 'Menu' })).toBeHidden();
  expect((await runAxeScan()).violations).toEqual([]);
});

test('Navbar mobile toggle waits for owner acceptance and restores focus through panel composition', async ({
  page,
  runAxeScan,
}) => {
  await page.setViewportSize({ width: 360, height: 1100 });
  const nav = page.getByRole('navigation', { name: 'Workspace navigation' });
  const toggle = nav.getByRole('button', { name: 'Menu' });
  const panel = page.getByRole('navigation', { name: 'Mobile destinations' });
  await expect(nav.getByRole('link', { name: 'Overview' })).toBeHidden();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(toggle).toHaveAttribute('aria-controls', 'navbar-mobile-panel');
  await page.getByRole('button', { name: 'Toggle acceptance' }).click();
  await toggle.click();
  await expect(page.getByLabel('Toggle requests')).toHaveText('1');
  await expect(panel).toBeVisible();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.getByRole('button', { name: 'Toggle acceptance' }).click();
  await toggle.focus();
  await page.keyboard.press('Space');
  await expect(panel).toBeHidden();
  await page.keyboard.press('Enter');
  await expect(panel).toBeVisible();
  await panel.getByRole('link', { name: 'Overview' }).focus();
  await page.keyboard.press('Escape');
  await expect(panel).toBeHidden();
  await expect(toggle).toBeFocused();
  await toggle.click();
  await panel.getByRole('link', { name: 'Projects' }).click();
  await expect(page).toHaveURL(/section=projects/);
  await expect(panel).toBeHidden();
  await expect(toggle).toBeFocused();
  await page.getByRole('button', { name: 'Toggle disabled' }).click();
  await expect(toggle).toBeDisabled();
  expect((await runAxeScan()).violations).toEqual([]);
});

test('Navbar static, sticky and fixed placement and transparent state follow the containing layout', async ({
  page,
}) => {
  const navbar = page.locator('zd-navbar');
  const scroller = page.getByTestId('navbar-scroll');
  await expect(navbar).toHaveCSS('position', 'static');
  await page.getByRole('combobox', { name: 'Position' }).selectOption('sticky');
  await expect(navbar).toHaveCSS('position', 'sticky');
  const top = (await navbar.boundingBox())!.y;
  await scroller.evaluate(element => {
    element.scrollTop = 160;
  });
  await expect.poll(async () => (await navbar.boundingBox())!.y).toBeCloseTo(top, 0);
  await page.getByRole('combobox', { name: 'Position' }).selectOption('static');
  await expect(navbar).toHaveCSS('position', 'static');
  await expect.poll(async () => (await navbar.boundingBox())!.y).toBeLessThan(top - 100);
  await page.getByRole('combobox', { name: 'Position' }).selectOption('fixed');
  await expect(navbar).toHaveCSS('position', 'fixed');
  await expect.poll(async () => (await navbar.boundingBox())!.y).toBe(0);
  await page.getByRole('button', { name: 'Toggle transparency' }).click();
  await expect(navbar.locator('nav')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
});

test('Navbar responsive regions reflow in RTL with visible forced-color focus', async ({
  page,
  runAxeScan,
}) => {
  await page.setViewportSize({ width: 360, height: 1100 });
  await page.getByRole('button', { name: 'Toggle direction' }).click();
  const nav = page.getByRole('navigation', { name: 'Workspace navigation' });
  await expect(nav).toHaveCSS('direction', 'rtl');
  const brand = nav.getByRole('link', { name: 'Zordon' });
  const account = nav.getByRole('link', { name: 'Account' });
  expect((await brand.boundingBox())!.x).toBeGreaterThan((await account.boundingBox())!.x);
  expect(await nav.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
  await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
  await brand.focus();
  await page.keyboard.press('Tab');
  const toggle = nav.getByRole('button', { name: 'Menu' });
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveCSS('outline-style', 'solid');
  expect((await runAxeScan()).violations).toEqual([]);
  await page.setViewportSize({ width: 768, height: 1100 });
  await expect(toggle).toBeHidden();
  await expect(nav.getByRole('link', { name: 'Overview' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Mobile destinations' })).toBeHidden();
});
