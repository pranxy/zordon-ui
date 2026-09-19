import { expect, test } from './fixtures/accessibility';

test('Radial Progress keeps actual units, inclusive thresholds and completion in one progressbar', async ({
  page,
  runAxeScan,
}) => {
  await page.goto('/__zordon-tests__/radial-progress');
  const task = page.getByRole('progressbar', { name: 'Download', exact: true });
  await expect(task).toHaveAttribute('aria-valuenow', '50');
  await expect(task).toHaveAttribute('aria-valuemax', '200');
  await expect(task).toHaveAttribute('aria-valuetext', '50 of 200 MB');
  const ring = task.locator('.zd-radial-ring');
  expect(
    await ring.evaluate(element => (element as HTMLElement).style.getPropertyValue('--value')),
  ).toBe('25');
  await page.getByRole('button', { name: 'Halfway', exact: true }).click();
  await expect(task).toHaveAttribute('aria-valuenow', '100');
  expect(
    await ring.evaluate(element =>
      (element as HTMLElement).style.getPropertyValue('--zd-radial-color'),
    ),
  ).toBe('var(--color-warning)');
  await page.getByRole('button', { name: 'Reach target' }).click();
  await expect(task).toHaveAttribute('aria-valuenow', '160');
  expect(
    await ring.evaluate(element =>
      (element as HTMLElement).style.getPropertyValue('--zd-radial-color'),
    ),
  ).toBe('var(--color-success)');
  await page.getByRole('button', { name: 'Complete', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(task).toHaveAttribute('aria-valuenow', '200');
  await expect(page.getByTestId('radial-completion')).toHaveText('Download complete');
  await expect(page.getByRole('button', { name: 'Complete', exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(task).toHaveAttribute('aria-valuenow', '0');
  expect(await ring.evaluate(element => getComputedStyle(element, '::before').visibility)).toBe(
    'hidden',
  );
  await page.getByRole('button', { name: 'Unknown duration' }).click();
  await expect(task).not.toHaveAttribute('aria-valuenow');
  await expect(task).toHaveAttribute('aria-valuetext', 'Waiting for total');
  await expect(page.getByTestId('radial-completion')).toHaveText('Download pending');
  expect((await runAxeScan()).violations).toEqual([]);
});

test('Radial Progress renders daisy ring geometry, dimensions, projected parts and static motion', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/__zordon-tests__/radial-progress');
  const unknown = page.getByTestId('radial-unknown').locator('.zd-radial-ring');
  await expect(unknown).toHaveCSS('animation-duration', '1.5s');
  const rings = page.getByTestId('radial-sizes').locator('.zd-radial-ring');
  expect(
    await rings.evaluateAll(elements =>
      elements.map(element => Math.round(element.getBoundingClientRect().width)),
    ),
  ).toEqual([64, 80, 128]);
  expect(
    await rings.first().evaluate(element => getComputedStyle(element, '::before').backgroundImage),
  ).toContain('conic-gradient');
  expect(
    await rings.evaluateAll(elements =>
      elements.map(element => getComputedStyle(element).getPropertyValue('--thickness').trim()),
    ),
  ).toEqual(['2px', 'calc(5rem / 10)', '16px']);
  await expect(page.getByTestId('radial-projected')).toHaveText('✓Done');
  await expect(page.getByTestId('radial-projected')).toHaveAttribute('aria-valuetext', '100%');
  await expect(page.getByTestId('radial-projected').locator('.zd-radial-content')).toHaveAttribute(
    'inert',
  );
  const colors = await page
    .getByTestId('radial-colors')
    .locator('.zd-radial-ring')
    .evaluateAll(elements => elements.map(element => getComputedStyle(element).color));
  expect(new Set(colors).size).toBe(8);
  await page.getByRole('button', { name: 'Animation: true' }).click();
  await expect(unknown).toHaveCSS('animation-name', 'none');
  await expect(unknown).toHaveCSS('transition-duration', '0s');
  await page.getByRole('button', { name: 'Animation: false' }).click();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(unknown).toHaveCSS('animation-name', 'none');
  await expect(unknown).toHaveCSS('transition-duration', '0s');
  expect(
    await unknown.evaluate(element => getComputedStyle(element, '::after').transitionDuration),
  ).toBe('0s');
});

test('Radial Progress keeps text readable in RTL and forced colors without a focus stop', async ({
  page,
  runAxeScan,
}) => {
  await page.setViewportSize({ width: 360, height: 1800 });
  await page.goto('/__zordon-tests__/radial-progress');
  await page.getByRole('button', { name: 'Toggle direction' }).click();
  const task = page.getByTestId('radial-task');
  await expect(task.locator('bdi')).toHaveCSS('direction', 'ltr');
  await expect(task).not.toHaveAttribute('tabindex');
  await page.emulateMedia({ forcedColors: 'active' });
  const ring = task.locator('.zd-radial-ring');
  await expect(ring).toHaveCSS('border-top-style', 'solid');
  expect(await ring.evaluate(element => getComputedStyle(element, '::before').display)).toBe(
    'none',
  );
  await expect(task.locator('bdi')).toBeVisible();
  await expect(task).toHaveAttribute('aria-valuenow', '50');
  expect(
    await page
      .getByTestId('radial-fixture')
      .evaluate(element => element.scrollWidth <= element.clientWidth),
  ).toBe(true);
  expect((await runAxeScan()).violations).toEqual([]);
});
