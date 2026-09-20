import { expect, test } from './fixtures/accessibility';
test('Breadcrumbs preserves hierarchy, current-page semantics and native overflow keyboard behavior', async ({
  page,
  nativeLinkTab,
}) => {
  await page.goto('/__zordon-tests__/breadcrumbs');
  const nav = page.getByRole('navigation', { name: 'Workspace path' });
  await expect(nav.locator('.zd-trail > li')).toHaveCount(4);
  await expect(nav.locator('[aria-current="page"]')).toHaveCount(1);
  await expect(
    nav.getByRole('link', { name: 'Quarterly performance report', exact: true }),
  ).toHaveCount(0);
  const summary = nav.locator('summary');
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(nav.getByRole('link', { name: 'All projects', exact: true })).toBeVisible();
  await page.keyboard.press('Tab');
  if (nativeLinkTab)
    await expect(nav.getByRole('link', { name: 'All projects', exact: true })).toBeFocused();
  else {
    await expect(page.getByRole('textbox', { name: 'Report title' })).toBeFocused();
    await nav.getByRole('link', { name: 'All projects', exact: true }).focus();
  }
  await page.keyboard.press('Escape');
  await expect(summary).toBeFocused();
  await expect(nav.locator('details')).not.toHaveAttribute('open');
  await summary.click();
  await page.getByRole('heading', { name: 'Breadcrumbs', exact: true }).click();
  await expect(nav.locator('details')).not.toHaveAttribute('open');
});
test('Breadcrumbs navigates RouterLink ancestors and current links without losing native link destinations', async ({
  page,
}) => {
  await page.goto('/__zordon-tests__/breadcrumbs');
  const nav = page.getByRole('navigation', { name: 'Workspace path' });
  await nav.locator('summary').click();
  const project = nav.getByRole('link', { name: 'All projects', exact: true });
  await expect(project).toHaveAttribute('href', /crumb=projects/);
  await project.click();
  await expect(page).toHaveURL(/crumb=projects/);
  await expect(nav.locator('details')).not.toHaveAttribute('open');
  await page.getByRole('button', { name: 'Toggle current link' }).click();
  const current = nav.getByRole('link', { name: 'Quarterly performance report', exact: true });
  await expect(current).toHaveAttribute('aria-current', 'page');
  await current.click();
  await expect(page).toHaveURL(/crumb=report#report/);
  await expect(nav.getByRole('link', { name: 'Workspace home', exact: true })).toHaveAttribute(
    'href',
    '#home',
  );
});
test('Breadcrumbs keeps all structured ancestors, supports bounds and keyboard scrolling in narrow RTL', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 1100 });
  await page.goto('/__zordon-tests__/breadcrumbs');
  const nav = page.getByRole('navigation', { name: 'Workspace path' });
  await expect(page.locator('zd-breadcrumbs [itemprop="position"]')).toHaveCount(6);
  expect(
    await page
      .locator('zd-breadcrumbs [itemprop="position"]')
      .evaluateAll(nodes => nodes.map(node => node.getAttribute('content'))),
  ).toEqual(['1', '2', '3', '4', '5', '6']);
  await page.getByRole('button', { name: 'Toggle maximum' }).click();
  await expect(nav.locator('.zd-trail > li')).toHaveCount(3);
  await expect(nav.locator('.zd-short').first()).toBeVisible();
  await page.getByRole('button', { name: 'Toggle direction' }).click();
  expect(
    await page.getByTestId('breadcrumbs-fixture').evaluate(el => el.scrollWidth <= el.clientWidth),
  ).toBe(true);
  await nav.locator('summary').click();
  const bounds = await nav.locator('.zd-overflow').boundingBox();
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(360);
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Toggle scrolling' }).click();
  await expect(nav.locator('.zd-trail > li')).toHaveCount(6);
  await expect(nav).toHaveAttribute('tabindex', '0');
  await nav.focus();
  await page.keyboard.press('ArrowLeft');
  await expect.poll(() => nav.evaluate(el => Math.abs(el.scrollLeft))).toBeGreaterThan(0);
  await page.getByRole('button', { name: 'Toggle separator' }).click();
  await expect(nav.locator('.zd-separator').first()).toHaveText('/');
});
test('Breadcrumbs passes axe with overflow, full accessible labels, reduced motion and forced-color focus', async ({
  page,
  nativeLinkTab,
  runAxeScan,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/__zordon-tests__/breadcrumbs');
  const nav = page.getByRole('navigation', { name: 'Workspace path' });
  await nav.locator('summary').focus();
  await nav.locator('summary').press('Enter');
  await page.emulateMedia({ forcedColors: 'active' });
  await nav.locator('summary').focus();
  await page.keyboard.press('Tab');
  const link = nav.getByRole('link', { name: 'All projects', exact: true });
  if (!nativeLinkTab) {
    await expect(page.getByRole('textbox', { name: 'Report title' })).toBeFocused();
    await link.focus();
  }
  await expect(link).toBeFocused();
  expect(await link.evaluate(el => getComputedStyle(el).outlineStyle)).toBe('solid');
  expect(await link.evaluate(el => getComputedStyle(el).transitionDuration)).toBe('0s');
  expect((await runAxeScan()).violations).toEqual([]);
});
