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

test('component reference pages have no serious accessibility violations, including open panels', async ({
  page,
  runAxeScan,
}) => {
  // One axe scan per reference page plus the open states.
  test.setTimeout(240_000);
  const material = (results: Awaited<ReturnType<typeof runAxeScan>>) =>
    results.violations.filter(
      violation => violation.impact === 'critical' || violation.impact === 'serious',
    );

  for (const path of [
    '/components/button',
    '/components/dropdown',
    '/components/swap',
    '/components/carousel',
    '/components/collapse',
    '/components/kbd',
    '/components/megamenu',
    '/components/menu',
    '/components/calendar',
    '/components/checkbox',
    '/components/radio',
    '/components/range',
    '/components/rating',
    '/components/select',
    '/components/text-input',
    '/components/textarea',
    '/components/toggle',
    '/components/fieldset',
    '/components/file-input',
    '/components/filter',
    '/components/label',
    '/components/validator',
    '/components/otp',
  ]) {
    await test.step(path, async () => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto(path);
      await page.locator('docs-search-dialog dialog').waitFor({ state: 'attached' });
      expect(material(await runAxeScan())).toEqual([]);
    });
  }

  await test.step('open Dropdown menu', async () => {
    await page.goto('/components/dropdown');
    await page.locator('docs-search-dialog dialog').waitFor({ state: 'attached' });
    await page.getByRole('button', { name: 'Actions ▾' }).click();
    await expect(page.getByRole('menu', { name: 'Document actions' })).toBeVisible();
    expect(material(await runAxeScan())).toEqual([]);
  });

  await test.step('open Megamenu panel', async () => {
    await page.goto('/components/megamenu');
    await page.locator('docs-search-dialog dialog').waitFor({ state: 'attached' });
    await page.getByRole('button', { name: 'Components ▾' }).first().click();
    await expect(page.getByRole('region', { name: 'Components', exact: true })).toBeVisible();
    expect(material(await runAxeScan())).toEqual([]);
  });

  await test.step('open Calendar popup', async () => {
    await page.goto('/components/calendar');
    await page.locator('docs-search-dialog dialog').waitFor({ state: 'attached' });
    await page.getByRole('button', { name: 'Departure date: Choose date' }).click();
    await expect(page.getByRole('dialog', { name: 'Departure date' })).toBeVisible();
    expect(material(await runAxeScan())).toEqual([]);
  });
});
