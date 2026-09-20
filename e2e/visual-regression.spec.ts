import { expect, test, type Page } from '@playwright/test';

import {
  applyZordonDocumentEnvironment,
  prepareZordonTestEnvironment,
  ZORDON_TEST_MEDIA_PROFILES,
} from './fixtures/environment';
import type { ZdTestTheme } from './fixtures/environment';

test('Navbar light desktop and expanded dark RTL mobile navigation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1280, height: 1100 });
  await page.goto('/__zordon-tests__/navbar');
  await applyZordonDocumentEnvironment(page, { theme: 'light', direction: 'ltr' });
  await expect(page.getByTestId('navbar-fixture')).toHaveScreenshot('navbar--light-desktop.png');
  await page.setViewportSize({ width: 360, height: 1300 });
  await applyZordonDocumentEnvironment(page, { theme: 'dark', direction: 'rtl' });
  await page.getByRole('button', { name: 'Toggle direction' }).click();
  await expect(page.getByTestId('navbar-fixture')).toHaveScreenshot('navbar--dark-rtl-mobile.png');
});

test('Pagination light desktop and dark RTL mobile ranges', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1280, height: 1300 });
  await page.goto('/__zordon-tests__/pagination?page=5&limit=10');
  await applyZordonDocumentEnvironment(page, { theme: 'light', direction: 'ltr' });
  await expect(page.getByTestId('pagination-fixture')).toHaveScreenshot(
    'pagination--light-desktop.png',
  );
  await page.setViewportSize({ width: 360, height: 1800 });
  await applyZordonDocumentEnvironment(page, { theme: 'dark', direction: 'rtl' });
  await page.getByRole('button', { name: 'Toggle direction' }).click();
  await expect(page.getByTestId('pagination-fixture')).toHaveScreenshot(
    'pagination--dark-rtl-mobile.png',
  );
});

const fixtureSelector = '[data-testid="browser-test-fixture"]';

test('Menu native lists and Aria hierarchy in light desktop and dark RTL mobile', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1280, height: 1300 });
  await page.goto('/__zordon-tests__/menu');
  await applyZordonDocumentEnvironment(page, { theme: 'light', direction: 'ltr' });
  await page.getByRole('button', { name: 'Toggle tree group' }).click();
  await expect(page.getByTestId('menu-fixture')).toHaveScreenshot('menu--light-desktop.png');
  await page.setViewportSize({ width: 360, height: 1800 });
  await applyZordonDocumentEnvironment(page, { theme: 'dark', direction: 'rtl' });
  await page.getByRole('button', { name: 'Toggle direction' }).click();
  await expect(page.getByTestId('menu-fixture')).toHaveScreenshot('menu--dark-rtl-mobile.png');
});

test('Megamenu wide light desktop and single-column dark RTL mobile panels', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1280, height: 1000 });
  await page.goto('/__zordon-tests__/megamenu');
  await applyZordonDocumentEnvironment(page, { theme: 'light', direction: 'ltr' });
  await page.getByRole('button', { name: 'Explore', exact: true }).click();
  await expect(page.locator('zd-megamenu-panel')).toHaveScreenshot('megamenu--light-desktop.png');
  await page.keyboard.press('Escape');
  await page.setViewportSize({ width: 360, height: 1000 });
  await applyZordonDocumentEnvironment(page, { theme: 'dark', direction: 'rtl' });
  await page.getByRole('button', { name: 'Toggle direction' }).click();
  await page.getByRole('button', { name: 'Explore', exact: true }).click();
  await expect(page.locator('zd-megamenu-panel')).toHaveScreenshot('megamenu--dark-rtl-mobile.png');
});

test('Dock native destinations in light desktop and dark RTL mobile overflow', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1280, height: 1000 });
  await page.goto('/__zordon-tests__/dock');
  await applyZordonDocumentEnvironment(page, { theme: 'light', direction: 'ltr' });
  await expect(page.getByTestId('dock-fixture')).toHaveScreenshot('dock--light-desktop.png');
  await page.setViewportSize({ width: 360, height: 1200 });
  await applyZordonDocumentEnvironment(page, { theme: 'dark', direction: 'rtl' });
  await page.getByRole('button', { name: 'Toggle direction' }).click();
  await page.getByRole('button', { name: 'Toggle extra items' }).click();
  await expect(page.getByTestId('dock-fixture')).toHaveScreenshot('dock--dark-rtl-mobile.png');
});

test('Breadcrumbs collapsed navigation in light desktop and dark RTL mobile', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1280, height: 1000 });
  await page.goto('/__zordon-tests__/breadcrumbs');
  await applyZordonDocumentEnvironment(page, { theme: 'light', direction: 'ltr' });
  await page.getByRole('navigation', { name: 'Workspace path' }).locator('summary').click();
  await expect(page.getByTestId('breadcrumbs-fixture')).toHaveScreenshot(
    'breadcrumbs--light-desktop.png',
  );
  await page.setViewportSize({ width: 360, height: 1200 });
  await applyZordonDocumentEnvironment(page, { theme: 'dark', direction: 'rtl' });
  await page.getByRole('button', { name: 'Toggle direction' }).click();
  await page.getByRole('navigation', { name: 'Workspace path' }).locator('summary').click();
  await expect(page.getByTestId('breadcrumbs-fixture')).toHaveScreenshot(
    'breadcrumbs--dark-rtl-mobile.png',
  );
});

test('Accordion grouped and native disclosure in light desktop and dark RTL mobile', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1280, height: 1800 });
  await page.goto('/__zordon-tests__/accordion');
  await applyZordonDocumentEnvironment(page, { theme: 'light', direction: 'ltr' });
  await expect(page.getByTestId('accordion-fixture')).toHaveScreenshot(
    'accordion--light-desktop.png',
  );
  await page.setViewportSize({ width: 360, height: 2200 });
  await applyZordonDocumentEnvironment(page, { theme: 'dark', direction: 'rtl' });
  await page.getByRole('button', { name: 'Toggle direction' }).click();
  await page.getByRole('button', { name: 'Billing', exact: true }).click();
  await expect(page.getByTestId('accordion-fixture')).toHaveScreenshot(
    'accordion--dark-rtl-mobile.png',
  );
});

