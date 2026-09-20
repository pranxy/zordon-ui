import { expect, test } from './fixtures/accessibility';

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1200 });
  await page.goto('/__zordon-tests__/tabs');
  await expect(page.locator('zd-tabs').first()).toHaveAttribute('data-zd-tabs-ready', 'true');
});
test('Tabs supports controlled Aria pointer and keyboard activation, disabled skipping and rejection', async ({
  page,
  runAxeScan,
}) => {
  const list = page.getByRole('tablist', { name: 'Workspace' });
  const overview = list.getByRole('tab', { name: 'Overview' });
  const activity = list.getByRole('tab', { name: 'Activity' });
  await overview.focus();
  await overview.press('ArrowRight');
  await expect(activity).toBeFocused();
  await expect(activity).toHaveAttribute('aria-selected', 'true');
  await page.getByLabel('Accept requests').uncheck();
  await list.getByRole('tab', { name: 'Reports' }).click();
  await expect(page.getByRole('status')).toHaveText('Requested reports');
  await expect(activity).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('heading', { name: 'Activity panel' })).toBeVisible();
  await expect(list.getByRole('tab', { name: 'Unavailable' })).toBeDisabled();
  expect((await runAxeScan()).violations).toEqual([]);
});
test('Tabs separates manual focus from selection and handles RTL and overflow', async ({
  page,
}) => {
  const list = page.getByRole('tablist', { name: 'Preferences' });
  await list.getByRole('tab', { name: 'General' }).focus();
  await page.keyboard.press('ArrowDown');
  const security = list.getByRole('tab', { name: 'Security' });
  await expect(security).toBeFocused();
  await expect(security).toHaveAttribute('aria-selected', 'false');
  await page.keyboard.press('Enter');
  await expect(security).toHaveAttribute('aria-selected', 'true');
  await page.getByRole('button', { name: 'Toggle direction' }).click();
  await expect(page.getByTestId('tabs-fixture')).toHaveAttribute('dir', 'rtl');
  const workspace = page.getByRole('tablist', { name: 'Workspace' });
  await workspace.getByRole('tab', { name: 'Overview' }).focus();
  await page.keyboard.press('ArrowLeft');
  await expect(workspace.getByRole('tab', { name: 'Activity' })).toBeFocused();
  await page.setViewportSize({ width: 360, height: 1200 });
  const long = page.getByRole('tablist', { name: 'Long labels' });
  expect(await long.evaluate(el => el.scrollWidth > el.clientWidth)).toBe(true);
  await long.getByRole('tab').first().focus();
  await page.keyboard.press('End');
  await expect(long.getByRole('tab').last()).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
test('Tabs preserves or recreates panel state and accepts close/reorder with focus recovery', async ({
  page,
}) => {
  const list = page.getByRole('tablist', { name: 'Workspace' });
  await page.getByRole('textbox', { name: 'Overview notes' }).fill('Saved draft');
  await list.getByRole('tab', { name: 'Activity' }).click();
  await list.getByRole('tab', { name: 'Overview' }).click();
  await expect(page.getByRole('textbox', { name: 'Overview notes' })).toHaveValue('Saved draft');
  await page.getByLabel('Preserve panels').uncheck();
  await list.getByRole('tab', { name: 'Activity' }).click();
  await list.getByRole('tab', { name: 'Overview' }).click();
  await expect(page.getByRole('textbox', { name: 'Overview notes' })).toHaveValue('');
  await page.getByRole('button', { name: 'Move Overview later' }).click();
  await expect(list.getByRole('tab').nth(1)).toHaveText('Overview');
  await expect(list.getByRole('tab', { name: 'Overview' })).toBeFocused();
  await page.getByRole('button', { name: 'Move Overview later' }).click();
  await expect(list.getByRole('tab').nth(2)).toHaveText('Overview');
  await expect(list.getByRole('tab', { name: 'Overview' })).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await expect(list.getByRole('tab', { name: 'Activity' })).toBeFocused();
  await expect(list.getByRole('tab', { name: 'Activity' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await list.getByRole('tab', { name: 'Overview' }).click();
  await page.keyboard.press('Delete');
  await expect(list.getByRole('tab', { name: 'Overview' })).toHaveCount(0);
  await expect(list.getByRole('tab', { name: 'Reports' })).toBeFocused();
});
test('Tabs synchronizes URL query selection with history while retaining other parameters and fragment', async ({
  page,
}) => {
  await page.goto('/__zordon-tests__/tabs?tab=security&filter=active#preferences');
  const list = page.getByRole('tablist', { name: 'URL tabs' });
  await expect(list.getByRole('tab', { name: 'Security' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await list.getByRole('tab', { name: 'Billing' }).click();
  await expect(page).toHaveURL(/tab=billing&filter=active#preferences$/);
  await expect(list.getByRole('tab', { name: 'Billing' })).toHaveAttribute('aria-selected', 'true');
  await page.goBack();
  await expect(list.getByRole('tab', { name: 'Security' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
});
