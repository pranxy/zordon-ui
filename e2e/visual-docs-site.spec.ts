import { expect, test, type Page } from '@playwright/test';

import {
  applyZordonDocumentEnvironment,
  prepareZordonTestEnvironment,
  ZORDON_TEST_MEDIA_PROFILES,
  type ZdTestViewport,
} from './fixtures/environment';

/**
 * Visual baselines for the documentation-site design system (projects/docs/DESIGN_SYSTEM.md).
 *
 * The gallery covers every `docs-*` component and variant; the page shots protect the three
 * mockup-derived templates above the fold. Fonts are pinned to faces installed on the Windows
 * baseline runner so a locally installed Inter or IBM Plex cannot change the rendering.
 */

const PINNED_FONTS = `:root {
  --docs-font-sans: Arial, sans-serif;
  --docs-font-mono: 'Courier New', monospace;
}`;

async function openDocsPage(
  page: Page,
  path: string,
  viewport: ZdTestViewport,
  theme: 'light' | 'dark',
): Promise<void> {
  await prepareZordonTestEnvironment(page, viewport, ZORDON_TEST_MEDIA_PROFILES.reducedMotion);
  // Use the site's own saved preference so the theme switch shows the matching label.
  await page.addInitScript(value => localStorage.setItem('zordon-docs-theme', value), theme);
  await page.goto(path);
  await page.addStyleTag({ content: PINNED_FONTS });
  // The search dialog is deferred until the hydrated app is idle, so its presence means every
  // post-hydration enhancement (copy buttons, saved preferences) has already rendered.
  await page.locator('docs-search-dialog dialog').waitFor({ state: 'attached' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
  await applyZordonDocumentEnvironment(page, { theme, direction: 'ltr' });
  await page.evaluate(() => document.fonts.ready);
}

test.describe('documentation UI gallery', () => {
  for (const [viewport, theme] of [
    ['desktop', 'light'],
    ['desktop', 'dark'],
    ['mobile', 'light'],
  ] as const) {
    test(`${theme} ${viewport}`, async ({ page }) => {
      await openDocsPage(page, '/__zordon-tests__/ui', viewport, theme);
      await expect(page.getByTestId('ui-gallery')).toHaveScreenshot(
        `docs-gallery--${theme}-${viewport}.png`,
      );
    });
  }
});

test.describe('documentation page templates above the fold', () => {
  const pages = [
    ['getting-started', '/docs/getting-started'],
    ['components', '/components'],
    ['button', '/components/button'],
  ] as const;

  for (const [name, path] of pages) {
    test(`${name} light desktop and dark mobile`, async ({ page }) => {
      await openDocsPage(page, path, 'desktop', 'light');
      await expect(page).toHaveScreenshot(`docs-${name}--light-desktop.png`);

      await openDocsPage(page, path, 'mobile', 'dark');
      await expect(page).toHaveScreenshot(`docs-${name}--dark-mobile.png`);
    });
  }
});

test('Button playground reflects chosen inputs', async ({ page }) => {
  await openDocsPage(page, '/components/button', 'desktop', 'light');
  const controls = page.getByRole('form', { name: 'Button controls' });
  await controls
    .getByRole('group', { name: 'color' })
    .getByRole('radio', { name: 'secondary' })
    .check();
  await controls
    .getByRole('group', { name: 'variant' })
    .getByRole('radio', { name: 'outline' })
    .check();
  await controls.getByRole('group', { name: 'size' }).getByRole('radio', { name: 'lg' }).check();
  await expect(page.locator('docs-playground')).toHaveScreenshot(
    'docs-button-playground--light-desktop.png',
  );
});

test('catalogue category filter in light desktop', async ({ page }) => {
  await openDocsPage(page, '/components?category=mockups', 'desktop', 'light');
  await expect(page.locator('docs-catalogue')).toHaveScreenshot(
    'docs-catalogue-mockups--light-desktop.png',
  );
});