test('Toast semantic custom and action content in light desktop and dark RTL mobile', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1280, height: 1000 });
  await page.goto('/__zordon-tests__/toast');
  await applyZordonDocumentEnvironment(page, { theme: 'light', direction: 'ltr' });
  await page.getByRole('button', { name: 'Show styled' }).click();
  await expect(page.locator('.zd-toast-stack')).toHaveScreenshot('toast--light-stack.png');
  await page.setViewportSize({ width: 360, height: 1000 });
  await applyZordonDocumentEnvironment(page, { theme: 'dark', direction: 'rtl' });
  await page.getByRole('button', { name: 'Toggle direction' }).click();
  await expect(page.locator('.zd-toast-stack')).toHaveScreenshot('toast--dark-rtl-mobile.png');
});
test('Skeleton shapes and compositions in light desktop and dark RTL mobile', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1280, height: 1600 });
  await page.goto('/__zordon-tests__/skeleton');
  await applyZordonDocumentEnvironment(page, { theme: 'light', direction: 'ltr' });
  await expect(page.getByTestId('skeleton-fixture')).toHaveScreenshot(
    'skeleton--light-desktop.png',
  );
  await page.setViewportSize({ width: 360, height: 2500 });
  await applyZordonDocumentEnvironment(page, { theme: 'dark', direction: 'rtl' });
  await page.getByRole('button', { name: 'Toggle direction' }).click();
  await expect(page.getByTestId('skeleton-fixture')).toHaveScreenshot(
    'skeleton--dark-rtl-mobile.png',
  );
});
test('Radial Progress values, sizes and colors in light desktop and dark RTL mobile', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1280, height: 1600 });
  await page.goto('/__zordon-tests__/radial-progress');
  await applyZordonDocumentEnvironment(page, { theme: 'light', direction: 'ltr' });
  await expect(page.getByTestId('radial-fixture')).toHaveScreenshot(
    'radial-progress--light-desktop.png',
  );
  await page.setViewportSize({ width: 360, height: 2500 });
  await applyZordonDocumentEnvironment(page, { theme: 'dark', direction: 'rtl' });
  await page.getByRole('button', { name: 'Toggle direction' }).click();
  await expect(page.getByTestId('radial-fixture')).toHaveScreenshot(
    'radial-progress--dark-rtl-mobile.png',
  );
});
test('Progress native values and buffers in light desktop and dark RTL mobile', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1280, height: 1500 });
  await page.goto('/__zordon-tests__/progress');
  await applyZordonDocumentEnvironment(page, { theme: 'light', direction: 'ltr' });
  await expect(page.getByTestId('progress-fixture')).toHaveScreenshot(
    'progress--light-desktop.png',
  );
  await page.setViewportSize({ width: 360, height: 1800 });
  await applyZordonDocumentEnvironment(page, { theme: 'dark', direction: 'rtl' });
  await page.getByRole('button', { name: 'Toggle direction' }).click();
  await expect(page.getByTestId('progress-fixture')).toHaveScreenshot(
    'progress--dark-rtl-mobile.png',
  );
});
test('Loading static motion fallback in light desktop and dark RTL mobile', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1280, height: 1200 });
  await page.goto('/__zordon-tests__/loading');
  await applyZordonDocumentEnvironment(page, { theme: 'light', direction: 'ltr' });
  await expect(page.getByTestId('loading-matrix')).toHaveScreenshot(
    'loading--static-light-matrix.png',
  );
  // Fit the tall gallery so the documentation's sticky header stays outside this capture.
  await page.setViewportSize({ width: 360, height: 2400 });
  await applyZordonDocumentEnvironment(page, { theme: 'dark', direction: 'rtl' });
  await page.getByRole('button', { name: 'Toggle direction' }).click();
  await page.getByRole('button', { name: 'Start work' }).click();
  await expect(page.getByTestId('loading-delayed')).toHaveAttribute(
    'data-zd-loading-visible',
    'true',
  );
  await expect(page.getByTestId('loading-fixture')).toHaveScreenshot(
    'loading--static-dark-rtl.png',
  );
});

test('Alert semantic variants in light desktop and dark RTL mobile', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1300 });
  await page.goto('/__zordon-tests__/alert');
  await applyZordonDocumentEnvironment(page, { direction: 'ltr', theme: 'light' });
  await expect(page.getByTestId('alert-matrix')).toHaveScreenshot('alert--light-variants.png');
  await page.setViewportSize({ width: 360, height: 1000 });
  await applyZordonDocumentEnvironment(page, { direction: 'rtl', theme: 'dark' });
  await page.getByRole('button', { name: 'Toggle direction' }).click();
  await expect(page.getByTestId('alert-interactive')).toHaveScreenshot(
    'alert--dark-rtl-mobile.png',
  );
});

test('Theme Controller light controls and dark RTL mobile with isolated preview', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 1100 });
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/__zordon-tests__/theme-controller');
  await expect(page.getByTestId('theme-fixture')).toHaveAttribute('data-zd-theme-ready', 'true');
  await expect(page.getByTestId('theme-fixture')).toHaveScreenshot(
    'theme-controller--light-desktop.png',
  );
  await page.setViewportSize({ width: 360, height: 1100 });
  await page.getByRole('button', { name: 'Use dark', exact: true }).click();
  await page.getByRole('button', { name: 'Toggle direction' }).click();
  await expect(page.getByTestId('theme-fixture')).toHaveScreenshot(
    'theme-controller--dark-rtl-mobile.png',
  );
});

test('Modal native light desktop and dark RTL overlay mobile', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/__zordon-tests__/modal');
  await applyZordonDocumentEnvironment(page, { direction: 'ltr', theme: 'light' });
  await page.getByRole('button', { name: 'Open native', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveScreenshot('modal--native-light.png');
  await page.keyboard.press('Escape');
  await page.setViewportSize({ width: 360, height: 800 });
  await applyZordonDocumentEnvironment(page, { direction: 'rtl', theme: 'dark' });
  await page.getByRole('button', { name: 'Toggle direction' }).click();
  await expect(page.getByTestId('modal-fixture')).toHaveAttribute('dir', 'rtl');
  await page.getByRole('button', { name: 'Open overlay', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveScreenshot('modal--overlay-dark-rtl.png');
});

test('FAB light desktop flower and dark RTL mobile vertical fallback', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1100 });
  await page.goto('/__zordon-tests__/fab');
  await applyZordonDocumentEnvironment(page, { direction: 'ltr', theme: 'light' });
  await page.getByTestId('fab-local').locator('.zd-fab-trigger').click();
  await page.getByRole('button', { name: 'Set controlled' }).click();
  // Reopen local after the outside control, without stealing focus from an action.
  await page.getByTestId('fab-local').locator('.zd-fab-trigger').click();
  await expect(page.getByTestId('fab-flower').locator('.zd-fab-trigger')).toHaveAttribute(
    'aria-expanded',
    'true',
  );
  await expect(page.getByTestId('fab-examples')).toHaveScreenshot('fab--light-desktop.png');
  await page.setViewportSize({ width: 360, height: 1100 });
  await applyZordonDocumentEnvironment(page, { direction: 'rtl', theme: 'dark' });
  await page.getByRole('button', { name: 'Toggle direction' }).click();
  await expect(page.getByTestId('fab-fixture')).toHaveAttribute('dir', 'rtl');
  await page.getByTestId('fab-local').locator('.zd-fab-trigger').click();
  await expect(page.getByTestId('fab-examples')).toHaveScreenshot('fab--dark-rtl-mobile.png');
});

