import { expect, test } from './fixtures/accessibility';

test('Progress exposes one native value, decorative buffering and resettable completion', async ({
  page,
  runAxeScan,
}) => {
  await page.goto('/__zordon-tests__/progress');
  const upload = page.getByTestId('progress-upload');
  const progress = upload.getByRole('progressbar', { name: 'Upload', exact: true });
  await expect(progress).toHaveAttribute('value', '50');
  await expect(progress).toHaveAttribute('max', '200');
  await expect(progress).toHaveAttribute('aria-valuetext', '50 of 200 MB');
  await expect(upload.getByRole('progressbar')).toHaveCount(1);
  await expect(upload.locator('.zd-progress-buffer')).toHaveCSS('inline-size', /\d/);
  expect(
    await upload
      .locator('.zd-progress-buffer')
      .evaluate(element => (element as HTMLElement).style.inlineSize),
  ).toBe('70%');
  await page.getByRole('button', { name: 'Complete upload' }).focus();
  await page.keyboard.press('Enter');
  await expect(progress).toHaveAttribute('value', '200');
  await expect(page.getByTestId('progress-completion')).toHaveText('Upload complete');
  await expect(page.getByRole('button', { name: 'Complete upload' })).toBeFocused();
  await page.getByRole('button', { name: 'Unknown duration' }).click();
  await expect(progress).not.toHaveAttribute('value');
  expect(await progress.evaluate(element => element.matches(':indeterminate'))).toBe(true);
  await expect(upload.locator('.zd-progress-buffer')).toHaveCount(0);
  await expect(progress).toHaveAttribute('aria-valuetext', 'Waiting for total');
  await page.getByRole('button', { name: 'Restart upload' }).click();
  await expect(progress).toHaveAttribute('value', '50');
  await expect(page.getByTestId('progress-completion')).toHaveText('Upload pending');
  expect((await runAxeScan()).violations).toEqual([]);
});

test('Progress uses actual daisy colors and respects animation opt-out and reduced motion', async ({
  page,
  browserName,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/__zordon-tests__/progress');
  const unknown = page.getByTestId('progress-unknown').locator('progress');
  await expect(unknown).toHaveCSS('animation-name', 'progress');
  const colors = await page
    .getByTestId('progress-matrix')
    .locator('progress')
    .evaluateAll(elements => elements.map(element => getComputedStyle(element).color));
  expect(new Set(colors).size).toBe(8);
  await page.getByRole('button', { name: 'Animation: true' }).click();
  await expect(unknown).toHaveCSS('animation-name', 'none');
  await page.getByRole('button', { name: 'Animation: false' }).click();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(unknown).toHaveCSS('animation-name', 'none');
  const transition = await unknown.evaluate(
    (element, pseudo) => getComputedStyle(element, pseudo).transitionDuration,
    browserName === 'firefox' ? '::-moz-progress-bar' : '::-webkit-progress-value',
  );
  expect(transition).toBe('0s');
});

test('Progress preserves native meaning in RTL, narrow layouts and forced colors', async ({
  page,
  runAxeScan,
}) => {
  await page.setViewportSize({ width: 360, height: 1400 });
  await page.goto('/__zordon-tests__/progress');
  await page.getByRole('button', { name: 'Toggle direction' }).click();
  const upload = page.getByTestId('progress-upload');
  const buffer = upload.locator('.zd-progress-buffer');
  await expect(upload.locator('bdi').last()).toHaveCSS('direction', 'ltr');
  await expect(upload.locator('bdi').last()).toHaveText('50 of 200 MB');
  const trackBox = await upload.locator('.zd-progress-track').boundingBox();
  const bufferBox = await buffer.boundingBox();
  expect(Math.abs(trackBox!.x + trackBox!.width - bufferBox!.x - bufferBox!.width)).toBeLessThan(1);
  await page.emulateMedia({ forcedColors: 'active' });
  await expect(buffer).toBeHidden();
  await expect(upload.locator('progress')).toHaveCSS('appearance', 'auto');
  await expect(upload.getByRole('progressbar', { name: 'Upload', exact: true })).toHaveAttribute(
    'value',
    '50',
  );
  expect(
    await page
      .getByTestId('progress-fixture')
      .evaluate(element => element.scrollWidth <= element.clientWidth),
  ).toBe(true);
  expect((await runAxeScan()).violations).toEqual([]);
});
