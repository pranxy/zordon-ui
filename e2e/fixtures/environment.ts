import type { Page } from '@playwright/test';

export const ZORDON_TEST_VIEWPORTS = {
  desktop: { width: 1280, height: 900 },
  mobile: { width: 390, height: 844 },
} as const;

export const ZORDON_TEST_THEMES = [
  'light',
  'dark',
  'corporate',
  'cupcake',
  'zordon-visual',
] as const;

export type ZdTestDirection = 'ltr' | 'rtl';
export type ZdTestTheme = (typeof ZORDON_TEST_THEMES)[number];
export type ZdTestViewport = keyof typeof ZORDON_TEST_VIEWPORTS;

export interface ZdTestMediaProfile {
  readonly colorScheme?: 'light' | 'dark';
  readonly forcedColors: 'active' | 'none';
  readonly reducedMotion: 'reduce' | 'no-preference';
}

export const ZORDON_TEST_MEDIA_PROFILES = {
  default: {
    forcedColors: 'none',
    reducedMotion: 'no-preference',
  },
  reducedMotion: {
    forcedColors: 'none',
    reducedMotion: 'reduce',
  },
  forcedColors: {
    forcedColors: 'active',
    reducedMotion: 'reduce',
  },
} as const satisfies Record<string, ZdTestMediaProfile>;

/**
 * Configures dimensions and media before navigation. Playwright documents that viewport changes
 * belong before navigation; this helper deliberately does not navigate or wait for application UI.
 */
export async function prepareZordonTestEnvironment(
  page: Page,
  viewport: ZdTestViewport,
  media: ZdTestMediaProfile,
): Promise<void> {
  await page.setViewportSize(ZORDON_TEST_VIEWPORTS[viewport]);
  await page.emulateMedia(media);
}

/**
 * Applies document-owned theme and direction after navigation. It intentionally does not emulate
 * Angular CDK `Directionality`, which components must supply through their own `Dir` scope.
 */
export async function applyZordonDocumentEnvironment(
  page: Page,
  environment: { readonly direction: ZdTestDirection; readonly theme: ZdTestTheme },
): Promise<void> {
  await page.locator('html').evaluate((element, value) => {
    element.setAttribute('data-theme', value.theme);
    element.setAttribute('dir', value.direction);
  }, environment);
}
