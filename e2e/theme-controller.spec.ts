import { expect, test } from './fixtures/accessibility';

test('Theme Controller native controls stay synchronized and preserve nested scopes', async ({
  page,
  runAxeScan,
}) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/__zordon-tests__/theme-controller');
  await expect(page.getByTestId('theme-fixture')).toHaveAttribute('data-zd-theme-ready', 'true');
  await page.getByRole('checkbox', { name: 'Dark checkbox' }).focus();
  await page.keyboard.press('Space');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.getByRole('checkbox', { name: 'Dark toggle' })).toBeChecked();
  await expect(page.getByRole('radio', { name: 'Dark', exact: true })).toBeChecked();
  await expect(page.getByRole('combobox', { name: 'Page theme' })).toHaveValue('dark');
  await page.getByRole('radio', { name: 'Dark', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('radio', { name: 'System', exact: true })).toBeChecked();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.keyboard.press('ArrowLeft');
  await expect(page.getByRole('radio', { name: 'Dark', exact: true })).toBeChecked();
  await expect(page.getByTestId('theme-nested')).toHaveAttribute('data-theme', 'light');
  await page.getByRole('button', { name: 'Preview dark', exact: true }).click();
  await page.getByRole('combobox', { name: 'Page theme' }).selectOption('light');
  await expect(page.getByTestId('theme-nested')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.getByRole('button', { name: 'Use system', exact: true }).focus();
  await page.keyboard.press('Enter');
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.getByTestId('theme-value')).toHaveText('system → dark');
  expect((await runAxeScan()).violations).toEqual([]);
  await page.getByRole('button', { name: 'Use light', exact: true }).click();
  await page.emulateMedia({ colorScheme: 'light' });
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  expect((await runAxeScan()).violations).toEqual([]);
});

test('Theme Controller persists and synchronizes real same-origin tabs without changing previews', async ({
  page,
  context,
}) => {
  await page.goto('/__zordon-tests__/theme-controller');
  await page.getByRole('button', { name: 'Use dark', exact: true }).click();
  await page.reload();
  await expect(page.getByRole('combobox', { name: 'Page theme' })).toHaveValue('dark');
  const second = await context.newPage();
  await second.goto('/__zordon-tests__/theme-controller');
  await expect(second.getByRole('combobox', { name: 'Page theme' })).toHaveValue('dark');
  await second.getByRole('button', { name: 'Use light', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.getByTestId('theme-event')).toHaveText('Last change: storage');
  await expect(page.getByTestId('theme-nested')).toHaveAttribute('data-theme', 'light');
  await second.evaluate(() => localStorage.removeItem('zd-theme-fixture'));
  await expect(page.getByRole('combobox', { name: 'Page theme' })).toHaveValue('system');
  await second.close();
});

test('Theme Controller handles blocked storage, custom selection and narrow RTL forced colors', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get: () => {
        throw new Error('Storage blocked');
      },
    });
  });
  await page.setViewportSize({ width: 360, height: 1000 });
  await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
  await page.goto('/__zordon-tests__/theme-controller');
  await page.getByRole('button', { name: 'Toggle direction' }).click();
  await page.getByRole('combobox', { name: 'Page theme' }).selectOption('brand/v2');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'brand/v2');
  await expect(page.getByTestId('theme-fixture')).toHaveAttribute('dir', 'rtl');
  await page.getByRole('button', { name: 'Use dark', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.getByRole('button', { name: 'Disabled dark' })).toBeDisabled();
  expect(
    await page
      .getByTestId('theme-fixture')
      .evaluate(element => element.scrollWidth <= element.clientWidth),
  ).toBe(true);
});
