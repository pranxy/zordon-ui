import { expect, test } from './fixtures/accessibility';

test.beforeEach(async ({ page }) => {
  await page.goto('/__zordon-tests__/calendar');
});

test('Calendar honors consumer sizing and reduced motion while retaining selected state', async ({
  page,
  browserName,
}) => {
  const single = page.getByTestId('calendar-single');
  const day = single.locator('[data-date="2026-09-14"]');
  await single
    .locator('zd-calendar')
    .evaluate(element =>
      (element as HTMLElement).style.setProperty('--zd-calendar-day-size', '3rem'),
    );
  await expect(day).toHaveCSS('width', '48px');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(day).toHaveCSS('transition-duration', '0s');
  await expect(day).toHaveAttribute('aria-pressed', 'true');
  if (browserName === 'chromium') {
    await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });
    await expect(day).toHaveCSS('outline-style', 'solid');
    await expect(day).toHaveCSS('outline-width', '2px');
  }
});

test('Calendar selects through native keyboard activation and preserves disabled dates', async ({
  page,
  runAxeScan,
}) => {
  const single = page.getByTestId('calendar-single');
  const date = (day: number) => single.locator(`[data-date="2026-09-${day}"]`);
  await date(14).focus();
  await page.keyboard.press('ArrowRight');
  await expect(date(15)).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(single.getByRole('status')).toHaveText('2026-09-14');
  await page.keyboard.press('ArrowRight');
  await expect(date(16)).toBeFocused();
  await page.keyboard.press('Space');
  await expect(single.getByRole('status')).toHaveText('2026-09-16');
  await expect(date(16)).toHaveAttribute('aria-pressed', 'true');
  await expect(single.locator('table [tabindex="0"]')).toHaveCount(1);
  await page.keyboard.press('PageDown');
  await expect(single.locator('[data-date="2026-10-16"]')).toBeFocused();
  await expect(single.getByRole('status')).toHaveText('2026-09-16');
  await page.getByRole('button', { name: 'Toggle calendar direction' }).click();
  await expect(single.locator('..')).toHaveAttribute('dir', 'rtl');
  await single.locator('[data-date="2026-10-16"]').focus();
  await page.keyboard.press('ArrowLeft');
  await expect(single.locator('[data-date="2026-10-17"]')).toBeFocused();
  expect((await runAxeScan('docs-calendar-test-fixture')).violations).toEqual([]);
});

test('Calendar supports range, multiple, popup Escape and focus restoration', async ({
  page,
  runAxeScan,
}) => {
  const range = page.getByTestId('calendar-range');
  await range.locator('[data-date="2026-09-20"]').click();
  await expect(range.getByRole('status')).toHaveText('Choose the end date.');
  await range.locator('[data-date="2026-09-18"]').click();
  await expect(range.locator('[aria-pressed="true"]')).toHaveCount(3);
  const multiple = page.getByTestId('calendar-multiple');
  await multiple.locator('[data-date="2026-09-14"]').click();
  await multiple.locator('[data-date="2026-09-16"]').click();
  await expect(multiple.locator('[aria-pressed="true"]')).toHaveCount(2);
  const popup = page.getByTestId('calendar-popup');
  const trigger = popup.getByRole('button', { name: 'Departure: Choose date' });
  await trigger.click();
  await expect(popup.getByRole('dialog')).toBeVisible();
  expect((await runAxeScan('docs-calendar-test-fixture')).violations).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(popup.getByRole('dialog')).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await popup.locator('[data-date="2026-09-16"]').click();
  await expect(popup.getByRole('dialog')).not.toBeVisible();
  await expect(trigger).toBeFocused();
});