test('Tooltip colors in light desktop and dark RTL mobile', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1100 });
  await page.goto('/__zordon-tests__/tooltip');
  await applyZordonDocumentEnvironment(page, { direction: 'ltr', theme: 'light' });
  await expect(page.getByTestId('tooltip-plain')).toHaveAttribute('data-zd-tooltip-ready', 'true');
  await page.getByRole('button', { name: 'Show colors' }).click();
  await expect(page.getByRole('tooltip')).toHaveCount(8);
  await expect(page.getByTestId('tooltip-palette')).toHaveScreenshot('tooltip--light-colors.png');
  await page.setViewportSize({ width: 360, height: 1100 });
  await applyZordonDocumentEnvironment(page, { direction: 'rtl', theme: 'dark' });
  await page.getByRole('button', { name: 'Toggle direction' }).click();
  await expect(page.getByTestId('tooltip-palette')).toHaveScreenshot(
    'tooltip--dark-rtl-colors.png',
  );
});

test('Swap light desktop and dark RTL mobile states', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1000 });
  await page.goto('/__zordon-tests__/swap');
  await applyZordonDocumentEnvironment(page, { direction: 'ltr', theme: 'light' });
  await expect(page.getByTestId('swap-fixture')).toHaveScreenshot('swap--light-desktop.png');
  await page.getByRole('button', { name: 'Toggle mixed' }).click();
  await page.getByRole('button', { name: 'Mute', exact: true }).click();
  await page.getByRole('button', { name: 'Toggle manual' }).click();
  await page.setViewportSize({ width: 360, height: 1000 });
  await applyZordonDocumentEnvironment(page, { direction: 'rtl', theme: 'dark' });
  await expect(page.getByTestId('swap-fixture')).toHaveScreenshot('swap--dark-rtl-mobile.png');
});

test('Dropdown light menu and dark RTL nested mobile panels', async ({ page }) => {
  await page.goto('/__zordon-tests__/dropdown');
  await applyZordonDocumentEnvironment(page, { direction: 'ltr', theme: 'light' });
  await expect(page.getByTestId('dropdown-menu-root')).toHaveAttribute(
    'data-zd-dropdown-ready',
    'true',
  );
  const trigger = page.getByRole('button', { name: 'Actions', exact: true });
  await trigger.click();
  await expect(page.getByRole('menuitem', { name: 'Edit', exact: true })).toBeFocused();
  await expect(page.getByRole('menu', { name: 'Actions', exact: true })).toHaveScreenshot(
    'dropdown--light-menu.png',
  );
  await page.keyboard.press('Escape');
  await page.setViewportSize({ width: 360, height: 800 });
  await applyZordonDocumentEnvironment(page, { direction: 'rtl', theme: 'dark' });
  await page.getByRole('button', { name: 'Toggle direction', exact: true }).click();
  await trigger.click();
  await expect(page.getByRole('menuitem', { name: 'Edit', exact: true })).toBeFocused();
  await page.keyboard.press('End');
  await page.keyboard.press('ArrowLeft');
  await expect(page.getByRole('menuitem', { name: 'Archive', exact: true })).toBeFocused();
  await expect(page).toHaveScreenshot('dropdown--dark-rtl-nested-mobile.png');
});

test('Calendar light desktop, dark RTL mobile, and popup', async ({ page }) => {
  await page.goto('/__zordon-tests__/calendar');
  await applyZordonDocumentEnvironment(page, { direction: 'ltr', theme: 'light' });
  await expect(page.getByTestId('calendar-single')).toHaveScreenshot('calendar--light-desktop.png');
  await page.setViewportSize({ width: 360, height: 800 });
  await applyZordonDocumentEnvironment(page, { direction: 'rtl', theme: 'dark' });
  await page.getByRole('button', { name: 'Toggle calendar direction' }).click();
  await expect(page.getByTestId('calendar-range')).toHaveScreenshot(
    'calendar--dark-rtl-mobile.png',
  );
  await page.getByRole('button', { name: 'Departure: Choose date' }).click();
  await expect(page.getByRole('dialog')).toHaveScreenshot('calendar--popup.png');
});

const desktopThemes = [
  ['light', 'light-desktop.png'],
  ['dark', 'dark-desktop.png'],
  ['corporate', 'corporate-low-radius-desktop.png'],
  ['cupcake', 'cupcake-high-radius-desktop.png'],
  ['zordon-visual', 'consumer-theme-desktop.png'],
] as const;

const mobileThemes = [
  ['light', 'light-mobile.png'],
  ['dark', 'dark-mobile.png'],
] as const;

