import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/__zordon-tests__/browser');
  await expect(page.getByRole('heading', { name: 'Browser integration fixture' })).toBeVisible();
});

test('boots the Angular fixture without page errors', async ({ page }) => {
  const pageErrors: Error[] = [];
  page.on('pageerror', error => pageErrors.push(error));

  await page.reload();
  await expect(page.getByTestId('browser-test-fixture')).toBeVisible();
  expect(pageErrors).toEqual([]);
});

test('moves focus in deterministic keyboard order', async ({ page }) => {
  const first = page.getByTestId('focus-first');
  const second = page.getByTestId('focus-second');

  await first.click();
  await expect(first).toBeFocused();

  await page.keyboard.press('Tab');
  await expect(second).toBeFocused();
  expect(await second.evaluate(element => element.matches(':focus-visible'))).toBe(true);
});

test('captures, wraps, monitors, and restores focus with supported CDK primitives', async ({
  page,
}) => {
  const trigger = page.getByRole('button', { name: 'Open focus region' });
  const region = page.getByTestId('focus-trap-region');
  const first = page.getByTestId('focus-trap-first');
  const initial = page.getByTestId('focus-trap-initial');
  const add = page.getByTestId('focus-trap-add');
  const dynamic = page.getByTestId('focus-trap-dynamic');
  const disable = page.getByTestId('focus-trap-disable');
  const close = page.getByTestId('focus-trap-close');

  await trigger.click();
  await expect(region).toBeVisible();
  await expect(initial).toBeFocused();
  await expect(initial).toHaveClass(/cdk-program-focused/);

  await page.keyboard.press('Shift+Tab');
  await expect(first).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(close).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(first).toBeFocused();

  await initial.click();
  await expect(initial).toHaveClass(/cdk-mouse-focused/);

  await add.click();
  await expect(dynamic).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(dynamic).toBeFocused();

  await disable.click();
  await expect(dynamic).toBeDisabled();
  await add.focus();
  await page.keyboard.press('Tab');
  await expect(disable).toBeFocused();

  await close.click();
  await expect(region).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByLabel('Test name')).toBeFocused();
});

