import { expect, test, type Page } from '@playwright/test';

import {
  applyZordonDocumentEnvironment,
  prepareZordonTestEnvironment,
  ZORDON_TEST_MEDIA_PROFILES,
} from './fixtures/environment';
import type { ZdTestTheme } from './fixtures/environment';

const fixtureSelector = '[data-testid="browser-test-fixture"]';

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
