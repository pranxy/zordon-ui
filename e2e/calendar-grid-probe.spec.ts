import { expect, test } from './fixtures/accessibility';

test.beforeEach(async ({ page }) => {
  await page.goto('/__zordon-tests__/browser');
  await expect(page.getByTestId('calendar-grid-probe')).toBeVisible();
});

test('Calendar grid spike preserves native activation, controlled state, and disabled dates', async ({
  page,
  runAxeScan,
}) => {
  const probe = page.getByTestId('calendar-grid-probe');
  const day = (date: number) =>
    probe.getByRole('button', { name: `September ${date}, 2026`, exact: true });
  await expect(probe.getByRole('gridcell', { selected: true })).toHaveCount(1);
  await day(14).focus();
  await page.keyboard.press('ArrowRight');
  await expect(day(15)).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(probe.getByRole('status')).toHaveText('14');
  await page.keyboard.press('ArrowRight');
  await expect(day(16)).toBeFocused();
  await page.keyboard.press('Space');
  await expect(probe.getByRole('status')).toHaveText('16');
  await expect(probe.locator('#calendar-probe-cell-16')).toHaveAttribute('aria-selected', 'true');
  await day(20).click();
  await expect(probe.getByRole('status')).toHaveText('20');
  await expect(probe.getByRole('gridcell', { selected: true })).toHaveCount(1);
  await probe.getByRole('button', { name: 'Select date externally' }).click();
  await expect(probe.locator('#calendar-probe-cell-16')).toHaveAttribute('aria-selected', 'true');
  expect((await runAxeScan('[data-testid="calendar-grid-probe"]')).violations).toEqual([]);
  await probe.getByRole('button', { name: 'Toggle grid disabled' }).click();
  await expect(day(16)).toBeDisabled();
  await probe.getByRole('button', { name: 'Toggle grid presence' }).click();
  await expect(probe.getByRole('grid')).toHaveCount(0);
  await probe.getByRole('button', { name: 'Toggle grid disabled' }).click();
  await probe.getByRole('button', { name: 'Toggle grid presence' }).click();
  await day(22).click();
  await expect(probe.getByRole('status')).toHaveText('22');
});

test('Calendar grid spike has one roving stop, vertical movement, and live RTL', async ({
  page,
}) => {
  const probe = page.getByTestId('calendar-grid-probe');
  const day = (date: number) =>
    probe.getByRole('button', { name: `September ${date}, 2026`, exact: true });
  await day(14).focus();
  await page.keyboard.press('ArrowDown');
  await expect(day(21)).toBeFocused();
  await expect(probe.locator('table [tabindex="0"]')).toHaveCount(1);
  await expect(probe.getByRole('status')).toHaveText('14');
  await page.keyboard.press('Home');
  await expect(day(20)).toBeFocused();
  await page.keyboard.press('End');
  await expect(day(26)).toBeFocused();
  await probe.getByRole('button', { name: 'Toggle grid direction' }).click();
  await expect(probe.locator('div[dir]')).toHaveAttribute('dir', 'rtl');
  await day(14).focus();
  await expect(day(14)).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await expect(day(15)).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(day(14)).toBeFocused();
});