test('closes an overlay with Escape and restores trigger focus', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'Open test dialog' });
  const dialog = page.getByRole('dialog', { name: 'Test dialog' });

  await trigger.click();
  await expect(dialog).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close test dialog' })).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test('lets a native dialog cancel request be prevented before controlled close', async ({
  page,
}) => {
  const trigger = page.getByRole('button', { name: 'Open test dialog' });
  const dialog = page.getByRole('dialog', { name: 'Test dialog' });

  await trigger.click();
  await page.getByRole('button', { name: 'Block next Escape' }).click();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test('classifies CDK outside and Escape events without suppressing the outside action', async ({
  page,
}) => {
  const trigger = page.getByRole('button', { name: 'Open dismissal fixture' });
  const outside = page.getByRole('button', { name: 'Outside action' });
  const overlay = page.getByTestId('dismissal-overlay');
  const inside = page.getByTestId('dismissal-inside');
  const veto = page.getByTestId('dismissal-veto');

  await trigger.click();
  await expect(overlay).toBeVisible();
  await inside.click();
  await expect(overlay).toBeVisible();

  await trigger.click();
  await expect(overlay).toBeVisible();
  await veto.focus();
  await page.keyboard.press('Escape');
  await expect(overlay).toBeVisible();
  await page.keyboard.press('Shift+Escape');
  await expect(overlay).toBeVisible();
  await veto.evaluate(element => {
    element.dispatchEvent(
      new KeyboardEvent('keydown', { bubbles: true, key: 'Escape', repeat: true }),
    );
    element.dispatchEvent(
      new KeyboardEvent('keydown', { bubbles: true, isComposing: true, key: 'Escape' }),
    );
  });
  await expect(overlay).toBeVisible();

  await inside.focus();
  await page.keyboard.press('Escape');
  await expect(overlay).not.toBeVisible();

  await trigger.click();
  await inside.dispatchEvent('pointerdown');
  await outside.dispatchEvent('click');
  await expect(overlay).toBeVisible();
  await expect(page.getByTestId('outside-action-count')).toHaveText('1');
  await expect(page.getByTestId('outside-dismissal-count')).toHaveText('0');

  await outside.click();
  await expect(overlay).not.toBeVisible();
  await expect(page.getByTestId('outside-action-count')).toHaveText('2');
  await expect(page.getByTestId('outside-dismissal-count')).toHaveText('1');

  await outside.click();
  await expect(page.getByTestId('outside-action-count')).toHaveText('3');
  await expect(page.getByTestId('outside-dismissal-count')).toHaveText('1');
});

test('positions, repositions, themes, hosts, and cleans up the private overlay foundation', async ({
  page,
}) => {
  const origin = page.getByTestId('positioned-overlay-origin');
  const panel = page.getByTestId('positioned-overlay-panel');

  await origin.click();
  await expect(panel).toBeVisible();
  const pane = page.locator('.cdk-overlay-pane').filter({ has: panel });
  await expect(pane).toHaveClass(/zd-test-above/);
  await expect(pane).toHaveAttribute('data-theme', 'cupcake');
  await expect(pane.locator('xpath=..')).toHaveAttribute('dir', 'ltr');
  await expect(page.getByTestId('positioned-overlay-direction')).toHaveText('ltr');
  const initial = await pane.boundingBox();
  const originBox = await origin.boundingBox();
  expect(initial).not.toBeNull();
  expect(originBox).not.toBeNull();
  expect(initial!.y + initial!.height).toBeLessThanOrEqual(originBox!.y + 1);
  expect(initial!.y).toBeGreaterThanOrEqual(8);
  expect(Math.abs(initial!.x - originBox!.x)).toBeLessThanOrEqual(1);
  await expect(page.locator('.cdk-overlay-backdrop')).toHaveCount(1);

  await page
    .getByTestId('toggle-positioned-direction')
    .evaluate((element: HTMLElement) => element.click());
  await expect(pane.locator('xpath=..')).toHaveAttribute('dir', 'rtl');
  await expect(page.getByTestId('positioned-overlay-direction')).toHaveText('rtl');
  await expect
    .poll(async () => {
      const paneBox = await pane.boundingBox();
      const triggerBox = await origin.boundingBox();
      return Math.abs(paneBox!.x + paneBox!.width - (triggerBox!.x + triggerBox!.width));
    })
    .toBeLessThanOrEqual(1);

  await origin.evaluate(element => {
    element.style.bottom = '180px';
    document.dispatchEvent(new Event('scroll', { bubbles: true }));
  });
  await expect.poll(async () => (await pane.boundingBox())?.y).toBeLessThan(initial!.y - 40);
  await expect(pane).toHaveClass(/zd-test-below/);
  const movedPane = await pane.boundingBox();
  const movedOrigin = await origin.boundingBox();
  expect(movedPane!.y).toBeGreaterThanOrEqual(movedOrigin!.y + movedOrigin!.height - 1);

  await page.keyboard.press('Escape');
  await expect(panel).not.toBeVisible();
  await expect(page.getByTestId('positioned-close-reason')).toHaveText('escape');
  await expect(page.locator('.cdk-overlay-pane').filter({ has: panel })).toHaveCount(0);

  await origin.click();
  await expect(panel).toBeVisible();
  await expect(pane.locator('xpath=..')).toHaveAttribute('dir', 'rtl');
  await page
    .getByTestId('toggle-positioned-direction')
    .evaluate((element: HTMLElement) => element.click());
  await expect(pane.locator('xpath=..')).toHaveAttribute('dir', 'ltr');
  await expect(page.getByTestId('positioned-overlay-direction')).toHaveText('ltr');
  await page.locator('.cdk-overlay-backdrop').click({ position: { x: 1, y: 1 } });
  await expect(panel).not.toBeVisible();
  await expect(page.getByTestId('positioned-close-reason')).toHaveText('backdrop');
  await expect(page.locator('.cdk-overlay-container > *')).toHaveCount(0);
});

test('keeps body scroll locked until the final blocking overlay closes and restores page state', async ({
  page,
}) => {
  await page.evaluate(() => {
    document.documentElement.classList.add('consumer-root-class');
    window.scrollTo(0, 300);
    document.documentElement.style.scrollBehavior = 'smooth';
    document.body.style.scrollBehavior = 'smooth';
  });
  const initialScroll = await page.evaluate(() => ({ x: scrollX, y: scrollY }));
  const fixedBefore = await page.getByTestId('scroll-lock-fixed-reference').boundingBox();
  const centeredBefore = await page.getByTestId('scroll-lock-centered-reference').boundingBox();

  await page
    .getByTestId('open-scroll-lock-first')
    .evaluate((element: HTMLElement) => element.click());
  await expect(page.locator('html')).toHaveClass(/cdk-global-scrollblock/);
  const lockedScroll = await page.evaluate(() => ({ x: scrollX, y: scrollY }));
  await page
    .getByTestId('open-scroll-lock-second')
    .evaluate((element: HTMLElement) => element.click());
  await expect(page.getByTestId('scroll-lock-panel')).toHaveCount(2);
  await page.mouse.wheel(0, 500);
  expect(await page.evaluate(() => ({ x: scrollX, y: scrollY }))).toEqual(lockedScroll);

  await page
    .getByTestId('close-scroll-lock-first')
    .evaluate((element: HTMLElement) => element.click());
  await expect(page.locator('html')).toHaveClass(/cdk-global-scrollblock/);
  await expect(page.getByTestId('scroll-lock-panel')).toHaveCount(1);
  await page.getByTestId('scroll-lock-panel').hover();
  await page.mouse.wheel(0, 300);
  await expect
    .poll(() => page.getByTestId('scroll-lock-panel').evaluate(element => element.scrollTop))
    .toBeGreaterThan(0);
  expect(await page.evaluate(() => ({ x: scrollX, y: scrollY }))).toEqual(lockedScroll);

  await page
    .getByTestId('close-scroll-lock-last')
    .evaluate((element: HTMLElement) => element.click());
  await expect(page.locator('html')).not.toHaveClass(/cdk-global-scrollblock/);
  expect(await page.evaluate(() => ({ x: scrollX, y: scrollY }))).toEqual(initialScroll);
  await expect(page.locator('html')).toHaveClass(/consumer-root-class/);
  expect(await page.evaluate(() => document.documentElement.style.scrollBehavior)).toBe('smooth');
  expect(await page.evaluate(() => document.body.style.scrollBehavior)).toBe('smooth');
  const fixedAfter = await page.getByTestId('scroll-lock-fixed-reference').boundingBox();
  const centeredAfter = await page.getByTestId('scroll-lock-centered-reference').boundingBox();
  expect(Math.abs(fixedAfter!.x - fixedBefore!.x)).toBeLessThanOrEqual(1);
  expect(Math.abs(centeredAfter!.x - centeredBefore!.x)).toBeLessThanOrEqual(1);
  await expect(page.locator('.cdk-overlay-container > *')).toHaveCount(0);
});

test('honors native form validation and submits a value', async ({ page }) => {
  const input = page.getByLabel('Test name');
  const submit = page.getByRole('button', { name: 'Submit test form' });

  await submit.click();
  await expect(input).toBeFocused();
  expect(await input.evaluate((element: HTMLInputElement) => element.validity.valueMissing)).toBe(
    true,
  );

  await input.fill('Zordon');
  await submit.click();
  await expect(page.getByTestId('submitted-name')).toHaveText('Zordon');
});

test('applies compiled daisyUI variables to nested and per-element theme scopes', async ({
  page,
}) => {
  const outer = page.getByTestId('theme-contract');
  const nested = page.getByTestId('nested-theme');
  const component = page.getByTestId('component-theme');

  await expect(outer).toHaveAttribute('data-theme', 'corporate');
  await expect(nested).toHaveAttribute('data-theme', 'cupcake');
  await expect(component).toHaveAttribute('data-theme', 'zordon-visual');

  const radii = await Promise.all(
    [outer, nested, component].map(locator =>
      locator.evaluate(element =>
        getComputedStyle(element).getPropertyValue('--radius-box').trim(),
      ),
    ),
  );
  const [outerRadius, nestedRadius, customRadius] = radii;
  expect(nestedRadius).not.toBe(outerRadius);
  expect(customRadius).toBe('1.25rem');

  await page
    .getByTestId('clear-nested-theme')
    .evaluate((element: HTMLButtonElement) => element.click());
  await expect(nested).not.toHaveAttribute('data-theme');
  await expect
    .poll(() =>
      nested.evaluate(element => getComputedStyle(element).getPropertyValue('--radius-box').trim()),
    )
    .toBe(outerRadius);
});

test('uses preferred dark only when an explicit theme boundary is absent', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.evaluate(() => document.documentElement.removeAttribute('data-theme'));
  await expect(page.locator('html')).not.toHaveAttribute('data-theme');
  const systemScope = page.getByTestId('system-theme');

  const readBaseColor = () =>
    systemScope.evaluate(element =>
      getComputedStyle(element).getPropertyValue('--color-base-100').trim(),
    );
  const preferredDarkColor = await readBaseColor();

  await page
    .getByTestId('set-system-light')
    .evaluate((element: HTMLButtonElement) => element.click());
  await expect(systemScope).toHaveAttribute('data-theme', 'light');
  const explicitLightColor = await readBaseColor();
  expect(explicitLightColor).not.toBe(preferredDarkColor);

  await page
    .getByTestId('clear-system-theme')
    .evaluate((element: HTMLButtonElement) => element.click());
  await expect(systemScope).not.toHaveAttribute('data-theme');
  await expect.poll(readBaseColor).toBe(preferredDarkColor);
});
