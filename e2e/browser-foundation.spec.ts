import { expect, test } from '@playwright/test';

import {
  applyZordonDocumentEnvironment,
  prepareZordonTestEnvironment,
  ZORDON_TEST_MEDIA_PROFILES,
} from './fixtures/environment';

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

test('configures deterministic theme, direction, viewport, motion, and forced-colors profiles', async ({
  page,
}) => {
  await prepareZordonTestEnvironment(page, 'mobile', {
    ...ZORDON_TEST_MEDIA_PROFILES.forcedColors,
    colorScheme: 'dark',
  });
  await page.goto('/__zordon-tests__/browser');
  await applyZordonDocumentEnvironment(page, { direction: 'rtl', theme: 'corporate' });

  await expect(page.getByRole('heading', { name: 'Browser integration fixture' })).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'corporate');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  expect(
    await page.evaluate(() => ({
      colorScheme: matchMedia('(prefers-color-scheme: dark)').matches,
      direction: getComputedStyle(document.documentElement).direction,
      forcedColors: matchMedia('(forced-colors: active)').matches,
      reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
      viewport: { height: innerHeight, width: innerWidth },
    })),
  ).toEqual({
    colorScheme: true,
    direction: 'rtl',
    forcedColors: true,
    reducedMotion: true,
    viewport: { height: 844, width: 390 },
  });
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

test('keeps native Button hosts semantic while guarding only loading and disabled-link activation', async ({
  page,
}) => {
  const pressed = page.getByTestId('button-pressed');
  const loading = page.getByTestId('button-loading');
  const loadingToggle = page.getByTestId('button-toggle-loading');
  const disabledLink = page.getByTestId('button-disabled-link');
  const buttonForm = page.getByTestId('button-form');
  const submit = page.getByTestId('button-submit');
  const reset = page.getByTestId('button-reset');
  const nativeValue = page.getByTestId('button-native-value');

  await expect(pressed).toHaveAttribute('aria-pressed', 'false');
  await pressed.click();
  await expect(pressed).toHaveAttribute('aria-pressed', 'true');
  await expect(pressed).toBeFocused();

  await expect(disabledLink).toHaveAttribute('href', '#button-link-target');
  await expect(disabledLink).toHaveAttribute('aria-disabled', 'true');
  await disabledLink.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('button-link-clicks')).toHaveText('Link clicks: 1');
  await expect(page).not.toHaveURL(/#button-link-target$/);

  await loadingToggle.click();
  await expect(loading).toHaveAttribute('aria-disabled', 'true');
  await expect(loading).toHaveClass(/btn-disabled/);
  await loading.evaluate(element => {
    element.addEventListener(
      'click',
      event =>
        ((
          window as Window & { __zordonButtonLoadingDefaultPrevented?: boolean }
        ).__zordonButtonLoadingDefaultPrevented = event.defaultPrevented),
      { once: true },
    );
  });
  await loading.focus();
  await loading.evaluate((element: HTMLButtonElement) => element.click());
  await expect(loading).toBeFocused();
  await expect(page.getByTestId('button-loading-clicks')).toHaveText('Loading clicks: 1');
  expect(
    await page.evaluate(
      () =>
        (window as Window & { __zordonButtonLoadingDefaultPrevented?: boolean })
          .__zordonButtonLoadingDefaultPrevented,
    ),
  ).toBe(true);

  await submit.click();
  await expect(page.getByTestId('button-submit-count')).toHaveText('Button submits: 1');
  await buttonForm.evaluate((element: HTMLFormElement) => element.requestSubmit());
  await expect(page.getByTestId('button-submit-count')).toHaveText('Button submits: 2');

  await nativeValue.fill('changed');
  await reset.click();
  await expect(nativeValue).toHaveValue('hydrated');
});

test('keeps native Link navigation, Router current-route state, and unavailable guarding separate', async ({
  page,
}) => {
  const nativeLink = page.getByTestId('link-native');
  const routerLink = page.getByTestId('link-router');
  const disabledLink = page.getByTestId('link-disabled');
  const toggle = page.getByTestId('link-toggle');

  await expect(nativeLink).toHaveClass(/link/);
  await expect(nativeLink).toHaveClass(/link-hover/);
  await expect(nativeLink).toHaveAttribute('href', '#link-target');
  await expect(routerLink).toHaveClass(/is-current/);
  await expect(routerLink).toHaveAttribute('aria-current', 'page');
  await expect(page.getByTestId('link-external')).toHaveAttribute('target', '_blank');
  await expect(page.getByTestId('link-external')).toHaveAttribute('rel', 'noopener noreferrer');

  await expect(disabledLink).toHaveAttribute('aria-disabled', 'true');
  await disabledLink.focus();
  await page.keyboard.press('Enter');
  await expect(disabledLink).toBeFocused();
  await expect(page.getByTestId('link-clicks')).toHaveText('Link clicks: 1');
  await expect(page).not.toHaveURL(/#link-target$/);

  await toggle.click();
  await expect(disabledLink).not.toHaveAttribute('aria-disabled');
  await disabledLink.click();
  await expect(page).toHaveURL(/#link-target$/);
});

test('removes decorative motion without delaying the semantic state change', async ({ page }) => {
  const toggle = page.getByRole('button', { name: 'Toggle motion probe' });
  const probe = page.getByTestId('motion-probe');

  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await probe.evaluate(element => {
    element.addEventListener(
      'transitionrun',
      () => element.setAttribute('data-transition-running', 'true'),
      { once: true },
    );
  });
  await toggle.click();

  const immediateState = await page.evaluate(() => {
    const toggleElement = document.querySelector('[data-testid="motion-contract"] button');
    const probeElement = document.querySelector('[data-testid="motion-probe"]');

    return {
      active: probeElement?.getAttribute('data-active'),
      pressed: toggleElement?.getAttribute('aria-pressed'),
      text: probeElement?.textContent?.trim(),
    };
  });
  expect(immediateState).toEqual({
    active: 'true',
    pressed: 'true',
    text: 'Motion is active',
  });
  await expect(probe).toHaveAttribute('data-transition-running', 'true');
  expect(
    await probe.evaluate(element =>
      element.getAnimations().some(animation => animation.playState === 'running'),
    ),
  ).toBe(true);
  expect(await probe.evaluate(element => getComputedStyle(element).transitionDuration)).toBe(
    '0.2s, 0.2s',
  );
  expect(await probe.evaluate(element => getComputedStyle(element).transform)).not.toBe('none');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(
    true,
  );
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await expect(probe).toHaveAttribute('data-active', 'true');
  await expect(probe).toContainText('Motion is active');
  expect(await probe.evaluate(element => getComputedStyle(element).transitionDuration)).toBe('0s');
  expect(await probe.evaluate(element => getComputedStyle(element).transform)).toBe('none');

  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await expect(probe).toContainText('Motion is inactive');
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

test('accepts one async action while pending and keeps retry, failure, and disabled ownership distinct', async ({
  page,
}) => {
  const start = page.getByTestId('async-action-start');
  const starts = page.getByTestId('async-action-starts');
  const status = page.getByTestId('async-action-status');

  await start.focus();
  await page
    .getByTestId('async-action-start-twice')
    .evaluate((element: HTMLButtonElement) => element.click());
  await expect(start).toBeFocused();
  await expect(start).toHaveAttribute('aria-disabled', 'true');
  await expect(starts).toHaveText('Accepted actions: 1');
  await expect(status).toHaveText('Saving request 1');

  await start.dispatchEvent('click');
  await page.keyboard.press('Enter');
  await expect(starts).toHaveText('Accepted actions: 1');

  await page.getByTestId('async-action-complete-oldest').click();
  await expect(status).toHaveText('Completed request 1');
  await expect(start).not.toHaveAttribute('aria-disabled');

  await start.click();
  await expect(starts).toHaveText('Accepted actions: 2');
  await page.getByTestId('async-action-fail').click();
  await expect(status).toHaveText('Request 2 failed');
  await expect(start).not.toHaveAttribute('aria-disabled');

  await start.click();
  await page.getByTestId('async-action-disable').click();
  await expect(start).toBeDisabled();
  await page.getByTestId('async-action-complete-oldest').click();
  await expect(status).toHaveText('Completed request 3');
  await expect(start).toBeDisabled();
});

test('separates cooperative cancellation from stale completion and stale finally handling', async ({
  page,
}) => {
  const start = page.getByTestId('async-action-start');
  const replace = page.getByTestId('async-action-replace');
  const status = page.getByTestId('async-action-status');
  const starts = page.getByTestId('async-action-starts');
  const aborts = page.getByTestId('async-action-aborts');

  await start.click();
  await page.getByTestId('async-action-cancel').click();
  await expect(status).toHaveText('Cancelled request 1');
  await expect(aborts).toHaveText('Abort requests: 1');
  await expect(start).not.toHaveAttribute('aria-disabled');

  await start.click();
  await replace.click();
  await expect(starts).toHaveText('Accepted actions: 3');
  await expect(aborts).toHaveText('Abort requests: 2');
  await expect(status).toHaveText('Saving request 3');

  await page.getByTestId('async-action-complete-oldest').click();
  await expect(status).toHaveText('Saving request 3');
  await expect(start).toHaveAttribute('aria-disabled', 'true');

  await page.getByTestId('async-action-complete-oldest').click();
  await expect(status).toHaveText('Completed request 3');
  await expect(start).not.toHaveAttribute('aria-disabled');
});

test('aborts owned async work and releases the probe on destruction', async ({ page }) => {
  const pageErrors: Error[] = [];
  page.on('pageerror', error => pageErrors.push(error));
  await page.getByTestId('async-action-start').click();
  await expect(page.getByTestId('async-action-status')).toHaveText('Saving request 1');
  await page.getByTestId('async-action-replace').click();
  await expect(page.getByTestId('async-action-aborts')).toHaveText('Abort requests: 1');
  await expect(page.getByTestId('async-action-status')).toHaveText('Saving request 2');

  await page.getByTestId('remove-async-action-probe').click();
  await expect(page.getByTestId('async-action-start')).toHaveCount(0);
  await expect(page.getByTestId('async-action-cleanup-aborts')).toHaveText('Cleanup aborts: 1');

  await page.getByTestId('restore-async-action-probe').click();
  await expect(page.getByTestId('async-action-status')).toHaveText('Action idle');
  await expect(page.getByTestId('async-action-starts')).toHaveText('Accepted actions: 0');
  expect(pageErrors).toEqual([]);
});

test('guards async work at the form submit boundary while preserving submitted data', async ({
  page,
}) => {
  const input = page.getByLabel('Async form value');
  const submit = page.getByTestId('async-form-submit');
  const starts = page.getByTestId('async-form-starts');

  await input.fill('consumer-value');
  await page
    .getByTestId('async-form-submit-twice')
    .evaluate((element: HTMLButtonElement) => element.click());
  await expect(submit).toHaveAttribute('aria-disabled', 'true');
  await expect(starts).toHaveText('Accepted form submits: 1');
  await expect(page.getByTestId('async-form-data')).toHaveText('Submitted value: consumer-value');
  await expect(page.getByTestId('async-form-intent')).toHaveText('Submitted intent: save');
  await expect(page.getByTestId('async-form-submitter')).toHaveText('Submitter: async-form-submit');

  await input.press('Enter');
  await submit.dispatchEvent('click');
  await expect(starts).toHaveText('Accepted form submits: 1');

  await page.getByTestId('async-form-complete').click();
  await expect(submit).not.toHaveAttribute('aria-disabled');
  await submit.click();
  await expect(starts).toHaveText('Accepted form submits: 2');
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