async function prepareFixture(page: Page, theme: ZdTestTheme): Promise<void> {
  await page.goto('/__zordon-tests__/browser');
  await applyZordonDocumentEnvironment(page, { direction: 'ltr', theme });
  await page.addStyleTag({
    content: `
      ${fixtureSelector} {
        display: block;
        min-width: 0;
        padding: 24px;
        background: var(--color-base-100);
        color: var(--color-base-content);
        font-family: Arial, sans-serif;
      }

      ${fixtureSelector} *,
      ${fixtureSelector} *::before,
      ${fixtureSelector} *::after {
        transition-duration: 0s !important;
        animation-duration: 0s !important;
      }

      ${fixtureSelector} docs-calendar-grid-probe,
      ${fixtureSelector} section:has(#dismissal-heading),
      ${fixtureSelector} section:has(#positioning-heading),
      ${fixtureSelector} section:has(#scroll-lock-heading),
      ${fixtureSelector} section:has(#focus-trap-heading),
      ${fixtureSelector} section:has(#button-heading),
      ${fixtureSelector} section:has(#carousel-heading),
      ${fixtureSelector} section:has(#collapse-heading),
      ${fixtureSelector} section:has(#kbd-heading),
      ${fixtureSelector} section:has(#status-heading),
      ${fixtureSelector} section:has(#countdown-heading),
      ${fixtureSelector} section:has(#hover-3d-heading),
      ${fixtureSelector} section:has(#hover-gallery-heading),
      ${fixtureSelector} section:has(#list-heading),
      ${fixtureSelector} section:has(#table-heading),
      ${fixtureSelector} section:has(#text-rotate-heading),
      ${fixtureSelector} section:has(#timeline-heading),
      ${fixtureSelector} section:has(#stack-heading),
      ${fixtureSelector} section:has(#footer-heading),
      ${fixtureSelector} section:has(#hero-heading),
      ${fixtureSelector} section:has(#indicator-heading),
      ${fixtureSelector} section:has(#join-heading),
      ${fixtureSelector} section:has(#browser-mockup-heading),
      ${fixtureSelector} section:has(#code-mockup-heading),
      ${fixtureSelector} section:has(#stat-heading),
      ${fixtureSelector} section:has(#checkbox-heading),
      ${fixtureSelector} section:has(#radio-heading),
      ${fixtureSelector} section:has(#filter-heading),
      ${fixtureSelector} section:has(#range-heading),
      ${fixtureSelector} section:has(#rating-heading),
      ${fixtureSelector} section:has(#select-heading),
      ${fixtureSelector} section:has(#text-input-heading),
      ${fixtureSelector} section:has(#textarea-heading),
      ${fixtureSelector} section:has(#toggle-heading),
        ${fixtureSelector} section:has(#validator-heading),
        ${fixtureSelector} section:has(#otp-heading),
      ${fixtureSelector} section:has(#file-input-heading),
      ${fixtureSelector} section:has(#diff-heading),
      ${fixtureSelector} section:has(#chat-heading),
      ${fixtureSelector} section:has(#link-heading),
      ${fixtureSelector} section:has(#divider-heading),
      ${fixtureSelector} section:has(#label-heading),
      ${fixtureSelector} section:has(#fieldset-heading),
      ${fixtureSelector} [data-testid='async-action-contract'],
      ${fixtureSelector} [data-testid='motion-contract'],
      ${fixtureSelector} [data-testid='block-dialog-cancel'] {
        display: none !important;
      }
    `,
  });

  await expect(page.getByRole('heading', { name: 'Browser integration fixture' })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
}

async function expectFixtureScreenshot(page: Page, name: string): Promise<void> {
  await expect(page.locator(fixtureSelector)).toHaveScreenshot(name, {
    animations: 'disabled',
    caret: 'hide',
    maxDiffPixelRatio: 0.002,
    scale: 'css',
    threshold: 0.2,
  });
}

for (const [theme, snapshot] of desktopThemes) {
  test(`${theme} theme at the desktop breakpoint`, async ({ page }) => {
    await prepareZordonTestEnvironment(page, 'desktop', ZORDON_TEST_MEDIA_PROFILES.reducedMotion);
    await prepareFixture(page, theme);
    await expectFixtureScreenshot(page, snapshot);
  });
}

for (const [theme, snapshot] of mobileThemes) {
  test(`${theme} theme at the mobile breakpoint`, async ({ page }) => {
    await prepareZordonTestEnvironment(page, 'mobile', ZORDON_TEST_MEDIA_PROFILES.reducedMotion);
    await prepareFixture(page, theme);
    await expectFixtureScreenshot(page, snapshot);
  });
}

test('light theme with the dialog open', async ({ page }) => {
  await prepareZordonTestEnvironment(page, 'desktop', ZORDON_TEST_MEDIA_PROFILES.reducedMotion);
  await prepareFixture(page, 'light');
  await page.getByRole('button', { name: 'Open test dialog' }).click();
  await expect(page.getByRole('dialog', { name: 'Test dialog' })).toBeVisible();

  await expect(page.locator('dialog[open] .modal-box')).toHaveScreenshot(
    'light-dialog-open-desktop.png',
    {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.002,
      scale: 'css',
      threshold: 0.2,
    },
  );
});

test('Button visual boundaries in dark RTL mobile', async ({ page }) => {
  await prepareZordonTestEnvironment(page, 'mobile', ZORDON_TEST_MEDIA_PROFILES.reducedMotion);
  await prepareFixture(page, 'dark');
  await applyZordonDocumentEnvironment(page, { direction: 'rtl', theme: 'dark' });
  await page.addStyleTag({
    content: `${fixtureSelector} section:has(#button-heading) { display: grid !important; }`,
  });
  await page.getByTestId('button-toggle-loading').click();

  await expect(page.getByTestId('button-contract')).toHaveScreenshot(
    'button--guarded--dark-rtl-mobile.png',
    {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.002,
      scale: 'css',
      threshold: 0.2,
    },
  );
});

test('Link visual boundaries in dark RTL mobile', async ({ page }) => {
  await prepareZordonTestEnvironment(page, 'mobile', ZORDON_TEST_MEDIA_PROFILES.reducedMotion);
  await prepareFixture(page, 'dark');
  await applyZordonDocumentEnvironment(page, { direction: 'rtl', theme: 'dark' });
  await page.addStyleTag({
    content: `${fixtureSelector} section:has(#link-heading) { display: grid !important; }`,
  });

  await expect(page.getByTestId('link-contract')).toHaveScreenshot(
    'link--native--dark-rtl-mobile.png',
    {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.002,
      scale: 'css',
      threshold: 0.2,
    },
  );
});

test('Divider visual boundaries in dark RTL mobile', async ({ page }) => {
  await prepareZordonTestEnvironment(page, 'mobile', ZORDON_TEST_MEDIA_PROFILES.reducedMotion);
  await prepareFixture(page, 'dark');
  await applyZordonDocumentEnvironment(page, { direction: 'rtl', theme: 'dark' });
  await page.addStyleTag({
    content: `${fixtureSelector} section:has(#divider-heading) { display: grid !important; }`,
  });

  await expect(page.getByTestId('divider-contract')).toHaveScreenshot(
    'divider--native--dark-rtl-mobile.png',
    {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.002,
      scale: 'css',
      threshold: 0.2,
    },
  );
});

test('Label visual boundaries in dark RTL mobile', async ({ page }) => {
  await prepareZordonTestEnvironment(page, 'mobile', ZORDON_TEST_MEDIA_PROFILES.reducedMotion);
  await prepareFixture(page, 'dark');
  await applyZordonDocumentEnvironment(page, { direction: 'rtl', theme: 'dark' });
  await page.addStyleTag({
    content: `${fixtureSelector} section:has(#label-heading) { display: grid !important; }`,
  });
  await expect(page.getByTestId('label-contract')).toHaveScreenshot(
    'label--native--dark-rtl-mobile.png',
    {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.002,
      scale: 'css',
      threshold: 0.2,
    },
  );
});

test('Fieldset visual boundaries in dark RTL mobile', async ({ page }) => {
  await prepareZordonTestEnvironment(page, 'mobile', ZORDON_TEST_MEDIA_PROFILES.reducedMotion);
  await prepareFixture(page, 'dark');
  await applyZordonDocumentEnvironment(page, { direction: 'rtl', theme: 'dark' });
  await page.addStyleTag({
    content: `${fixtureSelector} section:has(#fieldset-heading) { display: grid !important; }`,
  });
  await expect(page.getByTestId('fieldset-contract')).toHaveScreenshot(
    'fieldset--native--dark-rtl-mobile.png',
    {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.002,
      scale: 'css',
      threshold: 0.2,
    },
  );
});

for (const [theme, snapshot] of [
  ['light', 'fieldset--native--light-desktop.png'],
  ['zordon-visual', 'fieldset--native--consumer-theme-desktop.png'],
] as const) {
  test(`Fieldset visual boundaries in ${theme} desktop`, async ({ page }) => {
    await prepareZordonTestEnvironment(page, 'desktop', ZORDON_TEST_MEDIA_PROFILES.reducedMotion);
    await prepareFixture(page, theme);
    await page.addStyleTag({
      content: `${fixtureSelector} section:has(#fieldset-heading) { display: grid !important; }`,
    });
    await expect(page.getByTestId('fieldset-contract')).toHaveScreenshot(snapshot, {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.002,
      scale: 'css',
      threshold: 0.2,
    });
  });
}

test('Avatar visual boundaries in dark RTL mobile', async ({ page }) => {
  await prepareZordonTestEnvironment(page, 'mobile', ZORDON_TEST_MEDIA_PROFILES.reducedMotion);
  await prepareFixture(page, 'dark');
  await applyZordonDocumentEnvironment(page, { direction: 'rtl', theme: 'dark' });
  await page.addStyleTag({
    content: `${fixtureSelector} section:has(#avatar-heading) { display: grid !important; }`,
  });
  await expect(page.getByTestId('avatar-contract')).toHaveScreenshot(
    'avatar--native--dark-rtl-mobile.png',
    {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.002,
      scale: 'css',
      threshold: 0.2,
    },
  );
});

test('Aura visual boundaries in dark RTL mobile', async ({ page }) => {
  await prepareZordonTestEnvironment(page, 'mobile', ZORDON_TEST_MEDIA_PROFILES.reducedMotion);
  await prepareFixture(page, 'dark');
  await applyZordonDocumentEnvironment(page, { direction: 'rtl', theme: 'dark' });
  await page.addStyleTag({
    content: `${fixtureSelector} section:has(#aura-heading) { display: grid !important; }`,
  });
  await expect(page.getByTestId('aura-contract')).toHaveScreenshot(
    'aura--native--dark-rtl-mobile.png',
    {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.002,
      scale: 'css',
      threshold: 0.2,
    },
  );
});

test('Badge visual boundaries in dark RTL mobile', async ({ page }) => {
  await prepareZordonTestEnvironment(page, 'mobile', ZORDON_TEST_MEDIA_PROFILES.reducedMotion);
  await prepareFixture(page, 'dark');
  await applyZordonDocumentEnvironment(page, { direction: 'rtl', theme: 'dark' });
  await page.addStyleTag({
    content: `${fixtureSelector} section:has(#badge-heading) { display: grid !important; }`,
  });
  await expect(page.getByTestId('badge-contract')).toHaveScreenshot(
    'badge--native--dark-rtl-mobile.png',
    {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.002,
      scale: 'css',
      threshold: 0.2,
    },
  );
});

test('Card visual boundaries in dark RTL mobile', async ({ page }) => {
  await prepareZordonTestEnvironment(page, 'mobile', ZORDON_TEST_MEDIA_PROFILES.reducedMotion);
  await prepareFixture(page, 'dark');
  await applyZordonDocumentEnvironment(page, { direction: 'rtl', theme: 'dark' });
  await page.addStyleTag({
    content: `${fixtureSelector} section:has(#card-heading) { display: grid !important; }`,
  });
  await expect(page.getByTestId('card-contract')).toHaveScreenshot(
    'card--native--dark-rtl-mobile.png',
    {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.002,
      scale: 'css',
      threshold: 0.2,
    },
  );
});

test('Chat Bubble visual boundaries in dark RTL mobile', async ({ page }) => {
  await prepareZordonTestEnvironment(page, 'mobile', ZORDON_TEST_MEDIA_PROFILES.reducedMotion);
  await prepareFixture(page, 'dark');
  await applyZordonDocumentEnvironment(page, { direction: 'rtl', theme: 'dark' });
  await page.addStyleTag({
    content: `${fixtureSelector} section:has(#chat-heading) { display: grid !important; }`,
  });
  await expect(page.getByTestId('chat-contract')).toHaveScreenshot(
    'chat-bubble--native--dark-rtl-mobile.png',
    {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.002,
      scale: 'css',
      threshold: 0.2,
    },
  );
});

test('Carousel visual boundaries in dark RTL mobile', async ({ page }) => {
  await prepareZordonTestEnvironment(page, 'mobile', ZORDON_TEST_MEDIA_PROFILES.reducedMotion);
  await prepareFixture(page, 'dark');
  await applyZordonDocumentEnvironment(page, { direction: 'rtl', theme: 'dark' });
  await page.addStyleTag({
    content: `${fixtureSelector} section:has(#carousel-heading) { display: grid !important; }`,
  });
  await expect(page.getByTestId('carousel-contract')).toHaveScreenshot(
    'carousel--native--dark-rtl-mobile.png',
    {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.002,
      scale: 'css',
      threshold: 0.2,
    },
  );
});

test('Collapse visual boundaries in dark RTL mobile', async ({ page }) => {
  await prepareZordonTestEnvironment(page, 'mobile', ZORDON_TEST_MEDIA_PROFILES.reducedMotion);
  await prepareFixture(page, 'dark');
  await applyZordonDocumentEnvironment(page, { direction: 'rtl', theme: 'dark' });
  await page.addStyleTag({
    content: `${fixtureSelector} section:has(#collapse-heading) { display: grid !important; }`,
  });
  await expect(page.getByTestId('collapse-contract')).toHaveScreenshot(
    'collapse--native--dark-rtl-mobile.png',
    {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.002,
      scale: 'css',
      threshold: 0.2,
    },
  );
});

test('Kbd visual boundaries in dark RTL mobile', async ({ page }) => {
  await prepareZordonTestEnvironment(page, 'mobile', ZORDON_TEST_MEDIA_PROFILES.reducedMotion);
  await prepareFixture(page, 'dark');
  await applyZordonDocumentEnvironment(page, { direction: 'rtl', theme: 'dark' });
  await page.addStyleTag({
    content: `${fixtureSelector} section:has(#kbd-heading) { display: grid !important; }`,
  });
  await expect(page.getByTestId('kbd-contract')).toHaveScreenshot(
    'kbd--native--dark-rtl-mobile.png',
    {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.002,
      scale: 'css',
      threshold: 0.2,
    },
  );
});

test('Status visual boundaries in dark RTL mobile', async ({ page }) => {
  await prepareZordonTestEnvironment(page, 'mobile', ZORDON_TEST_MEDIA_PROFILES.reducedMotion);
  await prepareFixture(page, 'dark');
  await applyZordonDocumentEnvironment(page, { direction: 'rtl', theme: 'dark' });
  await page.addStyleTag({
    content: `${fixtureSelector} section:has(#status-heading) { display: grid !important; }`,
  });
  await expect(page.getByTestId('status-contract')).toHaveScreenshot(
    'status--native--dark-rtl-mobile.png',
    {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.002,
      scale: 'css',
      threshold: 0.2,
    },
  );
});

test('Countdown visual boundaries in dark RTL mobile', async ({ page }) => {
  await prepareZordonTestEnvironment(page, 'mobile', ZORDON_TEST_MEDIA_PROFILES.reducedMotion);
  await prepareFixture(page, 'dark');
  await applyZordonDocumentEnvironment(page, { direction: 'rtl', theme: 'dark' });
  await page.addStyleTag({
    content: `${fixtureSelector} section:has(#countdown-heading) { display: grid !important; }`,
  });
  await expect(page.getByTestId('countdown-contract')).toHaveScreenshot(
    'countdown--native--dark-rtl-mobile.png',
    {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.002,
      scale: 'css',
      threshold: 0.2,
    },
  );
});

test('Hover 3D visual boundaries in dark RTL mobile', async ({ page }) => {
  await prepareZordonTestEnvironment(page, 'mobile', ZORDON_TEST_MEDIA_PROFILES.reducedMotion);
  await prepareFixture(page, 'dark');
  await applyZordonDocumentEnvironment(page, { direction: 'rtl', theme: 'dark' });
  await page.addStyleTag({
    content: `${fixtureSelector} section:has(#hover-3d-heading) { display: grid !important; }`,
  });
  await expect(page.getByTestId('hover-3d-contract')).toHaveScreenshot(
    'hover-3d--native--dark-rtl-mobile.png',
    {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.002,
      scale: 'css',
      threshold: 0.2,
    },
  );
});

test('Hover Gallery visual boundaries in dark RTL mobile', async ({ page }) => {
  await prepareZordonTestEnvironment(page, 'mobile', ZORDON_TEST_MEDIA_PROFILES.reducedMotion);
  await prepareFixture(page, 'dark');
  await applyZordonDocumentEnvironment(page, { direction: 'rtl', theme: 'dark' });
  await page.addStyleTag({
    content: `${fixtureSelector} section:has(#hover-gallery-heading) { display: grid !important; }`,
  });
  await expect(page.getByTestId('hover-gallery-contract')).toHaveScreenshot(
    'hover-gallery--native--dark-rtl-mobile.png',
    {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.002,
      scale: 'css',
      threshold: 0.2,
    },
  );
});

test('List visual boundaries in dark RTL mobile', async ({ page }) => {
  await prepareZordonTestEnvironment(page, 'mobile', ZORDON_TEST_MEDIA_PROFILES.reducedMotion);
  await prepareFixture(page, 'dark');
  await applyZordonDocumentEnvironment(page, { direction: 'rtl', theme: 'dark' });
  await page.addStyleTag({
    content: `${fixtureSelector} section:has(#list-heading) { display: grid !important; }`,
  });
  await expect(page.getByTestId('list-contract')).toHaveScreenshot(
    'list--native--dark-rtl-mobile.png',
    {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.002,
      scale: 'css',
      threshold: 0.2,
    },
  );
});

test('Table visual boundaries in dark RTL mobile', async ({ page }) => {
  await prepareZordonTestEnvironment(page, 'mobile', ZORDON_TEST_MEDIA_PROFILES.reducedMotion);
  await prepareFixture(page, 'dark');
  await applyZordonDocumentEnvironment(page, { direction: 'rtl', theme: 'dark' });
  await page.addStyleTag({
    content: `${fixtureSelector} section:has(#table-heading) { display: grid !important; }`,
  });
  await expect(page.getByTestId('table-contract')).toHaveScreenshot(
    'table--native--dark-rtl-mobile.png',
    {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.002,
      scale: 'css',
      threshold: 0.2,
    },
  );
});

test('Text Rotate visual boundaries in dark RTL mobile', async ({ page }) => {
  await prepareZordonTestEnvironment(page, 'mobile', ZORDON_TEST_MEDIA_PROFILES.reducedMotion);
  await prepareFixture(page, 'dark');
  await applyZordonDocumentEnvironment(page, { direction: 'rtl', theme: 'dark' });
  await page.addStyleTag({
    content: `${fixtureSelector} section:has(#text-rotate-heading) { display: grid !important; }`,
  });
  await expect(page.getByTestId('text-rotate-contract')).toHaveScreenshot(
    'text-rotate--native--dark-rtl-mobile.png',
    {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.002,
      scale: 'css',
      threshold: 0.2,
    },
  );
});

test('Timeline visual boundaries in dark RTL mobile', async ({ page }) => {
  await prepareZordonTestEnvironment(page, 'mobile', ZORDON_TEST_MEDIA_PROFILES.reducedMotion);
  await prepareFixture(page, 'dark');
  await applyZordonDocumentEnvironment(page, { direction: 'rtl', theme: 'dark' });
  await page.addStyleTag({
    content: `${fixtureSelector} section:has(#timeline-heading) { display: grid !important; }`,
  });
  await expect(page.getByTestId('timeline-contract')).toHaveScreenshot(
    'timeline--native--dark-rtl-mobile.png',
    {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.002,
      scale: 'css',
      threshold: 0.2,
    },
  );
});

test('Stack visual boundaries in dark RTL mobile', async ({ page }) => {
  await prepareZordonTestEnvironment(page, 'mobile', ZORDON_TEST_MEDIA_PROFILES.reducedMotion);
  await prepareFixture(page, 'dark');
  await applyZordonDocumentEnvironment(page, { direction: 'rtl', theme: 'dark' });
  await page.addStyleTag({
    content: `${fixtureSelector} section:has(#stack-heading) { display: grid !important; }`,
  });
  await expect(page.getByTestId('stack-contract')).toHaveScreenshot(
    'stack--native--dark-rtl-mobile.png',
    {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.002,
      scale: 'css',
      threshold: 0.2,
    },
  );
});

test('Footer visual boundaries in dark RTL mobile', async ({ page }) => {
  await prepareZordonTestEnvironment(page, 'mobile', ZORDON_TEST_MEDIA_PROFILES.reducedMotion);
  await prepareFixture(page, 'dark');
  await applyZordonDocumentEnvironment(page, { direction: 'rtl', theme: 'dark' });
  await page.addStyleTag({
    content: `${fixtureSelector} section:has(#footer-heading) { display: grid !important; }`,
  });
  await expect(page.getByTestId('footer-contract')).toHaveScreenshot(
    'footer--native--dark-rtl-mobile.png',
    {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.002,
      scale: 'css',
      threshold: 0.2,
    },
  );
});

test('Hero visual boundaries in dark RTL mobile', async ({ page }) => {
  await prepareZordonTestEnvironment(page, 'mobile', ZORDON_TEST_MEDIA_PROFILES.reducedMotion);
  await prepareFixture(page, 'dark');
  await applyZordonDocumentEnvironment(page, { direction: 'rtl', theme: 'dark' });
  await page.addStyleTag({
    content: `${fixtureSelector} section:has(#hero-heading) { display: grid !important; }`,
  });
  await expect(page.getByTestId('hero-contract')).toHaveScreenshot(
    'hero--native--dark-rtl-mobile.png',
    {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.002,
      scale: 'css',
      threshold: 0.2,
    },
  );
});

test('Indicator visual boundaries in dark RTL mobile', async ({ page }) => {
  await prepareZordonTestEnvironment(page, 'mobile', ZORDON_TEST_MEDIA_PROFILES.reducedMotion);
  await prepareFixture(page, 'dark');
  await applyZordonDocumentEnvironment(page, { direction: 'rtl', theme: 'dark' });
  await page.addStyleTag({
    content: `${fixtureSelector} section:has(#indicator-heading) { display: grid !important; }`,
  });
  await expect(page.getByTestId('indicator-contract')).toHaveScreenshot(
    'indicator--native--dark-rtl-mobile.png',
    {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.002,
      scale: 'css',
      threshold: 0.2,
    },
  );
});

test('Join visual boundaries in dark RTL mobile', async ({ page }) => {
  await prepareZordonTestEnvironment(page, 'mobile', ZORDON_TEST_MEDIA_PROFILES.reducedMotion);
  await prepareFixture(page, 'dark');
  await applyZordonDocumentEnvironment(page, { direction: 'rtl', theme: 'dark' });
  await page.addStyleTag({
    content: `${fixtureSelector} section:has(#join-heading) { display: grid !important; }`,
  });
  await expect(page.getByTestId('join-contract')).toHaveScreenshot(
    'join--native--dark-rtl-mobile.png',
    {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.002,
      scale: 'css',
      threshold: 0.2,
    },
  );
});

test('Mask visual boundaries in dark RTL mobile', async ({ page }) => {
  await prepareZordonTestEnvironment(page, 'mobile', ZORDON_TEST_MEDIA_PROFILES.reducedMotion);
  await prepareFixture(page, 'dark');
  await applyZordonDocumentEnvironment(page, { direction: 'rtl', theme: 'dark' });
  await page.addStyleTag({
    content: `${fixtureSelector} section:has(#mask-heading) { display: grid !important; }`,
  });
  await expect(page.getByTestId('mask-contract')).toHaveScreenshot(
    'mask--native--dark-rtl-mobile.png',
    {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.002,
      scale: 'css',
      threshold: 0.2,
    },
  );
});

test('Stat visual boundaries in dark RTL mobile', async ({ page }) => {
  await prepareZordonTestEnvironment(page, 'mobile', ZORDON_TEST_MEDIA_PROFILES.reducedMotion);
  await prepareFixture(page, 'dark');
  await applyZordonDocumentEnvironment(page, { direction: 'rtl', theme: 'dark' });
  await page.addStyleTag({
    content: `${fixtureSelector} section:has(#stat-heading) { display: grid !important; }`,
  });
  await expect(page.getByTestId('stat-contract')).toHaveScreenshot(
    'stat--native--dark-rtl-mobile.png',
    {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.002,
      scale: 'css',
      threshold: 0.2,
    },
  );
});

test('Checkbox visual boundaries in dark RTL mobile', async ({ page }) => {
  await prepareZordonTestEnvironment(page, 'mobile', ZORDON_TEST_MEDIA_PROFILES.reducedMotion);
  await prepareFixture(page, 'dark');
  await applyZordonDocumentEnvironment(page, { direction: 'rtl', theme: 'dark' });
  await page.addStyleTag({
    content: `${fixtureSelector} section:has(#checkbox-heading) { display: grid !important; }`,
  });
  await expect(page.getByTestId('checkbox-contract')).toHaveScreenshot(
    'checkbox--native--dark-rtl-mobile.png',
    {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.002,
      scale: 'css',
      threshold: 0.2,
    },
  );
});

test('File Input visual boundaries in dark RTL mobile', async ({ page }) => {
  await prepareZordonTestEnvironment(page, 'mobile', ZORDON_TEST_MEDIA_PROFILES.reducedMotion);
  await prepareFixture(page, 'dark');
  await applyZordonDocumentEnvironment(page, { direction: 'rtl', theme: 'dark' });
  await page.addStyleTag({
    content: `${fixtureSelector} section:has(#file-input-heading) { display: grid !important; }`,
  });
  await expect(page.getByTestId('file-input-contract')).toHaveScreenshot(
    'file-input--native--dark-rtl-mobile.png',
    {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.002,
      scale: 'css',
      threshold: 0.2,
    },
  );
});

test('Radio visual boundaries in dark RTL mobile', async ({ page }) => {
  await prepareZordonTestEnvironment(page, 'mobile', ZORDON_TEST_MEDIA_PROFILES.reducedMotion);
  await prepareFixture(page, 'dark');
  await applyZordonDocumentEnvironment(page, { direction: 'rtl', theme: 'dark' });
  await page.addStyleTag({
    content: `${fixtureSelector} section:has(#radio-heading) { display: grid !important; }`,
  });
  await expect(page.getByTestId('radio-contract')).toHaveScreenshot(
    'radio--native--dark-rtl-mobile.png',
    {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.002,
      scale: 'css',
      threshold: 0.2,
    },
  );
});

test('Filter visual boundaries in dark RTL mobile', async ({ page }) => {
  await prepareZordonTestEnvironment(page, 'mobile', ZORDON_TEST_MEDIA_PROFILES.reducedMotion);
  await prepareFixture(page, 'dark');
  await applyZordonDocumentEnvironment(page, { direction: 'rtl', theme: 'dark' });
  await page.addStyleTag({
    content: `${fixtureSelector} section:has(#filter-heading) { display: grid !important; }`,
  });
  await expect(page.getByTestId('filter-contract')).toHaveScreenshot(
    'filter--native--dark-rtl-mobile.png',
    {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.002,
      scale: 'css',
      threshold: 0.2,
    },
  );
});

test('Range visual boundaries in dark RTL mobile', async ({ page }) => {
  await prepareZordonTestEnvironment(page, 'mobile', ZORDON_TEST_MEDIA_PROFILES.reducedMotion);
  await prepareFixture(page, 'dark');
  await applyZordonDocumentEnvironment(page, { direction: 'rtl', theme: 'dark' });
  await page.addStyleTag({
    content: `${fixtureSelector} section:has(#range-heading) { display: grid !important; }`,
  });
  await expect(page.getByTestId('range-contract')).toHaveScreenshot(
    'range--native--dark-rtl-mobile.png',
    {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.002,
      scale: 'css',
      threshold: 0.2,
    },
  );
});

test('Rating visual boundaries in dark RTL mobile', async ({ page }) => {
  await prepareZordonTestEnvironment(page, 'mobile', ZORDON_TEST_MEDIA_PROFILES.reducedMotion);
  await prepareFixture(page, 'dark');
  await applyZordonDocumentEnvironment(page, { direction: 'rtl', theme: 'dark' });
  await page.addStyleTag({
    content: `${fixtureSelector} section:has(#rating-heading) { display: grid !important; }`,
  });
  await expect(page.getByTestId('rating-contract')).toHaveScreenshot(
    'rating--native--dark-rtl-mobile.png',
    {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.002,
      scale: 'css',
      threshold: 0.2,
    },
  );
});

test('Select visual boundaries in dark RTL mobile', async ({ page }) => {
  await prepareZordonTestEnvironment(page, 'mobile', ZORDON_TEST_MEDIA_PROFILES.reducedMotion);
  await prepareFixture(page, 'dark');
  await applyZordonDocumentEnvironment(page, { direction: 'rtl', theme: 'dark' });
  await page.addStyleTag({
    content: `${fixtureSelector} section:has(#select-heading) { display: grid !important; }`,
  });
  await expect(page.getByTestId('select-contract')).toHaveScreenshot(
    'select--native--dark-rtl-mobile.png',
    {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.002,
      scale: 'css',
      threshold: 0.2,
    },
  );
});

test('Text Input visual boundaries in dark RTL mobile', async ({ page }) => {
  await prepareZordonTestEnvironment(page, 'mobile', ZORDON_TEST_MEDIA_PROFILES.reducedMotion);
  await prepareFixture(page, 'dark');
  await applyZordonDocumentEnvironment(page, { direction: 'rtl', theme: 'dark' });
  await page.addStyleTag({
    content: `${fixtureSelector} section:has(#text-input-heading) { display: grid !important; }`,
  });
  await expect(page.getByTestId('text-input-contract')).toHaveScreenshot(
    'text-input--native--dark-rtl-mobile.png',
    {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.002,
      scale: 'css',
      threshold: 0.2,
    },
  );
});

test('Textarea visual boundaries in dark RTL mobile', async ({ page }) => {
  await prepareZordonTestEnvironment(page, 'mobile', ZORDON_TEST_MEDIA_PROFILES.reducedMotion);
  await prepareFixture(page, 'dark');
  await applyZordonDocumentEnvironment(page, { direction: 'rtl', theme: 'dark' });
  await page.addStyleTag({
    content: `${fixtureSelector} section:has(#textarea-heading) { display: grid !important; }`,
  });
  await expect(page.getByTestId('textarea-contract')).toHaveScreenshot(
    'textarea--native--dark-rtl-mobile.png',
    {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.002,
      scale: 'css',
      threshold: 0.2,
    },
  );
});

test('Toggle visual boundaries in dark RTL mobile', async ({ page }) => {
  await prepareZordonTestEnvironment(page, 'mobile', ZORDON_TEST_MEDIA_PROFILES.reducedMotion);
  await prepareFixture(page, 'dark');
  await applyZordonDocumentEnvironment(page, { direction: 'rtl', theme: 'dark' });
  await page.addStyleTag({
    content: `${fixtureSelector} section:has(#toggle-heading) { display: grid !important; }`,
  });
  await expect(page.getByTestId('toggle-contract')).toHaveScreenshot(
    'toggle--native--dark-rtl-mobile.png',
    {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.002,
      scale: 'css',
      threshold: 0.2,
    },
  );
});

test('Validator visual boundaries in dark RTL mobile', async ({ page }) => {
  await prepareZordonTestEnvironment(page, 'mobile', ZORDON_TEST_MEDIA_PROFILES.reducedMotion);
  await prepareFixture(page, 'dark');
  await applyZordonDocumentEnvironment(page, { direction: 'rtl', theme: 'dark' });
  await page.addStyleTag({
    content: `${fixtureSelector} section:has(#validator-heading) { display: grid !important; }`,
  });
  await expect(page.getByTestId('validator-contract')).toHaveScreenshot(
    'validator--native--dark-rtl-mobile.png',
    {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.002,
      scale: 'css',
      threshold: 0.2,
    },
  );
});

test('OTP visual boundaries in dark RTL mobile', async ({ page }) => {
  await prepareZordonTestEnvironment(page, 'mobile', ZORDON_TEST_MEDIA_PROFILES.reducedMotion);
  await prepareFixture(page, 'dark');
  await applyZordonDocumentEnvironment(page, { direction: 'rtl', theme: 'dark' });
  await page.addStyleTag({
    content: `${fixtureSelector} section:has(#otp-heading) { display: grid !important; }`,
  });
  await expect(page.getByTestId('otp-contract')).toHaveScreenshot('otp--dark-rtl-mobile.png', {
    animations: 'disabled',
    caret: 'hide',
    maxDiffPixelRatio: 0.002,
    scale: 'css',
    threshold: 0.2,
  });
});

test('Browser Mockup visual boundaries in dark RTL mobile', async ({ page }) => {
  await prepareZordonTestEnvironment(page, 'mobile', ZORDON_TEST_MEDIA_PROFILES.reducedMotion);
  await prepareFixture(page, 'dark');
  await applyZordonDocumentEnvironment(page, { direction: 'rtl', theme: 'dark' });
  await page.addStyleTag({
    content: `${fixtureSelector} section:has(#browser-mockup-heading) { display: grid !important; }`,
  });
  await expect(page.getByTestId('browser-mockup-contract')).toHaveScreenshot(
    'browser-mockup--native--dark-rtl-mobile.png',
    {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.002,
      scale: 'css',
      threshold: 0.2,
    },
  );
});

test('Code Mockup visual boundaries in dark RTL mobile', async ({ page }) => {
  await prepareZordonTestEnvironment(page, 'mobile', ZORDON_TEST_MEDIA_PROFILES.reducedMotion);
  await prepareFixture(page, 'dark');
  await applyZordonDocumentEnvironment(page, { direction: 'rtl', theme: 'dark' });
  await page.addStyleTag({
    content: `${fixtureSelector} section:has(#code-mockup-heading) { display: grid !important; }`,
  });
  await expect(page.getByTestId('code-mockup-contract')).toHaveScreenshot(
    'code-mockup--native--dark-rtl-mobile.png',
    {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.002,
      scale: 'css',
      threshold: 0.2,
    },
  );
});

test('Diff visual boundaries in dark RTL mobile', async ({ page }) => {
  await prepareZordonTestEnvironment(page, 'mobile', ZORDON_TEST_MEDIA_PROFILES.reducedMotion);
  await prepareFixture(page, 'dark');
  await applyZordonDocumentEnvironment(page, { direction: 'rtl', theme: 'dark' });
  await page.addStyleTag({
    content: `${fixtureSelector} section:has(#diff-heading) { display: grid !important; }`,
  });
  await expect(page.getByTestId('diff-contract')).toHaveScreenshot(
    'diff--native--dark-rtl-mobile.png',
    {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.002,
      scale: 'css',
      threshold: 0.2,
    },
  );
});
