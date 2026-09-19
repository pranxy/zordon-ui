import { expect, test } from './fixtures/accessibility';
test('Toast queues, promotes, deduplicates and announces visible messages without stealing focus', async ({
  page,
  runAxeScan,
}) => {
  await page.goto('/__zordon-tests__/toast');
  const outlet = page.getByRole('region', { name: 'Notifications' });
  await expect(outlet.getByRole('status')).toHaveText('');
  await page.getByRole('button', { name: 'Queue five' }).click();
  await expect(page.getByTestId('toast-count')).toHaveText('Stored: 5');
  await expect(outlet.locator('zd-alert')).toHaveCount(3);
  await expect(page.getByRole('button', { name: 'Queue five' })).toBeFocused();
  await expect(outlet.getByRole('status')).toContainText('Queued 3');
  await expect(outlet.getByRole('status')).not.toContainText('Queued 4');
  await outlet.getByRole('button', { name: 'Dismiss notification' }).first().click();
  await expect(outlet.locator('zd-alert').last()).toContainText('Queued 4');
  await expect(outlet.getByRole('status')).toHaveText('Queued 4');
  await expect(page.getByRole('button', { name: 'Queue five' })).toBeFocused();
  await page.getByRole('button', { name: 'Clear notices' }).click();
  await page.getByRole('button', { name: 'Duplicate notice' }).click();
  await page.getByRole('button', { name: 'Duplicate notice' }).click();
  await expect(page.getByTestId('toast-count')).toHaveText('Stored: 1');
  expect((await runAxeScan()).violations).toEqual([]);
});
test('Toast timeout consumes visible active time and pauses on hover and focus', async ({
  page,
}) => {
  await page.goto('/__zordon-tests__/toast');
  await page.getByRole('button', { name: 'Clear notices' }).click();
  await page.clock.install();
  await page.getByRole('button', { name: 'Timed notice' }).click();
  const row = page.locator('zd-alert');
  await expect(row).toBeVisible();
  await row.hover();
  await page.clock.runFor(2000);
  await expect(row).toBeVisible();
  await row.getByRole('button', { name: 'Dismiss notification' }).focus();
  await page.mouse.move(0, 0);
  await page.clock.runFor(2000);
  await expect(row).toBeVisible();
  await page.getByRole('button', { name: 'Timed notice' }).focus();
  await page.clock.runFor(900);
  await expect(row).toHaveCount(0);
});
test('Toast custom content and actions retain one announcement path and report recoverable failure', async ({
  page,
  runAxeScan,
}) => {
  await page.goto('/__zordon-tests__/toast');
  await page.getByRole('button', { name: 'Show styled' }).click();
  await expect(page.locator('zd-alert strong')).toHaveText('Scheduled job');
  await expect(page.locator('zd-alert[role]')).toHaveCount(0);
  await page.getByRole('button', { name: 'Undo', exact: true }).click();
  await expect(page.getByTestId('toast-actions')).toHaveText('Actions: 1');
  await expect(page.locator('zd-alert')).toHaveCount(2);
  await expect(page.getByRole('button', { name: 'Show styled' })).toBeFocused();
  await page.getByRole('button', { name: 'Clear notices' }).click();
  await page.getByRole('button', { name: 'Fail action' }).click();
  await page.getByRole('button', { name: 'Retry request', exact: true }).click();
  await expect(page.getByRole('alert')).toHaveText('Request failed; retry is available');
  await expect(page.getByRole('button', { name: 'Retry request', exact: true })).toBeFocused();
  expect((await runAxeScan()).violations).toEqual([]);
});
test('Toast promise flows update in place and never resurrect dismissed or destroyed content', async ({
  page,
}) => {
  await page.goto('/__zordon-tests__/toast');
  await page.getByRole('button', { name: 'Clear notices' }).click();
  await page.getByRole('button', { name: 'Start task' }).click();
  const row = page.locator('zd-alert');
  const id = await row.getAttribute('id');
  await page.getByRole('button', { name: 'Resolve task' }).click();
  await expect(row).toContainText('Task complete: 42');
  await expect(row).toHaveAttribute('id', id!);
  await expect(page.getByTestId('toast-result')).toHaveText('Result: 42');
  await page.getByRole('button', { name: 'Clear notices' }).click();
  await page.getByRole('button', { name: 'Start task' }).click();
  await page.getByRole('button', { name: 'Reject task' }).click();
  await expect(page.getByRole('alert')).toHaveText('Task failed');
  await page.getByRole('button', { name: 'Clear notices' }).click();
  await page.getByRole('button', { name: 'Start task' }).click();
  await row.getByRole('button', { name: 'Dismiss notification' }).click();
  await page.getByRole('button', { name: 'Resolve task' }).click();
  await expect(row).toHaveCount(0);
  await page.getByRole('button', { name: 'Start task' }).click();
  await page.getByRole('button', { name: 'Toggle outlet' }).click();
  await page.getByRole('button', { name: 'Resolve task' }).click();
  await page.getByRole('button', { name: 'Toggle outlet' }).click();
  await expect(row).toHaveCount(0);
});
test('Toast positions all nine stacks using logical edges in LTR and RTL', async ({
  page,
  runAxeScan,
}) => {
  test.setTimeout(90000);
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/__zordon-tests__/toast');
  for (const direction of ['ltr', 'rtl']) {
    if (direction === 'rtl') await page.getByRole('button', { name: 'Toggle direction' }).click();
    for (const block of ['top', 'middle', 'bottom'])
      for (const inline of ['start', 'center', 'end']) {
        // Center stacks can cover this fixture control; exercise its native keyboard activation.
        await page.getByRole('button', { name: 'Clear notices' }).focus();
        await page.keyboard.press('Enter');
        await page.getByRole('combobox', { name: 'Position' }).selectOption(`${block}-${inline}`);
        await page.getByRole('button', { name: 'Show notice', exact: true }).click();
        const stack = page.locator('.zd-toast-stack');
        await expect(stack).toBeVisible();
        const box = (await stack.boundingBox())!;
        const expectedX =
          inline === 'center'
            ? (1280 - box.width) / 2
            : (inline === 'start') === (direction === 'ltr')
              ? 16
              : 1280 - box.width - 16;
        const expectedY =
          block === 'top'
            ? 16
            : block === 'middle'
              ? (900 - box.height) / 2
              : 900 - box.height - 16;
        expect(Math.abs(box.x - expectedX)).toBeLessThan(2);
        expect(Math.abs(box.y - expectedY)).toBeLessThan(2);
      }
  }
  await page.setViewportSize({ width: 360, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('zd-alert')).toHaveCSS('animation-name', 'none');
  expect((await page.locator('.zd-toast-stack').boundingBox())!.width).toBeLessThanOrEqual(328);
  await page.emulateMedia({ reducedMotion: 'no-preference', forcedColors: 'active' });
  await expect(page.locator('zd-alert')).toHaveCSS('animation-name', 'none');
  expect((await runAxeScan()).violations).toEqual([]);
});
