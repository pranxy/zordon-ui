import { expect, test, type Page } from '@playwright/test';

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

async function prepareFixture(page: Page, theme: string): Promise<void> {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/__zordon-tests__/browser');
  await page.locator('html').evaluate((element, value) => {
    element.setAttribute('data-theme', value);
  }, theme);
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
    await page.setViewportSize({ width: 1280, height: 900 });
    await prepareFixture(page, theme);
    await expectFixtureScreenshot(page, snapshot);
  });
}

for (const [theme, snapshot] of mobileThemes) {
  test(`${theme} theme at the mobile breakpoint`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await prepareFixture(page, theme);
    await expectFixtureScreenshot(page, snapshot);
  });
}

test('light theme with the dialog open', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
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
