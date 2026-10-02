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
  await page.locator('docs-search-dialog').waitFor({ state: 'attached' });
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

/**
 * One reference page per catalogue category: its playground (or live example) in both themes.
 * They share the reference template, so these catch shared-UI regressions and page-scoped daisyUI
 * stylesheets that stop loading. Pages with motion or a clock (Aura, Text Rotate, Countdown) are
 * left out because they are not deterministic.
 */
test.describe('component reference playgrounds', () => {
  const pages = [
    ['actions', '/components/modal'],
    ['data-display', '/components/card'],
    ['navigation', '/components/tabs'],
    ['feedback', '/components/alert'],
    ['data-input', '/components/select'],
    ['layout', '/components/stack'],
    ['mockups', '/components/code-mockup'],
  ] as const;

  for (const [category, path] of pages) {
    // Desktop only: on mobile the sticky header overlaps an element scrolled into view.
    test(`${category} light and dark desktop`, async ({ page }) => {
      const playground = page.locator('docs-reference-page [docsReferencePlayground]');
      await openDocsPage(page, path, 'desktop', 'light');
      await expect(playground).toHaveScreenshot(`docs-reference-${category}--light-desktop.png`);

      await openDocsPage(page, path, 'desktop', 'dark');
      await expect(playground).toHaveScreenshot(`docs-reference-${category}--dark-desktop.png`);
    });
  }
});

test('catalogue category filter in light desktop', async ({ page }) => {
  await openDocsPage(page, '/components?category=mockups', 'desktop', 'light');
  await expect(page.locator('docs-catalogue')).toHaveScreenshot(
    'docs-catalogue-mockups--light-desktop.png',
  );
});

test.describe('reviewed showcase examples', () => {
  const pages = [
    ['Table', 'table'],
    ['Avatar', 'avatar'],
    ['Aura', 'aura'],
    ['Badge', 'badge'],
    ['Card', 'card'],
    ['Carousel', 'carousel'],
    ['Chat', 'chat-bubble'],
    ['Countdown', 'countdown'],
    ['Diff', 'diff'],
    ['Hover 3D', 'hover-3d'],
    ['Hover Gallery', 'hover-gallery'],
    ['List', 'list'],
    ['Stat', 'stat'],
    ['Status', 'status'],
  ] as const;

  for (const [name, slug] of pages) {
    test(`${name} showcase light desktop and dark RTL mobile`, async ({ page }) => {
      for (const [viewport, theme, direction] of [
        ['desktop', 'light', 'ltr'],
        ['mobile', 'dark', 'rtl'],
      ] as const) {
        await openDocsPage(page, `/components/${slug}`, viewport, theme);
        await applyZordonDocumentEnvironment(page, { theme, direction });
        // Capture the visual examples, excluding their separately-tested copyable source.
        await page.addStyleTag({
          content: `
          section[aria-labelledby="examples"] docs-code-block,
          section[aria-labelledby="examples"] docs-code-tabs { display: none; }
          /* Chromium can paint off-screen fixed chrome inside tall locator captures. */
          .skip-link { visibility: hidden; }
        `,
        });
        const examples = page.locator('section[aria-labelledby="examples"]');
        // Load off-screen images for a deterministic capture of the complete examples section.
        await examples.locator('img').evaluateAll(async elements => {
          await Promise.all(
            elements.map(async element => {
              const image = element as HTMLImageElement;
              image.loading = 'eager';
              await image.decode();
            }),
          );
        });
        await expect(examples).toHaveScreenshot(
          `showcase-${slug}--${theme}-${direction}-${viewport}.png`,
        );
        if (slug === 'diff') {
          const comparison = page.locator('figure[zdDiff]');
          await comparison.locator('img').evaluateAll(async elements => {
            await Promise.all(elements.map(element => (element as HTMLImageElement).decode()));
          });
          await expect(comparison).toHaveScreenshot(
            `showcase-diff-images--${theme}-${direction}-${viewport}.png`,
          );
        }
      }
    });
  }
});

test('Table keyboard grid supports low-radius, high-radius and consumer themes', async ({
  page,
}) => {
  await openDocsPage(page, '/components/table', 'desktop', 'light');
  await page.addStyleTag({ path: 'node_modules/daisyui/theme/corporate.css' });
  await page.addStyleTag({ path: 'node_modules/daisyui/theme/cupcake.css' });
  await page.addStyleTag({
    content:
      '[data-theme="zordon-visual"] { --color-base-100: #f5f3ff; --color-base-200: #ede9fe; --color-base-300: #ddd6fe; --color-base-content: #2e1065; --color-primary: #6d28d9; --color-primary-content: #ffffff; --radius-box: 1.25rem; --radius-field: 0.75rem; }',
  });
  const grid = page.getByRole('grid', { name: 'Service controls' });
  await grid.getByRole('rowheader', { name: 'API', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  for (const theme of ['corporate', 'cupcake', 'zordon-visual'] as const) {
    await applyZordonDocumentEnvironment(page, { theme, direction: 'ltr' });
    await expect(grid).toHaveScreenshot(`showcase-table-grid--${theme}.png`);
  }
});

test('Card showcase responds to low-radius, high-radius and consumer themes', async ({ page }) => {
  await openDocsPage(page, '/components/card', 'desktop', 'light');
  await page.addStyleTag({ path: 'node_modules/daisyui/theme/corporate.css' });
  await page.addStyleTag({ path: 'node_modules/daisyui/theme/cupcake.css' });
  await page.addStyleTag({
    content: `
    [data-theme="zordon-visual"] {
      --color-base-100: #f5f3ff; --color-base-200: #ede9fe; --color-base-300: #ddd6fe;
      --color-base-content: #2e1065; --color-primary: #6d28d9;
      --color-primary-content: #ffffff; --radius-box: 1.25rem; --radius-field: 0.75rem;
    }
  `,
  });
  const card = page.locator('section[aria-labelledby="side-image"] .preview');
  await card.locator('img').evaluateAll(async elements => {
    await Promise.all(
      elements.map(async element => {
        const image = element as HTMLImageElement;
        image.loading = 'eager';
        await image.decode();
      }),
    );
  });
  for (const theme of ['corporate', 'cupcake', 'zordon-visual'] as const) {
    await applyZordonDocumentEnvironment(page, { theme, direction: 'ltr' });
    await expect(card).toHaveScreenshot(`showcase-card--${theme}.png`);
  }
});
