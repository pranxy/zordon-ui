import { expect, test } from './fixtures/accessibility';

test.beforeEach(async ({ page }) => {
  await page.goto('/__zordon-tests__/table');
});

test('Table grid has one tab stop, header roles and two-dimensional navigation', async ({
  page,
}) => {
  const grid = page.getByRole('grid', { name: 'Interactive people' });
  await page.getByRole('button', { name: 'Before grid', exact: true }).focus();
  await page.keyboard.press('Tab');
  await expect(grid.getByRole('columnheader', { name: 'Name', exact: true })).toBeFocused();
  await expect(grid.locator('[tabindex="0"]')).toHaveCount(1);
  await page.keyboard.press('ArrowDown');
  await expect(grid.getByRole('rowheader', { name: 'Ada', exact: true })).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(grid.getByRole('button', { name: 'Edit Ada', exact: true })).toBeFocused();
  await page.keyboard.press('Home');
  await expect(grid.getByRole('rowheader', { name: 'Ada', exact: true })).toBeFocused();
  await page.keyboard.press('End');
  await expect(grid.getByRole('textbox', { name: 'Notes for Ada' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'After grid', exact: true })).toBeFocused();
});

test('Table grid supports nested pointer targets, native actions and checkbox state', async ({
  page,
  runAxeScan,
}) => {
  const grid = page.getByRole('grid', { name: 'Interactive people' });
  await grid.getByRole('rowheader', { name: 'Ada', exact: true }).focus();
  await grid.getByRole('rowheader', { name: 'Grace', exact: true }).locator('span').click();
  await expect(grid.getByRole('rowheader', { name: 'Grace', exact: true })).toBeFocused();
  await grid.getByRole('button', { name: 'Edit Ada', exact: true }).locator('span').click();
  await expect(page.getByRole('status')).toHaveText('Editing Ada');
  await grid.getByRole('checkbox', { name: 'Select Ada' }).focus();
  await page.keyboard.press('Space');
  await expect(grid.getByRole('checkbox', { name: 'Select Ada' })).toBeChecked();
  await expect(page.getByText('Selected ID: 1', { exact: true })).toBeVisible();
  await expect(grid.getByRole('button', { name: 'Edit Grace', exact: true })).toBeDisabled();
  expect((await runAxeScan()).violations).toEqual([]);
});

test('Table grid respects RTL and survives data reorder, disabled state and recreation', async ({
  page,
}) => {
  const grid = page.getByRole('grid', { name: 'Interactive people' });
  await page.getByRole('button', { name: 'Toggle direction' }).click();
  await expect(page.locator('div[dir]')).toHaveAttribute('dir', 'rtl');
  await grid.getByRole('rowheader', { name: 'Ada', exact: true }).focus();
  await page.keyboard.press('ArrowLeft');
  await expect(grid.getByRole('button', { name: 'Edit Ada', exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'Reverse rows' }).click();
  await expect(grid.getByRole('rowheader')).toHaveText(['Grace', 'Ada']);
  await grid.getByRole('rowheader', { name: 'Grace', exact: true }).focus();
  await page.keyboard.press('ArrowLeft');
  await expect(grid.getByRole('checkbox', { name: 'Select Grace' })).toBeFocused();
  await page.getByRole('button', { name: 'Toggle disabled' }).click();
  await expect(grid).toHaveAttribute('aria-disabled', 'true');
  await expect(grid.getByRole('button', { name: 'Edit Ada' })).toBeDisabled();
  await page.getByRole('button', { name: 'Toggle grid', exact: true }).click();
  await expect(grid).toHaveCount(0);
  await page.getByRole('button', { name: 'Toggle disabled' }).click();
  await page.getByRole('button', { name: 'Toggle grid', exact: true }).click();
  await grid.getByRole('button', { name: 'Edit Ada' }).click();
  await expect(page.getByRole('status')).toHaveText('Editing Ada');
});

test('Table CDK composition renders custom templates, footer and changed column order', async ({
  page,
}) => {
  const table = page.getByRole('table', { name: 'Data people' });
  await expect(table.getByRole('columnheader')).toHaveText(['Name', 'Action']);
  await table.getByRole('button', { name: 'Open Ada' }).click();
  await expect(page.getByRole('status')).toHaveText('Editing Ada');
  await expect(table.getByRole('cell', { name: 'Total people: 2' })).toBeVisible();
  await page.getByRole('button', { name: 'Change data columns' }).click();
  await expect(table.getByRole('columnheader')).toHaveText(['Action', 'Name', 'Notes']);
  await page.getByRole('button', { name: 'Reverse rows' }).click();
  await expect(table.locator('tbody tr').first()).toContainText('Grace');
  await expect(table.getByRole('gridcell')).toHaveCount(0);
});

test('Table grid retains keyed focus when rows move and yields keys to an active text control', async ({
  page,
}) => {
  const grid = page.getByRole('grid', { name: 'Interactive people' });
  const ada = grid.getByRole('rowheader', { name: 'Ada', exact: true });
  await ada.focus();
  await page.keyboard.press('Alt+r');
  await expect(grid.getByRole('rowheader')).toHaveText(['Grace', 'Ada']);
  await expect(ada).toBeFocused();
  const notes = grid.getByRole('textbox', { name: 'Notes for Ada' });
  await notes.focus();
  await notes.press('Enter');
  await expect(notes).toHaveAttribute('data-active-control', 'widget');
  await notes.press('Home');
  await notes.pressSequentially('Updated ');
  await expect(notes).toHaveValue('Updated First');
  await expect(notes).toBeFocused();
  await notes.press('Escape');
  await expect(notes).toHaveAttribute('data-active-control', 'cell');
  await notes.press('ArrowLeft');
  await expect(grid.getByRole('checkbox', { name: 'Select Ada' })).toBeFocused();
});
