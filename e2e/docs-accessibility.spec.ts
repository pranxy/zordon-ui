import { expect, test } from './fixtures/accessibility';

test('representative docs route has no serious accessibility violations at desktop and mobile widths', async ({
  page,
  runAxeScan,
}) => {
  for (const viewport of [
    { width: 1280, height: 900 },
    { width: 375, height: 812 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/docs/getting-started');

    const results = await runAxeScan();
    const materialViolations = results.violations.filter(
      violation => violation.impact === 'critical' || violation.impact === 'serious',
    );

    expect(materialViolations).toEqual([]);
  }
});
