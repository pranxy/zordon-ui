import { expect, test } from './fixtures/accessibility';
test('Skeleton keeps artwork decorative while the consumer controls busy state and real content', async ({
  page,
  runAxeScan,
}) => {
  await page.goto('/__zordon-tests__/skeleton');
  const region = page.getByRole('region', { name: 'Profile', exact: true });
  const skeleton = page.getByTestId('skeleton-active');
  await expect(region).toHaveAttribute('aria-busy', 'true');
  await expect(skeleton).toHaveAttribute('aria-hidden', 'true');
  await expect(skeleton).toHaveAttribute('inert');
  await expect(page.getByRole('status')).toHaveText('Loading profile');
  await page.getByRole('button', { name: 'Finish loading' }).focus();
  await page.keyboard.press('Enter');
  await expect(region).toHaveAttribute('aria-busy', 'false');
  await expect(skeleton).toBeHidden();
  await expect(region.getByRole('button', { name: 'Edit profile' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Start loading' })).toBeFocused();
  await expect(page.getByRole('status')).toHaveText('Profile ready');
  await page.getByRole('button', { name: 'Start loading' }).click();
  await expect(skeleton).toBeVisible();
  await expect(region).toHaveAttribute('aria-busy', 'true');
  expect((await runAxeScan()).violations).toEqual([]);
});
test('Skeleton renders shapes, multiline widths and presets with configurable animation speed', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/__zordon-tests__/skeleton');
  const matrix = page.getByTestId('skeleton-matrix');
  const parts = matrix.locator('.zd-skeleton-part');
  await expect(parts).toHaveCount(18);
  await expect(parts.first()).toHaveCSS('animation-name', 'skeleton');
  await expect(parts.first()).toHaveCSS('animation-duration', '1.8s');
  const circle = matrix.locator('zd-skeleton[shape="circle"] .zd-skeleton-part');
  await expect(circle).toHaveCSS('width', '48px');
  await expect(circle).toHaveCSS('height', '48px');
  await expect(circle).toHaveCSS('border-radius', '50%');
  await expect(matrix.locator('zd-skeleton[shape="custom"] .zd-skeleton-part')).toHaveCSS(
    'clip-path',
    'polygon(50% 0px, 100% 50%, 50% 100%, 0px 50%)',
  );
  const lines = matrix.locator('zd-skeleton[shape="text"] .zd-skeleton-part');
  await expect(lines).toHaveCount(4);
  expect(await lines.last().evaluate(element => (element as HTMLElement).style.inlineSize)).toBe(
    '75%',
  );
  await page.getByRole('button', { name: 'Speed: 1800' }).click();
  await expect(parts.first()).toHaveCSS('animation-duration', '3s');
  await page.getByRole('button', { name: 'Animation: shimmer' }).click();
  await expect(parts.first()).toHaveCSS('animation-name', /zd-skeleton-pulse/);
  await expect(parts.first()).toHaveCSS('background-image', 'none');
  await page.getByRole('button', { name: 'Animation: pulse' }).click();
  await expect(parts.first()).toHaveCSS('animation-name', 'none');
});
test('Skeleton stops motion and retains placeholder outlines in forced colors and narrow RTL layouts', async ({
  page,
  runAxeScan,
}) => {
  await page.setViewportSize({ width: 360, height: 2400 });
  await page.goto('/__zordon-tests__/skeleton');
  await page.getByRole('button', { name: 'Toggle direction' }).click();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const part = page.getByTestId('skeleton-active').locator('.zd-skeleton-part').first();
  await expect(part).toHaveCSS('animation-name', 'none');
  await expect(part).toHaveCSS('background-image', 'none');
  await page.getByRole('button', { name: 'Animation: shimmer' }).click();
  await expect(part).toHaveCSS('animation-name', 'none');
  await page.emulateMedia({ reducedMotion: 'no-preference', forcedColors: 'active' });
  await expect(part).toHaveCSS('animation-name', 'none');
  await expect(part).toHaveCSS('border-top-style', 'solid');
  expect(
    await page
      .getByTestId('skeleton-fixture')
      .evaluate(element => element.scrollWidth <= element.clientWidth),
  ).toBe(true);
  expect((await runAxeScan()).violations).toEqual([]);
});
