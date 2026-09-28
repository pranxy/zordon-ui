import AxeBuilder from '@axe-core/playwright';
import { expect, test as base } from '@playwright/test';

const WCAG_AA_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

type AxeScanResult = Awaited<ReturnType<AxeBuilder['analyze']>>;

interface AccessibilityFixtures {
  /**
   * Wait after `page.goto` and `page.reload` until the app marks `<html data-hydrated>` (docs
   * site and SSR example), so keyboard and pointer input isn't lost to a server-rendered page.
   * Turn it off with `test.use({ waitForHydration: false })` for a page that never hydrates.
   */
  waitForHydration: boolean;
  hydratedNavigation: void;
  nativeLinkTab: boolean;
  runAxeScan: (
    scope?: string,
    options?: { disabledRules?: readonly string[] },
  ) => Promise<AxeScanResult>;
}

const test = base.extend<AccessibilityFixtures>({
  waitForHydration: [true, { option: true }],
  hydratedNavigation: [
    async ({ page, waitForHydration }, use) => {
      if (waitForHydration) {
        const hydrated = () => page.locator('html[data-hydrated]').waitFor({ state: 'attached' });
        const goto = page.goto.bind(page);
        const reload = page.reload.bind(page);
        page.goto = async (url, options) => {
          const response = await goto(url, options);
          await hydrated();
          return response;
        };
        page.reload = async options => {
          const response = await reload(options);
          await hydrated();
          return response;
        };
      }
      await use();
    },
    { auto: true },
  ],
  nativeLinkTab: async ({ context }, use, testInfo) => {
    const probe = await context.newPage();
    let includesLinks: boolean;
    try {
      await probe.setContent(
        '<button id="before">Before</button><a id="link" href="#target">Link</a><input id="after" aria-label="After">',
      );
      await probe.locator('#before').focus();
      await probe.keyboard.press('Tab');
      const target = await probe.evaluate(() => document.activeElement?.id);
      expect(['link', 'after']).toContain(target);
      includesLinks = target === 'link';
    } finally {
      await probe.close();
    }
    testInfo.annotations.push({
      type: 'native-keyboard-policy',
      description: includesLinks
        ? 'Tab includes native links.'
        : 'Tab bypasses native links; component exit and direct link activation are verified.',
    });
    await use(includesLinks);
  },
  runAxeScan: async ({ page }, use, testInfo) => {
    let scanNumber = 0;

    await use(async (scope?: string, options?: { disabledRules?: readonly string[] }) => {
      let builder = new AxeBuilder({ page }).withTags(WCAG_AA_TAGS);
      if (options?.disabledRules?.length) {
        builder = builder.disableRules([...options.disabledRules]);
      }
      if (scope) {
        builder.include(scope);
      }

      const results = await builder.analyze();
      scanNumber += 1;
      await testInfo.attach(`axe-results-${scanNumber}`, {
        body: JSON.stringify(results, null, 2),
        contentType: 'application/json',
      });

      return results;
    });
  },
});

export { expect, test };
