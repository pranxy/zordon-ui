import AxeBuilder from '@axe-core/playwright';
import { expect, test as base } from '@playwright/test';

const WCAG_AA_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

type AxeScanResult = Awaited<ReturnType<AxeBuilder['analyze']>>;

interface AccessibilityFixtures {
  runAxeScan: (scope?: string) => Promise<AxeScanResult>;
}

const test = base.extend<AccessibilityFixtures>({
  runAxeScan: async ({ page }, use, testInfo) => {
    let scanNumber = 0;

    await use(async (scope?: string) => {
      const builder = new AxeBuilder({ page }).withTags(WCAG_AA_TAGS);
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
