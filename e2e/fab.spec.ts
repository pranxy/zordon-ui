import { expect, test } from './fixtures/accessibility';

test.beforeEach(async ({ page }) => {
  await page.goto('/__zordon-tests__/fab');
});

test('FAB retains native disclosure, action cancellation, keyboard order and Tooltip Escape ownership', async ({
  page,
  runAxeScan,
}) => {
  const root = page.getByTestId('fab-local');
  const trigger = root.locator('.zd-fab-trigger');
  await expect(root.getByRole('group')).toHaveCount(0);
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Tab');
  await expect(root.getByRole('button', { name: 'Draft', exact: true })).toBeFocused();
  await expect(page.getByRole('tooltip')).toHaveText('Create a draft');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('tooltip')).toHaveCount(0);
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await trigger.click();
  await root.getByRole('button', { name: 'Cancelled' }).click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await root.getByRole('link').click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await root.getByRole('button', { name: 'Draft', exact: true }).focus();
  await root.getByRole('button', { name: 'Draft', exact: true }).press('Enter');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(trigger).toBeFocused();
  await expect(page.getByRole('status')).toHaveText('draft');
  await trigger.click();
  expect((await runAxeScan()).violations).toEqual([]);
  await page.getByRole('button', { name: 'Outside action' }).click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await page.getByRole('button', { name: 'New note' }).click();
  await expect(page.getByRole('status')).toHaveText('new note');
});

test('FAB controlled requests, disabled state, teardown and Tab departure remain native', async ({
  page,
}) => {
  const flower = page.getByTestId('fab-flower');
  const trigger = flower.locator('.zd-fab-trigger');
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await page.getByRole('button', { name: 'Accept controlled' }).click();
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await flower.getByRole('button', { name: 'Email', exact: true }).focus();
  await flower.getByRole('button', { name: 'Email', exact: true }).press('Enter');
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await page.getByRole('button', { name: 'Toggle disabled' }).click();
  await expect(page.getByTestId('fab-local').locator('.zd-fab-trigger')).toBeDisabled();
  await page.getByRole('button', { name: 'Toggle disabled' }).click();
  await page.getByTestId('fab-local').locator('.zd-fab-trigger').click();
  await page.getByTestId('fab-local').getByRole('button', { name: 'Cancelled' }).focus();
  await page.keyboard.press('Tab');
  await expect(page.getByTestId('fab-local').locator('.zd-fab-trigger')).toHaveAttribute(
    'aria-expanded',
    'false',
  );
  await page.getByTestId('fab-local').locator('.zd-fab-trigger').click();
  await page.getByTestId('fab-local').getByRole('button', { name: 'Draft', exact: true }).focus();
  await expect(page.getByRole('tooltip')).toHaveCount(1);
  await page.getByRole('button', { name: 'Toggle presence' }).click();
  await expect(page.getByTestId('fab-local')).toHaveCount(0);
  await expect(page.locator('.cdk-overlay-pane')).toHaveCount(0);
});

test('FAB flower geometry mirrors RTL, honors corners, falls back on small screens and removes motion', async ({
  page,
}) => {
  await page.getByRole('button', { name: 'Set controlled' }).click();
  const root = page.getByTestId('fab-flower');
  const email = root.getByRole('button', { name: 'Email', exact: true });
  const save = root.getByRole('button', { name: 'Save', exact: true });
  const e = await email.boundingBox(),
    s = await save.boundingBox();
  expect(e!.y).toBeLessThan(s!.y);
  expect(e!.x).toBeGreaterThan(s!.x);
  await page.getByRole('button', { name: 'Toggle direction' }).click();
  await expect(page.getByTestId('fab-fixture')).toHaveAttribute('dir', 'rtl');
  const re = await email.boundingBox(),
    rs = await save.boundingBox();
  expect(re!.x).toBeLessThan(rs!.x);
  await page.getByRole('button', { name: 'Toggle fixed' }).click();
  await page.getByRole('button', { name: 'Top start' }).click();
  await expect(root).toHaveAttribute('data-corner', 'top-start');
  await expect(root).not.toHaveAttribute('data-inline', '');
  const box = await root.boundingBox();
  expect(box!.y).toBeGreaterThanOrEqual(15);
  expect(box!.x).toBeGreaterThan(900);
  for (const direction of ['rtl', 'ltr']) {
    if (direction === 'ltr') {
      await page.getByRole('button', { name: 'Toggle direction' }).click();
      await expect(page.getByTestId('fab-fixture')).toHaveAttribute('dir', 'ltr');
    }
    for (const corner of ['Top start', 'Top end', 'Bottom start', 'Bottom end']) {
      await page.getByRole('button', { name: corner, exact: true }).click();
      await expect(root).toHaveAttribute('data-corner', corner.toLowerCase().replace(' ', '-'));
      const boxes = await root.locator('[data-zd-fab-action]').evaluateAll(elements =>
        elements.map(element => {
          const r = element.getBoundingClientRect();
          return { x: r.x, y: r.y, right: r.right, bottom: r.bottom };
        }),
      );
      for (const [index, a] of boxes.entries()) {
        expect(a.x).toBeGreaterThanOrEqual(0);
        expect(a.y).toBeGreaterThanOrEqual(0);
        expect(a.right).toBeLessThanOrEqual(1280);
        expect(a.bottom).toBeLessThanOrEqual(720);
        for (const b of boxes.slice(index + 1))
          expect(a.right <= b.x || b.right <= a.x || a.bottom <= b.y || b.bottom <= a.y).toBe(true);
      }
    }
  }
  await page.getByRole('button', { name: 'Extra actions' }).click();
  await expect(root.locator('.zd-fab-actions')).toHaveCSS('position', 'static');
  await page.setViewportSize({ width: 360, height: 740 });
  await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });
  await expect(root.locator('.zd-fab-trigger')).toHaveCSS('transition-duration', '0s');
  await expect(root.locator('.zd-fab-actions')).toHaveCSS('position', 'static');
});
