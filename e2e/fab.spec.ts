import { expect, test } from './fixtures/accessibility';
import type { Locator } from '@playwright/test';

async function sampleToggle(root: Locator) {
  return root.evaluate(async element => {
    const trigger = element.querySelector<HTMLButtonElement>('.zd-fab-trigger')!;
    const panel = element.querySelector<HTMLElement>('.zd-fab-actions')!;
    const opening = trigger.getAttribute('aria-expanded') !== 'true';
    trigger.click();
    const samples: { opacity: number; x: number; y: number }[] = [];
    for (let frame = 0; frame < 120; frame++) {
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
      const opacity = Number(getComputedStyle(panel).opacity);
      const { x, y } = trigger.getBoundingClientRect();
      samples.push({ opacity, x, y });
      if (frame > 0 && opacity === (opening ? 1 : 0)) break;
    }
    return samples;
  });
}

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/__zordon-tests__/fab');
});

test('FAB keeps its trigger still while opening and closing long action labels', async ({
  page,
}) => {
  const root = page.getByTestId('fab-local');
  const trigger = root.locator('.zd-fab-trigger');
  const panel = root.locator('.zd-fab-actions');
  const before = await trigger.boundingBox();
  const opening = await sampleToggle(root);
  await expect(panel).toHaveCSS('opacity', '1');
  const opened = await trigger.boundingBox();
  expect(Math.abs(opened!.x - before!.x)).toBeLessThanOrEqual(1);
  expect(Math.abs(opened!.y - before!.y)).toBeLessThanOrEqual(1);
  const closing = await sampleToggle(root);
  await expect(panel).toBeHidden();
  const closed = await trigger.boundingBox();
  expect(Math.abs(closed!.x - before!.x)).toBeLessThanOrEqual(1);
  expect(Math.abs(closed!.y - before!.y)).toBeLessThanOrEqual(1);
  for (const samples of [opening, closing]) {
    expect(samples.some(sample => sample.opacity > 0 && sample.opacity < 1)).toBe(true);
    for (const sample of samples) {
      expect(Math.abs(sample.x - before!.x)).toBeLessThanOrEqual(1);
      expect(Math.abs(sample.y - before!.y)).toBeLessThanOrEqual(1);
    }
  }
});

test('FAB reverses an exit without hiding reopened actions and makes closing actions inert immediately', async ({
  page,
}) => {
  const root = page.getByTestId('fab-local');
  const trigger = root.locator('.zd-fab-trigger');
  const panel = root.locator('.zd-fab-actions');
  await trigger.click();
  await expect(panel).toHaveCSS('opacity', '1');
  await root.getByRole('button', { name: 'Cancelled' }).focus();
  const closing = await root.evaluate(async element => {
    const trigger = element.querySelector<HTMLButtonElement>('.zd-fab-trigger')!;
    const panel = element.querySelector<HTMLElement>('.zd-fab-actions')!;
    trigger.click();
    for (let frame = 0; frame < 120; frame++) {
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
      const opacity = Number(getComputedStyle(panel).opacity);
      if (opacity > 0 && opacity < 1) {
        const action = panel.querySelector<HTMLElement>('button')!;
        action.focus();
        const result = {
          inert: panel.inert,
          hiddenFromAccessibility: panel.getAttribute('aria-hidden'),
          focusRestored: document.activeElement === trigger,
        };
        trigger.click();
        return result;
      }
    }
    return null;
  });
  expect(closing).toEqual({ inert: true, hiddenFromAccessibility: 'true', focusRestored: true });
  await expect(panel).toHaveCSS('opacity', '1');
  await expect(panel).toBeVisible();
  await root.getByRole('button', { name: 'Cancelled' }).focus();
  await expect(root.getByRole('button', { name: 'Cancelled' })).toBeFocused();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await trigger.click();
  await expect(panel).toBeHidden();
  await expect(panel).toHaveCSS('transition-duration', '0s');
  await trigger.click();
  await expect(panel).toBeVisible();
  await expect(panel).toHaveCSS('opacity', '1');
});

test('FAB vertical trigger stays anchored in every fixed corner and direction', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('button', { name: 'Toggle vertical fixed' }).click();
  const root = page.getByTestId('fab-local');
  const trigger = root.locator('.zd-fab-trigger');
  for (const direction of ['ltr', 'rtl']) {
    if (direction === 'rtl') await page.getByRole('button', { name: 'Toggle direction' }).click();
    for (const corner of ['Top start', 'Top end', 'Bottom start', 'Bottom end']) {
      await page.getByRole('button', { name: corner, exact: true }).click();
      await expect(root).toHaveAttribute('data-corner', corner.toLowerCase().replace(' ', '-'));
      const before = await trigger.boundingBox();
      await trigger.click();
      const opened = await trigger.boundingBox();
      expect(Math.abs(opened!.x - before!.x)).toBeLessThanOrEqual(1);
      expect(Math.abs(opened!.y - before!.y)).toBeLessThanOrEqual(1);
      const panel = await root.locator('.zd-fab-actions').boundingBox();
      expect(panel!.x).toBeGreaterThanOrEqual(0);
      expect(panel!.y).toBeGreaterThanOrEqual(0);
      expect(panel!.x + panel!.width).toBeLessThanOrEqual(1280);
      expect(panel!.y + panel!.height).toBeLessThanOrEqual(720);
      await trigger.click();
    }
  }
});

test('FAB showcase speed dial keeps its trigger fixed while its text actions animate', async ({
  page,
}) => {
  await page.goto('/components/fab');
  const root = page.getByRole('region', { name: 'Speed dial', exact: true }).locator('zd-fab');
  const trigger = root.getByRole('button', { name: 'Create', exact: true });
  await trigger.scrollIntoViewIfNeeded();
  const before = await trigger.boundingBox();
  const samples = await sampleToggle(root);
  expect(samples.some(sample => sample.opacity > 0 && sample.opacity < 1)).toBe(true);
  for (const sample of samples) {
    expect(Math.abs(sample.x - before!.x)).toBeLessThanOrEqual(1);
    expect(Math.abs(sample.y - before!.y)).toBeLessThanOrEqual(1);
  }
  await root.getByRole('button', { name: 'Template', exact: true }).click();
  await expect(root.locator('.zd-fab-actions')).toBeHidden();
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
  await expect(root.locator('[data-zd-fab-action]')).toHaveCount(5);
  const assertVertical = async () => {
    const boxes = await root.locator('[data-zd-fab-action]').evaluateAll(elements =>
      elements.map(element => {
        const { x, y, height, width } = element.getBoundingClientRect();
        return { x: x + width / 2, y, height };
      }),
    );
    for (const [index, box] of boxes.entries()) {
      expect(Math.abs(box.x - boxes[0].x)).toBeLessThanOrEqual(1);
      if (index) expect(box.y).toBeGreaterThanOrEqual(boxes[index - 1].y + boxes[index - 1].height);
    }
  };
  await assertVertical();
  await page.setViewportSize({ width: 360, height: 740 });
  await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });
  await expect(root.locator('.zd-fab-trigger')).toHaveCSS('transition-duration', '0s');
  await assertVertical();
});
